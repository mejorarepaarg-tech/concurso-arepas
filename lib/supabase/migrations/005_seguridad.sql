-- ============================================================
-- Migración 005 — Fixes de seguridad
-- Correr en el SQL Editor de Supabase sobre la base ya creada.
-- Referencia: análisis de seguridad (sept 2026).
-- ============================================================

-- ------------------------------------------------------------
-- CRÍTICO 1 — Bloquear inserción de votos con la anon key.
--
-- La anon key está incrustada en el bundle del navegador, así que
-- cualquiera podía hacer POST directo a /rest/v1/votes salteándose
-- el Server Action (y con él Turnstile + rate limit + dedup).
-- Se elimina la policy de insert para anon/authenticated: a partir
-- de acá el ÚNICO camino para insertar votos es el Server Action,
-- que usa la service_role key (bypassa RLS) del lado del servidor.
-- ------------------------------------------------------------
drop policy if exists "votes_insert_anon" on votes;

-- (No se crea policy de insert: con RLS activo y sin policy, anon y
--  authenticated quedan denegados. service_role sigue funcionando
--  porque bypassa RLS.)

-- ------------------------------------------------------------
-- CRÍTICO 2 — Límite de longitud en los campos de texto de votes,
-- por si algún día se reabre un camino de escritura directa.
-- ------------------------------------------------------------
alter table votes
  add constraint chk_votes_comentario_len check (char_length(comentario) <= 500),
  add constraint chk_votes_nombre_len     check (char_length(nombre) <= 80),
  add constraint chk_votes_telefono_len   check (char_length(telefono) <= 30),
  add constraint chk_votes_mail_len       check (char_length(mail) <= 120);

-- ------------------------------------------------------------
-- MEDIO 3 — Dejar de exponer columnas internas de `restaurants`
-- (pago_nota, pago_en_especie, habilitacion_bromatologica,
-- opt_in_leaderboard, qr_code_url) a través de la REST API pública.
--
-- Se revoca la lectura anónima de la tabla. La landing ya no la lee
-- con la anon key: page.tsx pasó a leerla server-side con service
-- role (que bypassa RLS). Ningún componente cliente consulta esta
-- tabla directamente, así que esto no rompe nada en el front.
-- ------------------------------------------------------------
drop policy if exists "restaurants_select_public" on restaurants;

-- (Si en el futuro se necesita lectura pública de SOLO columnas
--  seguras, crear una vista `restaurants_public` con esas columnas
--  y darle grant a anon, en vez de reabrir la tabla completa.)
