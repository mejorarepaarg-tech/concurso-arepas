import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import VotacionSection from './VotacionSection'

const Mapa = dynamic(() => import('./Mapa'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-marino2 animate-pulse" />
  ),
})

export default async function HomePage() {
  const supabase = await createClient()
  // Todos los restaurantes compiten por Favorito del Público, incluida la
  // categoría delivery (sección 3 del spec) — sin distinción visual para el votante.
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, nombre, provincia, ciudad, direccion, logo_url, instagram_url, latitud, longitud, category')
    .order('nombre', { ascending: true })

  const todos = restaurants ?? []
  // El mapa solo muestra locales presenciales con coordenadas cargadas.
  const pinesMapa = todos.filter(
    (r) => r.category === 'presencial' && r.latitud !== null && r.longitud !== null
  ) as { id: string; nombre: string; ciudad: string | null; latitud: number; longitud: number }[]

  return (
    <main className="min-h-screen bg-marino">
      {/* Hero — pantalla completa, solo el logo del evento. El fondo de la
          sección es blanco (crema), igual al fondo propio del PNG, por eso
          object-contain no deja ninguna costura visible aunque el logo sea
          más ancho que alto y el hero sea h-screen. */}
      <section className="h-screen w-full bg-crema flex items-center justify-center px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-evento-blanco.png"
          alt="Concurso Mejor Arepa de Argentina 2026 — Presentado por Morixe"
          className="w-full h-full object-contain"
        />
      </section>

      {/* Mapa nacional — sección clara, alterna el ritmo visual */}
      <section className="bg-crema px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-marino text-2xl font-bold text-center mb-8">
            Restaurantes en todo el país
          </h2>
          <Mapa restaurantes={pinesMapa} />
        </div>
      </section>

      {/* Galería + votación */}
      <div id="votar">
        <VotacionSection restaurants={todos} />
      </div>

      {/* Footer — sponsor */}
      <footer className="px-4 py-10 border-t border-white/10 flex flex-col items-center gap-3">
        <p className="text-celeste text-sm uppercase tracking-wide">Presentado por</p>
        <div className="bg-crema rounded-lg px-4 py-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/morixe-logo.png" alt="Morixe, desde 1901" className="h-8" />
        </div>
      </footer>
    </main>
  )
}
