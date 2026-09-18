'use client'

import { useMemo, useState } from 'react'

interface RestauranteCard {
  id: string
  nombre: string
  provincia: string | null
  direccion: string | null
  logo_url: string | null
  instagram_url: string | null
}

export default function Galeria({
  restaurantes,
  onVotar,
}: {
  restaurantes: RestauranteCard[]
  onVotar: (restaurantId: string) => void
}) {
  const [filtro, setFiltro] = useState('todas')

  const provincias = useMemo(() => {
    const set = new Set(restaurantes.map((r) => r.provincia).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [restaurantes])

  const filtrados = useMemo(() => {
    if (filtro === 'todas') return restaurantes
    return restaurantes.filter((r) => r.provincia === filtro)
  }, [restaurantes, filtro])

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setFiltro('todas')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
            filtro === 'todas' ? 'bg-dorado text-marino' : 'bg-marino/10 text-marino'
          }`}
        >
          Todas
        </button>
        {provincias.map((p) => (
          <button
            key={p}
            onClick={() => setFiltro(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filtro === p ? 'bg-dorado text-marino' : 'bg-marino/10 text-marino'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p className="text-gray-500 text-center">No hay restaurantes para mostrar todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((r) => (
            <div key={r.id} className="bg-marino rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
              {r.instagram_url ? (
                <a
                  href={r.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                >
                  <RestauranteLogo r={r} />
                </a>
              ) : (
                <RestauranteLogo r={r} />
              )}

              <button
                onClick={() => onVotar(r.id)}
                className="mt-4 w-full bg-dorado hover:bg-dorado2 text-marino font-bold py-2 rounded-full transition text-sm"
              >
                Votar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RestauranteLogo({ r }: { r: RestauranteCard }) {
  return (
    <>
      <div className="w-20 h-20 rounded-full bg-marino2 flex items-center justify-center overflow-hidden mb-3">
        {r.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.logo_url} alt={r.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-celeste text-xs">Sin logo</span>
        )}
      </div>
      <h3 className="text-crema font-bold">{r.nombre}</h3>
      {r.direccion && <p className="text-sm text-celeste">{r.direccion}</p>}
    </>
  )
}
