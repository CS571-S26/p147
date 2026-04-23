import { Form, Button } from 'react-bootstrap'
import styles from './SearchBar.module.css'

export default function SearchBar({ query, onChange }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <Form.Control
        type="search"
        className={styles.input}
        placeholder="Search by name, type, or amenity…"
        value={query}
        onChange={e => onChange(e.target.value)}
        aria-label="Search study spaces"
      />
      {query && (
        <Button
          variant="link"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </Button>
      )}
    </div>
  )
}
