# Fix PostgreSQL Installation

## Quick Fix

You have Homebrew installed. Run these commands:

### 1. Install PostgreSQL

```bash
brew install postgresql@15
```

Or use the installation script:
```bash
./install-postgres.sh
```

### 2. Start PostgreSQL Service

```bash
brew services start postgresql@15
```

### 3. Add to PATH

Since you're using zsh, add this to your `~/.zshrc`:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Or for latest version:
```bash
echo 'export PATH="/opt/homebrew/opt/postgresql/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 4. Verify Installation

```bash
psql --version
createdb --version
```

### 5. Create Database and Run Schema

```bash
# Create database
createdb moviefund

# Run schema
psql -d moviefund -f database/schema.sql
```

---

## Alternative: Use Docker (No Installation Needed)

If you have Docker installed, you can skip PostgreSQL installation:

```bash
# Start PostgreSQL in Docker
docker run --name moviefund-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=moviefund \
  -p 5432:5432 \
  -d postgres:15

# Then update .env.local:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
```

Then run schema:
```bash
# Copy schema into container
docker cp database/schema.sql moviefund-postgres:/tmp/schema.sql

# Run schema
docker exec -i moviefund-postgres psql -U postgres -d moviefund -f /tmp/schema.sql
```

---

## Alternative: Use Postgres.app (GUI)

1. Download from: https://postgresapp.com/
2. Install and open the app
3. Click "Initialize" to create a server
4. Add to PATH:
   ```bash
   sudo mkdir -p /etc/paths.d &&
   echo /Applications/Postgres.app/Contents/Versions/latest/bin | sudo tee /etc/paths.d/postgresapp
   ```
5. Restart terminal

---

## Manual Installation Steps

If the script doesn't work:

```bash
# 1. Install
brew install postgresql@15

# 2. Start service
brew services start postgresql@15

# 3. Add to PATH (for zsh)
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 4. Verify
psql --version

# 5. Create database
createdb moviefund

# 6. Run schema
psql -d moviefund -f database/schema.sql
```

---

## Check Current Status

```bash
# Check if PostgreSQL is installed
brew list | grep postgresql

# Check if service is running
brew services list | grep postgresql

# Check if psql is in PATH
which psql
```

---

## After Installation

Once PostgreSQL is installed and working:

1. **Create database:**
   ```bash
   createdb moviefund
   ```

2. **Run schema:**
   ```bash
   psql -d moviefund -f database/schema.sql
   ```

3. **Create .env.local:**
   ```bash
   cat > .env.local << 'EOF'
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/moviefund
   ENCRYPTION_KEY=dev-key-32-characters-long-12345678
   NODE_ENV=development
   EOF
   ```
   (Update DATABASE_URL with your actual credentials)

4. **Start dev server:**
   ```bash
   npm run dev
   ```

---

## Need Help?

- Check `INSTALL_POSTGRESQL.md` for detailed instructions
- Verify PostgreSQL is running: `brew services list`
- Check PATH: `echo $PATH | grep postgresql`
- Try restarting terminal after adding to PATH
