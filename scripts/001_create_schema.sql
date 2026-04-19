-- AlumniConnect AI Database Schema
-- Creates all necessary tables with RLS policies

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('student', 'alumni', 'admin')) default 'student',
  bio text,
  title text,
  company text,
  referrals_given integer default 0,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles for select using (true);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Mentors table
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  initials text not null,
  title text not null,
  company text not null,
  match_score integer default 85,
  bio text,
  created_at timestamp with time zone default now()
);

alter table public.mentors enable row level security;

create policy "mentors_select_all" on public.mentors for select using (true);
create policy "mentors_insert_alumni" on public.mentors for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('alumni', 'admin'))
);
create policy "mentors_update_own" on public.mentors for update using (
  user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "mentors_delete_own" on public.mentors for delete using (
  user_id = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Jobs table
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  posted_by uuid references public.profiles(id) on delete set null,
  title text not null,
  company text not null,
  location text not null,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.jobs enable row level security;

create policy "jobs_select_all" on public.jobs for select using (true);
create policy "jobs_insert_alumni" on public.jobs for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('alumni', 'admin'))
);
create policy "jobs_update_own" on public.jobs for update using (
  posted_by = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "jobs_delete_own" on public.jobs for delete using (
  posted_by = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Connection requests table
create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.mentors(id) on delete cascade not null,
  student_name text not null,
  status text not null check (status in ('pending', 'accepted', 'rejected')) default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.connection_requests enable row level security;

create policy "connection_requests_select" on public.connection_requests for select using (
  student_id = auth.uid() or 
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "connection_requests_insert" on public.connection_requests for insert with check (auth.uid() = student_id);
create policy "connection_requests_update" on public.connection_requests for update using (
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Messages table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references public.profiles(id) on delete cascade not null,
  to_mentor_id uuid references public.mentors(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;

create policy "messages_select" on public.messages for select using (
  from_user_id = auth.uid() or 
  exists (select 1 from public.mentors where id = to_mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "messages_insert" on public.messages for insert with check (auth.uid() = from_user_id);

-- Session requests table
create table if not exists public.session_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.mentors(id) on delete cascade not null,
  status text not null check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
  scheduled_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.session_requests enable row level security;

create policy "session_requests_select" on public.session_requests for select using (
  student_id = auth.uid() or 
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "session_requests_insert" on public.session_requests for insert with check (auth.uid() = student_id);
create policy "session_requests_update" on public.session_requests for update using (
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Referrals table
create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  job_id uuid references public.jobs(id) on delete cascade not null,
  status text not null check (status in ('requested', 'in_progress', 'completed', 'rejected')) default 'requested',
  created_at timestamp with time zone default now()
);

alter table public.referrals enable row level security;

create policy "referrals_select" on public.referrals for select using (
  user_id = auth.uid() or 
  exists (select 1 from public.jobs where id = job_id and posted_by = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "referrals_insert" on public.referrals for insert with check (auth.uid() = user_id);
create policy "referrals_update" on public.referrals for update using (
  exists (select 1 from public.jobs where id = job_id and posted_by = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Connections table (accepted connections between students and mentors)
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles(id) on delete cascade not null,
  mentor_id uuid references public.mentors(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(student_id, mentor_id)
);

alter table public.connections enable row level security;

create policy "connections_select" on public.connections for select using (
  student_id = auth.uid() or 
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "connections_insert" on public.connections for insert with check (
  exists (select 1 from public.mentors where id = mentor_id and user_id = auth.uid()) or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'student')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
