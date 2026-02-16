# Supabase Database Schema

To make the application functional with Supabase, you need to create the following tables. You can use the Supabase SQL Editor to run these commands.

## Tables

### 1. tasks
```sql
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  category text not null, -- 'DevOps' | 'Project' | 'Freelancing' | 'OnlinePresence' | 'AINews' | 'Lead' | 'Portfolio' | 'Reflection'
  completed boolean default false,
  date date not null,
  priority text not null, -- 'high' | 'medium' | 'low'
  created_at timestamp with time zone default now()
);
```

### 2. projects
```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  type text not null,
  status text not null,
  github_url text,
  deployment_url text,
  description text,
  monetization_plan text,
  commit_streak integer default 0,
  last_commit_date date,
  checklist jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 3. ai_tools
```sql
create table ai_tools (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  official_url text,
  category text not null,
  pricing text not null,
  rating integer check (rating >= 1 and rating <= 5),
  status text not null,
  tested boolean default false,
  review_written boolean default false,
  blog_published boolean default false,
  social_post_published boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);
```

### 4. intelligence_sources
```sql
create table intelligence_sources (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  url text not null,
  description text,
  checked_this_week boolean default false,
  last_reset_date date,
  created_at timestamp with time zone default now()
);
```

### 5. discovery_logs
```sql
create table discovery_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  link text,
  summary text,
  category text,
  action_required text,
  created_at timestamp with time zone default now()
);
```

### 6. notes
```sql
create table notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  task_id uuid references tasks(id) on delete cascade,
  type text not null,
  content text not null,
  timestamp text,
  video_name text,
  created_at timestamp with time zone default now()
);
```

### 7. accounts
```sql
create table accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  type text not null,
  platform text,
  job_board_category text,
  professional_category text,
  username text,
  url text,
  email text,
  login_password text,
  credential_hint text,
  notes text,
  post_count integer default 0,
  proposal_count integer default 0,
  application_count integer default 0,
  created_at timestamp with time zone default now()
);
```

### 8. leads
```sql
create table leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  source text,
  niche text,
  status text not null,
  proposal_sent boolean default false,
  follow_up_date date,
  notes text,
  created_at timestamp with time zone default now()
);
```

### 9. post_ideas
```sql
create table post_ideas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  category text not null,
  content text,
  scheduled_date date,
  status text not null,
  linked_task_id uuid references tasks(id),
  created_at timestamp with time zone default now()
);
```

### 10. documents
```sql
create table documents (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  type text not null,
  language text,
  file_content text, -- Base64 encoded or path to Supabase Storage
  file_name text,
  file_size integer,
  updated_at timestamp with time zone default now()
);
```

### 11. video_progress
```sql
create table video_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  video_id text not null,
  minutes_watched integer default 0,
  completed boolean default false,
  last_watched timestamp with time zone default now(),
  unique(user_id, video_id)
);
```

### 12. creator_radar
```sql
create table creator_radar (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  platform text not null,
  topic text,
  status text not null,
  notes text,
  last_reviewed_date date,
  created_at timestamp with time zone default now()
);
```

### 13. weekly_trends
```sql
create table weekly_trends (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  week_number integer not null,
  year integer not null,
  synthesis text,
  top_tools jsonb,
  action_items jsonb,
  updated_at timestamp with time zone default now(),
  unique(user_id, week_number, year)
);
```

## Row Level Security (RLS)

Make sure to enable RLS on all tables and add policies so that users can only access their own data:

```sql
alter table tasks enable row level security;
create policy "Users can only access their own tasks" on tasks
  for all using (auth.uid() = user_id);

-- Repeat for all tables
```
