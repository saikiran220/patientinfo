# 🏥 Patient Data Collection App

Full-stack patient intake form — React (Vite) + FastAPI + Supabase.

---

## 📁 Project Structure

```
patient-app/
├── frontend/
│   ├── src/
│   │   ├── api/client.js
│   │   ├── components/PatientForm.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── backend/
    ├── app.py
    ├── .env
    └── requirements.txt
```

---

## 🗄️ Supabase — Database Setup

Run this SQL in your Supabase project → **SQL Editor**:

```sql
-- 1. Enable pgcrypto (needed for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT        NOT NULL,
  age          INTEGER     NOT NULL CHECK (age >= 0 AND age <= 150),
  disease      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Disable Row Level Security (dev convenience)
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
```

---

## ⚙️ Backend Setup

### 1. Configure environment variables

Edit `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-or-service-role-key-here
```

Find these in Supabase → **Project Settings → API**.

### 2. Install dependencies & run

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install packages
pip install -r requirements.txt

# Start server
uvicorn app:app --reload --port 8000
```

Server runs at → **http://localhost:8000**

---

## 🖥️ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App runs at → **http://localhost:5173**

---

## 🔌 API Reference

### GET /health
Returns server status.

```json
{ "status": "ok" }
```

### POST /patient
Save a new patient record.

**Request body:**
```json
{
  "patientName": "Jane Smith",
  "age": 35,
  "disease": "Hypertension"
}
```

**Success response (201):**
```json
{
  "message": "Patient saved successfully",
  "data": {
    "id": "uuid-here",
    "patient_name": "Jane Smith",
    "age": 35,
    "disease": "Hypertension",
    "created_at": "2025-01-01T10:00:00+00:00"
  }
}
```

**Validation error (422):**
```json
{
  "detail": [{ "msg": "...", "loc": [...] }]
}
```

---

## 📬 Postman Test

| Field  | Value                             |
|--------|-----------------------------------|
| Method | `POST`                            |
| URL    | `http://localhost:8000/patient`   |
| Header | `Content-Type: application/json`  |
| Body   | raw → JSON                        |

**Body:**
```json
{
  "patientName": "John Doe",
  "age": 42,
  "disease": "Type 2 Diabetes"
}
```

**Health check:**
```
GET http://localhost:8000/health
```

---

## 🔑 Key Files Explained

| File | Purpose |
|------|---------|
| `backend/app.py` | FastAPI app — routes, Pydantic model, Supabase insert |
| `backend/schema.sql` | SQL to create the `patients` table in Supabase |
| `backend/.env` | Secrets (never commit this!) |
| `frontend/src/api/client.js` | Axios instance pointing to backend |
| `frontend/src/components/PatientForm.jsx` | Form with validation, API call, messages |
| `frontend/src/index.css` | All styling |

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| patientName | Required, non-empty string |
| age | Required integer, 0–150 |
| disease | Required, non-empty string |

- Frontend shows **blue** error messages on invalid input
- Backend double-validates via Pydantic
