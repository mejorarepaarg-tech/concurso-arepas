'use client'

import { useRef, useState } from 'react'
import Galeria from './Galeria'
import VotoForm from './VotoForm'

interface Restaurant {
  id: string
  nombre: string
  provincia: string | null
  ciudad: string | null
  foto_arepa_url: string | null
}

export default function VotacionSection({ restaurants }: { restaurants: Restaurant[] }) {
  const [selectedId, setSelectedId] = useState('')
  const formRef = useRef<HTMLDivElement>(null)

  function handleVotar(id: string) {
    setSelectedId(id)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="px-4 pb-16">
        <h2 className="text-crema text-2xl font-bold text-center mb-8">
          Restaurantes participantes
        </h2>
        <Galeria restaurantes={restaurants} onVotar={handleVotar} />
      </section>

      <section ref={formRef} className="px-4 pb-20 scroll-mt-6">
        <div className="w-full max-w-md mx-auto bg-crema rounded-2xl shadow-xl p-8">
          <h2 className="text-marino text-xl font-bold text-center mb-6">
            Registrá tu voto
          </h2>
          <VotoForm
            restaurants={restaurants}
            selectedRestaurantId={selectedId}
            onSelectRestaurant={setSelectedId}
          />
        </div>
      </section>
    </>
  )
}
