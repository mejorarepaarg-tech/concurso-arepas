-- ============================================================
-- Concurso Mejor Arepa de Argentina — Schema
-- Proyecto Supabase propio del evento (independiente del club)
-- Referencia: Concurso/concurso.md secciones 2, 3, 5, 6, 7
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- TIPOS ENUM
-- ============================================================
create type categoria_restaurante as enum ('presencial', 'delivery');
create type modalidad_inscripcion as enum ('participante', 'adherido', 'delivery');

-- ============================================================
-- TABLA: inspectores (jurado / equipo organizador)
-- Reemplaza el `usuarios` del club — este proyecto tiene su propio
-- auth de Supabase, sin relación con el auth del club.
-- ============================================================
create table inspectores (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombre     text not null,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLA: restaurants
-- ============================================================
create table restaurants (
  id                 uuid primary key default uuid_generate_v4(),
  nombre             text not null,
  modalidad          modalidad_inscripcion not null,
  category           categoria_restaurante not null default 'presencial',
  direccion          text,
  provincia          text,
  ciudad             text,
  latitud            numeric(9, 6),
  longitud           numeric(9, 6),
  foto_arepa_url     text,
  logo_url           text,
  instagram_url      text,
  opt_in_leaderboard boolean not null default false,
  delivery_link      text,
  qr_code_url        text,
  pago_en_especie    boolean not null default false,
  pago_nota          text,
  habilitacion_bromatologica boolean not null default false,
  created_at         timestamptz not null default now()
);

alter table restaurants
  add constraint chk_delivery_link
  check (category <> 'delivery' or delivery_link is not null);

-- ============================================================
-- TABLA: votes (Favorito del Público)
-- ============================================================
create table votes (
  id                  uuid primary key default uuid_generate_v4(),
  restaurant_id       uuid not null references restaurants(id) on delete cascade,
  rating              smallint not null check (rating between 1 and 5),
  comentario          text not null,
  nombre              text not null,
  telefono            text not null,
  mail                text not null,
  consentimiento      boolean not null,
  ip                  text,
  user_agent          text,
  turnstile_validated boolean not null default false,
  created_at          timestamptz not null default now(),

  constraint chk_consentimiento check (consentimiento is true),
  constraint uq_votes_telefono_mail unique (telefono, mail)
);

create index idx_votes_restaurant_id on votes (restaurant_id);
create index idx_votes_created_at on votes (created_at);

-- ============================================================
-- TABLA: jury_visits
-- ============================================================
create table jury_visits (
  id                       uuid primary key default uuid_generate_v4(),
  restaurant_id            uuid not null references restaurants(id) on delete cascade,
  inspector_id             uuid not null references inspectores(id),
  puntaje_masa             numeric(5, 2) not null check (puntaje_masa between 0 and 20),
  puntaje_relleno          numeric(5, 2) not null check (puntaje_relleno between 0 and 20),
  puntaje_consistencia     numeric(5, 2) not null check (puntaje_consistencia between 0 and 15),
  puntaje_presentacion     numeric(5, 2) not null check (puntaje_presentacion between 0 and 15),
  puntaje_experiencia      numeric(5, 2) not null check (puntaje_experiencia between 0 and 15),
  puntaje_precio_valor     numeric(5, 2) not null check (puntaje_precio_valor between 0 and 15),
  mejor_atencion           boolean not null default false,
  mejor_staff              boolean not null default false,
  created_at               timestamptz not null default now(),

  unique (restaurant_id, inspector_id)
);

create index idx_jury_visits_restaurant_id on jury_visits (restaurant_id);
create index idx_jury_visits_inspector_id on jury_visits (inspector_id);

-- ============================================================
-- TABLA: event_config
-- ============================================================
create table event_config (
  clave       text primary key,
  valor       text not null,
  descripcion text,
  updated_at  timestamptz not null default now()
);

insert into event_config (clave, valor, descripcion) values
  ('cierre_inscripcion',      '2026-10-15', 'Cierre de inscripción (ambas modalidades)'),
  ('inicio_visitas_jurado',   '2026-10-20', 'Inicio de visitas de jurado'),
  ('fin_visitas_jurado',      '2026-11-15', 'Fin de visitas de jurado'),
  ('apertura_votacion',       '2026-11-09', 'Apertura de votación pública'),
  ('cierre_votacion',         '2026-11-15', 'Cierre de votación pública'),
  ('escrutinio',              '2026-11-15', 'Escrutinio y auditoría'),
  ('gala_final',              '2026-11-22', 'Gala final — revelación de reconocimientos');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table inspectores enable row level security;
alter table restaurants enable row level security;
alter table votes enable row level security;
alter table jury_visits enable row level security;
alter table event_config enable row level security;

-- lectura pública: la landing (mapa, galería, dropdown de voto) es anónima por diseño
create policy "restaurants_select_public"
  on restaurants for select
  to anon, authenticated
  using (true);

-- votes: inserción pública (anon) permitida — el control real de fraude ocurre
-- en la Server Action (Turnstile + rate limit), no en RLS.
create policy "votes_insert_anon"
  on votes for insert
  to anon, authenticated
  with check (true);

-- nadie lee votos vía cliente público — solo backend con service role
create policy "votes_no_select"
  on votes for select
  to anon, authenticated
  using (false);

-- jury_visits: un inspector solo ve/inserta sus propias visitas
create policy "jury_visits_select_own"
  on jury_visits for select
  to authenticated
  using (inspector_id = auth.uid());

create policy "jury_visits_insert_own"
  on jury_visits for insert
  to authenticated
  with check (inspector_id = auth.uid());

-- event_config: lectura pública, escritura solo admin (service role)
create policy "event_config_select_all"
  on event_config for select
  to anon, authenticated
  using (true);
