import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import LocationCard from './LocationCard'
import styles from './FavoritesPage.module.css'

export default function FavoritesPage({ favoriteLocations, occupancy, onSelect, onToggleFavorite }) {
  return (
    <Container className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>★</span> Saved Spaces
        </h2>
        <p className={styles.subtitle}>
          {favoriteLocations.length === 0
            ? 'You haven\'t saved any spaces yet.'
            : `${favoriteLocations.length} space${favoriteLocations.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {favoriteLocations.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>☆</div>
          <p className={styles.emptyText}>
            Browse study spaces and tap the star on any card to save it here.
          </p>
          <Link to="/" className={styles.browseBtn}>
            Browse Spaces
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {favoriteLocations.map(loc => (
            <LocationCard
              key={loc.id}
              location={loc}
              isFavorite={true}
              occupancy={occupancy[loc.id]}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
