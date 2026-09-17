-- ============================================================
-- Migración: logo e Instagram del restaurante para la tarjeta
-- de la galería (click en la tarjeta redirige a Instagram).
-- Correr en el SQL Editor de Supabase sobre la base ya creada.
-- ============================================================

alter table restaurants
  add column if not exists logo_url      text,
  add column if not exists instagram_url text;
