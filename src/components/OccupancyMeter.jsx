import styles from './OccupancyMeter.module.css'

export default function OccupancyMeter({ percent }) {
  const level = percent < 35 ? 'low' : percent < 65 ? 'medium' : 'high'
  const label = percent < 35 ? 'Not busy' : percent < 65 ? 'Somewhat busy' : 'Busy'

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${styles[level]}`}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Occupancy: ${percent}%`}
        />
      </div>
      <span className={`${styles.label} ${styles[level]}`}>{label}</span>
    </div>
  )
}
