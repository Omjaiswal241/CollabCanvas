# CollabCanvas - Start WebSocket Backend
Write-Host "🔌 Starting CollabCanvas WebSocket Backend..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "📋 Please copy .env.example to .env and configure your DATABASE_URL" -ForegroundColor Yellow
    exit 1
}

# Navigate to ws-backend
Set-Location apps/ws-backend

Write-Host "📦 Building WebSocket backend..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host ""
Write-Host "🔥 Starting WebSocket server on ws://localhost:8080..." -ForegroundColor Cyan
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the server
node dist/index.js
