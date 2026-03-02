import { useState } from "react";
import client from "../api/client";

const INITIAL = { patientName: "", age: "", disease: "" };

export default function PatientForm() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required.";
    if (!form.age || isNaN(form.age) || form.age < 0 || form.age > 150)
      e.age = "Enter a valid age (0–150).";
    if (!form.disease.trim()) e.disease = "Disease field is required.";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await client.post("/patient", {
        patientName: form.patientName.trim(),
        age: parseInt(form.age, 10),
        disease: form.disease.trim(),
      });
      setSuccess("Patient record saved successfully!");
      setForm(INITIAL);
    } catch (err) {
      setErrors({ api: err.response?.data?.detail || "Server error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="icon">🏥</div>
        <h1>Patient Intake</h1>
        <p>Fill in the details below to register a new patient.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="patientName">Patient Name</label>
          <input
            id="patientName"
            name="patientName"
            type="text"
            placeholder="e.g. Jane Smith"
            value={form.patientName}
            onChange={handleChange}
            className={errors.patientName ? "input-error" : ""}
          />
          {errors.patientName && <span className="error">{errors.patientName}</span>}
        </div>

        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            placeholder="e.g. 35"
            value={form.age}
            onChange={handleChange}
            min={0}
            max={150}
            className={errors.age ? "input-error" : ""}
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        <div className="field">
          <label htmlFor="disease">Disease / Condition</label>
          <input
            id="disease"
            name="disease"
            type="text"
            placeholder="e.g. Hypertension"
            value={form.disease}
            onChange={handleChange}
            className={errors.disease ? "input-error" : ""}
          />
          {errors.disease && <span className="error">{errors.disease}</span>}
        </div>

        {errors.api && <div className="error api-error">{errors.api}</div>}
        {success && <div className="success">{success}</div>}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? "Saving…" : "Save Patient"}
        </button>
      </form>
    </div>
  );
}
