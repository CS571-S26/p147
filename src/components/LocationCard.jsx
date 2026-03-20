import { AMENITY_LABELS, NOISE_LABELS } from '../data/locations'
import OccupancyMeter from './OccupancyMeter'
import styles from './LocationCard.module.css'

const NOISE_ICON = { quiet: '🤫', moderate: '💬', collaborative: '🗣️' }

export default function LocationCard({ location, isFavorite, occupancy, onSelect, onToggleFavorite }) {
  return (
    <article className={styles.card} onClick={() => onSelect(location)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(location)}
      aria-label={`${location.name}, ${location.type}`}
    >
      <div className={styles.imgWrap}>
        <img src={location.photo} alt={location.name} className={styles.img} loading="lazy" />
        <button
          className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
          onClick={e => { e.stopPropagation(); onToggleFavorite(location.id) }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <span className={styles.typeBadge}>{location.type}</span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{location.name}</h2>

        <div className={styles.noise}>
          <span>{NOISE_ICON[location.noiseLevel]}</span>
          <span>{NOISE_LABELS[location.noiseLevel]}</span>
          {location.foodNearby && <span className={styles.food}>🍴 Food nearby</span>}
        </div>

        <OccupancyMeter percent={occupancy} />

        <div className={styles.amenities}>
          {location.amenities.slice(0, 4).map(a => (
            <span key={a} className={styles.tag}>{AMENITY_LABELS[a]}</span>
          ))}
          {location.amenities.length > 4 && (
            <span className={styles.tag}>+{location.amenities.length - 4} more</span>
          )}
        </div>
      </div>
    </article>
  )
}
