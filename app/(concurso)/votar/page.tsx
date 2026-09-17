import { createClient } from '@/lib/supabase/server'
import VotoForm from './VotoForm'

export default async function VotarPage() {
  const supabase = await createClient()
  // Todos los restaurantes compiten por Favorito del Público, incluida la
  // categoría delivery (sección 3 del spec) — sin distinción visual para el votante.
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, nombre')
    .order('nombre', { ascending: true })

  return (
    <main className="min-h-screen bg-marino">
      {/* Hero / landing */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-dorado font-bold tracking-wide uppercase text-sm">
          Concurso Mejor Arepa de Argentina 2026
        </p>
        <h1 className="text-crema text-3xl md:text-5xl font-bold mt-3 max-w-2xl">
          Elegí tu Favorito del Público
        </h1>
        <p className="text-celeste mt-4 max-w-xl">
          Votá una sola vez por el restaurante que preparó tu arepa favorita.
          El resultado se revela en la Gala final.
        </p>
      </section>

      {/* Sección de votación */}
      <section className="px-4 pb-20">
        <div className="w-full max-w-md mx-auto bg-crema rounded-2xl shadow-xl p-8">
          <h2 className="text-marino text-xl font-bold text-center mb-6">
            Registrá tu voto
          </h2>
          <VotoForm restaurants={restaurants ?? []} />
        </div>
      </section>
    </main>
  )
}
