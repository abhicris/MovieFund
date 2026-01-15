# Fix Vercel Deployment Errors

## Issue: Middleware Deprecation Warning

**Status:** ✅ **FIXED** - Removed `middleware.ts` file

The middleware file was only handling docs routing, which is already handled by `next.config.js` rewrites. The file has been removed to eliminate the deprecation warning.

---

## Environment Variables Setup in Vercel

Since your deployment is already linked, you need to add environment variables:

### Step 1: Go to Vercel Dashboard

1. Visit: https://vercel.com/dashboard
2. Open your "MovieFund" project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Required Variables

Click "Add New" for each:

#### 1. DATABASE_URL
```
Key: DATABASE_URL
Value: [Your production database connection string]
Environments: ☑ Production ☑ Preview ☑ Development
```

**Get Database Connection String:**

**Option A: Vercel Postgres**
- Vercel Dashboard → Storage → Create Postgres
- Copy connection string
- Format: `postgres://default:password@host.vercel-storage.com:5432/verceldb`

**Option B: External Database (Supabase, Neon, etc.)**
- Get connection string from your database provider
- Should include SSL if required

#### 2. ENCRYPTION_KEY
```
Key: ENCRYPTION_KEY
Value: [Generate 32-character key]
Environments: ☑ Production ☑ Preview ☑ Development
```

**Generate Key:**
```bash
openssl rand -hex 16
```

#### 3. NODE_ENV (Production)
```
Key: NODE_ENV
Value: production
Environments: ☑ Production only
```

#### 4. NODE_ENV (Development)
```
Key: NODE_ENV
Value: development
Environments: ☑ Preview ☑ Development
```

---

## Step 3: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. **Create Database**
   - Vercel Dashboard → "Storage" tab
   - Click "Create Database" → "Postgres"
   - Choose "Hobby" plan (free tier)
   - Click "Create"

2. **Get Connection String**
   - Go to database settings
   - Copy "Connection String"
   - It looks like: `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb`

3. **Add to Environment Variables**
   - Add as `DATABASE_URL` in project settings
   - Set for all environments

4. **Run Schema**
   ```bash
   # Use the connection string from Vercel
   psql "YOUR_VERCEL_POSTGRES_CONNECTION_STRING" -f database/schema.sql
   ```

### Option B: Supabase (Free Alternative)

1. Go to https://supabase.com
2. Create new project
3. Settings → Database → Connection string
4. Copy connection string
5. Add as `DATABASE_URL` in Vercel
6. Run schema:
   ```bash
   psql "YOUR_SUPABASE_CONNECTION_STRING" -f database/schema.sql
   ```

---

## Step 4: Redeploy

After adding environment variables:

1. **Redeploy in Vercel**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Or push a new commit**
   ```bash
   git add .
   git commit -m "Fix middleware deprecation and update config"
   git push
   ```

---

## Verify Deployment

1. **Check Build Logs**
   - Vercel Dashboard → Your Project
   - Go to latest deployment
   - Check "Build Logs" tab
   - Should see "Build Completed" without errors

2. **Test Production Site**
   - Visit: https://moviebitfund.kcolbchain.com
   - Test registration
   - Test login
   - Check API endpoints

---

## Common Build Errors & Fixes

### Error: "DATABASE_URL environment variable is not set"

**Fix:** Add `DATABASE_URL` in Vercel environment variables

### Error: "Cannot find module 'pg'"

**Fix:** Already in `package.json`, should install automatically. If not:
```bash
# Verify locally
npm install
npm run build
```

### Error: TypeScript errors

**Fix:** Check build logs for specific errors, fix TypeScript issues

### Error: Database connection timeout

**Fix:** 
- Verify database allows external connections
- Check connection string is correct
- For Vercel Postgres, ensure SSL is enabled

---

## Quick Checklist

- [ ] Removed `middleware.ts` (done)
- [ ] Added `DATABASE_URL` in Vercel
- [ ] Added `ENCRYPTION_KEY` in Vercel
- [ ] Added `NODE_ENV` in Vercel
- [ ] Set up production database
- [ ] Ran database schema
- [ ] Redeployed project
- [ ] Tested production site

---

## Next Steps

1. **Commit the middleware fix:**
   ```bash
   git add .
   git commit -m "Remove deprecated middleware file"
   git push
   ```

2. **Add environment variables in Vercel** (see above)

3. **Set up production database** (see above)

4. **Redeploy and test**

---

## Monitoring

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Deployment Logs:** Project → Deployments → Click deployment → Logs
- **Function Logs:** Project → Deployments → Functions tab

---

## Need Help?

If build still fails:
1. Check Vercel build logs for specific errors
2. Verify all environment variables are set
3. Test build locally: `npm run build`
4. Check database connection
