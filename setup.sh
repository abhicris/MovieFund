#!/bin/bash

# MovieFund Local Setup Script
# This script helps set up the development environment

echo "🎬 MovieFund Local Setup"
echo "========================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Please install PostgreSQL first."
    echo "   macOS: brew install postgresql"
    echo "   Linux: sudo apt-get install postgresql"
    exit 1
fi

echo "✅ PostgreSQL found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check if database exists
echo ""
echo "🗄️  Setting up database..."

# Try to connect to database
psql -d moviefund -c "SELECT 1" &> /dev/null

if [ $? -ne 0 ]; then
    echo "Creating database..."
    createdb moviefund
    
    if [ $? -ne 0 ]; then
        echo "⚠️  Could not create database. Please create it manually:"
        echo "   createdb moviefund"
        echo "   Or: psql postgres -c 'CREATE DATABASE moviefund;'"
    else
        echo "✅ Database created"
    fi
else
    echo "✅ Database already exists"
fi

# Run schema
if [ -f "database/schema.sql" ]; then
    echo "Running database schema..."
    psql -d moviefund -f database/schema.sql &> /dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ Schema applied"
    else
        echo "⚠️  Could not run schema. Please run manually:"
        echo "   psql -d moviefund -f database/schema.sql"
    fi
fi

# Check for .env.local
echo ""
echo "⚙️  Checking environment variables..."

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
ENCRYPTION_KEY=dev-key-32-characters-long-12345678
NODE_ENV=development
EOF
    echo "✅ Created .env.local"
    echo "⚠️  Please update DATABASE_URL with your PostgreSQL credentials!"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "For detailed instructions, see QUICK_START.md"
