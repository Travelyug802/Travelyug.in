@echo off
echo.
echo  ╔══════════════════════════════════════╗
echo  ║     Travelyug — Setup Script         ║
echo  ╚══════════════════════════════════════╝
echo.

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
echo  OK: Node.js found.

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend npm install failed.
    pause
    exit /b 1
)
echo  OK: Backend dependencies installed.

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend npm install failed.
    pause
    exit /b 1
)
echo  OK: Frontend dependencies installed.

echo.
echo [4/4] Seeding demo data...
cd ..\backend
call npm run seed
echo  OK: Demo data seeded.

echo.
echo  ╔══════════════════════════════════════════════════════╗
echo  ║   ✅  Setup Complete!                                ║
echo  ║                                                      ║
echo  ║   To start the project, open TWO terminals:          ║
echo  ║                                                      ║
echo  ║   Terminal 1 (Backend):                              ║
echo  ║     cd backend ^&^& npm run dev                       ║
echo  ║                                                      ║
echo  ║   Terminal 2 (Frontend):                             ║
echo  ║     cd frontend ^&^& npm run dev                      ║
echo  ║                                                      ║
echo  ║   Then open: http://localhost:5173                   ║
echo  ║   Admin:     http://localhost:5173/admin/login       ║
echo  ║   Email:     admin@travelyug.com                     ║
echo  ║   Password:  Admin@123456                            ║
echo  ╚══════════════════════════════════════════════════════╝
echo.
pause
