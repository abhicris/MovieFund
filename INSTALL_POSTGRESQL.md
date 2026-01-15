# Installing PostgreSQL on macOS

## Option 1: Using Homebrew (Recommended)

### Step 1: Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Step 2: Install PostgreSQL

```bash
brew install postgresql@15
```

Or for latest version:
```bash
brew install postgresql
```

### Step 3: Start PostgreSQL Service

```bash
brew services start postgresql@15
```

Or:
```bash
brew services start postgresql
```

### Step 4: Add to PATH (if needed)

If `psql` command is not found after installation, add to your shell config:

```bash
# For zsh (default on macOS)
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Or for latest version
echo 'export PATH="/usr/local/opt/postgresql/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Step 5: Verify Installation

```bash
psql --version
createdb --version
```

---

## Option 2: Using Postgres.app (GUI - Easier)

### Step 1: Download Postgres.app

Visit: https://postgresapp.com/

Download and install the app.

### Step 2: Add to PATH

```bash
sudo mkdir -p /etc/paths.d &&
echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
```

Then restart your terminal or run:
```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
```

### Step 3: Start Postgres.app

- Open Applications folder
- Double-click Postgres.app
- Click "Initialize" if prompted

---

## Option 3: Using Docker (Alternative)

If you have Docker installed:

```bash
# Run PostgreSQL in Docker
docker run --name moviefund-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=moviefund \
  -p 5432:5432 \
  -d postgres:15

# Then use:
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
```

---

## After Installation

### Create Database

```bash
# Using psql
psql postgres
CREATE DATABASE moviefund;
\q

# Or using createdb
createdb moviefund
```

### Run Schema

```bash
psql -d moviefund -f database/schema.sql
```

### Check Connection

```bash
psql -d moviefund -c "SELECT version();"
```

---

## Troubleshooting

### "psql: command not found"

**Solution:**
```bash
# Find where PostgreSQL is installed
brew list postgresql@15 | grep bin

# Add to PATH
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"

# Make permanent
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### "Connection refused"

**Solution:**
```bash
# Start PostgreSQL service
brew services start postgresql@15

# Or if using Postgres.app, make sure it's running
```

### "password authentication failed"

**Solution:**
- Default PostgreSQL user on macOS is usually your system username
- Try: `psql -d moviefund` (without username)
- Or create a user:
  ```sql
  psql postgres
  CREATE USER postgres WITH PASSWORD 'postgres';
  ALTER USER postgres CREATEDB;
  \q
  ```

---

## Quick Setup Script

After installing PostgreSQL, run:

```bash
# Create database
createdb moviefund

# Or if createdb doesn't work:
psql postgres -c "CREATE DATABASE moviefund;"

# Run schema
psql -d moviefund -f database/schema.sql

# Verify
psql -d moviefund -c "\dt"
```

---

## Verify Everything Works

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Check connection
psql -d moviefund -c "SELECT 1;"

# List tables
psql -d moviefund -c "\dt"
```
