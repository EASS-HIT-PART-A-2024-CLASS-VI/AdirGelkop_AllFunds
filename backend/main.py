import requests
import datetime
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS allows the frontend (on localhost:3000) 
# to make requests to the backend (on localhost:8000) 
# without being blocked by browser security policies
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #Allows requests from any origin (useful during development)
    allow_credentials=True,
    allow_methods=["*"], #Supports all HTTP methods
    allow_headers=["*"], #Allows all request headers
)

# Function to get the month name two months ago
def get_month_name_two_months_ago():
    today = datetime.date.today()
    two_months_ago = today - datetime.timedelta(days=60)
    return two_months_ago.strftime("%B")  # Returns the full month name, e.g., "October"

# Data model
# Defines the structure of the data returned by the API
class Fund(BaseModel):
    id: int
    name: str
    month_performance: str
    last_year: str
    last_3_years: str
    last_5_years: str

# Scraping Function
def scrape_funds():
    url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    response = requests.get(url) # Sends an HTTP request to the website
    soup = BeautifulSoup(response.content, "html.parser") # Parses the returned HTML

    # Get the month name dynamically
    month_name = get_month_name_two_months_ago()    

    # Mock scraping logic: Replace with the correct HTML structure
    funds = []
    rows = soup.find_all("tr")  # Adjust this selector based on the table structure
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

# Load scraped data
funds_db = scrape_funds()

# Defines a GET endpoint (/funds/) to serve the scraped data
@app.get("/funds/", response_model=List[Fund])
def get_funds():
    return funds_db

# SUMMARY
# Scrapes real-time data from a website.
# Exposes a clean and structured API (/funds/) to serve this data.
# Enables CORS so the frontend can access the backend.
# Returns the scraped data in JSON format to the React frontend.