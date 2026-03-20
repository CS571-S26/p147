import styles from './Header.module.css'

export default function Header({ favoriteCount }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo} aria-hidden="true">📍</span>
          <div>
            <h1 className={styles.title}>StudySpotter</h1>
            <p className={styles.subtitle}>UW–Madison Study Space Finder</p>
          </div>
        </div>
        {favoriteCount > 0 && (
          <div className={styles.favBadge} aria-label={`${favoriteCount} saved location${favoriteCount !== 1 ? 's' : ''}`}>
            <span>★</span> {favoriteCount} Saved
          </div>
        )}
      </div>
    </header>
  )
}
