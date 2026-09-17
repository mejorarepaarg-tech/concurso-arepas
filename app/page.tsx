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
      <section className="flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-dorado font-bold tracking-wide uppercase text-sm">
          Concurso Mejor Arepa de Argentina 2026
        </p>
        <h1 className="text-crema text-3xl md:text-5xl font-bold mt-3 max-w-2xl">
          Elegí tu Favorito del Público
        </h1>
        <p className="text-celeste mt-4 max-w-xl">
          Probá, calificá y dejá tu reseña. Votá una sola vez por el restaurante
          que preparó tu arepa favorita. El resultado se revela en la Gala final.
        </p>
      </section>

      {/* Mapa nacional */}
      <section className="px-4 pb-16 max-w-4xl mx-auto">
        <Mapa restaurantes={pinesMapa} />
      </section>

      {/* Galería + votación */}
      <VotacionSection restaurants={todos} />

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
