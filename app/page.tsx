import nextDynamic from 'next/dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import VotacionSection from './VotacionSection'
import CountdownBanner from './CountdownBanner'
import ArepaCarousel from './ArepaCarousel'
import MorixeCarousel from './MorixeCarousel'

// La home lee datos en vivo (restaurantes, fechas de event_config) y calcula
// votacionAbierta con la hora del servidor: debe renderizarse en cada request,
// no congelarse en build time.
export const dynamic = 'force-dynamic'

const Mapa = nextDynamic(() => import('./Mapa'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-2xl bg-marino2 animate-pulse" />
  ),
})

export default async function HomePage() {
  // Lectura server-side con service role: la tabla `restaurants` NO es legible
  // por el cliente anónimo (ver migración 005) para no exponer columnas internas
  // (pago_nota, habilitacion_bromatologica, etc.) vía la REST API pública.
  const supabase = createAdminClient()
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

  const { data: configRows } = await supabase
    .from('event_config')
    .select('clave, valor')
    .in('clave', ['apertura_votacion', 'cierre_inscripcion', 'mostrar_restaurantes'])
  const configMap = Object.fromEntries((configRows ?? []).map((r) => [r.clave, r.valor]))
  const aperturaVotacion = configMap.apertura_votacion ?? '2026-11-09'
  const cierreInscripcion = configMap.cierre_inscripcion ?? '2026-10-15'
  const votacionAbierta = Date.now() >= new Date(aperturaVotacion).getTime()
  // Ocultamos mapa + galería hasta juntar ~10 restaurantes reales, para no
  // mostrar una lista muy corta apenas arranca la etapa de inscripciones.
  // Se reactiva cambiando este valor en event_config, sin necesidad de deploy.
  const mostrarRestaurantes = configMap.mostrar_restaurantes === 'true'

  return (
    <main className="min-h-screen">
      {/* Banner + Hero ocupan juntos una pantalla completa en todos los
          tamaños — solo el hero debe verse al cargar, sin que se asome
          la sección siguiente. */}
      <div className="h-screen flex flex-col">
        <CountdownBanner targetDate={aperturaVotacion} />

        {/* Mobile: imagen unica ya compuesta (isotipo + Presentado por + los 3 logos) */}
        <section className="flex-1 min-h-0 w-full bg-crema flex items-center justify-center px-6 md:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/fondo-mobile.png"
            alt="Concurso Mejor Arepa de Argentina 2026 — Presentado por Feor, Morixe y Secretaría de Cultura"
            className="w-full h-full object-contain"
          />
        </section>

        {/* Desktop: logo completo con todo el texto ya incluido */}
        <section className="hidden md:flex flex-1 min-h-0 w-full bg-crema items-center justify-center px-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-evento-2.png"
            alt="Concurso Mejor Arepa de Argentina 2026 — Presentado por Feor, Morixe y Secretaría de Cultura"
            className="w-full h-full object-contain"
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

      {/* Sección 3 — Mapa: fondo azul oscuro, descripción a la izquierda, mapa a la derecha.
          Oculta hasta sumar ~10 restaurantes reales (ver event_config.mostrar_restaurantes). */}
      {mostrarRestaurantes && (
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
      )}

      {/* Sección — El ingrediente Morixe, parte central de la descripción del evento. Fondo blanco. */}
      <section className="bg-crema px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <p className="text-dorado font-bold tracking-wide uppercase text-sm">
              La base de cada arepa
            </p>
            <h2 className="text-marino text-3xl md:text-4xl font-extrabold mt-3 leading-tight">
              El ingrediente que lo hace posible
            </h2>
            <p className="text-gray-600 mt-5 max-w-xl mx-auto md:mx-0">
              Cada arepa que se prueba en este concurso nace del mismo punto de
              partida: harina de maíz Morixe. Detrás de la competencia, del
              jurado, y de cada voto del público, hay un ingrediente en común
              que atraviesa todas las cocinas participantes. Por eso Morixe no
              solo presenta el Concurso Mejor Arepa de Argentina: es parte de
              la receta.
            </p>
          </div>

          <MorixeCarousel />
        </div>
      </section>

      {/* Sección 3 (galería) y 4 (voto) */}
      <div id="votar">
        <VotacionSection
          restaurants={todos}
          votacionAbierta={votacionAbierta}
          cierreInscripcion={cierreInscripcion}
          mostrarRestaurantes={mostrarRestaurantes}
        />
      </div>

      {/* Footer — fondo blanco, sponsor y organizadores lado a lado (siempre en fila) */}
      <footer className="bg-crema px-6 sm:px-12 py-12 border-t border-gray-200 flex flex-row flex-wrap items-start justify-between gap-8 sm:gap-12 max-w-4xl mx-auto w-full">
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wide">Presentado por</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/morixe-isologo.png" alt="Morixe, desde 1901" className="h-16 sm:h-24 object-contain" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-wide">Organizado por</p>
          <div className="flex items-center gap-6 sm:gap-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-feor.png" alt="Feor" className="h-16 sm:h-24" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/secretaria.png" alt="Secretaría de Cultura, Deportivo Venezolano" className="h-16 sm:h-24" />
          </div>
        </div>
      </footer>
    </main>
  )
}
