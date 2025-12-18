-- HMBTI Schema v1.0

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. QUESTIONS Table
create table public.questions (
  id uuid primary key default uuid_generate_v4(),
  dimension text not null, -- 'I_E', 'C_B', 'O_X', 'G_F'
  text text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. TESTS Table
create table public.tests (
  id uuid primary key default uuid_generate_v4(),
  started_at timestamptz default now(),
  completed_at timestamptz,
  model_version text not null,
  result_type text, -- e.g., 'ICXG'
  result_vector jsonb, -- e.g., {"I_E": 1.5, ...}
  confidence_flag text, -- 'high', 'low'
  created_at timestamptz default now()
);

-- 3. ANSWERS Table
create table public.answers (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.tests(id),
  question_id uuid references public.questions(id),
  answer_value int, -- 1-4, null if skipped
  skipped boolean default false,
  view_duration_ms int,
  created_at timestamptz default now()
);

-- 4. POST_SURVEYS Table
create table public.post_surveys (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid references public.tests(id),
  role text,
  engagement_level int,
  answer_basis text,
  created_at timestamptz default now()
);

-- RLS Policies
alter table public.questions enable row level security;
alter table public.tests enable row level security;
alter table public.answers enable row level security;
alter table public.post_surveys enable row level security;

-- Questions: Public read-only
create policy "Questions are viewable by everyone" 
on public.questions for select 
using (true);

-- Tests: Public insert (anon) - assuming no user auth for MVP
create policy "Anyone can insert tests" 
on public.tests for insert 
with check (true);

-- Answers: Public insert (anon)
create policy "Anyone can insert answers" 
on public.answers for insert 
with check (true);

-- Post Surveys: Public insert (anon)
create policy "Anyone can insert post surveys" 
on public.post_surveys for insert 
with check (true);

-- Optional: If we want users to read their own tests, we'd need some way to identify them. 
-- For now, returning data immediately after insertion works without RLS select policy if using select() on insert response? 
-- Actually Supabase returns data for the inserted row if allowed.
-- But standard Select needs a policy.
-- For now, let's allow reading tests if you have the ID? No, that's not secure by default.
-- MVP: We only need to write tests/answers. The frontend has the state in memory to show results.
-- IF we implement result sharing via URL /result/:id, we need a SELECT policy.
create policy "Tests are viewable by ID"
on public.tests for select
using (true); -- Ideally this should satisfy specific UUID match, but Supabase RLS 'using' is row-based.
-- 'using (true)' makes it public. For MVP sharing, this is acceptable (results are anonymous).

