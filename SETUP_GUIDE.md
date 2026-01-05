# Food Buddy Setup Guide

This guide walks you through setting up all the services needed to run Food Buddy in production.

---

## 1. Mapbox Setup (5 minutes)

Mapbox provides the interactive maps for viewing food locations.

### Steps:

1. **Create account**: Go to [mapbox.com](https://www.mapbox.com/) and sign up (free tier is generous)

2. **Get your token**: 
   - Go to your [Account page](https://account.mapbox.com/)
   - Your default public token is shown, or create a new one
   - Copy the token (starts with `pk.`)

3. **Add to your project**:
   ```bash
   # In your food-buddy directory, create .env.local
   echo "NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here" >> .env.local
   ```

4. **Verify it works**:
   - Restart your Next.js dev server (`npm run dev`)
   - Go to a list detail page - you should see the map!

### Free Tier Limits:
- 50,000 map loads/month
- 100,000 geocoding requests/month
- More than enough for MVP and early users

---

## 2. Supabase Setup (10 minutes)

Supabase provides the PostgreSQL database with authentication and real-time features.

### Steps:

1. **Create account**: Go to [supabase.com](https://supabase.com/) and sign up

2. **Create new project**:
   - Click "New Project"
   - Name: `food-buddy`
   - Database password: Generate a strong one and **save it**
   - Region: Choose closest to Singapore (e.g., Singapore or Southeast Asia)
   - Click "Create new project" (takes ~2 minutes)

3. **Get your credentials**:
   - Go to Project Settings → API
   - Copy:
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon/public key** (starts with `eyJ...`)

4. **Add to your project**:
   ```bash
   # Add to .env.local
   echo "NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co" >> .env.local
   echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ..." >> .env.local
   ```

5. **Run the database schema**:
   - Go to SQL Editor in Supabase dashboard
   - Click "New Query"
   - Copy the contents of `src/lib/supabase/schema.sql`
   - Paste and click "Run"
   - You should see "Success" messages

6. **Enable PostGIS** (for location queries):
   - Go to Database → Extensions
   - Search for "postgis"
   - Toggle it ON

### Verify Setup:
```bash
# In your project, test the connection
npm run dev
# Check browser console for any Supabase errors
```

---

## 3. Deploy to Vercel (5 minutes)

Vercel is the easiest way to deploy Next.js apps.

### Prerequisites:
- GitHub account
- Your code pushed to a GitHub repo

### Steps:

1. **Push to GitHub** (if not already):
   ```bash
   cd food-buddy
   git init
   git add .
   git commit -m "Initial commit - Food Buddy MVP"
   
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/food-buddy.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com/) and sign up with GitHub
   - Click "Add New Project"
   - Import your `food-buddy` repository
   - Vercel auto-detects Next.js settings

3. **Add Environment Variables**:
   - In the deployment settings, add:
     ```
     NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx
     NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     ```
   - Click "Deploy"

4. **Get your URL**:
   - Vercel gives you a URL like `food-buddy-xxx.vercel.app`
   - You can add a custom domain later

### Auto-Deployments:
Every push to `main` automatically deploys. Feature branches get preview URLs!

---

## 4. Deploy AI Service to Railway (10 minutes)

Railway is the easiest way to deploy Python services.

### Steps:

1. **Create account**: Go to [railway.app](https://railway.app/) and sign up with GitHub

2. **Create new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `food-buddy` repo
   - Railway will ask which directory - select `ai-service`

3. **Configure the service**:
   - Railway auto-detects the Dockerfile
   - Add environment variables (click on the service → Variables):
     ```
     OPENAI_API_KEY=sk-xxx (optional, for semantic search)
     ANTHROPIC_API_KEY=sk-ant-xxx (optional, for cultural context)
     PINECONE_API_KEY=xxx (optional, for vector search)
     ```

4. **Generate a domain**:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - You'll get something like `food-buddy-ai-production.up.railway.app`

5. **Connect to your frontend**:
   - Add to your Vercel environment variables:
     ```
     NEXT_PUBLIC_AI_SERVICE_URL=https://food-buddy-ai-production.up.railway.app
     ```

### Alternative: Render.com

If you prefer Render:

1. Go to [render.com](https://render.com/) and sign up
2. New → Web Service
3. Connect your GitHub repo
4. Root Directory: `ai-service`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

---

## 5. Connect Everything Together

### Update your Next.js app to use the AI service:

Create `src/lib/ai-service.ts`:

```typescript
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000';

export async function semanticSearch(query: string) {
  const response = await fetch(`${AI_SERVICE_URL}/api/search?q=${encodeURIComponent(query)}`);
  return response.json();
}

export async function generateCulturalContext(dishName: string, placeName: string) {
  const response = await fetch(`${AI_SERVICE_URL}/api/context/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dish_name: dishName, place_name: placeName }),
  });
  return response.json();
}

export async function optimizeRoute(places: Array<{id: string, name: string, lat: number, lng: number}>) {
  const response = await fetch(`${AI_SERVICE_URL}/api/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ places }),
  });
  return response.json();
}
```

---

## Quick Reference: All Environment Variables

### .env.local (for local development)
```bash
# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Service (local)
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

# AI Features (optional)
ENABLE_AI_FEATURES=true
```

### Vercel Environment Variables
Same as above, but with production URLs:
- `NEXT_PUBLIC_APP_URL=https://your-app.vercel.app`
- `NEXT_PUBLIC_AI_SERVICE_URL=https://your-ai-service.railway.app`

### Railway Environment Variables (AI Service)
```bash
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
PINECONE_API_KEY=xxx
```

---

## Estimated Costs

| Service | Free Tier | When You'll Pay |
|---------|-----------|-----------------|
| Mapbox | 50k loads/mo | After 50k map views |
| Supabase | 500MB DB, 1GB storage | After limits |
| Vercel | 100GB bandwidth | After limits |
| Railway | $5 credit/mo | After ~500 hours |
| OpenAI | Pay per use | ~$0.01 per search |
| Anthropic | Pay per use | ~$0.01 per context |

**Total for MVP: $0-10/month** until you have significant users.

---

## Troubleshooting

### Map not showing?
- Check browser console for Mapbox errors
- Verify token is correct and not expired
- Make sure token has the right scopes

### Database connection failing?
- Check Supabase project is running (not paused)
- Verify URL and key are correct
- Check if RLS policies are blocking queries

### AI service not responding?
- Check Railway/Render logs
- Verify the service is running (not sleeping)
- Check CORS settings if getting blocked

### Deployment failing?
- Check build logs in Vercel/Railway
- Make sure all env vars are set
- Check for TypeScript errors locally first

---

## Next Steps After Deployment

1. **Add authentication** - Let users create accounts
2. **Seed real data** - Add actual Singapore restaurants
3. **Enable AI features** - Add API keys for search/context
4. **Custom domain** - Add your own domain name
5. **Analytics** - Add Vercel Analytics or Plausible

Need help? Check the README.md or open an issue on GitHub.
