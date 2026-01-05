#!/bin/bash

# Food Buddy Local Development Setup Script
# Run this script to set up your local development environment

echo "🍜 Food Buddy Local Setup"
echo "========================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found. AI service won't work locally."
else
    echo "✅ Python $(python3 --version) detected"
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo "   - NEXT_PUBLIC_MAPBOX_TOKEN (from mapbox.com)"
    echo "   - NEXT_PUBLIC_SUPABASE_URL (from supabase.com)"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY (from supabase.com)"
    echo ""
else
    echo "✅ .env.local exists"
fi

# Install Node dependencies
echo ""
echo "📦 Installing Node.js dependencies..."
npm install

# Check if AI service dependencies should be installed
if command -v python3 &> /dev/null; then
    echo ""
    read -p "🤖 Install AI service dependencies? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Installing Python dependencies..."
        cd ai-service
        python3 -m pip install -r requirements.txt
        cd ..
        echo "✅ AI service dependencies installed"
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env.local with your API keys"
echo "   2. Run 'npm run dev' to start the Next.js app"
echo "   3. Run 'cd ai-service && python3 -m uvicorn app.main:app --reload' for AI service"
echo ""
echo "🌐 URLs:"
echo "   - Frontend: http://localhost:3000"
echo "   - AI Service: http://localhost:8000"
echo "   - AI Docs: http://localhost:8000/docs"
echo ""
