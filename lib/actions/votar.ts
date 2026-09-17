'use server'

import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { isRateLimited } from '@/lib/rate-limit'

export interface VotarState {
  status: 'idle' | 'ok' | 'error'
  message?: string
}

const TELEFONO_AR_REGEX = /^(\+?54)?\s?9?\s?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{4}$/
const MAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

async function validarTurnstile(token: string): Promise<boolean> {
  if (!token) return false

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!,
      response: token,
    }),
  })

  const data = await res.json()
  return data.success === true
}

export async function votar(_prev: VotarState, formData: FormData): Promise<VotarState> {
  const restaurantId = String(formData.get('restaurant_id') ?? '')
  const rating = Number(formData.get('rating') ?? 0)
  const comentario = String(formData.get('comentario') ?? '').trim()
  const nombre = String(formData.get('nombre') ?? '').trim()
  const telefono = String(formData.get('telefono') ?? '').trim()
  const mail = String(formData.get('mail') ?? '').trim().toLowerCase()
  const consentimiento = formData.get('consentimiento') === 'on'
  const turnstileToken = String(formData.get('cf-turnstile-response') ?? '')

  // Validación server-side — nunca confiar solo en el frontend.
  if (!restaurantId || !nombre || !telefono || !mail || !consentimiento || !comentario) {
    return { status: 'error', message: 'Completá todos los campos obligatorios.' }
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: 'error', message: 'Seleccioná una calificación de 1 a 5 estrellas.' }
  }
  if (!TELEFONO_AR_REGEX.test(telefono)) {
    return { status: 'error', message: 'El teléfono no tiene un formato válido.' }
  }
  if (!MAIL_REGEX.test(mail)) {
    return { status: 'error', message: 'El mail no tiene un formato válido.' }
  }

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const userAgent = h.get('user-agent') ?? 'unknown'

  // Rate limit por IP: tope conservador, el voto es un evento poco frecuente por persona.
  if (isRateLimited(ip, 'votar', { windowSecs: 60, maxRequests: 5 })) {
    return { status: 'error', message: 'Demasiados intentos. Probá de nuevo en un minuto.' }
  }

  // Capa 1 — Cloudflare Turnstile. Si falla, rechazo silencioso (mensaje genérico).
  const turnstileValidated = await validarTurnstile(turnstileToken)
  if (!turnstileValidated) {
    return { status: 'error', message: 'No pudimos validar tu voto. Intentá de nuevo.' }
  }

  const admin = createAdminClient()

  // Capa 2 — deduplicación a nivel de todo el evento (constraint único en DB).
  const { error } = await admin.from('votes').insert({
    restaurant_id: restaurantId,
    rating,
    comentario,
    nombre,
    telefono,
    mail,
    consentimiento,
    ip,
    user_agent: userAgent,
    turnstile_validated: turnstileValidated,
  } as Record<string, unknown>)

  if (error) {
    if (error.code === '23505') {
      return { status: 'error', message: 'Ya registramos tu voto.' }
    }
    return { status: 'error', message: 'No pudimos registrar tu voto. Intentá de nuevo.' }
  }

  return { status: 'ok', message: '¡Voto registrado, gracias!' }
}
