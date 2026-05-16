-- Create agent memory table
create table if not exists public.agent_memory (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  agent_id text not null,
  task text not null,
  result text not null,
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.agent_memory enable row level security;

-- Policies
create policy "Users can view their own agent memory"
  on public.agent_memory for select
  using (auth.uid() = user_id);

create policy "Users can insert their own agent memory"
  on public.agent_memory for insert
  with check (auth.uid() = user_id);
