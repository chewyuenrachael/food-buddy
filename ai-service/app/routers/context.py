"""
Cultural Context Router
Generates tourist-friendly explanations of local dishes using Claude
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os

router = APIRouter()


class ContextRequest(BaseModel):
    """Request model for cultural context generation"""
    dish_name: str
    place_name: str
    cuisine_type: Optional[str] = None


class ContextResponse(BaseModel):
    """Response model for cultural context"""
    dish_name: str
    place_name: str
    context: str
    tips: list[str]


# System prompt for Claude
CONTEXT_SYSTEM_PROMPT = """You are a friendly Singaporean food expert helping tourists understand local cuisine.

Your role is to explain dishes in a way that:
1. Is accessible to someone who has never tried the dish
2. Highlights what makes it special and unique to Singapore
3. Provides practical tips for ordering and eating
4. Keeps explanations concise (2-3 sentences max for the main context)

Be enthusiastic but not over-the-top. Sound like a knowledgeable local friend, not a guidebook."""


@router.post("/generate", response_model=ContextResponse)
async def generate_cultural_context(request: ContextRequest):
    """
    Generate a tourist-friendly explanation of a local dish.
    
    Uses Claude to create cultural context that helps visitors
    understand and appreciate Singapore's food culture.
    """
    
    # TODO: Implement with Anthropic Claude API
    # from anthropic import Anthropic
    # client = Anthropic()
    # 
    # message = client.messages.create(
    #     model="claude-sonnet-4-20250514",
    #     max_tokens=300,
    #     system=CONTEXT_SYSTEM_PROMPT,
    #     messages=[{
    #         "role": "user",
    #         "content": f"""Write a brief explanation of "{request.dish_name}" 
    #         served at {request.place_name} for a tourist.
    #         
    #         Include:
    #         1. What it is (2-3 sentences)
    #         2. 2-3 practical tips for ordering/eating
    #         
    #         Keep it conversational and friendly."""
    #     }]
    # )
    
    # Mock response for now
    mock_contexts = {
        "chicken rice": ContextResponse(
            dish_name=request.dish_name,
            place_name=request.place_name,
            context="Hainanese Chicken Rice is Singapore's national dish - tender poached chicken served over fragrant rice cooked in chicken fat and pandan leaves. The simplicity is deceptive; the magic is in the perfectly cooked chicken and the trio of sauces that accompany it.",
            tips=[
                "Ask for 'white' (steamed) or 'roasted' chicken - try both if you can!",
                "Don't skip the dark soy sauce, chili sauce, and ginger paste",
                "The chicken should be silky with a slight jelly-like layer under the skin - that's the sign of proper cooking"
            ]
        ),
        "laksa": ContextResponse(
            dish_name=request.dish_name,
            place_name=request.place_name,
            context="Laksa is a spicy coconut curry noodle soup that's a beautiful blend of Chinese and Malay cuisines. The rich, creamy broth is flavored with a complex spice paste called rempah, and topped with prawns, cockles, and fish cake.",
            tips=[
                "The noodles are often cut short so you can eat with just a spoon",
                "Add the sambal (chili paste) gradually - it's potent!",
                "Squeeze the lime over the top for the authentic experience"
            ]
        ),
    }
    
    # Try to match the dish name
    dish_lower = request.dish_name.lower()
    for key, response in mock_contexts.items():
        if key in dish_lower:
            return response
    
    # Default response
    return ContextResponse(
        dish_name=request.dish_name,
        place_name=request.place_name,
        context=f"{request.dish_name} is a beloved local dish. Ask the staff for their recommendations on how to enjoy it best!",
        tips=[
            "Don't be shy to ask the hawker for recommendations",
            "Watch what the locals are ordering",
            "Try it without modifications first to taste the authentic version"
        ]
    )


@router.get("/dishes")
async def list_common_dishes():
    """
    List common Singaporean dishes with brief descriptions.
    Useful for building a cultural context database.
    """
    
    dishes = [
        {
            "name": "Hainanese Chicken Rice",
            "category": "Rice",
            "description": "Poached chicken with fragrant rice",
        },
        {
            "name": "Laksa",
            "category": "Noodles",
            "description": "Spicy coconut curry noodle soup",
        },
        {
            "name": "Char Kway Teow",
            "category": "Noodles",
            "description": "Stir-fried flat rice noodles with egg and cockles",
        },
        {
            "name": "Bak Kut Teh",
            "category": "Soup",
            "description": "Pork rib soup with herbs and spices",
        },
        {
            "name": "Hokkien Mee",
            "category": "Noodles",
            "description": "Stir-fried prawn noodles in rich stock",
        },
        {
            "name": "Satay",
            "category": "Grilled",
            "description": "Grilled meat skewers with peanut sauce",
        },
        {
            "name": "Roti Prata",
            "category": "Bread",
            "description": "Flaky Indian-influenced flatbread",
        },
        {
            "name": "Nasi Lemak",
            "category": "Rice",
            "description": "Coconut rice with sambal and accompaniments",
        },
    ]
    
    return {"dishes": dishes, "total": len(dishes)}
