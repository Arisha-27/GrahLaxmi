from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from model.recommender import recommend_schemes

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/predict")
async def predict(request: Request):
    data = await request.json()
    try:
        schemes = recommend_schemes(data, top_n=1)
        return {"predicted_scheme": schemes[0] if schemes else "No match found"}
    except Exception as e:
        return {"error": str(e)}
