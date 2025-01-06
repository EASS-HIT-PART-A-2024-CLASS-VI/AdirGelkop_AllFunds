# All API endpoints in one file
from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
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
    """
    Returns the Hebrew name of the month two months ago.
    """
    hebrew_months = {
        "January": "ינואר",
        "February": "פברואר",
        "March": "מרץ",
        "April": "אפריל",
        "May": "מאי",
        "June": "יוני",
        "July": "יולי",
        "August": "אוגוסט",
        "September": "ספטמבר",
        "October": "אוקטובר",
        "November": "נובמבר",
        "December": "דצמבר"
    }
    today = datetime.date.today()
    two_months_ago = today - datetime.timedelta(days=60)
    month_name = two_months_ago.strftime("%B")
    return hebrew_months.get(month_name, month_name)

# Scraping function: fetches and parses fund data
def scrape_funds(url: str):
    """
    Scrapes the investment funds data from the website based on the provided URL.
    Returns:
        A list of dictionaries containing fund details.
    """
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data from {url}: {response.status_code}")

    soup = BeautifulSoup(response.content, "html.parser")
    month_name = get_month_name_two_months_ago()

    # Extract funds data from the table
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

# API Endpoints
@router.get("/funds/", response_model=List[Fund])
def get_funds():
    """
    Fetch and return all available funds (default: קרנות השתלמות).
    """
    default_url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    return scrape_funds(default_url)

@router.get("/funds/product", response_model=List[Fund])
def get_funds_by_product(url: str = Query(...)):
    """
    Fetch funds dynamically based on the provided product URL.
    :param url: The URL of the financial product (e.g., קרנות השתלמות, קופות גמל, etc.).
    :return: A list of funds.
    """
    return scrape_funds(url)

@router.get("/funds/{index}", response_model=Fund)
def get_fund_by_index(index: int):
    """
    Fetch a single fund by its index.
    """
    default_url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    funds = scrape_funds(default_url)
    if 0 <= index < len(funds):
        return funds[index]
    return {"error": "Fund not found"}

@router.get("/funds/filter/")
def filter_funds(company: str = None, product_type: str = None):
    """
    Filter the list of funds by company name or product type.
    :param company: The name of the company (e.g., "הפניקס").
    :param product_type: The type of financial product (e.g., "קרן השתלמות").
    :return: A filtered list of funds.
    """
    default_url = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"
    funds = scrape_funds(default_url)
    if company:
        funds = [fund for fund in funds if company in fund['name']]
    if product_type:
        funds = [fund for fund in funds if product_type in fund['name']]
    return funds
