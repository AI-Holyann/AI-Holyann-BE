@echo off
echo ========================================
echo Restarting Dev Server and Regenerating Prisma Client
echo ========================================

echo.
echo Step 1: Stopping all Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo Step 2: Cleaning Prisma client cache...
if exist "node_modules\.prisma" (
    rmdir /s /q "node_modules\.prisma"
    echo - Prisma client cache deleted
)

echo Step 3: Regenerating Prisma client...
call npx prisma generate

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Prisma client regenerated
    echo ========================================
    echo.
    echo You can now restart the dev server with:
    echo   npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR! Failed to regenerate Prisma client
    echo ========================================
    pause
    exit /b 1
)

pause

