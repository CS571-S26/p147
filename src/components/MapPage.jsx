import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import { Badge } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css'
import useGeolocation, { formatDistance } from '../hooks/useGeolocation'
import OccupancyMeter from './OccupancyMeter'
import { LOCATIONS } from '../data/locations'
import styles from './MapPage.module.css'

const UW_CENTER = [43.0766, -89.4125]

const NOISE_COLOR = { quiet: '#2d8a4e', moderate: '#d97706', collaborative: '#c5050c' }
const NOISE_LABEL = { quiet: 'Quiet', moderate: 'Moderate', collaborative: 'Collaborative' }

function FlyToUser({ userPos }) {
  const map = useMap()
  useEffect(() => {
    if (userPos) map.flyTo([userPos.lat, userPos.lng], map.getZoom(), { duration: 1.2 })
  }, [userPos])
  return null
}

export default function MapPage({ occupancy, onSelect, favorites, onToggleFavorite }) {
  const { userPos, geoError, distances } = useGeolocation(LOCATIONS)

  const sorted = [...LOCATIONS].sort((a, b) => {
    if (!distances[a.id] && !distances[b.id]) return 0
    if (!distances[a.id]) return 1
    if (!distances[b.id]) return -1
    return distances[a.id] - distances[b.id]
  })

  return (
    <div className={styles.page}>
      <div className={styles.mapWrap}>
        <MapContainer
          center={UW_CENTER}
          zoom={15}
          className={styles.map}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userPos && (
            <>
              <FlyToUser userPos={userPos} />
              <CircleMarker
                center={[userPos.lat, userPos.lng]}
                radius={10}
                pathOptions={{ fillColor: '#1d4ed8', color: '#fff', weight: 2, fillOpacity: 1 }}
              >
                <Tooltip permanent direction="top" offset={[0, -12]}>
                  <span className={styles.tooltipYou}>📍 You</span>
                </Tooltip>
              </CircleMarker>
            </>
          )}

          {LOCATIONS.map(loc => (
            <CircleMarker
              key={loc.id}
              center={[loc.lat, loc.lng]}
              radius={12}
              pathOptions={{
                fillColor: NOISE_COLOR[loc.noiseLevel],
                color: '#fff',
                weight: 2,
                fillOpacity: 0.9,
              }}
              eventHandlers={{ click: () => onSelect(loc) }}
            >
              <Tooltip direction="top" offset={[0, -14]}>
                <div className={styles.tooltipBox}>
                  <strong>{loc.name}</strong>
                  {distances[loc.id] != null && (
                    <span className={styles.tooltipDist}>{formatDistance(distances[loc.id])}</span>
                  )}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        <div className={styles.legend}>
          {Object.entries(NOISE_COLOR).map(([level, color]) => (
            <div key={level} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: color }} />
              {NOISE_LABEL[level]}
            </div>
          ))}
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#1d4ed8' }} />
            You
          </div>
        </div>
      </div>

      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Nearby Spaces</h1>
          {geoError ? (
            <p className={styles.geoError}>📍 {geoError}</p>
          ) : !userPos ? (
            <p className={styles.geoLoading}>Getting your location…</p>
          ) : (
            <p className={styles.geoOk}>Sorted by distance from you</p>
          )}
        </div>

        <ul className={styles.list}>
          {sorted.map(loc => {
            const dist = distances[loc.id]
            const isFav = favorites.includes(loc.id)
            return (
              <li
                key={loc.id}
                className={styles.listItem}
                onClick={() => onSelect(loc)}
                tabIndex={0}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSelect(loc)}
              >
                <div className={styles.itemTop}>
                  <div>
                    <span
                      className={styles.noiseDot}
                      style={{ background: NOISE_COLOR[loc.noiseLevel] }}
                      title={NOISE_LABEL[loc.noiseLevel]}
                    />
                    <span className={styles.itemName}>{loc.name}</span>
                  </div>
                  <div className={styles.itemRight}>
                    {dist != null && (
                      <Badge bg="secondary" className={styles.distBadge}>
                        {formatDistance(dist)}
                      </Badge>
                    )}
                    <button
                      className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
                      onClick={e => { e.stopPropagation(); onToggleFavorite(loc.id) }}
                      aria-label={isFav ? 'Remove from favorites' : 'Save'}
                      aria-pressed={isFav}
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                  </div>
                </div>
                <div className={styles.itemMeta}>
                  <span className={styles.itemType}>{loc.type}</span>
                  <span className={styles.itemAddress}>{loc.address}</span>
                </div>
                <OccupancyMeter percent={occupancy[loc.id]} />
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
