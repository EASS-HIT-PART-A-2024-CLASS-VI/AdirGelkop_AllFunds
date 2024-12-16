import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data model
class Fund(BaseModel):
    id: int
    name: str
    type: str
    returns: str
    management_fee: str

# Function to scrape data
def scrape_funds():
    url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Mock scraping logic: Replace with the correct HTML structure
    funds = []
    rows = soup.find_all("tr")  # Adjust this selector based on the table structure
    for i, row in enumerate(rows[1:], start=1):  # Skip the table header
        cols = row.find_all("td")
        if len(cols) >= 4:
            funds.append({
                "id": i,
                "name": cols[0].text.strip(),
                "type": cols[1].text.strip(),
                "returns": cols[2].text.strip(),
                "management_fee": cols[3].text.strip()
            })
    return funds

# Load scraped data
funds_db = scrape_funds()

@app.get("/funds/", response_model=List[Fund])
def get_funds():
    return funds_db
