# Deployment Guide - GitHub & Vercel

## Step 1: Push to GitHub

### Initialize Git (if not already done)

```bash
cd /Users/abhishekkrishna/Documents/GitHub/MovieFund

# Check if git is initialized
git status

# If not initialized, run:
git init
```

### Create/Update .gitignore

Make sure `.gitignore` includes:
- `.env.local` (already included)
- `node_modules` (already included)
- `.next` (already included)
- Database files
- Local config files

### Commit and Push

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: MovieFund platform with auth, film plans, and investor features"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/MovieFund.git

# Or if using SSH:
# git remote add origin git@github.com:YOUR_USERNAME/MovieFund.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Connect to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (MovieFund)
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (root)
   - **Build Command:** `npm run build` (or `npm run build:all` if you want docs)
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

4. **Add Environment Variables** (see Step 3 below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? moviefund
# - Directory? ./
# - Override settings? No
```

---

## Step 3: Add Environment Variables in Vercel

### Via Vercel Dashboard

1. **Go to Project Settings**
   - Open your project in Vercel dashboard
   - Go to "Settings" → "Environment Variables"

2. **Add Variables**

Add these required variables:

#### Required Variables

```
DATABASE_URL
postgresql://username:password@host:5432/moviefund
```

```
ENCRYPTION_KEY
your-32-character-encryption-key-here!!
```

```
NODE_ENV
production
```

#### Optional Variables (for future features)

```
AWS_ACCESS_KEY_ID
your_aws_access_key
```

```
AWS_SECRET_ACCESS_KEY
your_aws_secret_key
```

```
AWS_REGION
us-east-1
```

```
AWS_S3_BUCKET
moviefund-documents
```

```
STRIPE_PUBLISHABLE_KEY
pk_live_...
```

```
STRIPE_SECRET_KEY
sk_live_...
```

```
RAZORPAY_KEY_ID
rzp_live_...
```

```
RAZORPAY_KEY_SECRET
your_razorpay_secret
```

### Environment-Specific Variables

Vercel allows you to set variables for different environments:

- **Production** - Live site
- **Preview** - Pull request previews
- **Development** - Local development

**Best Practice:**
- Set `DATABASE_URL` for all environments (use different databases)
- Set `NODE_ENV` to `production` for Production, `development` for others

### Via Vercel CLI

```bash
# Add environment variable
vercel env add DATABASE_URL production

# Add multiple
vercel env add ENCRYPTION_KEY production
vercel env add NODE_ENV production

# List all
vercel env ls
```

---

## Step 4: Set Up Production Database

### Option A: Vercel Postgres (Recommended)

1. **Add Vercel Postgres**
   - In Vercel dashboard, go to "Storage"
   - Click "Create Database" → "Postgres"
   - Choose plan (Hobby is fine for MVP)
   - Create database

2. **Get Connection String**
   - Go to database settings
   - Copy "Connection String"
   - Add to Environment Variables as `DATABASE_URL`

3. **Run Schema**
   ```bash
   # Get connection string from Vercel
   # Then run:
   psql "YOUR_VERCEL_POSTGRES_CONNECTION_STRING" -f database/schema.sql
   ```

### Option B: External Database (Supabase, Neon, etc.)

1. **Create Database**
   - Sign up for Supabase/Neon/Railway/etc.
   - Create PostgreSQL database
   - Get connection string

2. **Add to Vercel**
   - Add connection string as `DATABASE_URL` in Vercel environment variables

3. **Run Schema**
   ```bash
   psql "YOUR_CONNECTION_STRING" -f database/schema.sql
   ```

---

## Step 5: Configure Vercel Project Settings

### Build Settings

In Vercel dashboard → Settings → General:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Node Version:** 18.x or 20.x

### Domain Settings

1. **Add Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your domain
   - Follow DNS configuration instructions

2. **Automatic HTTPS**
   - Vercel provides SSL certificates automatically

---

## Step 6: GitHub Actions for CI/CD (Optional)

Create `.github/workflows/vercel.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Add GitHub Secrets

1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add:
   - `VERCEL_TOKEN` - Get from Vercel → Settings → Tokens
   - `VERCEL_ORG_ID` - Get from Vercel API or dashboard
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings

---

## Step 7: Post-Deployment Checklist

### Verify Deployment

1. **Check Build Logs**
   - Go to Vercel dashboard → Deployments
   - Check latest deployment logs
   - Ensure build succeeded

2. **Test Live Site**
   - Visit your Vercel URL
   - Test registration
   - Test login
   - Check API endpoints

3. **Verify Environment Variables**
   - Check that all variables are set
   - Verify database connection works

4. **Check Database**
   - Connect to production database
   - Verify schema is applied
   - Test a query

### Common Issues

**Build Fails:**
- Check build logs in Vercel
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

**Database Connection Fails:**
- Verify `DATABASE_URL` is set correctly
- Check database allows connections from Vercel IPs
- Verify SSL settings (Vercel Postgres uses SSL)

**API Routes Return 500:**
- Check server logs in Vercel dashboard
- Verify environment variables are set
- Check database connection

---

## Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `ENCRYPTION_KEY` | 32-character encryption key | `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` |
| `NODE_ENV` | Environment mode | `production` |

### Optional (Future Features)

| Variable | Description |
|----------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `AWS_REGION` | AWS region |
| `AWS_S3_BUCKET` | S3 bucket name |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |

---

## Quick Deploy Commands

```bash
# 1. Commit and push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy to Vercel (if using CLI)
vercel --prod

# 3. Check deployment status
vercel ls
```

---

## Monitoring & Logs

### View Logs

1. **Vercel Dashboard**
   - Go to project → Deployments
   - Click on a deployment
   - View "Functions" tab for API route logs

2. **Vercel CLI**
   ```bash
   vercel logs
   ```

### Set Up Monitoring

- **Vercel Analytics** - Built-in analytics
- **Sentry** - Error tracking (optional)
- **LogRocket** - Session replay (optional)

---

## Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Set up custom domain (if needed)
3. ✅ Configure database backups
4. ✅ Set up monitoring/alerts
5. ✅ Update documentation with production URLs
6. ✅ Test payment integrations (when ready)
7. ✅ Set up staging environment

---

## Troubleshooting

### Issue: Build fails on Vercel

**Check:**
- Build logs in Vercel dashboard
- TypeScript errors: `npm run build` locally
- Missing dependencies in `package.json`
- Node version compatibility

### Issue: Database connection fails

**Check:**
- `DATABASE_URL` is set correctly
- Database allows external connections
- SSL mode is correct (Vercel Postgres requires SSL)
- Database is running and accessible

### Issue: Environment variables not working

**Check:**
- Variables are set for correct environment (Production/Preview)
- Variable names match exactly (case-sensitive)
- Redeploy after adding variables
- No typos in variable names

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to git
- [ ] Database credentials are secure
- [ ] Encryption key is strong and unique
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] API routes have proper authentication
- [ ] Rate limiting configured (future)

---

## Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Docs: https://vercel.com/docs
- GitHub Actions: https://docs.github.com/en/actions
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
