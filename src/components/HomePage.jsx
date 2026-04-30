import { Container, Button } from 'react-bootstrap'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import LocationCard from './LocationCard'
import styles from '../App.module.css'

export default function HomePage({
  query, onQueryChange,
  filters, onFilterChange,
  sort, onSortChange,
  filtered, favorites, occupancy, distances,
  onSelect, onToggleFavorite,
}) {
  return (
    <Container as="main" className={styles.main}>
      <h1 className={styles.pageTitle}>Explore Study Spaces</h1>
      <div className={styles.controls}>
        <SearchBar query={query} onChange={onQueryChange} />
      </div>

      <FilterPanel
        filters={filters}
        onFilterChange={onFilterChange}
        sort={sort}
        onSortChange={onSortChange}
        resultCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔍</span>
          <p>No study spaces match your filters.</p>
          <Button
            variant="danger"
            onClick={() => {
              onQueryChange('')
              onFilterChange({ noise: 'all', amenities: [], favoritesOnly: false })
            }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(loc => (
            <LocationCard
              key={loc.id}
              location={loc}
              isFavorite={favorites.includes(loc.id)}
              occupancy={occupancy[loc.id]}
              distance={distances[loc.id]}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </Container>
  )
}
