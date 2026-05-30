-- Seed data for OgunStartups
-- Run after applying migrations

-- Sample approved startups
insert into public.startups (id, founder_id, name, slug, tagline, description, category, stage, lga, location, status, is_featured, tags)
select
  gen_random_uuid(),
  (select id from public.profiles limit 1),
  s.name, s.slug, s.tagline, s.description, s.category, s.stage, s.lga,
  s.lga || ', Ogun State, Nigeria',
  'approved',
  s.featured,
  s.tags
from (values
  ('AgroNova', 'agronova', 'Connecting Ogun farmers to premium markets across Nigeria',
   'AgroNova is a digital marketplace that links smallholder farmers in Ogun State to institutional buyers, supermarkets, and export markets. We provide price discovery, logistics coordination, and payment escrow.',
   'agritech', 'growth', 'obafemi_owode', true, ARRAY['agritech','marketplace','farmers']),
  ('PayOgun', 'payogun', 'Fast, reliable micro-payments for artisans and traders in Ogun State',
   'PayOgun provides a simple mobile payments platform tailored to the needs of market traders, artisans, and micro-businesses in Ogun State. No smartphone required — works on basic feature phones via USSD.',
   'fintech', 'mvp', 'abeokuta_south', true, ARRAY['fintech','payments','ussd']),
  ('EduBridge NG', 'edubridge-ng', 'Closing the learning gap for secondary students in Ogun State',
   'EduBridge NG delivers offline-first WAEC and JAMB prep content to students in areas with limited connectivity. Our Android app syncs when online and works fully offline, covering all core subjects.',
   'edtech', 'growth', 'sagamu', true, ARRAY['edtech','offline','waec','jamb']),
  ('MediFlow', 'mediflow', 'Digital health records for community clinics and primary health centres',
   'MediFlow digitises patient records and appointment scheduling for primary health centres across Ogun State. Our lightweight web app works on 2G connections and requires no special hardware.',
   'healthtech', 'mvp', 'ijebu_ode', false, ARRAY['healthtech','records','clinics']),
  ('SwiftHaul', 'swifthaul', 'Last-mile logistics for Ogun State SMEs and e-commerce sellers',
   'SwiftHaul provides reliable same-day and next-day delivery services across all 20 LGAs in Ogun State, with real-time tracking and cash-on-delivery support for sellers on Jumia, Konga, and WhatsApp stores.',
   'logistics', 'scale', 'ado_odo_ota', true, ARRAY['logistics','delivery','ecommerce']),
  ('CleanWatts', 'cleanwatts', 'Solar micro-grids bringing affordable electricity to rural Ogun communities',
   'CleanWatts designs, installs, and operates solar micro-grid systems for rural communities and agricultural clusters in Ogun State. We serve communities of 200–2000 people with 24/7 reliable power.',
   'cleantech', 'growth', 'imeko_afon', false, ARRAY['solar','cleantech','rural','energy'])
) as s(name, slug, tagline, description, category, stage, lga, featured, tags);

-- Sample organizations
insert into public.organizations (id, owner_id, name, slug, tagline, description, org_type, lga, status, is_featured)
select
  gen_random_uuid(),
  (select id from public.profiles limit 1),
  o.name, o.slug, o.tagline, o.description, o.org_type, o.lga,
  'approved', true
from (values
  ('Ogun Tech Hub', 'ogun-tech-hub',
   'The leading technology innovation hub in Ogun State',
   'Ogun Tech Hub provides co-working space, mentorship, and access to funding for early-stage tech startups. We run cohort-based acceleration programs and host regular networking events.',
   'incubator', 'abeokuta_north'),
  ('OSGOF (Ogun State Growth and Opportunity Fund)', 'osgof',
   'Government-backed financing for Ogun State entrepreneurs',
   'OSGOF provides low-interest loans, grants, and matching funds for registered businesses in Ogun State. We partner with commercial banks and development finance institutions.',
   'government_agency', 'abeokuta_south'),
  ('Gateway Founders', 'gateway-founders',
   'Angel investor network backing Ogun State startups',
   'Gateway Founders is a network of angel investors and mentors committed to backing the next generation of Ogun State entrepreneurs. We invest between ₦5M–₦50M in pre-seed and seed-stage startups.',
   'angel_network', 'sagamu')
) as o(name, slug, tagline, description, org_type, lga);
