@echo off
echo ================================================
echo  Finance Advisor - Setup Script
echo ================================================

echo.
echo [1/4] Restoring .NET packages...
dotnet restore FinanceAdvisor.sln
if %errorlevel% neq 0 (echo ERROR: dotnet restore failed & exit /b 1)

echo.
echo [2/4] Creating EF Core migration...
dotnet ef migrations add InitialCreate ^
  --project src\FinanceAdvisor.Infrastructure ^
  --startup-project src\FinanceAdvisor.API ^
  --output-dir Data\Migrations
if %errorlevel% neq 0 (
    echo Migration may already exist, continuing...
)

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (echo ERROR: npm install failed & exit /b 1)
cd ..

echo.
echo [4/4] Done!
echo.
echo ================================================
echo  NEXT STEPS:
echo  1. Add your Groq API key to:
echo     src\FinanceAdvisor.API\appsettings.json
echo  2. Run backend:
echo     dotnet run --project src\FinanceAdvisor.API
echo  3. Run frontend:
echo     cd frontend ^& npm run dev
echo  4. Open: http://localhost:5173
echo  5. Login: mustafeez@demo.com / Demo@1234
echo ================================================
pause
