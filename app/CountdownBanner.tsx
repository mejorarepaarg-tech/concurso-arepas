'use client'

import { useEffect, useState } from 'react'

function calcularRestante(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
    horas: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((diff / (1000 * 60)) % 60),
    segundos: Math.floor((diff / 1000) % 60),
    terminado: diff <= 0,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownBanner({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime()
  const [tiempo, setTiempo] = useState(() => calcularRestante(target))

  useEffect(() => {
    const interval = setInterval(() => setTiempo(calcularRestante(target)), 1000)
    return () => clearInterval(interval)
  }, [target])

  if (tiempo.terminado) {
    return (
      <div className="bg-rojo text-white text-center py-3 px-4 text-base sm:text-lg font-extrabold uppercase tracking-wide">
        ¡La mejor arepa del país se elige ahora! Entrá a votar
      </div>
    )
  }

  return (
    <div className="bg-rojo text-white text-center py-3 px-4 font-extrabold uppercase tracking-wide flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
      <span className="text-sm sm:text-lg">La mejor arepa del país se elige en:</span>
      <span className="font-mono tabular-nums normal-case tracking-normal text-lg sm:text-2xl animate-pulse">
        {tiempo.dias}d {pad(tiempo.horas)}:{pad(tiempo.minutos)}:{pad(tiempo.segundos)}
      </span>
    </div>
  )
}
