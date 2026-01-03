"""
Food Buddy AI Service
FastAPI backend for AI-powered features
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import search, context, routes

app = FastAPI(
    title="Food Buddy AI Service",
    description="AI-powered features for Food Buddy",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(context.router, prefix="/api/context", tags=["context"])
app.include_router(routes.router, prefix="/api/routes", tags=["routes"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "food-buddy-ai"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Food Buddy AI Service",
        "version": "1.0.0",
        "docs": "/docs",
    }
