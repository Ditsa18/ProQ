'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getServiceRequests } from '@/lib/api/serviceRequests'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export type MapServiceRequest = {
  id: string
  title: string
  priority: string
  status: string
  locationName: string
  time: string
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lng], 12) }, [lat, lng, map])
  return null
}

interface Props {
  requests: MapServiceRequest[]
  setRequests: (r: MapServiceRequest[]) => void
  selected: MapServiceRequest | null
  setSelected: (r: MapServiceRequest) => void
}

export default function MapView({ requests, setRequests, selected, setSelected }: Props) {

  useEffect(() => {
    getServiceRequests()
      .then((data) => {
        const mapped: MapServiceRequest[] = data.map((r) => ({
          id: r.id,
          title: r.serviceType || "Service Request",
          priority: r.priority,
          status: r.status,
          locationName: r.location,
          time: new Date(r.createdAt).toLocaleString(),
        }))
        setRequests(mapped)
      })
      .catch(() => setRequests([]))
  }, [setRequests])

  const MARKER_COLOR: Record<string, string> = {
    urgent: '#e53e3e', high: '#dd6b20', normal: '#805ad5',
    low: '#38a169', P2: '#3182ce', P3: '#00b5d8', P4: '#718096',
  }

  const defaultCenter: [number, number] = [22.5937, 78.9629]

  return (
    <MapContainer center={defaultCenter} zoom={5} className="h-full w-full">
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {selected && <FlyTo lat={defaultCenter[0]} lng={defaultCenter[1]} />}
    </MapContainer>
  )
}
