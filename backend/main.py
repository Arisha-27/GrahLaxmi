from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Extra
from typing import Optional

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to ["http://localhost:3000"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define your InputData with known fields and allow extra keys
class InputData(BaseModel, extra=Extra.allow):
    DBT: str
    Economic_Distress: str
    min_age: int
    max_age: int
    age_group: str
    income_upper_limit: int
    caste: str
    status: str
    income_category: str
    sub_categories: str
    primary_category: str
    Residence_Cleaned: str
    Minority_Cleaned: str
    Disability_Cleaned: str
    Benefit_Category: str
    Marital_Status_Clean: str
    BPL_Clean: str
    Employment_Status_Clean: str
    Application_Mode_Clean: str
    Scheme_Type_Clean: str
    Location_Clean: str

# ✅ Recommendation logic defined before usage
def recommend_schemes(input_data: dict) -> str:
    if input_data.get("caste_sc") == 1 and input_data.get("DBT") == "Yes":
        return "SC DBT Benefit Scheme"
    if input_data.get("is_student") == 1 and input_data.get("income_upper_limit", 0) < 200000:
        return "Student Financial Assistance Scheme"
    return "No matching scheme found"

@app.post("/api/predict")
async def predict(request: Request):
    data = await request.json()
    predicted_scheme = recommend_schemes(data)
    return {"predicted_scheme": predicted_scheme}
