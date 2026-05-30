-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ─── Profiles (extends auth.users 1-to-1) ──────────────────────────────────
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text,
  avatar_url   text,
  role         text not null default 'founder'
               check (role in ('founder', 'admin', 'viewer')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Startups ───────────────────────────────────────────────────────────────
create table public.startups (
  id              uuid primary key default gen_random_uuid(),
  founder_id      uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  slug            text not null unique,
  tagline         text,
  description     text,
  logo_url        text,
  cover_url       text,
  website_url     text,
  category        text,
  stage           text check (stage in ('idea', 'mvp', 'growth', 'scale')),
  founded_year    int,
  location        text default 'Ogun State, Nigeria',
  lga             text,
  is_hiring       boolean default false,
  is_featured     boolean default false,
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'archived')),
  tags            text[] default '{}',
  social_links    jsonb default '{}',
  view_count      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Full-text search vector
alter table public.startups
  add column search_vector tsvector
    generated always as (
      to_tsvector('english',
        coalesce(name, '') || ' ' ||
        coalesce(tagline, '') || ' ' ||
        coalesce(description, '') || ' ' ||
        coalesce(category, '') || ' ' ||
        coalesce(lga, '')
      )
    ) stored;

create index startups_search_idx on public.startups using gin(search_vector);
create index startups_status_idx on public.startups(status);
create index startups_category_idx on public.startups(category);
create index startups_lga_idx on public.startups(lga);
create index startups_featured_idx on public.startups(is_featured);

-- ─── Organizations ──────────────────────────────────────────────────────────
create table public.organizations (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references public.profiles(id) on delete cascade,
  name            text not null,
  slug            text not null unique,
  tagline         text,
  description     text,
  logo_url        text,
  cover_url       text,
  website_url     text,
  org_type        text check (org_type in (
                    'accelerator', 'incubator', 'coworking', 'angel_network',
                    'government_agency', 'ngo', 'university_hub', 'corporate_program'
                  )),
  lga             text,
  founded_year    int,
  is_featured     boolean default false,
  status          text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected', 'archived')),
  tags            text[] default '{}',
  social_links    jsonb default '{}',
  view_count      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index orgs_status_idx on public.organizations(status);
create index orgs_type_idx on public.organizations(org_type);

-- ─── Startup Products ───────────────────────────────────────────────────────
create table public.startup_products (
  id           uuid primary key default gen_random_uuid(),
  startup_id   uuid not null references public.startups(id) on delete cascade,
  name         text not null,
  description  text,
  image_url    text,
  price        numeric,
  currency     text default 'NGN',
  created_at   timestamptz default now()
);

-- ─── Bookmarks ──────────────────────────────────────────────────────────────
create table public.bookmarks (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  startup_id   uuid not null references public.startups(id) on delete cascade,
  created_at   timestamptz default now(),
  unique(user_id, startup_id)
);

-- ─── View Count RPC ─────────────────────────────────────────────────────────
create or replace function public.increment_view_count(startup_id uuid)
returns void language sql security definer as $$
  update public.startups
  set view_count = view_count + 1
  where id = startup_id;
$$;

-- ─── Updated At Trigger ─────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger startups_updated_at before update on public.startups
  for each row execute procedure public.handle_updated_at();

create trigger orgs_updated_at before update on public.organizations
  for each row execute procedure public.handle_updated_at();
