import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { query, queryOne } from '@/lib/db';
import { DocumentType } from '@/types';

// GET /api/film-plans/[id]/documents - List documents for a film plan
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verify film plan exists
    const filmPlan = await queryOne('SELECT id FROM film_plans WHERE id = $1', [id]);
    if (!filmPlan) {
      return NextResponse.json(
        { success: false, error: 'Film plan not found' },
        { status: 404 }
      );
    }

    // Get documents
    const result = await query(
      `SELECT 
        d.*,
        u.name as uploaded_by_name
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      WHERE d.film_plan_id = $1
      ORDER BY d.uploaded_at DESC`,
      [id]
    );

    const documents = result.rows.map((row: any) => ({
      id: row.id,
      filmPlanId: row.film_plan_id,
      type: row.type,
      title: row.title,
      fileName: row.file_name,
      fileUrl: row.file_url,
      fileSize: parseInt(row.file_size),
      mimeType: row.mime_type,
      uploadedBy: row.uploaded_by,
      uploadedAt: row.uploaded_at,
      verifiedBy: row.verified_by,
      verifiedAt: row.verified_at,
      isVerified: row.is_verified,
      uploadedByName: row.uploaded_by_name,
    }));

    return NextResponse.json({
      success: true,
      data: documents,
    });
  } catch (error: any) {
    console.error('List documents error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/film-plans/[id]/documents - Upload document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) {
      return authResult.error;
    }
    const { user } = authResult;
    const { id } = await params;

    // Verify film plan exists and user has access
    const filmPlan = await queryOne<{ producer_id: string }>(
      'SELECT producer_id FROM film_plans WHERE id = $1',
      [id]
    );

    if (!filmPlan) {
      return NextResponse.json(
        { success: false, error: 'Film plan not found' },
        { status: 404 }
      );
    }

    // Only producer or admin can upload documents
    if (user.role !== 'admin' && filmPlan.producer_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to upload documents' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as DocumentType;
    const title = formData.get('title') as string;

    if (!file || !type || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: file, type, title' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'script',
      'budget_breakdown',
      'production_agreement',
      'distribution_agreement',
      'legal_clearance',
      'insurance',
      'tax_document',
      'other',
    ];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid document type' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // TODO: Upload file to S3/Cloudinary
    // For now, we'll store a placeholder URL
    // In production, implement actual file upload:
    // const fileUrl = await uploadToS3(file);
    
    const fileUrl = `https://storage.example.com/documents/${id}/${file.name}`;
    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = file.type;

    // Save document record
    const result = await query(
      `INSERT INTO documents (
        film_plan_id, type, title, file_name, file_url, file_size, mime_type, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [id, type, title, fileName, fileUrl, fileSize, mimeType, user.id]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Document uploaded successfully',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Upload document error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload document' },
      { status: 500 }
    );
  }
}
