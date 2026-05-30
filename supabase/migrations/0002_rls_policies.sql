-- ─── Profiles RLS ───────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─── Startups RLS ───────────────────────────────────────────────────────────
alter table public.startups enable row level security;

-- Public can read approved startups
create policy "startups_select_approved"
  on public.startups for select
  using (status = 'approved');

-- Founder sees all their own startups regardless of status
create policy "startups_select_own"
  on public.startups for select
  using (auth.uid() = founder_id);

-- Founder can insert
create policy "startups_insert_own"
  on public.startups for insert
  with check (auth.uid() = founder_id);

-- Founder can update their own startups
create policy "startups_update_own"
  on public.startups for update
  using (auth.uid() = founder_id)
  with check (auth.uid() = founder_id);

-- Admin full access
create policy "startups_admin_all"
  on public.startups for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Organizations RLS ──────────────────────────────────────────────────────
alter table public.organizations enable row level security;

create policy "orgs_select_approved"
  on public.organizations for select
  using (status = 'approved');

create policy "orgs_select_own"
  on public.organizations for select
  using (auth.uid() = owner_id);

create policy "orgs_insert_own"
  on public.organizations for insert
  with check (auth.uid() = owner_id);

create policy "orgs_update_own"
  on public.organizations for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "orgs_admin_all"
  on public.organizations for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Startup Products RLS ───────────────────────────────────────────────────
alter table public.startup_products enable row level security;

create policy "products_select_approved_startup"
  on public.startup_products for select
  using (
    exists (
      select 1 from public.startups
      where id = startup_id and status = 'approved'
    )
  );

create policy "products_select_own_startup"
  on public.startup_products for select
  using (
    exists (
      select 1 from public.startups
      where id = startup_id and founder_id = auth.uid()
    )
  );

create policy "products_manage_founder"
  on public.startup_products for all
  using (
    exists (
      select 1 from public.startups
      where id = startup_id and founder_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.startups
      where id = startup_id and founder_id = auth.uid()
    )
  );

-- ─── Bookmarks RLS ──────────────────────────────────────────────────────────
alter table public.bookmarks enable row level security;

create policy "bookmarks_own"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
