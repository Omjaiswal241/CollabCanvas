# CollabCanvas - Complete Setup & Start
Write-Host "🚀 CollabCanvas - Complete Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = $PSScriptRoot

# Function to show colored messages
function Write-Step {
    param($emoji, $message, $color = "White")
    Write-Host "$emoji $message" -ForegroundColor $color
}

# Check if .env exists
Write-Step "📋" "Checking configuration..." "Yellow"
if (-not (Test-Path "$projectRoot\.env")) {
    Write-Step "❌" "Error: .env file not found!" "Red"
    Write-Host ""
    Write-Host "📝 Creating .env from example..." -ForegroundColor Yellow
    Copy-Item "$projectRoot\.env.example" "$projectRoot\.env"
    Write-Step "✅" ".env file created!" "Green"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env and configure your DATABASE_URL" -ForegroundColor Yellow
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Step "✅" ".env file found" "Green"
}

Write-Host ""

# Check if database migrations are needed
Write-Step "🗄️" "Setting up database..." "Yellow"
Set-Location "$projectRoot\packages\db"

$prismaStatus = npx prisma migrate status 2>&1
if ($prismaStatus -match "Database schema is up to date") {
    Write-Step "✅" "Database is up to date" "Green"
} else {
    Write-Host "   Running migrations..." -ForegroundColor Gray
    npx prisma migrate dev --name init
    if ($LASTEXITCODE -eq 0) {
        Write-Step "✅" "Database migrations completed" "Green"
    } else {
        Write-Step "❌" "Database migration failed!" "Red"
        Write-Host "   Please check your DATABASE_URL in .env" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# Build HTTP backend
Write-Step "🔧" "Building HTTP backend..." "Yellow"
Set-Location "$projectRoot\apps\http-backend"
npm run build | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Step "✅" "HTTP backend built successfully" "Green"
} else {
    Write-Step "❌" "HTTP backend build failed!" "Red"
    exit 1
}

Write-Host ""

# Build WebSocket backend
Write-Step "🔧" "Building WebSocket backend..." "Yellow"
Set-Location "$projectRoot\apps\ws-backend"
npm run build | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Step "✅" "WebSocket backend built successfully" "Green"
} else {
    Write-Step "❌" "WebSocket backend build failed!" "Red"
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Step "✅" "Setup complete!" "Green"
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Terminal 1 - HTTP Backend:" -ForegroundColor Yellow
Write-Host "   .\start-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 2 - WebSocket Backend:" -ForegroundColor Yellow
Write-Host "   .\start-ws-backend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 3 - Frontend:" -ForegroundColor Yellow
Write-Host "   .\start-frontend.ps1" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Then open: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""

# Ask if user wants to start now
$response = Read-Host "Would you like to start the HTTP backend now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Step "🚀" "Starting HTTP backend..." "Cyan"
    Write-Host "   Note: Run start-ws-backend.ps1 in another terminal for real-time features" -ForegroundColor Yellow
    Set-Location "$projectRoot\apps\http-backend"
    node dist/index.js
}
