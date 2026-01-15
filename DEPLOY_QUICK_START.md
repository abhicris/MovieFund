# Quick Deploy to Vercel - Step by Step

## 🚀 5-Minute Deployment Guide

### Step 1: Push to GitHub

```bash
cd /Users/abhishekkrishna/Documents/GitHub/MovieFund

# Check git status
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit: MovieFund platform"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/MovieFund.git

# Push
git branch -M main
git push -u origin main
```

---

### Step 2: Create Vercel Project

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find "MovieFund" repository
   - Click "Import"

3. **Configure**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Click "Deploy" (we'll add env vars after)

---

### Step 3: Add Environment Variables

1. **Go to Project Settings**
   - In Vercel dashboard → Your project
   - Settings → Environment Variables

2. **Add Required Variables**

Click "Add New" for each:

**Variable 1:**
```
Key: DATABASE_URL
Value: [Your production database connection string]
Environment: Production, Preview, Development
```

**Variable 2:**
```
Key: ENCRYPTION_KEY
Value: [Generate 32-character key]
Environment: Production, Preview, Development
```

**Variable 3:**
```
Key: NODE_ENV
Value: production
Environment: Production
```

**Variable 4:**
```
Key: NODE_ENV
Value: development
Environment: Preview, Development
```

3. **Generate Encryption Key**
   ```bash
   openssl rand -hex 16
   ```

---

### Step 4: Set Up Production Database

**Option A: Vercel Postgres (Easiest)**

1. In Vercel → "Storage" tab
2. "Create Database" → "Postgres"
3. Choose "Hobby" plan (free tier)
4. Copy connection string
5. Add as `DATABASE_URL` in environment variables
6. Run schema:
   ```bash
   psql "YOUR_VERCEL_POSTGRES_CONNECTION_STRING" -f database/schema.sql
   ```

**Option B: Supabase (Free Alternative)**

1. Go to: https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Add as `DATABASE_URL` in Vercel
5. Run schema:
   ```bash
   psql "YOUR_SUPABASE_CONNECTION_STRING" -f database/schema.sql
   ```

---

### Step 5: Redeploy

1. **Redeploy in Vercel**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"

2. **Or trigger via push**
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

---

### Step 6: Test Production

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test registration
3. Test login
4. Check API endpoints

---

## 🔑 Getting Vercel Credentials (for CI/CD)

### Vercel Token

1. Go to: https://vercel.com/account/tokens
2. Click "Create Token"
3. Name: "MovieFund CI/CD"
4. Copy token

### Organization ID

1. Go to: https://vercel.com/account
2. Organization ID is in URL or API section

### Project ID

1. After creating project
2. Go to Project Settings → General
3. Project ID is shown there

### Add to GitHub Secrets

1. GitHub repo → Settings → Secrets → Actions
2. Add:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Production database set up
- [ ] Database schema run
- [ ] Project deployed
- [ ] Production URL tested
- [ ] All features working

---

## 🐛 Common Issues

**Build fails:**
- Check build logs in Vercel
- Run `npm run build` locally first

**Database connection fails:**
- Verify `DATABASE_URL` is correct
- Check database allows external connections
- Ensure SSL is enabled if required

**Environment variables not working:**
- Redeploy after adding variables
- Check variable names match exactly
- Verify environment scope (Production/Preview)

---

## 📝 Quick Reference

**Vercel Dashboard:** https://vercel.com/dashboard
**GitHub Actions:** https://github.com/YOUR_USERNAME/MovieFund/actions
**Project Settings:** Vercel → Your Project → Settings

---

## 🎯 Next Steps

1. Set up custom domain (optional)
2. Configure monitoring
3. Set up staging environment
4. Add payment integrations
5. Configure backups
