# Quick Start Guide - Test Locally

## Prerequisites Check

First, verify you have the required tools:

```bash
# Check Node.js version (should be 18+)
node --version

# Check if PostgreSQL is installed
psql --version

# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

---

## Step-by-Step Setup

### 1. Fix npm Permissions (if needed)

If you see permission errors, run:
```bash
sudo chown -R $(whoami) ~/.npm
```

### 2. Install Dependencies

```bash
cd /Users/abhishekkrishna/Documents/GitHub/MovieFund
npm install
```

### 3. Set Up Database

```bash
# Create database (if it doesn't exist)
createdb moviefund

# Or using psql:
psql postgres -c "CREATE DATABASE moviefund;"

# Run schema
psql -d moviefund -f database/schema.sql

# Run fixes (optional but recommended)
psql -d moviefund -f database/schema_fixes.sql
```

### 4. Create Environment File

Create `.env.local` in the project root:

```bash
cat > .env.local << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
ENCRYPTION_KEY=dev-key-32-characters-long-12345678
NODE_ENV=development
EOF
```

**Important:** Update `DATABASE_URL` with your actual PostgreSQL credentials:
- Replace `postgres:postgres` with your username:password
- If using default postgres user with no password, use: `postgresql://postgres@localhost:5432/moviefund`

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## Testing Checklist

### ✅ Basic Functionality

1. **Home Page** (http://localhost:3000)
   - Should load without errors
   - Shows hero, stats, movies

2. **Register** (http://localhost:3000/register)
   - Choose role (Investor/Producer)
   - Fill form and submit
   - Should create account

3. **Login** (http://localhost:3000/login)
   - Use registered credentials
   - Should redirect to dashboard

4. **Producer Dashboard** (http://localhost:3000/producer/dashboard)
   - Should show stats
   - "New Film Plan" button works

5. **Create Film Plan** (http://localhost:3000/producer/film-plans/new)
   - Fill all fields
   - Submit form
   - Should create draft film plan

6. **Film Plans List** (http://localhost:3000/producer/film-plans)
   - Should show created film plans
   - Click to view details

7. **Investor Dashboard** (http://localhost:3000/investor/dashboard)
   - Should load for investor accounts
   - Shows portfolio placeholder

---

## Common Issues & Quick Fixes

### Issue: "psql: command not found"
**Solution:**
```bash
# macOS
brew install postgresql
export PATH="/usr/local/opt/postgresql/bin:$PATH"

# Or add to ~/.zshrc or ~/.bashrc
echo 'export PATH="/usr/local/opt/postgresql/bin:$PATH"' >> ~/.zshrc
```

### Issue: "database does not exist"
**Solution:**
```bash
createdb moviefund
```

### Issue: "password authentication failed"
**Solution:**
- Check your PostgreSQL password in `.env.local`
- Or create a user without password:
```sql
psql postgres
CREATE USER moviefund_user WITH PASSWORD 'your_password';
ALTER USER moviefund_user CREATEDB;
\q
```

### Issue: "Cannot find module 'pg'"
**Solution:**
```bash
npm install pg @types/pg
```

### Issue: Port 3000 already in use
**Solution:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: TypeScript errors
**Solution:**
- Some errors might be expected
- Check if the app still runs: `npm run dev`
- Fix critical errors first

---

## Verify Database Setup

```bash
# Connect to database
psql -d moviefund

# Check tables
\dt

# Check users table
SELECT id, email, name, role, account_status FROM users LIMIT 5;

# Exit
\q
```

---

## Test User Accounts

After setup, you can test with:

### Default Admin (from schema.sql)
- Email: `admin@moviefund.com`
- Password: `admin123` (⚠️ Change this in production!)

### Create Test Users via UI
1. Register as Producer
2. Register as Investor
3. Test different features

---

## Development Workflow

1. **Start Database** (if not running as service)
   ```bash
   # macOS
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   ```

2. **Start Dev Server**
   ```bash
   npm run dev
   ```

3. **Make Changes**
   - Edit files
   - Next.js auto-reloads
   - Check browser console for errors

4. **Check Database**
   ```bash
   psql -d moviefund -c "SELECT COUNT(*) FROM users;"
   ```

---

## Next Steps After Setup

1. ✅ Test registration flow
2. ✅ Test login/logout
3. ✅ Create a film plan
4. ✅ Upload documents
5. ✅ Test investor dashboard
6. ✅ Check database for saved data

---

## Need Help?

1. Check `LOCAL_SETUP.md` for detailed instructions
2. Check browser console for client errors
3. Check terminal for server errors
4. Verify database connection in `.env.local`
5. Make sure all dependencies are installed
