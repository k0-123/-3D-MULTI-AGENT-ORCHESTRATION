-- Create deliverables table
create table if not exists public.deliverables (
  id text primary key,
  created_at timestamp with time zone default now(),
  agent_id text not null,
  issue_id uuid references public.issues(id) on delete set null,
  content text not null,
  timestamp bigint not null,
  audit_log jsonb default '[]'::jsonb,
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.deliverables enable row level security;

-- Policies
create policy "Users can view their own deliverables"
  on public.deliverables for select
  using (auth.uid() = user_id);

create policy "Users can insert their own deliverables"
  on public.deliverables for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own deliverables"
  on public.deliverables for delete
  using (auth.uid() = user_id);
