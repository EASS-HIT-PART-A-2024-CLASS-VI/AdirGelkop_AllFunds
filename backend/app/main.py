from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI()

# Add CORS middleware for frontend-backend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin (useful during development)
    allow_credentials=True,
    allow_methods=["*"],  # Supports all HTTP methods
    allow_headers=["*"],  # Allows all request headers
)

# Include routes from the routes.py file
app.include_router(router)

@app.get("/")
def read_root():
    """
    Root endpoint to verify the server is running.
    """
    return {"message": "Welcome to the FastAPI backend!"}
