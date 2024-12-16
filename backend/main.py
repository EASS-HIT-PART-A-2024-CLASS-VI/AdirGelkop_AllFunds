from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Data model
class Fund(BaseModel):
    id: int
    name: str
    type: str
    returns: float
    management_fee: float

# Mock database
funds_db = [
    {"id": 1, "name": "Fund A", "type": "Equity", "returns": 15.2, "management_fee": 0.5},
    {"id": 2, "name": "Fund B", "type": "Debt", "returns": 8.5, "management_fee": 0.3},
]

@app.get("/funds/", response_model=List[Fund])
def get_funds():
    return funds_db
