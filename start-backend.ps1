# CollabCanvas - Start Backend Server
Write-Host "🚀 Starting CollabCanvas Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "📋 Please copy .env.example to .env and configure your DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

# Navigate to http-backend
Set-Location apps/http-backend

Write-Host "📦 Building backend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🔥 Starting server on http://localhost:3001..." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
node dist/index.js
