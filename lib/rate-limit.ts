interface RateLimitEntry {
  count:    number
  resetAt:  number
}

// In-memory store — se resetea con cada cold start (apropiado para Vercel Serverless)
const store = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  /** Ventana de tiempo en segundos */
  windowSecs: number
  /** Máximo de requests por ventana */
  maxRequests: number
}

/**
 * Devuelve `true` si la IP superó el límite, `false` si está OK.
 */
export function isRateLimited(ip: string, key: string, opts: RateLimitOptions): boolean {
  const now    = Date.now()
  const mapKey = `${key}:${ip}`
  const entry  = store.get(mapKey)

  if (!entry || now > entry.resetAt) {
    store.set(mapKey, { count: 1, resetAt: now + opts.windowSecs * 1000 })
    return false
  }

  entry.count++
  if (entry.count > opts.maxRequests) return true

  return false
}

/** Helper para extraer la IP del request en Next.js */
export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}
