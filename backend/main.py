from fastapi import FastAPI, HTTPException
from bs4 import BeautifulSoup
import requests

app = FastAPI()

BASE_URL = "https://www.mygemel.net/%D7%A7%D7%A8%D7%A0%D7%95%D7%AA-%D7%94%D7%A9%D7%AA%D7%9C%D7%9E%D7%95%D7%AA"

# Scraping function
def scrape_funds():
    try:
        response = requests.get(BASE_URL)
        if response.status_code != 200:
            raise Exception("Failed to fetch data")

        soup = BeautifulSoup(response.content, "html.parser")
        funds = []

        for row in soup.select("table tr"):
            cols = row.find_all("td")
            if len(cols) >= 4:  # Skip incomplete rows
                funds.append({
                    "name": cols[0].text.strip(),
                    "type": cols[1].text.strip(),
                    "returns": cols[2].text.strip(),
                    "management_fee": cols[3].text.strip(),
                })

        return funds
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/funds/")
def get_funds():
    return {"funds": scrape_funds()}
