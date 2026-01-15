# Database & API Review Findings

## Critical Issues

### 1. SQL Syntax Error in Schema
**Location:** `database/schema.sql` line 108
**Issue:** Missing comma after `approved_movie_id UUID`
**Fix:** Add comma

### 2. Missing Transaction Handling
**Location:** `app/api/admin/film-plans/[id]/approve/route.ts`
**Issue:** Multi-step operation (create movie + update film plan + update stats) not wrapped in transaction
**Risk:** Data inconsistency if one step fails
**Fix:** Use database transactions

### 3. Middleware Error Handling
**Location:** `lib/middleware.ts`
**Issue:** `requireAuth` and `requireRole` throw errors instead of returning HTTP responses
**Risk:** Unhandled exceptions, poor error responses
**Fix:** Return NextResponse for errors

### 4. Missing Unique Constraint
**Location:** `payment_integrations` table
**Issue:** No unique constraint on (user_id, provider)
**Risk:** Duplicate payment provider connections
**Fix:** Add unique constraint

### 5. Missing Data Validation Constraints
**Issues:**
- No check to ensure `available_lots <= total_lots` in movies
- No check to prevent negative amounts in financial fields
- No validation that investment lots don't exceed available lots
**Fix:** Add CHECK constraints

---

## High Priority Issues

### 6. Missing Indexes
**Missing indexes on:**
- `investments.reserved_at` (for querying recent investments)
- `transactions.completed_at` (for financial reporting)
- `film_plans.reviewed_by` (for admin queries)
- `documents.uploaded_by` (for user document lists)

### 7. No Session Cleanup
**Issue:** Expired sessions not automatically cleaned up
**Risk:** Database bloat over time
**Fix:** Add scheduled job or cleanup on login

### 8. Missing Input Validation
**Issues:**
- No email format validation
- No phone number validation
- No budget/revenue validation (could be negative or zero)
- No date validation (release_date could be in past)
**Fix:** Add validation in API routes

### 9. Security Concerns
**Issues:**
- No rate limiting on auth endpoints
- No CSRF protection
- No email verification
- No password reset functionality
- Default admin password is placeholder
**Fix:** Implement security measures

### 10. Missing Error Handling
**Issues:**
- Some queries don't handle database errors gracefully
- No validation of foreign key constraints before operations
- Missing try-catch in some async operations

---

## Medium Priority Issues

### 11. Missing Features
- No soft delete mechanism
- No audit trail for sensitive operations
- No email notifications
- No password reset
- No account recovery

### 12. API Improvements Needed
- Missing pagination on some list endpoints
- No filtering/sorting options on some endpoints
- No bulk operations
- Missing GET endpoint for all movies

### 13. Data Integrity
- No cascade rules for some relationships
- Missing NOT NULL constraints on some required fields
- No validation that returns don't exceed investment amount

### 14. Performance Concerns
- No connection pooling configuration tuning
- Missing query optimization hints
- No caching strategy
- No database query logging in production

---

## Low Priority / Enhancements

### 15. Code Quality
- Some type assertions using `as any`
- Inconsistent error message formats
- Missing JSDoc comments
- No unit tests

### 16. Documentation
- Missing API examples
- No database relationship diagrams
- Missing migration guide

---

## Recommended Fixes

### Priority 1 (Critical - Fix Immediately)

1. **Fix SQL syntax error**
2. **Add transaction handling to approve endpoint**
3. **Fix middleware error handling**
4. **Add unique constraint on payment_integrations**
5. **Add data validation constraints**

### Priority 2 (High - Fix Soon)

6. **Add missing indexes**
7. **Implement session cleanup**
8. **Add input validation**
9. **Implement basic security measures**
10. **Improve error handling**

### Priority 3 (Medium - Plan for Next Sprint)

11. **Add missing features (email verification, password reset)**
12. **Improve API endpoints**
13. **Enhance data integrity**
14. **Optimize performance**

---

## Detailed Fix Recommendations

See `REVIEW_FIXES.md` for detailed code fixes.
