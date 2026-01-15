# Testing Guide - Local Development

## Quick Start Commands

```bash
# 1. Install dependencies (if not done)
npm install

# 2. Set up database
createdb moviefund
psql -d moviefund -f database/schema.sql

# 3. Create .env.local
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
ENCRYPTION_KEY=dev-key-32-characters-long-12345678
NODE_ENV=development
EOF

# 4. Start dev server
npm run dev
```

Then open: **http://localhost:3000**

---

## Manual Testing Steps

### 1. Test Home Page
- ✅ Visit http://localhost:3000
- ✅ Should see landing page with movies
- ✅ Navigation should work

### 2. Test Registration

**Investor Registration:**
1. Go to `/register`
2. Click "Investor"
3. Fill form:
   - Name: Test Investor
   - Email: investor@test.com
   - Password: test1234
4. Submit
5. ✅ Should redirect to dashboard

**Producer Registration:**
1. Go to `/register`
2. Click "Producer"
3. Fill form:
   - Name: Test Producer
   - Email: producer@test.com
   - Production Company: Test Films
   - Password: test1234
4. Submit
5. ✅ Should redirect to dashboard

### 3. Test Login

1. Go to `/login`
2. Enter credentials from registration
3. Submit
4. ✅ Should redirect to role-specific dashboard
5. ✅ Header should show user name and logout

### 4. Test Producer Features

**Film Plans List:**
1. Login as producer
2. Go to `/producer/film-plans`
3. ✅ Should see empty list or existing plans

**Create Film Plan:**
1. Click "+ New Film Plan"
2. Fill all required fields:
   - Title: Test Movie
   - Director: Test Director
   - Producer: Test Producer
   - Production Company: Test Films
   - Budget: 1000000
   - Select genres
   - Add cast members
   - Set release date
   - Fill revenue projections
   - Fill returns projections
3. Submit
4. ✅ Should create draft film plan
5. ✅ Should redirect to film plan detail

**View Film Plan:**
1. Click on a film plan
2. ✅ Should see all details
3. ✅ Should see "Edit" and "Submit for Review" buttons

**Edit Film Plan:**
1. Click "Edit"
2. Change some fields
3. Save
4. ✅ Should update film plan

**Upload Documents:**
1. Go to film plan detail
2. Click "Documents" or go to `/producer/film-plans/[id]/documents`
3. Click "+ Upload Document"
4. Select file, choose type, enter title
5. Upload
6. ✅ Should see document in list

**Submit for Review:**
1. Go to film plan detail
2. Click "Submit for Review"
3. ✅ Status should change to "submitted"

### 5. Test Investor Features

**Investor Dashboard:**
1. Login as investor
2. Go to `/investor/dashboard`
3. ✅ Should see dashboard with stats
4. ✅ Should see account status

**Portfolio:**
1. Go to `/investor/portfolio`
2. ✅ Should see portfolio page (empty initially)

### 6. Test Navigation

**Header Navigation:**
- ✅ Should show different links based on role
- ✅ Should show user name when logged in
- ✅ Logout should work

**Protected Routes:**
- ✅ Try accessing `/producer/film-plans` without login
- ✅ Should redirect to `/login`

---

## Database Verification

After testing, verify data in database:

```bash
psql -d moviefund

# Check users
SELECT id, email, name, role, account_status FROM users;

# Check film plans
SELECT id, title, status, budget FROM film_plans;

# Check documents
SELECT id, type, title, film_plan_id FROM documents;

# Exit
\q
```

---

## Expected Behavior

### Registration
- ✅ Creates user account
- ✅ Sets account_status to 'pending'
- ✅ Sets role correctly
- ✅ Stores password hash (not plain text)

### Film Plan Creation
- ✅ Creates draft film plan
- ✅ Links to producer
- ✅ Stores all fields correctly
- ✅ Can be edited

### Document Upload
- ✅ Creates document record
- ✅ Links to film plan
- ✅ Stores file metadata
- ✅ Shows in document list

### Authentication
- ✅ Session token stored in localStorage
- ✅ Header shows auth state
- ✅ Protected routes redirect if not logged in
- ✅ Logout clears session

---

## Common Issues During Testing

### Issue: "Failed to fetch" errors
**Cause:** Database not connected or API error
**Fix:**
- Check `.env.local` has correct DATABASE_URL
- Verify PostgreSQL is running
- Check server console for errors

### Issue: Registration fails
**Cause:** Database connection or validation error
**Fix:**
- Check database is running
- Verify schema is applied
- Check server console for specific error

### Issue: Can't login after registration
**Cause:** Password hash mismatch or session issue
**Fix:**
- Check database for user record
- Verify password was hashed
- Check browser console for errors

### Issue: Film plan not saving
**Cause:** Validation error or API issue
**Fix:**
- Check all required fields are filled
- Verify budget is a number
- Check server console for validation errors

---

## Testing Checklist

- [ ] Home page loads
- [ ] Can register as investor
- [ ] Can register as producer
- [ ] Can login with registered credentials
- [ ] Header shows correct auth state
- [ ] Can create film plan
- [ ] Can edit film plan
- [ ] Can upload documents
- [ ] Can submit film plan
- [ ] Investor dashboard loads
- [ ] Producer dashboard loads
- [ ] Portfolio page loads
- [ ] Logout works
- [ ] Protected routes redirect properly

---

## Next Steps After Testing

1. **Fix any bugs** found during testing
2. **Test edge cases** (empty forms, invalid data, etc.)
3. **Test error handling** (network errors, validation errors)
4. **Verify database** stores data correctly
5. **Check browser console** for any warnings/errors

---

## Performance Testing

- Page load times should be reasonable
- API calls should complete within 1-2 seconds
- No console errors or warnings
- Smooth navigation between pages

---

## Browser Compatibility

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

---

## Notes

- Some features may show placeholder data until APIs are fully implemented
- Investment features will need investment API endpoints
- Admin features need admin API endpoints
- Document upload currently uses placeholder URLs (needs S3/Cloudinary setup)
