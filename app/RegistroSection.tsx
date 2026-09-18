'use client'

import { useState } from 'react'

const FORMULARIOS = {
  restaurante: {
    label: 'Anotá tu restaurante',
    url: 'https://forms.gle/AYSjwJ8878pCLsxx7',
  },
  emprendedor: {
    label: 'Soy emprendedor',
    url: 'https://forms.gle/Y8hNAj6ipk5ahf7j7',
  },
} as const

type Tipo = keyof typeof FORMULARIOS

export default function RegistroSection() {
  const [tipo, setTipo] = useState<Tipo>('restaurante')

  return (
    <div>
      <div className="flex justify-center gap-2 mb-6">
        {(Object.keys(FORMULARIOS) as Tipo[]).map((key) => (
          <button
            key={key}
            onClick={() => setTipo(key)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition ${
              tipo === key ? 'bg-dorado text-marino' : 'bg-white/10 text-crema'
            }`}
          >
            {FORMULARIOS[key].label}
          </button>
        ))}
      </div>

      <div className="bg-crema rounded-2xl shadow-xl overflow-hidden">
        <iframe
          key={tipo}
          src={FORMULARIOS[tipo].url}
          title={FORMULARIOS[tipo].label}
          className="w-full h-[900px] border-0"
        >
          Cargando…
        </iframe>
      </div>

      <p className="text-celeste text-sm text-center mt-4">
        ¿El formulario no carga?{' '}
        <a
          href={FORMULARIOS[tipo].url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
        >
          Abrilo en una pestaña nueva
        </a>
      </p>
    </div>
  )
}
