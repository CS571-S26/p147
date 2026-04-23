import { useState, useEffect } from 'react'

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8 // Earth radius in miles
  const toRad = deg => deg * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function formatDistance(miles) {
  if (miles < 0.1) return `${Math.round(miles * 5280)} ft`
  return `${miles.toFixed(1)} mi`
}

export default function useGeolocation(locations) {
  const [userPos, setUserPos] = useState(null)
  const [geoError, setGeoError] = useState(null)
  const [distances, setDistances] = useState({})

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.')
      return
    }
    const id = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        setUserPos({ lat: latitude, lng: longitude })
        const d = {}
        locations.forEach(loc => {
          d[loc.id] = haversineDistance(latitude, longitude, loc.lat, loc.lng)
        })
        setDistances(d)
        setGeoError(null)
      },
      err => setGeoError(err.message),
      { enableHighAccuracy: true, maximumAge: 30000 }
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [])

  return { userPos, geoError, distances }
}
