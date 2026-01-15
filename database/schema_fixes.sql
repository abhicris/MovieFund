-- Fixes and improvements for database schema
-- Run these after the main schema.sql

-- ============================================
-- FIX 1: Add missing comma in film_plans table
-- ============================================
-- This is already fixed in the main schema, but keeping for reference

-- ============================================
-- FIX 2: Add unique constraint on payment_integrations
-- ============================================
ALTER TABLE payment_integrations
ADD CONSTRAINT unique_user_provider UNIQUE (user_id, provider);

-- ============================================
-- FIX 3: Add data validation constraints
-- ============================================

-- Ensure available_lots <= total_lots in movies
ALTER TABLE movies
ADD CONSTRAINT check_available_lots 
CHECK (available_lots <= total_lots AND available_lots >= 0);

-- Ensure total_lots is always 1000
ALTER TABLE movies
ADD CONSTRAINT check_total_lots 
CHECK (total_lots = 1000);

-- Prevent negative amounts in financial fields
ALTER TABLE movies
ADD CONSTRAINT check_budget_positive 
CHECK (budget > 0);

ALTER TABLE movies
ADD CONSTRAINT check_price_per_lot_positive 
CHECK (price_per_lot > 0);

ALTER TABLE investments
ADD CONSTRAINT check_investment_amount_positive 
CHECK (total_amount > 0);

ALTER TABLE investments
ADD CONSTRAINT check_returns_earned_non_negative 
CHECK (returns_earned >= 0);

ALTER TABLE returns
ADD CONSTRAINT check_return_amount_positive 
CHECK (amount > 0);

ALTER TABLE transactions
ADD CONSTRAINT check_transaction_amount_positive 
CHECK (amount > 0);

-- Ensure revenue projections are positive
ALTER TABLE film_plans
ADD CONSTRAINT check_revenue_projections_positive 
CHECK (
  revenue_projection_box_office >= 0 AND
  revenue_projection_streaming >= 0 AND
  revenue_projection_distribution >= 0 AND
  revenue_projection_total >= 0
);

ALTER TABLE movies
ADD CONSTRAINT check_movie_revenue_projections_positive 
CHECK (
  revenue_projection_box_office >= 0 AND
  revenue_projection_streaming >= 0 AND
  revenue_projection_distribution >= 0 AND
  revenue_projection_total >= 0
);

-- Ensure returns projections are reasonable (0-1000%)
ALTER TABLE film_plans
ADD CONSTRAINT check_returns_projections_range 
CHECK (
  returns_projection_year1 >= 0 AND returns_projection_year1 <= 1000 AND
  returns_projection_year2 >= 0 AND returns_projection_year2 <= 1000 AND
  returns_projection_year3 >= 0 AND returns_projection_year3 <= 1000 AND
  returns_projection_year4 >= 0 AND returns_projection_year4 <= 1000 AND
  returns_projection_year5 >= 0 AND returns_projection_year5 <= 1000
);

-- ============================================
-- FIX 4: Add missing indexes
-- ============================================

CREATE INDEX idx_investments_reserved_at ON investments(reserved_at);
CREATE INDEX idx_investments_confirmed_at ON investments(confirmed_at);
CREATE INDEX idx_transactions_completed_at ON transactions(completed_at);
CREATE INDEX idx_transactions_movie_id ON transactions(movie_id);
CREATE INDEX idx_transactions_investment_id ON transactions(investment_id);
CREATE INDEX idx_film_plans_reviewed_by ON film_plans(reviewed_by);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_verified_by ON documents(verified_by);
CREATE INDEX idx_movies_film_plan_id ON movies(film_plan_id);
CREATE INDEX idx_returns_created_at ON returns(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_investments_user_movie ON investments(user_id, movie_id);
CREATE INDEX idx_investments_movie_status ON investments(movie_id, status);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX idx_transactions_user_status ON transactions(user_id, payment_status);

-- ============================================
-- FIX 5: Add NOT NULL constraints where needed
-- ============================================

-- Ensure genre and cast arrays are not empty
-- Note: PostgreSQL doesn't support CHECK constraints on array length directly
-- This would need to be enforced at application level or via trigger

-- ============================================
-- FIX 6: Add function to validate investment lots
-- ============================================

CREATE OR REPLACE FUNCTION check_available_lots()
RETURNS TRIGGER AS $$
DECLARE
  available INTEGER;
BEGIN
  SELECT available_lots INTO available
  FROM movies
  WHERE id = NEW.movie_id;
  
  IF available < NEW.lots THEN
    RAISE EXCEPTION 'Not enough available lots. Available: %, Requested: %', available, NEW.lots;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check available lots before investment
CREATE TRIGGER check_investment_lots
BEFORE INSERT ON investments
FOR EACH ROW
WHEN (NEW.status = 'reserved' OR NEW.status = 'confirmed')
EXECUTE FUNCTION check_available_lots();

-- ============================================
-- FIX 7: Add function to update available_lots
-- ============================================

CREATE OR REPLACE FUNCTION update_available_lots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND (NEW.status = 'confirmed' OR NEW.status = 'active') THEN
    UPDATE movies
    SET available_lots = available_lots - NEW.lots
    WHERE id = NEW.movie_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- If status changed to confirmed/active, decrease available lots
    IF (OLD.status != 'confirmed' AND OLD.status != 'active') AND 
       (NEW.status = 'confirmed' OR NEW.status = 'active') THEN
      UPDATE movies
      SET available_lots = available_lots - NEW.lots
      WHERE id = NEW.movie_id;
    -- If status changed from confirmed/active, increase available lots
    ELSIF (OLD.status = 'confirmed' OR OLD.status = 'active') AND 
          (NEW.status != 'confirmed' AND NEW.status != 'active') THEN
      UPDATE movies
      SET available_lots = available_lots + OLD.lots
      WHERE id = NEW.movie_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update available_lots
CREATE TRIGGER update_movie_available_lots
AFTER INSERT OR UPDATE ON investments
FOR EACH ROW
EXECUTE FUNCTION update_available_lots();

-- ============================================
-- FIX 8: Add function to clean expired sessions
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM sessions
  WHERE expires_at < CURRENT_TIMESTAMP;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FIX 9: Add email validation constraint
-- ============================================
-- Note: Basic email validation - for production, use application-level validation
-- PostgreSQL doesn't have built-in email validation

-- ============================================
-- FIX 10: Add audit fields (optional enhancement)
-- ============================================
-- Consider adding created_by, updated_by fields for audit trail
-- This would require additional columns and triggers
