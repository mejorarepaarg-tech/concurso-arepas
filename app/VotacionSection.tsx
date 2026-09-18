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
}: {
  restaurants: Restaurant[]
  votacionAbierta: boolean
}) {
  return (
    <>
      {/* Sección 3 — Galería: fondo blanco, tarjetas azul oscuro */}
      <section className="bg-crema px-4 py-16">
        <h2 className="text-marino text-2xl font-bold text-center mb-8">
          Restaurantes participantes
        </h2>
        <Galeria restaurantes={restaurants} />
      </section>

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
              La votación pública todavía no abrió. Mientras tanto, anotate
              para participar.
            </p>
            <RegistroSection />
          </div>
        )}
      </section>
    </>
  )
}
