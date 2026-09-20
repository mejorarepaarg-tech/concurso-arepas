'use client'

import { useEffect, useState } from 'react'

const SLIDES = [
  { src: '/morixe-arepa-1.png', caption: 'Harina de maíz blanco, para arepas clásicas', fit: 'contain' },
  { src: '/morixe-arepa-2.png', caption: 'Harina de maíz amarillo, sabor tradicional', fit: 'contain' },
  { src: '/morixe-asado-1.jfif', caption: 'Ideal para acompañar tus asados con amigos', fit: 'cover' },
  { src: '/morixe-cena-1.png', caption: 'El complemento perfecto para compartir en familia', fit: 'cover' },
] as const

export default function MorixeCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-crema">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.caption}
            className={`w-full h-full ${slide.fit === 'contain' ? 'object-contain p-8' : 'object-cover'}`}
          />
          <div className="absolute bottom-0 inset-x-0 bg-marino/80 text-crema text-center text-sm sm:text-base font-semibold px-4 py-3">
            {slide.caption}
          </div>
        </div>
      ))}
    </div>
  )
}
