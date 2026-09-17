-- ============================================================
-- Migración: landing con mapa/galería + voto con rating y reseña
-- Referencia: Concurso/concurso.md sección 6 (actualizada)
-- Correr en el SQL Editor de Supabase sobre la base ya creada.
-- ============================================================

-- restaurants: datos para mapa nacional y galería con filtro
alter table restaurants
  add column if not exists provincia      text,
  add column if not exists ciudad         text,
  add column if not exists latitud        numeric(9, 6),
  add column if not exists longitud       numeric(9, 6),
  add column if not exists foto_arepa_url text;

-- votes: reemplaza el voto simple por calificación 1-5 + reseña
alter table votes
  add column if not exists rating     smallint,
  add column if not exists comentario text;

update votes set rating = 5 where rating is null;
update votes set comentario = '' where comentario is null;

alter table votes
  alter column rating set not null,
  alter column comentario set not null,
  add constraint chk_votes_rating check (rating between 1 and 5);

-- restaurants: la landing pública (mapa, galería, dropdown de voto) es anónima.
-- La política anterior solo dejaba leer a "authenticated", lo cual bloqueaba
-- por completo la lectura pública que necesita la landing.
drop policy if exists "restaurants_select_authenticated" on restaurants;

create policy "restaurants_select_public"
  on restaurants for select
  to anon, authenticated
  using (true);
