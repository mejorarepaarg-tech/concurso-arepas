import Galeria from './Galeria'
import VotoForm from './VotoForm'

interface Restaurant {
  id: string
  nombre: string
  provincia: string | null
  direccion: string | null
  logo_url: string | null
  instagram_url: string | null
}

export default function VotacionSection({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <>
      {/* Sección 3 — Galería: fondo blanco, tarjetas azul oscuro */}
      <section className="bg-crema px-4 py-16">
        <h2 className="text-marino text-2xl font-bold text-center mb-8">
          Restaurantes participantes
        </h2>
        <Galeria restaurantes={restaurants} />
      </section>

      {/* Sección 4 — Formulario de voto: fondo azul oscuro */}
      <section className="bg-marino px-4 py-16 md:py-20 scroll-mt-6">
        <div className="w-full max-w-md mx-auto bg-crema rounded-2xl shadow-xl p-8">
          <h2 className="text-marino text-xl font-bold text-center mb-6">
            Registrá tu voto
          </h2>
          <VotoForm restaurants={restaurants} />
        </div>
      </section>
    </>
  )
}
