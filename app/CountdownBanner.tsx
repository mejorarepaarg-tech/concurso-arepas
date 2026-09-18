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
        ¡La votación ya está abierta! Elegí la mejor arepa del país
      </div>
    )
  }

  return (
    <div className="bg-dorado text-marino py-2 px-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-bold uppercase tracking-wide">
      <span>
        Faltan {tiempo.dias} día{tiempo.dias === 1 ? '' : 's'} para elegir la mejor arepa del país
      </span>
      <span className="font-mono tabular-nums normal-case tracking-normal">
        {pad(tiempo.horas)}:{pad(tiempo.minutos)}:{pad(tiempo.segundos)}
      </span>
    </div>
  )
}
