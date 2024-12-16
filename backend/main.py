from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

# Data models
class Fund(BaseModel):
    name: str
    type: str
    returns: str
    management_fee: str

# In-memory "database"
funds = [
    {"id": 1, "name": "Fund A", "type": "Equity", "returns": "15%", "management_fee": "0.5%"},
    {"id": 2, "name": "Fund B", "type": "Debt", "returns": "10%", "management_fee": "0.3%"},
]
current_id = 3

# 1. Get all funds
@app.get("/funds/")
def get_funds():
    return funds

# 2. Get a fund by ID
@app.get("/funds/{fund_id}")
def get_fund(fund_id: int):
    for fund in funds:
        if fund["id"] == fund_id:
            return fund
    raise HTTPException(status_code=404, detail="Fund not found")

# 3. Add a new fund
@app.post("/funds/")
def add_fund(new_fund: Fund):
    global current_id
    fund = new_fund.dict()
    fund["id"] = current_id
    current_id += 1
    funds.append(fund)
    return fund

# 4. Update a fund by ID
@app.put("/funds/{fund_id}")
def update_fund(fund_id: int, updated_fund: Fund):
    for fund in funds:
        if fund["id"] == fund_id:
            fund.update(updated_fund.dict())
            return fund
    raise HTTPException(status_code=404, detail="Fund not found")

# 5. Delete a fund by ID
@app.delete("/funds/{fund_id}")
def delete_fund(fund_id: int):
    global funds
    funds = [fund for fund in funds if fund["id"] != fund_id]
    return {"message": "Fund deleted successfully"}

# 6. Search funds by name
@app.get("/funds/search/")
def search_funds(name: str = Query(...)):
    return [fund for fund in funds if name.lower() in fund["name"].lower()]

# 7. Get top 5 funds by returns
@app.get("/funds/top-returns/")
def get_top_funds():
    return sorted(funds, key=lambda x: float(x["returns"].replace("%", "")), reverse=True)[:5]

# 8. Get statistics about returns
@app.get("/funds/stats/")
def get_stats():
    returns = [float(f["returns"].replace("%", "")) for f in funds]
    avg_return = sum(returns) / len(returns) if returns else 0
    return {"average_return": f"{avg_return:.2f}%"}

# 9. Add multiple funds (batch)
@app.post("/funds/batch/")
def add_funds_batch(new_funds: List[Fund]):
    global current_id
    for f in new_funds:
        fund = f.dict()
        fund["id"] = current_id
        current_id += 1
        funds.append(fund)
    return {"message": f"{len(new_funds)} funds added successfully"}

# 10. Clear all manually added funds
@app.delete("/funds/clear/")
def clear_funds():
    global funds
    funds = [fund for fund in funds if fund["id"] <= 2]  # Keep initial data
    return {"message": "Manually added funds cleared"}
