-- Agapetoi Database Schema for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Weaknesses table
create table public.weaknesses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text default '',
  severity integer check (severity >= 1 and severity <= 5) default 3,
  status text check (status in ('active', 'improving', 'archived')) default 'active',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Virtues table (static reference)
create table public.virtues (
  id text primary key,
  name text not null,
  description text default '',
  daily_practice text default '',
  reflection_question text default ''
);

-- Weakness-Virtue mappings (many-to-many)
create table public.weakness_virtues (
  id uuid default uuid_generate_v4() primary key,
  weakness_id uuid references public.weaknesses(id) on delete cascade not null,
  virtue_id text references public.virtues(id) on delete cascade not null,
  unique(weakness_id, virtue_id)
);

-- Journal entries
create table public.journal_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  reflection text not null,
  lesson text default '',
  tomorrow_practice text default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Journal-Weakness relationships
create table public.journal_weaknesses (
  id uuid default uuid_generate_v4() primary key,
  journal_id uuid references public.journal_entries(id) on delete cascade not null,
  weakness_id uuid references public.weaknesses(id) on delete cascade not null,
  unique(journal_id, weakness_id)
);

-- Journal-Virtue relationships
create table public.journal_virtues (
  id uuid default uuid_generate_v4() primary key,
  journal_id uuid references public.journal_entries(id) on delete cascade not null,
  virtue_id text references public.virtues(id) on delete cascade not null,
  unique(journal_id, virtue_id)
);

-- Indexes
create index idx_weaknesses_user_id on public.weaknesses(user_id);
create index idx_weaknesses_status on public.weaknesses(status);
create index idx_journal_entries_user_id on public.journal_entries(user_id);
create index idx_journal_entries_created_at on public.journal_entries(created_at desc);
create index idx_journal_weaknesses_journal_id on public.journal_weaknesses(journal_id);
create index idx_journal_virtues_journal_id on public.journal_virtues(journal_id);
create index idx_weakness_virtues_weakness_id on public.weakness_virtues(weakness_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.weaknesses enable row level security;
alter table public.virtues enable row level security;
alter table public.weakness_virtues enable row level security;
alter table public.journal_entries enable row level security;
alter table public.journal_weaknesses enable row level security;
alter table public.journal_virtues enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Weaknesses policies
create policy "Users can view own weaknesses"
  on public.weaknesses for select
  using (auth.uid() = user_id);

create policy "Users can insert own weaknesses"
  on public.weaknesses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own weaknesses"
  on public.weaknesses for update
  using (auth.uid() = user_id);

create policy "Users can delete own weaknesses"
  on public.weaknesses for delete
  using (auth.uid() = user_id);

-- Virtues policies (read-only for authenticated users)
create policy "Authenticated users can read virtues"
  on public.virtues for select
  using (auth.role() = 'authenticated');

-- Weakness-Virtues policies
create policy "Users can manage own weakness-virtues"
  on public.weakness_virtues for all
  using (
    exists (
      select 1 from public.weaknesses
      where weaknesses.id = weakness_virtues.weakness_id
      and weaknesses.user_id = auth.uid()
    )
  );

-- Journal entries policies
create policy "Users can view own journal entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert own journal entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own journal entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own journal entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- Journal-Weaknesses policies
create policy "Users can manage own journal-weaknesses"
  on public.journal_weaknesses for all
  using (
    exists (
      select 1 from public.journal_entries
      where journal_entries.id = journal_weaknesses.journal_id
      and journal_entries.user_id = auth.uid()
    )
  );

-- Journal-Virtues policies
create policy "Users can manage own journal-virtues"
  on public.journal_virtues for all
  using (
    exists (
      select 1 from public.journal_entries
      where journal_entries.id = journal_virtues.journal_id
      and journal_entries.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Insert default virtues
insert into public.virtues (id, name, description, daily_practice, reflection_question) values
('v-humility', 'Humility', 'Recognizing your true place without exaggeration or self-deprecation.', 'Choose to listen before speaking. Acknowledge what others contribute.', 'Where can I put someone else before myself today?'),
('v-purity', 'Purity', 'Seeing people and things as they truly are, free from distortion.', 'Notice when your gaze lingers. Redirect your attention to what is good.', 'What am I looking for in this moment — and is it true?'),
('v-temperance', 'Temperance', 'Practicing moderation and self-restraint in desires.', 'Pause before indulging. Ask if this serves the person you want to become.', 'Where am I taking more than I need?'),
('v-patience', 'Patience', 'Enduring difficulty calmly without complaint.', 'When frustrated, take a breath before responding. Accept the pace of life.', 'What is this moment of waiting trying to teach me?'),
('v-meekness', 'Meekness', 'Strength under control. Power used gently.', 'Respond softly when you could retaliate. Let go of the need to be right.', 'Where could my strength be used more gently?'),
('v-hope', 'Hope', 'Confident trust that good will come even in difficulty.', 'Name one thing you are grateful for. Trust that tomorrow holds growth.', 'What good thing am I afraid to hope for?'),
('v-trust', 'Trust', 'Letting go of the need to control outcomes.', 'When anxiety rises, pause and say: I do not need to carry this alone.', 'What am I trying to control that I could release?'),
('v-courage', 'Courage', 'Acting rightly despite fear.', 'Do one thing today that scares you a little. Speak the truth kindly.', 'What is fear keeping me from doing right now?'),
('v-charity', 'Charity', 'Seeing the good in others and wishing them well.', 'When you notice a flaw in someone, also name a strength.', 'Who did I judge today, and what goodness did I overlook?'),
('v-gratitude', 'Gratitude', 'Recognizing and appreciating what has been given.', 'Name three specific things you received today that you did not earn.', 'What do I have that I did not create?'),
('v-diligence', 'Diligence', 'Steady, purposeful effort in what matters.', 'Begin the task you have been avoiding. Give it your best for ten minutes.', 'What have I been neglecting that deserves my effort?'),
('v-generosity', 'Generosity', 'Giving freely without expecting return.', 'Give something — time, attention, a kind word — without being asked.', 'What am I holding onto too tightly?'),
('v-obedience', 'Obedience', 'Willingly aligning your will with what is right.', 'Follow through on something you know you should do, even if you don''t feel like it.', 'Where am I resisting what I know is right?'),
('v-mindfulness', 'Mindfulness', 'Being fully present in the current moment.', 'When your mind wanders, gently bring it back. Focus on one thing at a time.', 'Where was my attention today — and where did it need to be?'),
('v-discernment', 'Discernment', 'The ability to judge well and see what truly matters.', 'Before reacting, pause. Ask: is this important, or just urgent?', 'What truly matters today that I am overlooking?')
on conflict (id) do nothing;
