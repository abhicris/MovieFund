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
export type UserRole = "investor" | "producer" | "admin";
export type AccountStatus = "pending" | "verified" | "rejected" | "suspended";
export type FilmPlanStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published" | "archived";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  accountStatus: AccountStatus;
  investments: Investment[];
  totalInvested: number;
  totalReturns: number;
  createdAt: Date;
  updatedAt: Date;
  // Producer-specific fields
  productionCompany?: string;
  companyRegistration?: string;
  taxId?: string;
  bankAccountConnected?: boolean;
  stripeAccountId?: string;
  // Investor-specific fields
  kycStatus?: "pending" | "verified" | "rejected";
  kycVerifiedAt?: Date;
  // Admin-specific fields
  adminLevel?: "super" | "moderator";
}

// Film Plan (submitted by producers, before approval)
export interface FilmPlan {
  id: string;
  producerId: string;
  title: string;
  tagline?: string;
  director: string;
  producer: string;
  productionCompany: string;
  genre: MovieGenre[];
  language: MovieLanguage;
  budget: number;
  description: string;
  cast: string[];
  releaseDate: Date;
  revenueProjection: {
    boxOffice: number;
    streaming: number;
    distribution: number;
    total: number;
  };
  returnsProjection: {
    year1: number;
    year2: number;
    year3: number;
    year4: number;
    year5: number;
  };
  status: FilmPlanStatus;
  submittedAt?: Date;
  reviewedBy?: string; // Admin user ID
  reviewedAt?: Date;
  rejectionReason?: string;
  // Once approved, this becomes a Movie
  approvedMovieId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Document/Agreement Types
export type DocumentType = 
  | "script" 
  | "budget_breakdown" 
  | "production_agreement" 
  | "distribution_agreement"
  | "legal_clearance"
  | "insurance"
  | "tax_document"
  | "other";

export interface Document {
  id: string;
  filmPlanId: string;
  type: DocumentType;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  verifiedBy?: string; // Admin user ID
  verifiedAt?: Date;
  isVerified: boolean;
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
  filmPlansSubmitted: number;
  filmPlansApproved: number;
  producersRegistered: number;
}

// Payment/Banking Integration Types
export interface PaymentIntegration {
  provider: "stripe" | "razorpay" | "paypal" | "other";
  accountId: string;
  status: "connected" | "pending" | "disconnected";
  connectedAt?: Date;
  lastVerifiedAt?: Date;
}

export interface BankAccount {
  id: string;
  userId: string;
  accountHolderName: string;
  accountNumber: string; // Last 4 digits only for display
  bankName: string;
  routingNumber?: string;
  swiftCode?: string;
  country: string;
  currency: string;
  isPrimary: boolean;
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}
