import { useState, useEffect, useMemo } from 'react'
import { LOCATIONS } from './data/locations'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import LocationCard from './components/LocationCard'
import LocationDetail from './components/LocationDetail'
import styles from './App.module.css'

const STORAGE_KEY_FAVORITES = 'studyspotter_favorites'
const STORAGE_KEY_COMMENTS = 'studyspotter_comments'
const STORAGE_KEY_CHECKINS = 'studyspotter_checkins'

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}

function useOccupancy(checkIns) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => {
    const now = Date.now()
    return Object.fromEntries(
      LOCATIONS.map(loc => {
        const jitter = ((now / 60000 + loc.id * 137) % 30) - 15
        const boost = checkIns[loc.id] ? 8 : 0
        return [loc.id, Math.min(100, Math.max(0, Math.round(loc.baseOccupancy + jitter + boost)))]
      })
    )
  }, [checkIns, tick])
}

export default function App() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ noise: 'all', amenities: [], favoritesOnly: false })
  const [sort, setSort] = useState('name')
  const [favorites, setFavorites] = useState(() => loadJSON(STORAGE_KEY_FAVORITES, []))
  const [comments, setComments] = useState(() => loadJSON(STORAGE_KEY_COMMENTS, {}))
  const [checkIns, setCheckIns] = useState(() => loadJSON(STORAGE_KEY_CHECKINS, {}))
  const [selected, setSelected] = useState(null)

  const occupancy = useOccupancy(checkIns)

  useEffect(() => { localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments)) }, [comments])
  useEffect(() => { localStorage.setItem(STORAGE_KEY_CHECKINS, JSON.stringify(checkIns)) }, [checkIns])

  const toggleFavorite = (id) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])

  const handleCheckIn = (id) => setCheckIns(prev => ({ ...prev, [id]: true }))
  const handleCheckOut = (id) => setCheckIns(prev => { const n = { ...prev }; delete n[id]; return n })

  const handleAddComment = (locationId, text) => {
    const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    setComments(prev => ({
      ...prev,
      [locationId]: [{ text, time: now }, ...(prev[locationId] || [])],
    }))
  }

  const filtered = useMemo(() => {
    let list = LOCATIONS.filter(loc => {
      if (filters.favoritesOnly && !favorites.includes(loc.id)) return false
      if (filters.noise !== 'all' && loc.noiseLevel !== filters.noise) return false
      if (filters.amenities.length > 0 && !filters.amenities.every(a => loc.amenities.includes(a))) return false
      if (query) {
        const q = query.toLowerCase()
        const inName = loc.name.toLowerCase().includes(q)
        const inType = loc.type.toLowerCase().includes(q)
        const inAmenity = loc.amenities.some(a => a.toLowerCase().includes(q))
        if (!inName && !inType && !inAmenity) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'occupancy-asc') return occupancy[a.id] - occupancy[b.id]
      if (sort === 'occupancy-desc') return occupancy[b.id] - occupancy[a.id]
      return 0
    })
    return list
  }, [query, filters, sort, favorites, occupancy])

  return (
    <div className={styles.app}>
      <Header favoriteCount={favorites.length} />

      <main className={styles.main}>
        <div className={styles.controls}>
          <SearchBar query={query} onChange={setQuery} />
        </div>

        <FilterPanel
          filters={filters}
          onFilterChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p>No study spaces match your filters.</p>
            <button className={styles.emptyReset} onClick={() => { setQuery(''); setFilters({ noise: 'all', amenities: [], favoritesOnly: false }) }}>
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
                onSelect={setSelected}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <LocationDetail
          location={selected}
          isFavorite={favorites.includes(selected.id)}
          occupancy={occupancy[selected.id]}
          checkedIn={!!checkIns[selected.id]}
          comments={comments[selected.id] || []}
          onClose={() => setSelected(null)}
          onToggleFavorite={toggleFavorite}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  )
}
