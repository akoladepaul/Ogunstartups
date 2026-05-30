-- ─── Blog / Press Room ──────────────────────────────────────────────────────
create table public.posts (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.profiles(id) on delete cascade,
  title           text not null,
  slug            text not null unique,
  excerpt         text,
  content         text not null,
  cover_image_url text,
  category        text not null default 'news'
                  check (category in ('news', 'press_release', 'founder_story', 'ecosystem', 'opinion', 'event')),
  tags            text[] default '{}',
  status          text not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  featured        boolean default false,
  startup_id      uuid references public.startups(id) on delete set null,
  published_at    timestamptz,
  view_count      int default 0,
  read_time_mins  int,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Full-text search on posts
alter table public.posts
  add column search_vector tsvector
    generated always as (
      to_tsvector('english',
        coalesce(title, '') || ' ' ||
        coalesce(excerpt, '') || ' ' ||
        coalesce(content, '')
      )
    ) stored;

create index posts_search_idx on public.posts using gin(search_vector);
create index posts_status_idx on public.posts(status);
create index posts_category_idx on public.posts(category);
create index posts_published_at_idx on public.posts(published_at desc);

-- Updated at trigger
create trigger posts_updated_at before update on public.posts
  for each row execute procedure public.handle_updated_at();

-- View count RPC
create or replace function public.increment_post_views(post_id uuid)
returns void language sql security definer as $$
  update public.posts set view_count = view_count + 1 where id = post_id;
$$;

-- ─── RLS for posts ──────────────────────────────────────────────────────────
alter table public.posts enable row level security;

-- Anyone can read published posts
create policy "posts_select_published"
  on public.posts for select
  using (status = 'published');

-- Authors see all their own posts
create policy "posts_select_own"
  on public.posts for select
  using (auth.uid() = author_id);

-- Only admins can insert/update/delete
create policy "posts_admin_all"
  on public.posts for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
