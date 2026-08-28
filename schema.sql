-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- 1. Workers table
create table if not exists harness_workers (
  id text primary key,
  phone text unique not null,
  name text not null,
  language text not null,
  department text not null,
  active text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Documents table
create table if not exists harness_documents (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  status text not null,
  chunks integer not null,
  date text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Document Chunks table (with embeddings)
create table if not exists harness_chunks (
  id uuid default gen_random_uuid() primary key,
  doc_name text references harness_documents(name) on delete cascade,
  content text not null,
  embedding vector(768), -- 768 dimensions for Gemini text-embedding-004
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Incidents table
create table if not exists harness_incidents (
  id text primary key,
  worker text not null,
  description text not null,
  severity text not null,
  status text not null,
  time text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Unanswered Questions pool table
create table if not exists harness_unanswered (
  id text primary key,
  question text unique not null,
  asked_count integer not null,
  cluster_topic text not null,
  resolved boolean not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Workers
insert into harness_workers (id, phone, name, language, department, active) values
  ('w-01', '+919876543210', 'Ramesh Kumar', 'hi', 'Production', '5 mins ago'),
  ('w-02', '+919922334455', 'Rajesh Kumar', 'hi', 'Spinning Floor', '10 mins ago'),
  ('w-03', '+919811223344', 'Suresh Patil', 'mr', 'Warehouse A', '1 hour ago'),
  ('w-04', '+918811223355', 'Anil Sharma', 'hi', 'Production', 'Yesterday')
on conflict (phone) do nothing;

-- Seed Incidents
insert into harness_incidents (id, worker, description, severity, status, time) values
  ('inc-01', 'Ramesh Kumar', 'Smoke observed on line 2 main breaker', 'HIGH', 'Resolved', '09:03 AM'),
  ('inc-02', 'Suresh Patil', 'Forklift hydraulic line leakage near Gate 2', 'MEDIUM', 'in_progress', 'Yesterday')
on conflict (id) do nothing;

-- Seed Unanswered
insert into harness_unanswered (id, question, asked_count, cluster_topic, resolved) values
  ('un-01', 'Store Room keys kis supervisor ke paas hain?', 5, 'Keys & Access', false),
  ('un-02', 'Line 2 reset alarm kaise silience karein?', 3, 'Alarm controls', false)
on conflict (question) do nothing;

-- 6. Conversations table
create table if not exists harness_conversations (
  id text primary key,
  phone text not null,
  channel text not null,
  snippet text not null,
  messages jsonb not null,
  trace jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Conversations
insert into harness_conversations (id, phone, channel, snippet, messages, trace) values
  ('c-01', '+919876543210', 'whatsapp', 'yahan pe line 2 mein smoke...', '[{"sender": "Worker", "text": "yahan pe line 2 mein smoke aa raha hai jaldi aao", "time": "09:03 AM"}, {"sender": "Agent", "text": "[EMERGENCY ALERT] Line 2 mein aag/smoke detect kiya gaya hai. Main gas valve band karein. Supervisor Ramesh ji ko notify kar diya gaya hai.", "time": "09:03 AM"}]', '{"Observe": "Worker reported: ''smoke''", "ToolsCalled": "log_incident(), route_to_supervisor()", "Confidence": 0.98, "DatabaseSync": "Logged incident inc-01 successfully"}'),
  ('c-02', '+919922334455', 'whatsapp', 'Safety helmet kahan milega?', '[{"sender": "Worker", "text": "Safety helmet kahan milega?", "time": "09:01 AM"}, {"sender": "Agent", "text": "Store Room B mein — Gate 2 ke paas. Supervisor Ramesh ji ke paas extra hain. (SOP Sec 2.1)", "time": "09:01 AM"}]', '{"Observe": "Worker query: ''safety helmet''", "ToolsCalled": "search_knowledge_base()", "Confidence": 0.96, "DatabaseSync": "Cache query hit"}')
on conflict (id) do nothing;


-- Create function for vector similarity search (Gemini text-embedding-004 is 768 dimensions)
create or replace function match_harness_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  doc_name text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    harness_chunks.id,
    harness_chunks.doc_name,
    harness_chunks.content,
    1 - (harness_chunks.embedding <=> query_embedding) as similarity
  from harness_chunks
  where 1 - (harness_chunks.embedding <=> query_embedding) > match_threshold
  order by harness_chunks.embedding <=> query_embedding
  limit match_count;
$$;

-- Disable Row Level Security (RLS) to allow public anonymous read and write access from server API routes
alter table harness_workers disable row level security;
alter table harness_incidents disable row level security;
alter table harness_documents disable row level security;
alter table harness_chunks disable row level security;
alter table harness_unanswered disable row level security;
alter table harness_conversations disable row level security;
