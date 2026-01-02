# Food Buddy 🍜

> The Local's Guide to Singapore Food

A Progressive Web App (PWA) that helps tourists and visitors discover authentic Singapore food through curated lists from locals and food influencers.

## Features

- **Curated Food Lists**: Browse lists created by locals and food influencers
- **Interactive Map**: View all places on a map with markers
- **Route Optimization**: Get walking directions through multiple food stops
- **QR Code Sharing**: Share your food list via QR code—no app download needed
- **Cultural Context**: Learn what makes each dish special
- **Offline Support**: Works without internet (PWA)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Maps**: Mapbox GL
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Mapbox account (for maps)
- Supabase account (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/food-buddy.git
cd food-buddy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── lists/             # List pages
│   └── share/             # Share redirect pages
├── components/
│   ├── ui/               # Reusable UI components
│   ├── layout/           # Layout components
│   ├── lists/            # List-related components
│   └── map/              # Map components
├── lib/                   # Utilities and helpers
├── stores/               # Zustand stores
└── types/                # TypeScript types
```

## License

MIT License
