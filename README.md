# Food Buddy 🍜

> The Local's Guide to Singapore Food

A Progressive Web App (PWA) that helps tourists and visitors discover authentic Singapore food through curated lists from locals and food influencers.

[![CI](https://github.com/YOUR_USERNAME/food-buddy/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/food-buddy/actions/workflows/ci.yml)

## ✨ Features

- **Curated Food Lists** - Browse lists created by locals and food influencers
- **Interactive Map** - View all places on a Mapbox-powered map
- **Route Optimization** - Get walking directions through multiple food stops
- **QR Code Sharing** - Share your food list via QR code—no app download needed
- **Cultural Context** - AI-generated explanations of local dishes
- **Semantic Search** - Natural language search ("quiet cafe with wifi")
- **Offline Support** - Works without internet (PWA)

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| State | Zustand |
| Maps | Mapbox GL |
| Database | Supabase (PostgreSQL + PostGIS) |
| AI Service | Python FastAPI |
| AI/ML | OpenAI Embeddings, Anthropic Claude, Pinecone |
| Deployment | Vercel (frontend), Railway (AI service) |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/food-buddy.git
cd food-buddy

# Run setup script
./scripts/setup.sh

# Or manually:
cp .env.example .env.local
npm install
npm run dev
```

## 📁 Project Structure

```
food-buddy/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── lists/        # List pages (browse, create, view)
│   │   └── share/        # QR share redirect
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Header, Footer
│   │   ├── lists/        # List-related components
│   │   └── map/          # Map components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, clients, helpers
│   ├── stores/           # Zustand state stores
│   └── types/            # TypeScript definitions
├── ai-service/           # Python FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   └── routers/      # API endpoints
│   ├── Dockerfile
│   └── requirements.txt
├── public/               # Static assets
└── scripts/              # Development scripts
```

## 🔧 Configuration

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

### Environment Variables

```bash
# Required
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional (AI features)
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
ENABLE_AI_FEATURES=true
```

## 🧪 Development

```bash
# Start Next.js development server
npm run dev

# Start AI service (in another terminal)
cd ai-service
python3 -m uvicorn app.main:app --reload

# Run type checking
npx tsc --noEmit

# Run linter
npm run lint

# Build for production
npm run build
```

## 📡 API Endpoints

### Next.js API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/lists` | Get all public lists |
| POST | `/api/lists` | Create a new list |
| GET | `/api/lists/[id]` | Get a specific list |
| PATCH | `/api/lists/[id]` | Update a list |
| DELETE | `/api/lists/[id]` | Delete a list |
| GET | `/api/places` | Search places |
| POST | `/api/routes` | Optimize walking route |

### AI Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=` | Semantic search |
| POST | `/api/context/generate` | Generate cultural context |
| POST | `/api/routes/optimize` | Optimize route (OR-Tools) |
| GET | `/health` | Health check |

## 🚢 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

### AI Service (Railway)

1. Connect repo to Railway
2. Set root directory to `ai-service`
3. Add API keys as environment variables
4. Deploy

## 📊 Blue Ocean Strategy

This app creates uncontested market space by:

- **Eliminating**: User reviews, algorithmic recommendations
- **Reducing**: Social features, comprehensive coverage
- **Raising**: Curation quality, shareability, trust signals
- **Creating**: Food routes, cultural context, QR sharing

## 🗺 Roadmap

- [x] MVP with mock data
- [x] Create list page
- [x] AI service structure
- [ ] Supabase integration
- [ ] Authentication
- [ ] Real semantic search
- [ ] Influencer onboarding
- [ ] Push notifications
- [ ] Offline mode

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built as part of the x10 Ideas January 2025 sprint.

