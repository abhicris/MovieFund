# Vercel Environment Variables Setup

## Quick Setup Guide

### Step 1: Get Vercel Credentials

1. **Get Vercel Token**
   - Go to: https://vercel.com/account/tokens
   - Click "Create Token"
   - Name it (e.g., "MovieFund Deployment")
   - Copy the token (you'll need this)

2. **Get Organization ID**
   - Go to: https://vercel.com/account
   - Your Organization ID is in the URL or API settings

3. **Get Project ID**
   - After creating project in Vercel
   - Go to Project Settings → General
   - Project ID is shown there

---

## Step 2: Add Environment Variables in Vercel Dashboard

### Via Web Interface

1. **Go to Project Settings**
   - Open your project in Vercel
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

2. **Add Each Variable**

Click "Add New" for each variable:

#### Required Variables

**1. DATABASE_URL**
```
Key: DATABASE_URL
Value: postgresql://username:password@host:5432/moviefund
Environment: Production, Preview, Development
```

**2. ENCRYPTION_KEY**
```
Key: ENCRYPTION_KEY
Value: [32-character random string]
Environment: Production, Preview, Development
```

**3. NODE_ENV**
```
Key: NODE_ENV
Value: production
Environment: Production only
```

**4. NODE_ENV (Development)**
```
Key: NODE_ENV
Value: development
Environment: Preview, Development
```

### Generate Encryption Key

```bash
# On macOS/Linux
openssl rand -hex 16

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Step 3: Add GitHub Secrets (for CI/CD)

1. **Go to GitHub Repository**
   - Navigate to: `https://github.com/YOUR_USERNAME/MovieFund`
   - Click "Settings" → "Secrets and variables" → "Actions"

2. **Add Secrets**

Click "New repository secret" for each:

**VERCEL_TOKEN**
```
Name: VERCEL_TOKEN
Value: [Your Vercel token from Step 1]
```

**VERCEL_ORG_ID**
```
Name: VERCEL_ORG_ID
Value: [Your Organization ID]
```

**VERCEL_PROJECT_ID**
```
Name: VERCEL_PROJECT_ID
Value: [Your Project ID - get after creating project]
```

---

## Step 4: Database Setup for Production

### Option A: Vercel Postgres (Easiest)

1. **Create Database**
   - In Vercel dashboard → "Storage" tab
   - Click "Create Database" → "Postgres"
   - Choose plan (Hobby is fine for MVP)
   - Create database

2. **Get Connection String**
   - Go to database settings
   - Copy "Connection String"
   - It looks like: `postgres://default:password@host.vercel-storage.com:5432/verceldb`

3. **Add to Environment Variables**
   - Add as `DATABASE_URL` in Vercel project settings
   - Set for all environments

4. **Run Schema**
   ```bash
   # Use the connection string from Vercel
   psql "YOUR_VERCEL_POSTGRES_CONNECTION_STRING" -f database/schema.sql
   ```

### Option B: External Database (Supabase, Neon, Railway)

1. **Create Database**
   - Sign up for provider
   - Create PostgreSQL database
   - Get connection string

2. **Add to Vercel**
   - Add connection string as `DATABASE_URL`
   - Make sure it includes SSL parameters if required

3. **Run Schema**
   ```bash
   psql "YOUR_CONNECTION_STRING" -f database/schema.sql
   ```

---

## Environment Variables Checklist

### Production Environment

- [ ] `DATABASE_URL` - Production database connection
- [ ] `ENCRYPTION_KEY` - 32-character encryption key
- [ ] `NODE_ENV` - Set to `production`

### Preview Environment (Pull Requests)

- [ ] `DATABASE_URL` - Preview/test database connection
- [ ] `ENCRYPTION_KEY` - Same or different key
- [ ] `NODE_ENV` - Set to `development`

### Development Environment (Local)

- [ ] `DATABASE_URL` - Local database connection
- [ ] `ENCRYPTION_KEY` - Development key
- [ ] `NODE_ENV` - Set to `development`

---

## Quick Commands

### Add Variable via CLI

```bash
# Add to production
vercel env add DATABASE_URL production

# Add to all environments
vercel env add ENCRYPTION_KEY production preview development

# List all variables
vercel env ls

# Pull variables to local .env
vercel env pull .env.local
```

### Deploy with Environment Variables

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Verify Environment Variables

### Check in Vercel Dashboard

1. Go to Project → Settings → Environment Variables
2. Verify all variables are listed
3. Check they're set for correct environments

### Test in Code

Add temporary logging (remove after testing):

```typescript
// In any API route
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? 'Set' : 'Missing');
```

Check logs in Vercel dashboard → Deployments → Functions

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use different keys for production** - Don't reuse dev keys
3. **Rotate keys regularly** - Especially encryption keys
4. **Use Vercel's built-in secret management** - Don't hardcode
5. **Limit access** - Only add variables to needed environments

---

## Troubleshooting

### Variables not working

1. **Redeploy after adding variables**
   - Variables are only available after redeployment
   - Go to Deployments → Redeploy

2. **Check environment scope**
   - Make sure variable is set for correct environment
   - Production variables won't work in Preview

3. **Verify variable names**
   - Case-sensitive
   - No typos
   - Matches exactly what's in code

4. **Check build logs**
   - Look for errors about missing variables
   - Check server logs in Vercel dashboard

---

## Example .env.local (for reference only - don't commit)

```env
# Production Database (Vercel Postgres)
DATABASE_URL=postgres://default:password@host.vercel-storage.com:5432/verceldb?sslmode=require

# Encryption Key (32 characters)
ENCRYPTION_KEY=your-production-encryption-key-32-chars

# Environment
NODE_ENV=production
```

---

## Next Steps

1. ✅ Add all environment variables in Vercel
2. ✅ Set up production database
3. ✅ Run database schema
4. ✅ Deploy to Vercel
5. ✅ Test production deployment
6. ✅ Verify all features work
