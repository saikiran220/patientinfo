-- Patient table schema for Supabase/PostgreSQL
-- Run this in the Supabase SQL Editor or any PostgreSQL client

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS patients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT        NOT NULL,
  age          INTEGER     NOT NULL CHECK (age >= 0 AND age <= 150),
  disease      TEXT        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
