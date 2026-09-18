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

export default function Galeria({ restaurantes }: { restaurantes: RestauranteCard[] }) {
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtrados.map((r) => (
            <RestauranteCardItem key={r.id} r={r} />
          ))}
        </div>
      )}
    </div>
  )
}

function RestauranteCardItem({ r }: { r: RestauranteCard }) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {r.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={r.logo_url} alt={r.nombre} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs text-center">Sin logo</span>
        )}
      </div>
      <h3 className="text-marino font-bold mt-4">{r.nombre}</h3>
      {r.direccion && <p className="text-sm text-gray-500 mt-1">{r.direccion}</p>}
    </div>
  )

  if (r.instagram_url) {
    return (
      <a href={r.instagram_url} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    )
  }

  return content
}
