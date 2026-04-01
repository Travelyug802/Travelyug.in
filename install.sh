#!/bin/bash
set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║     Travelyug — Setup Script         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Download from: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version) found"

# Backend deps
echo ""
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/backend"
npm install
echo "✅ Backend dependencies installed"

# Frontend deps
echo ""
echo "📦 Installing frontend dependencies..."
cd "../frontend"
npm install
echo "✅ Frontend dependencies installed"

# Seed
echo ""
echo "🌱 Seeding demo data..."
cd "../backend"
npm run seed
echo "✅ Demo data seeded"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅  Setup Complete!                                 ║"
echo "║                                                      ║"
echo "║  Open TWO terminals:                                 ║"
echo "║                                                      ║"
echo "║  Terminal 1:  cd backend && npm run dev              ║"
echo "║  Terminal 2:  cd frontend && npm run dev             ║"
echo "║                                                      ║"
echo "║  Site:   http://localhost:5173                       ║"
echo "║  Admin:  http://localhost:5173/admin/login           ║"
echo "║  Email:  admin@travelyug.com                         ║"
echo "║  Pass:   Admin@123456                                ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
