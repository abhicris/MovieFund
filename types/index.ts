// Movie Types
export type MovieGenre = 
  | "action" 
  | "drama" 
  | "comedy" 
  | "thriller" 
  | "romance" 
  | "horror" 
  | "sci-fi" 
  | "documentary"
  | "animation"
  | "fantasy";

export type MovieLanguage = "hindi" | "english" | "spanish" | "tamil" | "telugu" | "malayalam" | "kannada" | "bengali" | "marathi";

export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  director: string;
  producer: string;
  productionCompany: string;
  genre: MovieGenre[];
  language: MovieLanguage;
  budget: number; // Total production budget
  totalLots: number; // Total investment lots available (always 1000)
  availableLots: number; // Available lots for investment
  pricePerLot: number; // Investment price per lot (0.1% of budget)
  projectedROI: number; // Percentage per annum
  images: string[];
  poster: string;
  description: string;
  cast: string[]; // Main cast members
  releaseDate: Date;
  status: "pre-production" | "production" | "post-production" | "completed" | "released" | "fully_funded";
  revenueProjection: {
    boxOffice: number; // Projected box office revenue
    streaming: number; // Projected streaming revenue
    distribution: number; // Projected distribution revenue
    total: number; // Total projected revenue
  };
  returnsProjection: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
  minimumInvestment: number; // Minimum investment amount
  maximumInvestment?: number; // Maximum investment per investor
  createdAt: Date;
  updatedAt: Date;
}

// Investment Types
export interface Investment {
  id: string;
  userId: string;
  movieId: string;
  lots: number;
  totalAmount: number;
  status: "reserved" | "confirmed" | "active" | "completed";
  reservedAt: Date;
  confirmedAt?: Date;
  returnsEarned: number;
  paymentId?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  investments: Investment[];
  totalInvested: number;
  totalReturns: number;
  createdAt: Date;
}

// Returns Types
export interface Returns {
  id: string;
  investmentId: string;
  amount: number;
  period: string; // "monthly" | "quarterly" | "annually"
  source: "box_office" | "streaming" | "distribution";
  paidAt: Date;
  status: "pending" | "paid";
}

// Platform Stats
export interface PlatformStats {
  totalAmountRaised: number;
  totalInvestors: number;
  totalReturnsEarned: number;
  assetsUnderManagement: number;
  moviesFunded: number;
  moviesReleased: number;
}
