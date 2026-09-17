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
      {/* Hero */}
      <section className="px-6 md:px-16 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div className="text-center md:text-left">
          <p className="text-dorado font-bold tracking-wide uppercase text-sm">
            Concurso Mejor Arepa de Argentina 2026
          </p>
          <h1 className="text-crema text-4xl md:text-6xl font-extrabold mt-3 leading-tight">
            Elegí tu Favorito del Público
          </h1>
          <p className="text-celeste mt-5 max-w-md mx-auto md:mx-0">
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
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-evento.jpg"
            alt="Concurso Mejor Arepa de Argentina 2026"
            className="w-full max-w-sm rounded-3xl shadow-2xl"
          />
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
