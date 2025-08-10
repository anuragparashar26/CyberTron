-- 1. Create a table for public profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone,
  xp integer default 0,

  primary key (id),
  unique(username),
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- 2. Enable RLS for the profiles table
alter table public.profiles enable row level security;

-- 3. Create a policy that allows public read access for everyone
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- 4. Create a policy that allows users to insert their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- 5. Create a policy that allows users to update their own profile
create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 6. Create a function to handle new user creation
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- 7. Create a trigger to execute the function after a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. Add a column to track completed quizzes
ALTER TABLE public.profiles
ADD COLUMN completed_quizzes jsonb DEFAULT '[]'::jsonb;

-- 9. Add a column to track scan history
ALTER TABLE public.profiles
ADD COLUMN scan_history jsonb DEFAULT '[]'::jsonb;
