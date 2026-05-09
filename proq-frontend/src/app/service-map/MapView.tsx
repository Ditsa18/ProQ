'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

type ServiceRequest = {
  id: string
  title: string
  priority: string
  status: 'Assigned' | 'Pending'
  vendor: string
  locationName: string
  lat: number
  lng: number
  time: string
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.flyTo([lat, lng], 12) }, [lat, lng, map])
  return null
}

interface Props {
  requests: ServiceRequest[]
  setRequests: (r: ServiceRequest[]) => void
  selected: ServiceRequest | null
  setSelected: (r: ServiceRequest) => void
}

export default function MapView({ requests, setRequests, selected, setSelected }: Props) {

  useEffect(() => {
    fetch('/api/service-requests')
      .then((r) => r.json())
      .then(setRequests)
      .catch(() => setRequests([
        { id:'1', title:'AC Repair', priority:'urgent', status:'Assigned',
          vendor:'BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoltPro General Services',
          locationName:'Vijay Nagar', lat:28.4595, lng:77.0266, time:'16 Apr 11:33 pm' },
        { id:'2', title:'AC Repair', priority:'normal', status:'Assigned',
          vendor:'BreezePro AC Services, MegaMachine Heavy Equipment Gurgaon, DoltPro General Services',
          locationName:'Vijay Nagar', lat:28.4595, lng:77.0266, time:'16 Apr 11:16 pm' },
        { id:'3', title:'Kitchen Deep Cleaning', priority:'high', status:'Pending',
          vendor:'', locationName:'', lat:28.5355, lng:77.3910, time:'16 Apr 10:39 pm' },
      ]))
  }, [setRequests])

  const MARKER_COLOR: Record<string, string> = {
    urgent:'#e53e3e', high:'#dd6b20', normal:'#805ad5',
    low:'#38a169', P2:'#3182ce', P3:'#00b5d8', P4:'#718096',
  }

  return (
    <MapContainer center={[22.5937, 78.9629]} zoom={5} className="h-full w-full">
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {requests.map((req) => {
        const color = MARKER_COLOR[req.priority] ?? '#718096'
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
          iconSize: [13,13], iconAnchor: [6,6], popupAnchor: [0,-8],
        })
        return (
          <Marker
            key={req.id}
            position={[req.lat, req.lng]}
            icon={icon}
            eventHandlers={{ click: () => setSelected(req) }}
          >
            <Popup maxWidth={260}>
              <div style={{ fontFamily:'system-ui,sans-serif', minWidth:180 }}>
                <p style={{ fontWeight:600, fontSize:14, margin:'0 0 6px' }} dir="auto">
                  {req.title}
                </p>
                <p style={{ fontSize:11, color:'#718096', margin:'0 0 4px' }}>{req.time}</p>
                {req.vendor && (
                  <p style={{ fontSize:11, color:'#4a5568', margin:0, lineHeight:1.5 }}>
                    Vendor: {req.vendor}{req.locationName ? `, ${req.locationName}` : ''}
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}

      {selected && <FlyTo lat={selected.lat} lng={selected.lng} />}
    </MapContainer>
  )
}