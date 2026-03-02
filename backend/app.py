from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

# ── Supabase client ──────────────────────────────────────────────────────────
SUPABASE_URL: str = os.environ["SUPABASE_URL"]
SUPABASE_KEY: str = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── FastAPI app ──────────────────────────────────────────────────────────────
app = FastAPI(title="Patient API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Pydantic model ───────────────────────────────────────────────────────────
class PatientIn(BaseModel):
    patientName: str = Field(..., min_length=1, max_length=200)
    age: int = Field(..., ge=0, le=150)
    disease: str = Field(..., min_length=1, max_length=300)

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Patient API",
        "docs": "/docs",
        "health": "/health",
        "create_patient": "POST /patient",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/patient", status_code=201)
def create_patient(patient: PatientIn):
    try:
        data = {
            "patient_name": patient.patientName,
            "age": patient.age,
            "disease": patient.disease,
        }
        response = supabase.table("patients").insert(data).execute()
        return {"message": "Patient saved successfully", "data": response.data[0]}
    except Exception as e:
        err_msg = str(e)
        print(f"[ERROR] Failed to insert patient: {err_msg}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save patient: {err_msg}. Ensure the patients table exists (run backend/schema.sql in Supabase SQL Editor).",
        )
