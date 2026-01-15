# Local Development Setup Guide

## Prerequisites

1. **Node.js** (v18 or higher)
   ```bash
   node --version
   ```

2. **PostgreSQL** (v12 or higher)
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

3. **npm** or **yarn**

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js
- React
- PostgreSQL client (pg)
- bcryptjs for password hashing
- TypeScript types

---

## Step 2: Set Up PostgreSQL Database

### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE moviefund;

# Create user (optional, or use your existing user)
CREATE USER moviefund_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE moviefund TO moviefund_user;

# Exit psql
\q
```

### Run Schema

```bash
# Run the main schema
psql -d moviefund -f database/schema.sql

# Run the fixes (optional but recommended)
psql -d moviefund -f database/schema_fixes.sql
```

**Note:** If you get "command not found: psql", make sure PostgreSQL is installed and in your PATH.

---

## Step 3: Configure Environment Variables

### Create `.env.local` file

```bash
cp .env.local.example .env.local
```

### Edit `.env.local` with your database credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/moviefund
ENCRYPTION_KEY=your-32-character-random-key-here!!
NODE_ENV=development
```

**Generate encryption key:**
```bash
# On macOS/Linux
openssl rand -hex 16

# Or use any 32-character random string
```

**Example `.env.local`:**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
NODE_ENV=development
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## Step 5: Test the Application

### 1. Visit the Home Page
- Open `http://localhost:3000`
- You should see the landing page

### 2. Register a User
- Click "Register" or go to `http://localhost:3000/register`
- Choose a role (Investor or Producer)
- Fill in the registration form
- Submit

### 3. Login
- Go to `http://localhost:3000/login`
- Use the credentials you just registered
- You should be redirected to your dashboard

### 4. Test Producer Features
- Register as a Producer
- Go to `/producer/film-plans`
- Create a new film plan
- Upload documents
- Submit for review

### 5. Test Investor Features
- Register as an Investor
- Go to `/investor/dashboard`
- View portfolio (will be empty initially)

---

## Troubleshooting

### Database Connection Issues

**Error: "DATABASE_URL environment variable is not set"**
- Make sure `.env.local` exists in the root directory
- Check that `DATABASE_URL` is set correctly
- Restart the dev server after creating `.env.local`

**Error: "Connection refused"**
- Make sure PostgreSQL is running:
  ```bash
  # macOS
  brew services list
  brew services start postgresql
  
  # Linux
  sudo systemctl status postgresql
  sudo systemctl start postgresql
  ```

**Error: "password authentication failed"**
- Check your database credentials in `.env.local`
- Make sure the user has access to the database

### TypeScript Errors

**Error: "Cannot find module"**
- Run `npm install` again
- Make sure all dependencies are installed

**Error: "Type errors"**
- Run `npm run build` to see all TypeScript errors
- Some errors might be expected if APIs aren't fully implemented

### Port Already in Use

**Error: "Port 3000 is already in use"**
```bash
# Kill the process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

If you see errors about missing modules:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Test Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database created and schema run
- [ ] `.env.local` file created with correct credentials
- [ ] Dev server starts without errors
- [ ] Home page loads
- [ ] Can register a new user
- [ ] Can login
- [ ] Can access role-specific dashboards
- [ ] Can create film plan (producer)
- [ ] Can view film plans list

---

## Development Tips

1. **Hot Reload**: Next.js automatically reloads on file changes
2. **Database Changes**: Restart the dev server after database schema changes
3. **Environment Variables**: Changes to `.env.local` require server restart
4. **TypeScript**: Run `npm run build` to check for type errors
5. **Database Queries**: Check console for slow query warnings in development

---

## Next Steps

Once everything is running:

1. **Test Authentication Flow**
   - Register both investor and producer accounts
   - Test login/logout
   - Test protected routes

2. **Test Film Plan Management**
   - Create film plans
   - Edit film plans
   - Upload documents
   - Submit for review

3. **Test API Endpoints**
   - Use browser DevTools Network tab
   - Check API responses
   - Verify data is saved to database

4. **Check Database**
   ```bash
   psql -d moviefund
   SELECT * FROM users;
   SELECT * FROM film_plans;
   ```

---

## Common Issues & Solutions

### Issue: "use() must be called inside a React component"
- This is a Next.js 15+ feature
- Make sure you're using `use()` correctly in async components
- Check that you're using the latest Next.js version

### Issue: "localStorage is not defined"
- This is expected on the server side
- The auth-client.ts handles this with `typeof window !== 'undefined'` checks
- Should work fine in the browser

### Issue: API routes return 500 errors
- Check server console for error messages
- Verify database connection
- Check that all required environment variables are set
- Make sure database schema is run

---

## Need Help?

1. Check the console for error messages
2. Verify all prerequisites are installed
3. Verify database is running and accessible
4. Check that `.env.local` is configured correctly
5. Review the API documentation in `API_DOCUMENTATION.md`
