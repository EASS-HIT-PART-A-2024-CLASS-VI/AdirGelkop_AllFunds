from fastapi import APIRouter, Query, HTTPException, Request
from pydantic import BaseModel
from typing import List
import requests
from bs4 import BeautifulSoup
import datetime
import os
import openai
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch

router = APIRouter()

# Initialize the transformer pipeline with a Hebrew GPT-2 model ("taich/gpt2-hebrew")
try:
    model = AutoModelForCausalLM.from_pretrained("taich/gpt2-hebrew")
    tokenizer = AutoTokenizer.from_pretrained("taich/gpt2-hebrew")
    chatbot = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        device=0 if torch.cuda.is_available() else -1  # Use GPU if available
    )
except Exception as init_error:
    print("Error initializing chatbot:", init_error)
    chatbot = None

# Data model for fund details
class Fund(BaseModel):
    id: int
    name: str
    month_performance: str
    last_year: str
    last_3_years: str
    last_5_years: str

# Helper function to get the Hebrew name of the month two months ago
def get_month_name_two_months_ago():
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

# Scraping function: fetches and parses fund data from the given URL
def scrape_funds(url: str):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data from {url}: {response.status_code}")
    soup = BeautifulSoup(response.content, "html.parser")
    month_name = get_month_name_two_months_ago()
    funds = []
    rows = soup.find_all("tr")  # Adjust selector as needed
    for i, row in enumerate(rows[1:], start=1):  # Skip table header
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

# Endpoint to fetch funds based on product_type parameter
@router.get("/funds/", response_model=List[Fund])
def get_funds(product_type: str = Query("קרנות השתלמות")):
    PRODUCT_URLS = {
        "קרנות השתלמות": "https://www.mygemel.net/קרנות-השתלמות",
        "קופות גמל": "https://www.mygemel.net/קופות-גמל",
        "קופות גמל להשקעה": "https://www.mygemel.net/קופת-גמל-להשקעה",
        "פוליסות חיסכון": "https://www.mygemel.net/פוליסות-חיסכון",
        "קרנות פנסיה": "https://www.mygemel.net/פנסיה"
    }
    url = PRODUCT_URLS.get(product_type, PRODUCT_URLS["קרנות השתלמות"])
    return scrape_funds(url)

@router.get("/funds/product", response_model=List[Fund])
def get_funds_by_product(url: str = Query(...)):
    return scrape_funds(url)

@router.get("/funds/{index}", response_model=Fund)
def get_fund_by_index(index: int):
    default_url = "https://www.mygemel.net/קרנות-השתלמות"
    funds = scrape_funds(default_url)
    if 0 <= index < len(funds):
        return funds[index]
    return {"error": "Fund not found"}

@router.get("/funds/filter/")
def filter_funds(company: str = None, product_type: str = None):
    default_url = "https://www.mygemel.net/קרנות-השתלמות"
    funds = scrape_funds(default_url)
    if company:
        funds = [fund for fund in funds if company in fund['name']]
    if product_type:
        funds = [fund for fund in funds if product_type in fund['name']]
    return funds

# New /chat endpoint for the RAG Agent (Economic Advisor) using the free transformer model
@router.post("/chat")
async def chat_endpoint(request: Request):
    data = await request.json()
    user_message = data.get("message", "")
    if not user_message:
        raise HTTPException(status_code=400, detail="No message provided")
    
    # Prepare prompt for economic advice in Hebrew
    prompt = (
        "אתה יועץ כלכלי מומחה בתחום פתרונות קרנות. "
        "ענה בצורה מקצועית ומפורטת על השאלה הבאה בעברית, והכלל בסיום דיסקליימר שהמידע הוא לצורך מידע בלבד ואינו מהווה המלצה פיננסית:\n\n"
        f"משתמש: {user_message}\n"
        "יועץ:"
    )
    
    if not chatbot:
        return {"response": "מצטער, לא ניתן לגשת ליועץ הכלכלי כעת. אנא נסה מאוחר יותר."}
    
    try:
        response = chatbot(prompt, max_length=150, do_sample=True, temperature=0.7)
        generated_text = response[0]["generated_text"]
        # Remove the prompt from the generated text if present
        answer = generated_text.replace(prompt, "").strip()
        if not answer:
            answer = "סליחה, לא הצלחתי לקבל תשובה מהמערכת. אנא נסה שוב."
        return {"response": answer}
    except Exception as e:
        return {"response": f"מצטער, אירעה שגיאה: {str(e)}. (זוהי תשובה דמה)"}
