# Deployment Guide

## GitHub Repository
- **Repository**: https://github.com/abhicris/MovieFund
- **Branch**: `main`
- **Status**: ✅ All code pushed and up to date

## Vercel Deployment

### Project Details
- **Project Name**: movie-fund
- **Production URL**: https://movie-fund.vercel.app
- **Custom Domain**: moviebitfund.kcolbchain.com
- **Organization**: kcolbchains-projects

### Continuous Deployment Setup

The project is configured for automatic deployments from GitHub:

1. **GitHub Integration**: 
   - Repository is connected to Vercel
   - Every push to `main` branch triggers automatic deployment
   - Pull requests create preview deployments

2. **Deployment Configuration**:
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node Version: 24.x
   - Region: Mumbai (bom1)

### Manual Deployment

If needed, you can manually deploy using:

```bash
vercel --prod
```

### Domain Configuration

- **Custom Domain**: moviebitfund.kcolbchain.com
- **DNS Setup**: Add A record pointing to `76.76.21.21` in Cloudflare
- **Status**: Domain added to Vercel project

### Deployment Status

✅ **Current Status**: 
- All code pushed to GitHub
- Vercel project linked
- Continuous deployment enabled
- Custom domain configured

### Monitoring Deployments

- **Vercel Dashboard**: https://vercel.com/kcolbchains-projects/movie-fund
- **GitHub Actions**: Automatic via Vercel integration
- **Deployment Logs**: Available in Vercel dashboard

## Deployment Workflow

1. **Make Changes**: Edit files locally
2. **Commit**: `git add . && git commit -m "Your message"`
3. **Push**: `git push origin main`
4. **Auto-Deploy**: Vercel automatically detects the push and deploys
5. **Verify**: Check deployment status in Vercel dashboard

## Environment Variables

If needed, add environment variables in:
- Vercel Dashboard → Project Settings → Environment Variables

## Build Settings

Current build settings (configured in `vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["bom1"]
}
```

## Troubleshooting

### If deployments aren't triggering:
1. Check GitHub repository connection in Vercel dashboard
2. Verify branch name matches (should be `main`)
3. Check Vercel project settings → Git → Connected Git Repository

### If build fails:
1. Check build logs in Vercel dashboard
2. Verify all dependencies are in `package.json`
3. Check Node.js version compatibility

---

*Last Updated: December 2025*
