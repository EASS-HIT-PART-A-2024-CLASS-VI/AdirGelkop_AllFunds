# All API endpoints in one file
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict
import requests
from bs4 import BeautifulSoup
import datetime

router = APIRouter()

# Data model for fund details
class Fund(BaseModel):
    id: int
    name: str
    month_performance: str
    last_year: str
    last_3_years: str
    last_5_years: str

# Helper function to get the month name two months ago
def get_month_name_two_months_ago():
    today = datetime.date.today()
    two_months_ago = today - datetime.timedelta(days=60)
    return two_months_ago.strftime("%B")

# Scraping function: fetches and parses fund data
def scrape_funds():
    url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Get the month name dynamically
    month_name = get_month_name_two_months_ago()

    # Replace with actual table structure parsing logic
    funds = []
    rows = soup.find_all("tr")  # Adjust this selector for the table structure
    for i, row in enumerate(rows[1:], start=1):  # Skip the table header
        cols = row.find_all("td")
        if len(cols) >= 5:
            funds.append({
                "id": i,
                "name": cols[0].text.strip(),
                "month_performance": f"{month_name}: {cols[1].text.strip()}",
                "last_year": cols[2].text.strip(),
                "last_3_years": cols[3].text.strip(),
                "last_5_years": cols[4].text.strip()
            })
    return funds

# Load scraped data into memory
funds_db = scrape_funds()

# API Endpoints
@router.get("/funds/", response_model=List[Fund])
def get_funds():
    """
    Fetch and return all available funds.
    """
    return funds_db

@router.get("/funds/{index}", response_model=Fund)
def get_fund_by_index(index: int):
    """
    Fetch a single fund by its index.
    """
    if 0 <= index < len(funds_db):
        return funds_db[index]
    return {"error": "Fund not found"}

@router.get("/funds/plan/{plan_name}", response_model=List[Fund])
def get_funds_by_plan(plan_name: str):
    """
    Fetch funds that match the given investment plan name.
    """
    filtered_funds = [
        fund for fund in funds_db
        if plan_name.lower() in fund['name'].lower()
    ]
    return filtered_funds
