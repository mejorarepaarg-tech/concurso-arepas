'use client'

import { useEffect, useState } from 'react'

export default function ArepaCarousel({ fotos }: { fotos: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (fotos.length < 2) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % fotos.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [fotos.length])

  if (fotos.length === 0) {
    return (
      <div className="w-full aspect-square rounded-3xl bg-marino2 flex items-center justify-center">
        <span className="text-celeste text-sm">Próximamente: fotos de las arepas</span>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl">
      {fotos.map((foto, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={foto}
          src={foto}
          alt="Arepa participante"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
