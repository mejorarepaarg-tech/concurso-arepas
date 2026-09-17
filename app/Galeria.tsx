'use client'

import { useMemo, useState } from 'react'

interface RestauranteCard {
  id: string
  nombre: string
  provincia: string | null
  ciudad: string | null
  foto_arepa_url: string | null
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
            filtro === 'todas' ? 'bg-dorado text-marino' : 'bg-white/10 text-crema'
          }`}
        >
          Todas
        </button>
        {provincias.map((p) => (
          <button
            key={p}
            onClick={() => setFiltro(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filtro === p ? 'bg-dorado text-marino' : 'bg-white/10 text-crema'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p className="text-celeste text-center">No hay restaurantes para mostrar todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map((r) => (
            <div key={r.id} className="bg-crema rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="aspect-video bg-marino2 flex items-center justify-center">
                {r.foto_arepa_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.foto_arepa_url} alt={r.nombre} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-celeste text-sm">Sin foto</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-marino font-bold">{r.nombre}</h3>
                {r.ciudad && <p className="text-sm text-gray-500">{r.ciudad}</p>}
                <button
                  onClick={() => onVotar(r.id)}
                  className="mt-auto pt-4 text-dorado font-semibold text-sm hover:underline text-left"
                >
                  Votar →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
