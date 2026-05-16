-- Create issues table
create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  title text not null,
  assignee text not null,
  status text not null default 'todo',
  priority text not null default 'medium',
  description text,
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table public.issues enable row level security;

-- Policies
create policy "Users can view their own issues"
  on public.issues for select
  using (auth.uid() = user_id);

create policy "Users can insert their own issues"
  on public.issues for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own issues"
  on public.issues for update
  using (auth.uid() = user_id);

create policy "Users can delete their own issues"
  on public.issues for delete
  using (auth.uid() = user_id);
