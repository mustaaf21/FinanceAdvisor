#!/bin/bash
set -e

echo "================================================"
echo " Finance Advisor - Setup Script"
echo "================================================"

echo ""
echo "[1/4] Restoring .NET packages..."
dotnet restore FinanceAdvisor.sln

echo ""
echo "[2/4] Creating EF Core migration..."
dotnet ef migrations add InitialCreate \
  --project src/FinanceAdvisor.Infrastructure \
  --startup-project src/FinanceAdvisor.API \
  --output-dir Data/Migrations \
  2>/dev/null || echo "Migration may already exist, continuing..."

echo ""
echo "[3/4] Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "[4/4] Done!"
echo ""
echo "================================================"
echo " NEXT STEPS:"
echo " 1. Add your Groq API key to:"
echo "    src/FinanceAdvisor.API/appsettings.json"
echo " 2. Run backend:"
echo "    dotnet run --project src/FinanceAdvisor.API"
echo " 3. Run frontend:"
echo "    cd frontend && npm run dev"
echo " 4. Open: http://localhost:5173"
echo " 5. Login: mustafeez@demo.com / Demo@1234"
echo "================================================"
