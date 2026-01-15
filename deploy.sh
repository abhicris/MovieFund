#!/bin/bash

# MovieFund Deployment Helper Script
# This script helps prepare and deploy to Vercel

echo "🚀 MovieFund Deployment Helper"
echo "=============================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Check git status
echo "📋 Checking git status..."
git status

echo ""
echo "Next steps:"
echo ""
echo "1. Add and commit your changes:"
echo "   git add ."
echo "   git commit -m 'Your commit message'"
echo ""
echo "2. Add GitHub remote (if not done):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/MovieFund.git"
echo ""
echo "3. Push to GitHub:"
echo "   git push -u origin main"
echo ""
echo "4. Deploy to Vercel:"
echo "   - Go to: https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables (see VERCEL_ENV_SETUP.md)"
echo "   - Deploy!"
echo ""
echo "📚 See DEPLOY_QUICK_START.md for detailed instructions"
