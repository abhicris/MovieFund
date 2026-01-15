import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';

// GET /api/movies/[id] - Get movie details with role-based data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await authenticateRequest(request);

    // Get movie
    const movie = await queryOne<any>(
      `SELECT 
        m.*,
        fp.id as film_plan_id,
        u.name as producer_name,
        u.email as producer_email
      FROM movies m
      LEFT JOIN film_plans fp ON m.film_plan_id = fp.id
      LEFT JOIN users u ON fp.producer_id = u.id
      WHERE m.id = $1`,
      [id]
    );

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Movie not found' },
        { status: 404 }
      );
    }

    // Base movie data
    const movieData: any = {
      id: movie.id,
      filmPlanId: movie.film_plan_id,
      title: movie.title,
      tagline: movie.tagline,
      director: movie.director,
      producer: movie.producer,
      productionCompany: movie.production_company,
      genre: movie.genre,
      language: movie.language,
      description: movie.description,
      cast: movie.cast,
      releaseDate: movie.release_date,
      budget: parseFloat(movie.budget),
      totalLots: parseInt(movie.total_lots),
      availableLots: parseInt(movie.available_lots),
      pricePerLot: parseFloat(movie.price_per_lot),
      projectedROI: parseFloat(movie.projected_roi),
      minimumInvestment: parseFloat(movie.minimum_investment),
      maximumInvestment: movie.maximum_investment ? parseFloat(movie.maximum_investment) : null,
      images: movie.images || [],
      poster: movie.poster,
      revenueProjection: {
        boxOffice: parseFloat(movie.revenue_projection_box_office),
        streaming: parseFloat(movie.revenue_projection_streaming),
        distribution: parseFloat(movie.revenue_projection_distribution),
        total: parseFloat(movie.revenue_projection_total),
      },
      returnsProjection: {
        year1: parseFloat(movie.returns_projection_year1),
        year2: parseFloat(movie.returns_projection_year2),
        year3: parseFloat(movie.returns_projection_year3),
        year4: parseFloat(movie.returns_projection_year4),
        year5: parseFloat(movie.returns_projection_year5),
      },
      status: movie.status,
      createdAt: movie.created_at,
      updatedAt: movie.updated_at,
    };

    // Role-based additional data
    if (user) {
      // For investors: show investment data
      if (user.role === 'investor') {
        const investment = await queryOne<{
          id: string;
          lots: number;
          total_amount: number;
          status: string;
          returns_earned: number;
        }>(
          `SELECT id, lots, total_amount, status, returns_earned 
           FROM investments 
           WHERE user_id = $1 AND movie_id = $2`,
          [user.id, id]
        );

        if (investment) {
          movieData.userInvestment = {
            id: investment.id,
            lots: parseInt(investment.lots),
            totalAmount: parseFloat(investment.total_amount),
            status: investment.status,
            returnsEarned: parseFloat(investment.returns_earned),
          };
        }

        // Get total investments count
        const investmentStats = await queryOne<{ total_investors: string; total_raised: string }>(
          `SELECT 
            COUNT(DISTINCT user_id) as total_investors,
            SUM(total_amount) as total_raised
           FROM investments 
           WHERE movie_id = $1 AND status IN ('confirmed', 'active', 'completed')`,
          [id]
        );

        movieData.investmentStats = {
          totalInvestors: parseInt(investmentStats?.total_investors || '0'),
          totalRaised: parseFloat(investmentStats?.total_raised || '0'),
        };
      }

      // For producers: show production data
      if (user.role === 'producer') {
        const producerData = await queryOne<{
          producer_id: string;
        }>(
          `SELECT producer_id FROM film_plans WHERE id = $1`,
          [movie.film_plan_id]
        );

        if (producerData && producerData.producer_id === user.id) {
          // Get investment summary
          const investmentSummary = await queryOne<{
            total_investors: string;
            total_raised: string;
            total_lots_sold: string;
          }>(
            `SELECT 
              COUNT(DISTINCT user_id) as total_investors,
              SUM(total_amount) as total_raised,
              SUM(lots) as total_lots_sold
             FROM investments 
             WHERE movie_id = $1 AND status IN ('confirmed', 'active', 'completed')`,
            [id]
          );

          movieData.producerData = {
            totalInvestors: parseInt(investmentSummary?.total_investors || '0'),
            totalRaised: parseFloat(investmentSummary?.total_raised || '0'),
            totalLotsSold: parseInt(investmentSummary?.total_lots_sold || '0'),
            fundingProgress: ((parseFloat(investmentSummary?.total_raised || '0') / parseFloat(movie.budget)) * 100).toFixed(2),
          };
        }
      }

      // For admins: show all data
      if (user.role === 'admin') {
        const adminData = await queryOne<{
          total_investors: string;
          total_raised: string;
          total_returns_paid: string;
        }>(
          `SELECT 
            COUNT(DISTINCT i.user_id) as total_investors,
            SUM(i.total_amount) as total_raised,
            COALESCE(SUM(r.amount), 0) as total_returns_paid
           FROM investments i
           LEFT JOIN returns r ON r.investment_id = i.id AND r.status = 'paid'
           WHERE i.movie_id = $1 AND i.status IN ('confirmed', 'active', 'completed')`,
          [id]
        );

        movieData.adminData = {
          totalInvestors: parseInt(adminData?.total_investors || '0'),
          totalRaised: parseFloat(adminData?.total_raised || '0'),
          totalReturnsPaid: parseFloat(adminData?.total_returns_paid || '0'),
        };
      }
    } else {
      // Public data (no authentication)
      const publicStats = await queryOne<{
        total_investors: string;
        total_raised: string;
      }>(
        `SELECT 
          COUNT(DISTINCT user_id) as total_investors,
          SUM(total_amount) as total_raised
         FROM investments 
         WHERE movie_id = $1 AND status IN ('confirmed', 'active', 'completed')`,
        [id]
      );

      movieData.publicStats = {
        totalInvestors: parseInt(publicStats?.total_investors || '0'),
        totalRaised: parseFloat(publicStats?.total_raised || '0'),
      };
    }

    return NextResponse.json({
      success: true,
      data: movieData,
    });
  } catch (error: any) {
    console.error('Get movie error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}
