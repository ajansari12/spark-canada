-- Create grants table for Canadian business funding opportunities
CREATE TABLE public.grants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  province TEXT, -- NULL means federal/national
  industries TEXT[] DEFAULT '{}',
  funding_min INTEGER,
  funding_max INTEGER,
  eligibility TEXT,
  deadline DATE,
  url TEXT NOT NULL,
  grant_type TEXT NOT NULL DEFAULT 'grant', -- grant, loan, tax_credit
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.grants ENABLE ROW LEVEL SECURITY;

-- Grants are publicly readable (no auth required to browse)
CREATE POLICY "Grants are publicly readable"
ON public.grants
FOR SELECT
USING (true);

-- Only admins can modify grants
CREATE POLICY "Admins can manage grants"
ON public.grants
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Add updated_at trigger
CREATE TRIGGER update_grants_updated_at
BEFORE UPDATE ON public.grants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with real Canadian grant data
INSERT INTO public.grants (name, description, province, industries, funding_min, funding_max, eligibility, deadline, url, grant_type) VALUES
-- Federal Programs
('Canada Small Business Financing Program', 'Government-backed loans to help small businesses access financing for equipment, leasehold improvements, and real property.', NULL, ARRAY['all'], 0, 1000000, 'Canadian businesses with gross annual revenues of $10 million or less', NULL, 'https://ised-isde.canada.ca/site/canada-small-business-financing-program/en', 'loan'),
('SR&ED Tax Incentive Program', 'Tax credits for businesses conducting scientific research and experimental development in Canada.', NULL, ARRAY['technology', 'manufacturing', 'life_sciences'], 0, NULL, 'Canadian-controlled private corporations conducting R&D', NULL, 'https://www.canada.ca/en/revenue-agency/services/scientific-research-experimental-development-tax-incentive-program.html', 'tax_credit'),
('Canada Digital Adoption Program', 'Grants to help small businesses adopt digital technologies and e-commerce solutions.', NULL, ARRAY['retail', 'services', 'all'], 2400, 15000, 'Canadian-owned SMEs with 1-499 employees', NULL, 'https://ised-isde.canada.ca/site/canada-digital-adoption-program/en', 'grant'),
('Futurpreneur Canada', 'Financing and mentoring for young entrepreneurs aged 18-39 starting a business.', NULL, ARRAY['all'], 0, 60000, 'Canadian residents aged 18-39 with a viable business idea', NULL, 'https://www.futurpreneur.ca/', 'loan'),
('Industrial Research Assistance Program (IRAP)', 'Funding and advisory services for technology-driven SMEs.', NULL, ARRAY['technology', 'manufacturing'], 0, 500000, 'Canadian SMEs with innovative technology projects', NULL, 'https://nrc.canada.ca/en/support-technology-innovation', 'grant'),

-- Ontario
('Ontario Small Business Support Grant', 'Support for small businesses affected by public health measures.', 'ON', ARRAY['retail', 'food_beverage', 'services'], 10000, 20000, 'Ontario small businesses with 2+ employees', NULL, 'https://www.ontario.ca/page/businesses-get-help-covid-19-costs', 'grant'),
('Ontario Interactive Digital Media Tax Credit', 'Tax credit for interactive digital media products developed in Ontario.', 'ON', ARRAY['technology', 'gaming', 'media'], 0, NULL, 'Corporations developing interactive digital media in Ontario', NULL, 'https://www.ontario.ca/page/ontario-interactive-digital-media-tax-credit', 'tax_credit'),

-- British Columbia
('BC Small Business Venture Capital Tax Credit', 'Tax credits for investors in eligible small businesses in BC.', 'BC', ARRAY['technology', 'manufacturing', 'clean_tech'], 0, 120000, 'BC-based small businesses raising equity capital', NULL, 'https://www2.gov.bc.ca/gov/content/taxes/income-taxes/corporate/credits/venture-capital', 'tax_credit'),
('Innovate BC Programs', 'Various programs supporting technology companies and startups in BC.', 'BC', ARRAY['technology', 'clean_tech'], 0, 300000, 'BC-based technology companies', NULL, 'https://innovatebc.ca/', 'grant'),

-- Alberta
('Alberta Innovates Programs', 'Funding for technology and innovation projects in Alberta.', 'AB', ARRAY['technology', 'energy', 'agriculture', 'life_sciences'], 0, 500000, 'Alberta-based companies with innovative projects', NULL, 'https://albertainnovates.ca/', 'grant'),
('Digital Economy Program', 'Support for Alberta businesses adopting digital technologies.', 'AB', ARRAY['all'], 0, 25000, 'Alberta SMEs seeking digital transformation', NULL, 'https://www.alberta.ca/digital-economy-program.aspx', 'grant'),

-- Quebec
('PME MTL', 'Loans and grants for Montreal-area businesses.', 'QC', ARRAY['all'], 5000, 50000, 'Montreal-based SMEs', NULL, 'https://pmemtl.com/en', 'loan'),
('Investissement Québec', 'Financing solutions for Quebec businesses at all stages.', 'QC', ARRAY['manufacturing', 'technology', 'tourism'], 0, 5000000, 'Quebec-based businesses', NULL, 'https://www.investquebec.com/quebec/en/', 'loan'),

-- Saskatchewan
('Saskatchewan Technology Startup Incentive', 'Tax credits for investors in Saskatchewan tech startups.', 'SK', ARRAY['technology'], 0, NULL, 'Saskatchewan-based technology startups', NULL, 'https://www.saskatchewan.ca/business/investment-and-economic-development/business-incentives-and-tax-credits', 'tax_credit'),

-- Manitoba
('Manitoba Industrial Opportunities Program', 'Loans for major capital projects in Manitoba.', 'MB', ARRAY['manufacturing', 'food_beverage'], 0, 5000000, 'Manitoba businesses with major capital projects', NULL, 'https://www.gov.mb.ca/jec/busdev/financial/miop.html', 'loan'),

-- Atlantic Canada
('Atlantic Canada Opportunities Agency (ACOA)', 'Funding for businesses in Atlantic Canada to grow and innovate.', NULL, ARRAY['all'], 0, 500000, 'Businesses in NB, NS, PE, NL', NULL, 'https://www.canada.ca/en/atlantic-canada-opportunities.html', 'grant'),
('Nova Scotia Business Inc.', 'Support for Nova Scotia businesses including payroll rebates.', 'NS', ARRAY['technology', 'manufacturing', 'services'], 0, NULL, 'Nova Scotia-based businesses creating jobs', NULL, 'https://www.novascotiabusiness.com/', 'grant');
