'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix del ícono default de Leaflet, roto por cómo Next.js empaqueta assets.
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface RestaurantePin {
  id: string
  nombre: string
  ciudad: string | null
  latitud: number
  longitud: number
}

// Centro aproximado de Argentina.
const CENTRO_ARGENTINA: [number, number] = [-38.4161, -63.6167]

export default function Mapa({ restaurantes }: { restaurantes: RestaurantePin[] }) {
  return (
    <MapContainer
      center={CENTRO_ARGENTINA}
      zoom={4}
      scrollWheelZoom={false}
      className="w-full h-[400px] rounded-2xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurantes.map((r) => (
        <Marker key={r.id} position={[r.latitud, r.longitud]} icon={icon}>
          <Popup>
            <strong>{r.nombre}</strong>
            {r.ciudad && <div>{r.ciudad}</div>}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
