@echo off
echo ========================================
echo   Setting up Neon Database
echo ========================================
echo.
echo STEP 1: Update .env.neon with your Neon connection string
echo STEP 2: Then run these commands:
echo.
echo cd packages\db
echo npx prisma migrate deploy
echo npx prisma generate
echo.
pause
