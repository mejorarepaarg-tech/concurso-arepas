-- ============================================================
-- Migración: nuevas fechas del evento (movido a noviembre 2026)
-- Referencia: Concurso/concurso.md sección 1 (actualizada)
-- Correr en el SQL Editor de Supabase sobre la base ya creada.
-- ============================================================

update event_config set valor = '2026-10-15', updated_at = now() where clave = 'cierre_inscripcion';
update event_config set valor = '2026-10-20', updated_at = now() where clave = 'inicio_visitas_jurado';
update event_config set valor = '2026-11-15', updated_at = now() where clave = 'fin_visitas_jurado';
update event_config set valor = '2026-11-09', updated_at = now() where clave = 'apertura_votacion';
update event_config set valor = '2026-11-15', updated_at = now() where clave = 'cierre_votacion';
update event_config set valor = '2026-11-15', updated_at = now() where clave = 'escrutinio';
update event_config set valor = '2026-11-22', updated_at = now() where clave = 'gala_final';
