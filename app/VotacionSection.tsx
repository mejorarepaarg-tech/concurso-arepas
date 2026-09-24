import Galeria from './Galeria'
import VotoForm from './VotoForm'
import RegistroSection from './RegistroSection'

interface Restaurant {
  id: string
  nombre: string
  provincia: string | null
  direccion: string | null
  logo_url: string | null
  instagram_url: string | null
}

export default function VotacionSection({
  restaurants,
  votacionAbierta,
  cierreInscripcion,
  mostrarRestaurantes,
}: {
  restaurants: Restaurant[]
  votacionAbierta: boolean
  cierreInscripcion: string
  mostrarRestaurantes: boolean
}) {
  const fechaCierre = new Date(`${cierreInscripcion}T00:00:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
  })

  return (
    <>
      {/* Sección 3 — Galería: fondo blanco, tarjetas azul oscuro.
          Oculta hasta sumar ~10 restaurantes reales (ver event_config.mostrar_restaurantes),
          para no mostrar una lista muy corta durante el arranque de las inscripciones. */}
      {mostrarRestaurantes && (
        <section className="bg-crema px-4 py-16">
          <h2 className="text-marino text-2xl font-bold text-center mb-8">
            Restaurantes participantes
          </h2>
          <Galeria restaurantes={restaurants} />
        </section>
      )}

      {/* Sección 4 — Voto (si ya abrió) o inscripción (mientras tanto). Fondo azul oscuro. */}
      <section className="bg-marino px-4 py-16 md:py-20 scroll-mt-6">
        {votacionAbierta ? (
          <div className="w-full max-w-md mx-auto bg-crema rounded-2xl shadow-xl p-8">
            <h2 className="text-marino text-xl font-bold text-center mb-6">
              Registrá tu voto
            </h2>
            <VotoForm restaurants={restaurants} />
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto">
            <h2 className="text-crema text-2xl font-bold text-center mb-2">
              Sumate al concurso
            </h2>
            <p className="text-celeste text-center mb-8">
              Las inscripciones cierran el {fechaCierre}: anotate antes de esa
              fecha para asegurar tu lugar en el concurso gastronómico más
              grande del año.
            </p>
            <RegistroSection />
          </div>
        )}
      </section>
    </>
  )
}
