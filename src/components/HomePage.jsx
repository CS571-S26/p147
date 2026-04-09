import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import LocationCard from './LocationCard'
import styles from '../App.module.css'

export default function HomePage({
  query, onQueryChange,
  filters, onFilterChange,
  sort, onSortChange,
  filtered, favorites, occupancy,
  onSelect, onToggleFavorite,
}) {
  return (
    <main className={styles.main}>
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
          <button
            className={styles.emptyReset}
            onClick={() => {
              onQueryChange('')
              onFilterChange({ noise: 'all', amenities: [], favoritesOnly: false })
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(loc => (
            <LocationCard
              key={loc.id}
              location={loc}
              isFavorite={favorites.includes(loc.id)}
              occupancy={occupancy[loc.id]}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </main>
  )
}
