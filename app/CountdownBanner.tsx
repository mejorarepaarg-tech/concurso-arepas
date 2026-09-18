'use client'

import { useEffect, useState } from 'react'

function calcularRestante(target: number) {
  const diff = Math.max(0, target - Date.now())
  return {
    dias: Math.ceil(diff / (1000 * 60 * 60 * 24)),
    terminado: diff <= 0,
  }
}

export default function CountdownBanner({ targetDate }: { targetDate: string }) {
  const target = new Date(targetDate).getTime()
  const [tiempo, setTiempo] = useState(() => calcularRestante(target))

  useEffect(() => {
    const interval = setInterval(() => setTiempo(calcularRestante(target)), 1000 * 30)
    return () => clearInterval(interval)
  }, [target])

  const mensaje = tiempo.terminado
    ? '¡La votación ya está abierta! Elegí la mejor arepa del país'
    : `Faltan ${tiempo.dias} día${tiempo.dias === 1 ? '' : 's'} para elegir la mejor arepa del país`

  return (
    <div className="bg-dorado text-marino text-center py-2 px-4 text-sm font-bold uppercase tracking-wide">
      {mensaje}
    </div>
  )
}
