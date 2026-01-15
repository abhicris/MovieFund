-- MovieFund Database Schema
-- PostgreSQL Database Schema for the MovieFund Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users table - stores all user accounts (investors, producers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt hashed password
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('investor', 'producer', 'admin')),
    account_status VARCHAR(20) DEFAULT 'pending' CHECK (account_status IN ('pending', 'verified', 'rejected', 'suspended')),
    
    -- Producer-specific fields
    production_company VARCHAR(255),
    company_registration VARCHAR(100),
    tax_id VARCHAR(100),
    bank_account_connected BOOLEAN DEFAULT FALSE,
    stripe_account_id VARCHAR(255),
    
    -- Investor-specific fields
    kyc_status VARCHAR(20) DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    kyc_verified_at TIMESTAMP,
    
    -- Admin-specific fields
    admin_level VARCHAR(20) CHECK (admin_level IN ('super', 'moderator')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_account_status ON users(account_status);

-- User sessions table (for NextAuth or custom session management)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sessions table
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================
-- FILM PLANS (Producer Submissions)
-- ============================================

-- Film plans table - stores film proposals submitted by producers
CREATE TABLE film_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    director VARCHAR(255) NOT NULL,
    producer VARCHAR(255) NOT NULL,
    production_company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    genre TEXT[] NOT NULL, -- Array of genres
    language VARCHAR(50) NOT NULL,
    
    -- Financial Information
    budget DECIMAL(15, 2) NOT NULL CHECK (budget > 0),
    
    -- Cast & Release
    cast TEXT[] NOT NULL, -- Array of cast member names
    release_date DATE NOT NULL,
    
    -- Revenue Projections
    revenue_projection_box_office DECIMAL(15, 2) NOT NULL,
    revenue_projection_streaming DECIMAL(15, 2) NOT NULL,
    revenue_projection_distribution DECIMAL(15, 2) NOT NULL,
    revenue_projection_total DECIMAL(15, 2) NOT NULL,
    
    -- Returns Projections (percentage per year)
    returns_projection_year1 DECIMAL(5, 2) NOT NULL,
    returns_projection_year2 DECIMAL(5, 2) NOT NULL,
    returns_projection_year3 DECIMAL(5, 2) NOT NULL,
    returns_projection_year4 DECIMAL(5, 2) NOT NULL,
    returns_projection_year5 DECIMAL(5, 2) NOT NULL,
    
    -- Status & Workflow
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'published', 'archived')),
    submitted_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id), -- Admin who reviewed
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Link to approved movie (once approved and published)
    approved_movie_id UUID, -- Will reference movies table once created (FK added after movies table)
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for film_plans table
CREATE INDEX idx_film_plans_producer_id ON film_plans(producer_id);
CREATE INDEX idx_film_plans_status ON film_plans(status);
CREATE INDEX idx_film_plans_submitted_at ON film_plans(submitted_at);

-- ============================================
-- DOCUMENTS & AGREEMENTS
-- ============================================

-- Documents table - stores uploaded documents for film plans
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    film_plan_id UUID NOT NULL REFERENCES film_plans(id) ON DELETE CASCADE,
    
    -- Document Information
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'script', 
        'budget_breakdown', 
        'production_agreement', 
        'distribution_agreement',
        'legal_clearance',
        'insurance',
        'tax_document',
        'other'
    )),
    title VARCHAR(255) NOT NULL,
    
    -- File Information
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL, -- S3/Cloudinary URL
    file_size BIGINT NOT NULL, -- Size in bytes
    mime_type VARCHAR(100) NOT NULL,
    
    -- Verification
    uploaded_by UUID NOT NULL REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by UUID REFERENCES users(id), -- Admin who verified
    verified_at TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE
);

-- Indexes for documents table
CREATE INDEX idx_documents_film_plan_id ON documents(film_plan_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_is_verified ON documents(is_verified);

-- ============================================
-- MOVIES (Approved Film Plans)
-- ============================================

-- Movies table - stores approved and published film plans
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    film_plan_id UUID REFERENCES film_plans(id), -- Link back to original submission
    
    -- Basic Information (copied from film_plan)
    title VARCHAR(255) NOT NULL,
    tagline TEXT,
    director VARCHAR(255) NOT NULL,
    producer VARCHAR(255) NOT NULL,
    production_company VARCHAR(255) NOT NULL,
    genre TEXT[] NOT NULL,
    language VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    cast TEXT[] NOT NULL,
    release_date DATE NOT NULL,
    
    -- Financial Information
    budget DECIMAL(15, 2) NOT NULL,
    total_lots INTEGER DEFAULT 1000 NOT NULL,
    available_lots INTEGER DEFAULT 1000 NOT NULL,
    price_per_lot DECIMAL(15, 2) NOT NULL, -- Calculated as budget / 1000
    projected_roi DECIMAL(5, 2) NOT NULL,
    minimum_investment DECIMAL(15, 2) NOT NULL,
    maximum_investment DECIMAL(15, 2),
    
    -- Media
    images TEXT[], -- Array of image URLs
    poster TEXT, -- Main poster URL
    
    -- Revenue Projections
    revenue_projection_box_office DECIMAL(15, 2) NOT NULL,
    revenue_projection_streaming DECIMAL(15, 2) NOT NULL,
    revenue_projection_distribution DECIMAL(15, 2) NOT NULL,
    revenue_projection_total DECIMAL(15, 2) NOT NULL,
    
    -- Returns Projections
    returns_projection_year1 DECIMAL(5, 2) NOT NULL,
    returns_projection_year2 DECIMAL(5, 2) NOT NULL,
    returns_projection_year3 DECIMAL(5, 2) NOT NULL,
    returns_projection_year4 DECIMAL(5, 2) NOT NULL,
    returns_projection_year5 DECIMAL(5, 2) NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pre-production' CHECK (status IN (
        'pre-production', 
        'production', 
        'post-production', 
        'completed', 
        'released', 
        'fully_funded'
    )),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for movies table
CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_genre ON movies USING GIN(genre);
CREATE INDEX idx_movies_language ON movies(language);
CREATE INDEX idx_movies_release_date ON movies(release_date);

-- Add foreign key constraint for approved_movie_id (after movies table is created)
ALTER TABLE film_plans 
ADD CONSTRAINT fk_film_plans_approved_movie 
FOREIGN KEY (approved_movie_id) REFERENCES movies(id) ON DELETE SET NULL;

-- ============================================
-- INVESTMENTS
-- ============================================

-- Investments table - stores investor investments in movies
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    
    -- Investment Details
    lots INTEGER NOT NULL CHECK (lots > 0),
    total_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'active', 'completed')),
    
    -- Payment Information
    payment_id VARCHAR(255), -- Stripe/Razorpay payment ID
    payment_method VARCHAR(50),
    
    -- Timestamps
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    
    -- Returns
    returns_earned DECIMAL(15, 2) DEFAULT 0
);

-- Indexes for investments table
CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_movie_id ON investments(movie_id);
CREATE INDEX idx_investments_status ON investments(status);

-- ============================================
-- RETURNS
-- ============================================

-- Returns table - tracks returns paid to investors
CREATE TABLE returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
    
    -- Return Details
    amount DECIMAL(15, 2) NOT NULL,
    period VARCHAR(50) NOT NULL, -- 'monthly', 'quarterly', 'annually'
    source VARCHAR(50) NOT NULL CHECK (source IN ('box_office', 'streaming', 'distribution')),
    
    -- Payment Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
    paid_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for returns table
CREATE INDEX idx_returns_investment_id ON returns(investment_id);
CREATE INDEX idx_returns_status ON returns(status);
CREATE INDEX idx_returns_paid_at ON returns(paid_at);

-- ============================================
-- PAYMENT & BANKING INTEGRATIONS
-- ============================================

-- Payment integrations table - stores payment provider connections
CREATE TABLE payment_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Provider Information
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('stripe', 'razorpay', 'paypal', 'other')),
    account_id VARCHAR(255) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('connected', 'pending', 'disconnected')),
    
    -- Timestamps
    connected_at TIMESTAMP,
    last_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for payment_integrations table
CREATE INDEX idx_payment_integrations_user_id ON payment_integrations(user_id);
CREATE INDEX idx_payment_integrations_provider ON payment_integrations(provider);

-- Bank accounts table - stores bank account information
CREATE TABLE bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Account Information
    account_holder_name VARCHAR(255) NOT NULL,
    account_number_encrypted TEXT NOT NULL, -- Encrypted account number
    account_number_last4 VARCHAR(4) NOT NULL, -- Last 4 digits for display
    bank_name VARCHAR(255) NOT NULL,
    routing_number VARCHAR(50), -- For US accounts
    swift_code VARCHAR(20), -- For international accounts
    country VARCHAR(2) NOT NULL, -- ISO country code
    currency VARCHAR(3) NOT NULL DEFAULT 'USD', -- ISO currency code
    
    -- Status
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for bank_accounts table
CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_is_primary ON bank_accounts(is_primary);

-- ============================================
-- TRANSACTIONS
-- ============================================

-- Transactions table - tracks all financial transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Transaction Details
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'investment', 
        'return_payment', 
        'refund', 
        'fee', 
        'withdrawal'
    )),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Related Entities
    investment_id UUID REFERENCES investments(id),
    movie_id UUID REFERENCES movies(id),
    
    -- Payment Information
    payment_id VARCHAR(255), -- External payment provider ID
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 
        'processing', 
        'completed', 
        'failed', 
        'refunded'
    )),
    
    -- Metadata
    description TEXT,
    metadata JSONB, -- Additional flexible data
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Indexes for transactions table
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_payment_status ON transactions(payment_status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- PLATFORM STATISTICS (Optional - can be computed or cached)
-- ============================================

-- Platform stats table - cached platform statistics
CREATE TABLE platform_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Statistics
    total_amount_raised DECIMAL(15, 2) DEFAULT 0,
    total_investors INTEGER DEFAULT 0,
    total_returns_earned DECIMAL(15, 2) DEFAULT 0,
    assets_under_management DECIMAL(15, 2) DEFAULT 0,
    movies_funded INTEGER DEFAULT 0,
    movies_released INTEGER DEFAULT 0,
    film_plans_submitted INTEGER DEFAULT 0,
    film_plans_approved INTEGER DEFAULT 0,
    producers_registered INTEGER DEFAULT 0,
    
    -- Timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_film_plans_updated_at BEFORE UPDATE ON film_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movies_updated_at BEFORE UPDATE ON movies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_integrations_updated_at BEFORE UPDATE ON payment_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL DATA
-- ============================================

-- Create default admin user (password should be changed immediately)
-- Password: 'admin123' (bcrypt hash - should be changed)
INSERT INTO users (email, password_hash, name, role, account_status, admin_level) VALUES
('admin@moviefund.com', '$2b$10$rQ8K8K8K8K8K8K8K8K8K8O8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K', 'Admin User', 'admin', 'verified', 'super');

-- Initialize platform stats
INSERT INTO platform_stats DEFAULT VALUES;
