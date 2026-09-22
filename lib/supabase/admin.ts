import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      // Fuerza no-store explícito: Next.js parchea el fetch global para
      // cachear por defecto, y aunque `force-dynamic` debería desactivarlo,
      // no queremos depender de esa heurística para datos que cambian
      // (restaurantes, fechas). Sin esto se vieron respuestas obsoletas.
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: 'no-store' }),
      },
    }
  )
}
