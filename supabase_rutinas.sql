-- Ejecutar en el SQL Editor de Supabase
-- https://supabase.com/dashboard → SQL Editor

create table if not exists rutinas (
  id uuid default gen_random_uuid() primary key,
  nombre text not null,
  descripcion text,
  nivel text check (nivel in ('Principiante', 'Intermedio', 'Avanzado')),
  dias_semana integer check (dias_semana between 1 and 7),
  objetivo text check (objetivo in ('Perder peso', 'Ganar masa muscular', 'Mejorar resistencia', 'Mantenimiento', 'Otro')),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- Habilitar Row Level Security
alter table rutinas enable row level security;

-- Política: cada usuario solo ve y modifica sus propias rutinas
create policy "Usuarios gestionan sus propias rutinas"
  on rutinas
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
