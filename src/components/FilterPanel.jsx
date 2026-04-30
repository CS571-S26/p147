import { Form, Button } from 'react-bootstrap'
import { AMENITY_LABELS } from '../data/locations'
import styles from './FilterPanel.module.css'

const NOISE_OPTIONS = [
  { value: 'all', label: 'Any noise level' },
  { value: 'quiet', label: '🤫 Quiet' },
  { value: 'moderate', label: '💬 Moderate' },
  { value: 'collaborative', label: '🗣️ Collaborative' },
]

const SORT_OPTIONS = [
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'occupancy-asc', label: 'Least Busy' },
  { value: 'occupancy-desc', label: 'Most Busy' },
]

export default function FilterPanel({ filters, onFilterChange, onSortChange, sort, resultCount }) {
  const toggleAmenity = (key) => {
    const next = filters.amenities.includes(key)
      ? filters.amenities.filter(a => a !== key)
      : [...filters.amenities, key]
    onFilterChange({ ...filters, amenities: next })
  }

  const hasActiveFilters = filters.noise !== 'all' || filters.amenities.length > 0 || filters.favoritesOnly

  return (
    <aside className={styles.panel}>
      <div className={styles.row}>
        <div className={styles.field}>
          <Form.Label className={styles.label} htmlFor="noise-filter">Noise Level</Form.Label>
          <Form.Select
            id="noise-filter"
            className={`${styles.select} ${filters.noise !== 'all' ? styles.selectActive : ''}`}
            value={filters.noise}
            onChange={e => onFilterChange({ ...filters, noise: e.target.value })}
          >
            {NOISE_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </div>

        <div className={styles.field}>
          <Form.Label className={styles.label} htmlFor="sort-select">Sort By</Form.Label>
          <Form.Select
            id="sort-select"
            className={styles.select}
            value={sort}
            onChange={e => onSortChange(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </div>
      </div>

      <div className={styles.amenityRow}>
        <span className={styles.label}>Amenities</span>
        <div className={styles.chips}>
          {Object.entries(AMENITY_LABELS).map(([key, label]) => {
            const active = filters.amenities.includes(key)
            return (
              <Button
                key={key}
                size="sm"
                variant="outline-secondary"
                className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                onClick={() => toggleAmenity(key)}
                aria-pressed={active}
              >
                {label}
              </Button>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <Form.Check
          type="checkbox"
          id="favorites-only"
          label="Show favorites only"
          checked={filters.favoritesOnly}
          onChange={e => onFilterChange({ ...filters, favoritesOnly: e.target.checked })}
          className={styles.checkLabel}
        />

        <div className={styles.meta}>
          <span className={styles.count}>{resultCount} space{resultCount !== 1 ? 's' : ''} found</span>
          {hasActiveFilters && (
            <Button
              variant="link"
              size="sm"
              className={styles.resetBtn}
              onClick={() => onFilterChange({ noise: 'all', amenities: [], favoritesOnly: false })}
            >
              Reset filters
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
