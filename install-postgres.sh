#!/bin/bash

# PostgreSQL Installation Script for macOS
# This script installs PostgreSQL using Homebrew

echo "🐘 Installing PostgreSQL..."
echo ""

# Check if PostgreSQL is already installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is already installed"
    psql --version
    exit 0
fi

# Install PostgreSQL
echo "📦 Installing PostgreSQL via Homebrew..."
brew install postgresql@15

if [ $? -ne 0 ]; then
    echo "❌ Failed to install PostgreSQL"
    echo "Trying latest version..."
    brew install postgresql
fi

# Add to PATH
echo ""
echo "🔧 Adding PostgreSQL to PATH..."

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_CONFIG="$HOME/.bash_profile"
else
    SHELL_CONFIG="$HOME/.zshrc"
fi

# Check if already in PATH
if grep -q "postgresql" "$SHELL_CONFIG" 2>/dev/null; then
    echo "✅ PostgreSQL path already configured"
else
    # Add to PATH
    echo '' >> "$SHELL_CONFIG"
    echo '# PostgreSQL' >> "$SHELL_CONFIG"
    echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> "$SHELL_CONFIG"
    echo 'export PATH="/opt/homebrew/opt/postgresql/bin:$PATH"' >> "$SHELL_CONFIG"
    echo "✅ Added PostgreSQL to $SHELL_CONFIG"
fi

# Source the config
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
export PATH="/opt/homebrew/opt/postgresql/bin:$PATH"

# Start PostgreSQL service
echo ""
echo "🚀 Starting PostgreSQL service..."
brew services start postgresql@15 2>/dev/null || brew services start postgresql

# Wait a moment for service to start
sleep 2

# Verify installation
echo ""
echo "✅ Verifying installation..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL installed successfully!"
    psql --version
    echo ""
    echo "Next steps:"
    echo "1. Restart your terminal or run: source $SHELL_CONFIG"
    echo "2. Create database: createdb moviefund"
    echo "3. Run schema: psql -d moviefund -f database/schema.sql"
else
    echo "⚠️  PostgreSQL installed but not in PATH"
    echo "Please restart your terminal or run:"
    echo "  source $SHELL_CONFIG"
fi
