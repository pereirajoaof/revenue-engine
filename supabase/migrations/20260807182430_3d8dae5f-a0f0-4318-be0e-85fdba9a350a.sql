CREATE TABLE public.calculator_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  job_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  recommended_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.calculator_leads TO anon, authenticated;
GRANT ALL ON public.calculator_leads TO service_role;

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a calculator lead"
  ON public.calculator_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255);