# CollabCanvas - Start Frontend
Write-Host "🎨 Starting CollabCanvas Frontend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend
Set-Location apps/collabcanvas-landing

Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Yellow
npm install

Write-Host "🔥 Starting development server..." -ForegroundColor Cyan
Write-Host "   The app will open in your browser" -ForegroundColor Gray
Write-Host "   Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host ""

# Start the dev server
npm run dev
