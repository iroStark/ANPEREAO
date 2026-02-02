#!/bin/bash

# Automated deploy script for Railway
# Usage: ./scripts/deploy-railway.sh

set -e

echo "🚀 ANPERE Railway Deploy Script"
echo "================================"

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo "🔑 Please login to Railway:"
    railway login
fi

# Step 1: Backup uploads
echo ""
echo "📁 Step 1: Backing up uploads..."
if [ -d "uploads" ]; then
    ./scripts/backup-uploads.sh
else
    echo "⚠️  No uploads directory found, skipping backup"
fi

# Step 2: Verify database connection
echo ""
echo "🔌 Step 2: Checking local database..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running locally"
    
    # Show current data
    echo "📊 Current data:"
    psql -h localhost -d anpere -c "SELECT 'users' as table, count(*) FROM users UNION ALL SELECT 'gallery', count(*) FROM gallery UNION ALL SELECT 'slideshow', count(*) FROM slideshow;" 2>/dev/null || echo "⚠️  Could not query database"
else
    echo "⚠️  PostgreSQL not running locally"
fi

# Step 3: Build locally to verify
echo ""
echo "🔨 Step 3: Building locally to verify..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed, aborting deploy"
    exit 1
fi

# Step 4: Deploy to Railway
echo ""
echo "🚂 Step 4: Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo "✅ Deploy successful"
else
    echo "❌ Deploy failed"
    exit 1
fi

# Step 5: Health check
echo ""
echo "🏥 Step 5: Running health check..."
RAILWAY_URL=$(railway status | grep -o 'https://[^ ]*\.up\.railway\.app' | head -1)

if [ -n "$RAILWAY_URL" ]; then
    echo "🌐 Checking $RAILWAY_URL/api/health..."
    sleep 5
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$RAILWAY_URL/api/health" || echo "000")
    
    if [ "$HEALTH_STATUS" = "200" ]; then
        echo "✅ Health check passed"
        curl -s "$RAILWAY_URL/api/health" | jq . 2>/dev/null || curl -s "$RAILWAY_URL/api/health"
    else
        echo "⚠️  Health check returned HTTP $HEALTH_STATUS"
    fi
else
    echo "⚠️  Could not determine Railway URL"
fi

echo ""
echo "🎉 Deploy completed!"
echo "🔗 Railway Dashboard: https://railway.app/dashboard"
