-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  created_at timestamptz default now()
);

-- Families
create table families (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  code text unique not null,
  created_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- Family members
create table family_member (
  user_id uuid references profiles(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (user_id, family_id)
);

-- Animals
create table animals (
  id uuid default gen_random_uuid() primary key,
  family_id uuid references families(id) on delete cascade,
  name text not null,
  species text not null,
  created_at timestamptz default now()
);

-- Medications
create table medications (
  id uuid default gen_random_uuid() primary key,
  animal_id uuid references animals(id) on delete cascade,
  name text not null,
  dose text,
  note text,
  created_at timestamptz default now()
);

-- Medication schedules
create table medication_schedules (
  id uuid default gen_random_uuid() primary key,
  medication_id uuid references medications(id) on delete cascade,
  time time not null,
  frequency text not null,
  days_of_week int[],
  starts_on date,
  ends_on date
);

-- Dose logs
create table dose_logs (
  id uuid default gen_random_uuid() primary key,
  medication_id uuid references medications(id) on delete cascade,
  family_id uuid references families(id) on delete cascade,
  schedule_id uuid references medication_schedules(id) on delete cascade,
  given_by uuid references profiles(id),
  given_at timestamptz default now(),
  scheduled_time time not null,
  note text
);

-- Push tokens
create table push_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  token text not null,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-delete empty families
create function delete_empty_family()
returns trigger as $$
begin
  if not exists (
    select 1 from family_member where family_id = OLD.family_id
  ) then
    delete from families where id = OLD.family_id;
  end if;
  return OLD;
end;
$$ language plpgsql security definer;

create trigger on_last_member_exit
  after delete on family_member
  for each row execute procedure delete_empty_family();

-- Enable RLS
alter table profiles enable row level security;
alter table families enable row level security;
alter table family_member enable row level security;
alter table animals enable row level security;
alter table medications enable row level security;
alter table medication_schedules enable row level security;
alter table dose_logs enable row level security;
alter table push_tokens enable row level security;

-- Profiles policies
create policy "users can read own profile"
on profiles for select to authenticated
using (true);

create policy "users can update own profile"
on profiles for update to authenticated
using (auth.uid() = id);

-- Families policies
create policy "members can read their family"
on families for select to authenticated
using (
  created_by = auth.uid()
  or exists (
    select 1 from family_member
    where family_member.family_id = families.id
    and family_member.user_id = auth.uid()
  )
);

create policy "authenticated users can create families"
on families for insert to authenticated
with check (auth.uid() = created_by);

-- Family member policies
create policy "members can read family members"
on family_member for select to authenticated
using (user_id = auth.uid());

create policy "users can join a family"
on family_member for insert to authenticated
with check (auth.uid() = user_id);

create policy "users can exit a family"
on family_member for delete to authenticated
using (user_id = auth.uid());

-- Animals policies
create policy "members can read animals"
on animals for select to authenticated
using (
  exists (
    select 1 from family_member
    where family_member.family_id = animals.family_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can insert animals"
on animals for insert to authenticated
with check (
  exists (
    select 1 from family_member
    where family_member.family_id = animals.family_id
    and family_member.user_id = auth.uid()
  )
);

-- Medications policies
create policy "members can read medications"
on medications for select to authenticated
using (
  exists (
    select 1 from animals
    join family_member on family_member.family_id = animals.family_id
    where animals.id = medications.animal_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can insert medications"
on medications for insert to authenticated
with check (
  exists (
    select 1 from animals
    join family_member on family_member.family_id = animals.family_id
    where animals.id = medications.animal_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can update medications"
on medications for update to authenticated
using (
  exists (
    select 1 from animals
    join family_member on family_member.family_id = animals.family_id
    where animals.id = medications.animal_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can delete medications"
on medications for delete to authenticated
using (
  exists (
    select 1 from animals
    join family_member on family_member.family_id = animals.family_id
    where animals.id = medications.animal_id
    and family_member.user_id = auth.uid()
  )
);

-- Medication schedules policies
create policy "members can read schedules"
on medication_schedules for select to authenticated
using (
  exists (
    select 1 from medications
    join animals on animals.id = medications.animal_id
    join family_member on family_member.family_id = animals.family_id
    where medications.id = medication_schedules.medication_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can insert schedules"
on medication_schedules for insert to authenticated
with check (
  exists (
    select 1 from medications
    join animals on animals.id = medications.animal_id
    join family_member on family_member.family_id = animals.family_id
    where medications.id = medication_schedules.medication_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can update schedules"
on medication_schedules for update to authenticated
using (
  exists (
    select 1 from medications
    join animals on animals.id = medications.animal_id
    join family_member on family_member.family_id = animals.family_id
    where medications.id = medication_schedules.medication_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can delete schedules"
on medication_schedules for delete to authenticated
using (
  exists (
    select 1 from medications
    join animals on animals.id = medications.animal_id
    join family_member on family_member.family_id = animals.family_id
    where medications.id = medication_schedules.medication_id
    and family_member.user_id = auth.uid()
  )
);

-- Dose logs policies
create policy "members can read dose logs"
on dose_logs for select to authenticated
using (
  exists (
    select 1 from family_member
    where family_member.family_id = dose_logs.family_id
    and family_member.user_id = auth.uid()
  )
);

create policy "members can insert dose logs"
on dose_logs for insert to authenticated
with check (
  exists (
    select 1 from family_member
    where family_member.family_id = dose_logs.family_id
    and family_member.user_id = auth.uid()
  )
);

create policy "users can delete their own dose logs"
on dose_logs for delete to authenticated
using (given_by = auth.uid());

-- Push tokens policies
create policy "users can manage their own tokens"
on push_tokens for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Enable realtime
alter publication supabase_realtime add table medication_schedules;
alter publication supabase_realtime add table medications;
alter publication supabase_realtime add table animals;
alter publication supabase_realtime add table dose_logs;
alter publication supabase_realtime add table families;
alter publication supabase_realtime add table family_member;