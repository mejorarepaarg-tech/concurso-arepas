-- ============================================================
-- Migración 006 — Flag para mostrar/ocultar mapa + galería
-- de restaurantes participantes.
-- Correr en el SQL Editor de Supabase.
-- ============================================================

insert into event_config (clave, valor, descripcion) values
  ('mostrar_restaurantes', 'false', 'Mostrar mapa y galería de restaurantes en la landing (se activa manualmente al llegar a ~10 restaurantes cargados)')
on conflict (clave) do nothing;

-- Para reactivar el mapa y la galería más adelante, correr:
-- update event_config set valor = 'true' where clave = 'mostrar_restaurantes';
