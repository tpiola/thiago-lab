-- Create the leads table for storing form submissions
CREATE TABLE IF NOT EXISTS leads (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email     TEXT NOT NULL,
  name      TEXT NOT NULL,
  source    TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);

-- Index for sorting/querying by creation date
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

-- Enable Row Level Security (recommended for Supabase)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (needed for public lead capture forms)
CREATE POLICY "Allow anonymous inserts"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view leads
CREATE POLICY "Allow authenticated select"
  ON leads
  FOR SELECT
  TO authenticated
  USING (true);
