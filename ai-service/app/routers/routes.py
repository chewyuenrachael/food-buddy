"""
Route Optimization Router
Optimizes walking routes through multiple food stops using OR-Tools
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import math

router = APIRouter()


class Coordinates(BaseModel):
    """Geographic coordinates"""
    lat: float
    lng: float


class Place(BaseModel):
    """Place with coordinates"""
    id: str
    name: str
    lat: float
    lng: float


class OptimizeRequest(BaseModel):
    """Route optimization request"""
    places: list[Place]
    start_location: Optional[Coordinates] = None
    return_to_start: bool = False


class RouteStep(BaseModel):
    """Single step in the route"""
    place_id: str
    place_name: str
    distance_from_previous: int  # meters
    walking_time: int  # minutes


class OptimizeResponse(BaseModel):
    """Route optimization response"""
    optimized_order: list[str]
    steps: list[RouteStep]
    total_distance: int  # meters
    total_walking_time: int  # minutes


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points in meters using Haversine formula."""
    R = 6371e3  # Earth's radius in meters
    
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    
    a = (math.sin(delta_phi / 2) ** 2 + 
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c


def estimate_walking_time(distance_meters: float) -> int:
    """Estimate walking time in minutes (assuming 5 km/h average speed)."""
    WALKING_SPEED_KMH = 5
    hours = (distance_meters / 1000) / WALKING_SPEED_KMH
    return int(hours * 60)


def nearest_neighbor_route(places: list[Place], start: Coordinates) -> list[Place]:
    """
    Simple nearest neighbor algorithm for route optimization.
    
    For production, use Google OR-Tools for better results:
    
    from ortools.constraint_solver import routing_enums_pb2
    from ortools.constraint_solver import pywrapcp
    """
    if len(places) <= 1:
        return places
    
    remaining = list(places)
    route = []
    current = start
    
    while remaining:
        # Find nearest unvisited place
        nearest_idx = 0
        nearest_dist = float('inf')
        
        for i, place in enumerate(remaining):
            dist = haversine_distance(current.lat, current.lng, place.lat, place.lng)
            if dist < nearest_dist:
                nearest_dist = dist
                nearest_idx = i
        
        # Add to route and update current position
        next_place = remaining.pop(nearest_idx)
        route.append(next_place)
        current = Coordinates(lat=next_place.lat, lng=next_place.lng)
    
    return route


@router.post("/optimize", response_model=OptimizeResponse)
async def optimize_route(request: OptimizeRequest):
    """
    Optimize the walking route through multiple food stops.
    
    Uses a nearest-neighbor algorithm for quick results.
    For better optimization, the service can be extended to use
    Google OR-Tools' constraint solver.
    
    Returns the optimized order of places and step-by-step
    walking times and distances.
    """
    
    if len(request.places) == 0:
        raise HTTPException(status_code=400, detail="No places provided")
    
    if len(request.places) == 1:
        place = request.places[0]
        return OptimizeResponse(
            optimized_order=[place.id],
            steps=[RouteStep(
                place_id=place.id,
                place_name=place.name,
                distance_from_previous=0,
                walking_time=0,
            )],
            total_distance=0,
            total_walking_time=0,
        )
    
    # Default start location to Singapore center
    start = request.start_location or Coordinates(lat=1.3521, lng=103.8198)
    
    # Optimize route
    optimized = nearest_neighbor_route(request.places, start)
    
    # Calculate distances and times
    steps = []
    total_distance = 0
    total_walking_time = 0
    current = start
    
    for place in optimized:
        distance = haversine_distance(
            current.lat, current.lng,
            place.lat, place.lng
        )
        walking_time = estimate_walking_time(distance)
        
        steps.append(RouteStep(
            place_id=place.id,
            place_name=place.name,
            distance_from_previous=int(distance),
            walking_time=walking_time,
        ))
        
        total_distance += distance
        total_walking_time += walking_time
        current = Coordinates(lat=place.lat, lng=place.lng)
    
    return OptimizeResponse(
        optimized_order=[p.id for p in optimized],
        steps=steps,
        total_distance=int(total_distance),
        total_walking_time=total_walking_time,
    )


@router.get("/matrix")
async def get_distance_matrix(place_ids: str):
    """
    Get a distance matrix for a set of places.
    Useful for visualization and manual route planning.
    """
    # TODO: Implement distance matrix calculation
    return {"message": "Distance matrix endpoint - implement for advanced routing"}
