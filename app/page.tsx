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
      {/* Hero — pantalla completa, imagen a sangre como referencia tuliorecomienda.com */}
      <section className="relative h-screen w-full overflow-hidden flex items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-evento.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-marino via-marino/90 to-marino/40" />

        <div className="relative z-10 px-6 md:px-16 max-w-2xl">
          <p className="text-dorado font-bold tracking-wide uppercase text-sm">
            Concurso Mejor Arepa de Argentina 2026
          </p>
          <h1 className="text-crema text-5xl md:text-7xl font-extrabold mt-3 leading-none">
            Elegí tu Favorito del Público
          </h1>
          <p className="text-celeste mt-6 max-w-md text-lg">
            Probá, calificá y dejá tu reseña. Votá una sola vez por el restaurante
            que preparó tu arepa favorita. El resultado se revela en la Gala final.
          </p>
          <a
            href="#votar"
            className="inline-block mt-8 bg-dorado hover:bg-dorado2 text-marino font-bold px-8 py-3 rounded-full transition"
          >
            Votar ahora
          </a>
        </div>
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
