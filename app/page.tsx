import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/server'
import VotacionSection from './VotacionSection'
import CountdownBanner from './CountdownBanner'
import ArepaCarousel from './ArepaCarousel'

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
    .select('id, nombre, provincia, ciudad, direccion, logo_url, instagram_url, foto_arepa_url, latitud, longitud, category')
    .order('nombre', { ascending: true })

  const todos = restaurants ?? []
  const fotosArepas = todos
    .map((r) => r.foto_arepa_url)
    .filter((url): url is string => Boolean(url))
  // El mapa solo muestra locales presenciales con coordenadas cargadas.
  const pinesMapa = todos.filter(
    (r) => r.category === 'presencial' && r.latitud !== null && r.longitud !== null
  ) as { id: string; nombre: string; ciudad: string | null; latitud: number; longitud: number }[]

  const { data: config } = await supabase
    .from('event_config')
    .select('valor')
    .eq('clave', 'apertura_votacion')
    .single()
  const aperturaVotacion = config?.valor ?? '2026-11-09'

  return (
    <main className="min-h-screen">
      {/* Banner + Hero. En desktop ocupan juntos una pantalla completa;
          en mobile el logo es muy panorámico para forzar el mismo alto
          sin dejar espacio vacío, así que el hero toma una altura
          natural en base al ancho disponible. */}
      <div className="md:h-screen flex flex-col">
        <CountdownBanner targetDate={aperturaVotacion} />

        <section className="flex-1 min-h-0 w-full bg-crema flex items-center justify-center px-6 py-10 md:py-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-evento-blanco.png"
            alt="Concurso Mejor Arepa de Argentina 2026 — Presentado por Morixe"
            className="w-full max-w-md md:max-w-none md:h-full object-contain"
          />
        </section>
      </div>

      {/* Sección 2 — Descripción + fechas a la izquierda, carrusel de arepas a la derecha. Fondo azul oscuro. */}
      <section className="bg-marino px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <p className="text-dorado font-bold tracking-wide uppercase text-sm">
              Del plato a la gloria
            </p>
            <h2 className="text-crema text-3xl md:text-4xl font-extrabold mt-3 leading-tight">
              Restaurantes de todo el país compiten por el título de
              Mejor Arepa de Argentina
            </h2>
            <p className="text-celeste mt-5 max-w-xl mx-auto md:mx-0">
              Probá las mejores arepas de tu ciudad, calificá tu favorita y sé
              parte del jurado que define quién se corona campeón. Todo se
              define en una sola semana.
            </p>
            <div className="mt-10 inline-block border-2 border-dorado rounded-2xl px-6 py-4 md:px-10 md:py-6">
              <p className="text-dorado text-3xl md:text-5xl font-extrabold tracking-tight text-center">
                9 AL 15 DE NOVIEMBRE
              </p>
            </div>
          </div>

          <ArepaCarousel fotos={fotosArepas} />
        </div>
      </section>

      {/* Sección 3 — Mapa: fondo azul oscuro, descripción a la izquierda, mapa a la derecha */}
      <section className="bg-marino px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-crema text-3xl md:text-4xl font-extrabold leading-tight">
              Un Concurso Federal
            </h2>
            <p className="text-celeste mt-4 max-w-md mx-auto md:mx-0">
              Recorré el mapa y descubrí los restaurantes que compiten este año
              por el título de Mejor Arepa de Argentina. Elegí el más cercano
              a vos, probá su arepa y no te olvides de dejar tu voto.
            </p>
            <a
              href="#votar"
              className="inline-block mt-8 bg-dorado hover:bg-dorado2 text-marino font-bold px-8 py-3 rounded-full transition"
            >
              Ver participantes
            </a>
          </div>
          <Mapa restaurantes={pinesMapa} />
        </div>
      </section>

      {/* Sección 3 (galería) y 4 (voto) */}
      <div id="votar">
        <VotacionSection restaurants={todos} />
      </div>

      {/* Footer — fondo blanco, sponsor(s) */}
      <footer className="bg-crema px-4 py-10 border-t border-gray-200 flex flex-col items-center gap-3">
        <p className="text-gray-500 text-sm uppercase tracking-wide">Presentado por</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/morixe-logo.png" alt="Morixe, desde 1901" className="h-8" />
      </footer>
    </main>
  )
}
