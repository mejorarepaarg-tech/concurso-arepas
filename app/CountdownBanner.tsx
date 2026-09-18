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
      <div className="bg-dorado text-marino text-center py-2 px-4 text-sm font-bold uppercase tracking-wide">
        ¡La mejor arepa del país se elige ahora! Entrá a votar
      </div>
    )
  }

  return (
    <div className="bg-dorado text-marino text-center py-2 px-4 text-sm font-bold uppercase tracking-wide">
      La mejor arepa del país se elige en:{' '}
      <span className="font-mono tabular-nums normal-case tracking-normal">
        {tiempo.dias}d {pad(tiempo.horas)}:{pad(tiempo.minutos)}:{pad(tiempo.segundos)}
      </span>
    </div>
  )
}
