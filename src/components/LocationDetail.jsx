import { useState } from 'react'
import { AMENITY_LABELS, NOISE_LABELS } from '../data/locations'
import OccupancyMeter from './OccupancyMeter'
import styles from './LocationDetail.module.css'

const NOISE_ICON = { quiet: '🤫', moderate: '💬', collaborative: '🗣️' }

export default function LocationDetail({
  location, isFavorite, occupancy, checkedIn, comments,
  onClose, onToggleFavorite, onCheckIn, onCheckOut, onAddComment
}) {
  const [commentText, setCommentText] = useState('')
  const [commentError, setCommentError] = useState('')

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    const trimmed = commentText.trim()
    if (!trimmed) {
      setCommentError('Comment cannot be empty.')
      return
    }
    if (trimmed.length < 10) {
      setCommentError('Please write at least 10 characters.')
      return
    }
    onAddComment(location.id, trimmed)
    setCommentText('')
    setCommentError('')
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={location.name}>
      <div className={styles.sheet}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close detail view">✕</button>

        <div className={styles.hero}>
          <img src={location.photo} alt={location.name} className={styles.heroImg} />
          <div className={styles.heroOverlay}>
            <span className={styles.typeTag}>{location.type}</span>
            <h2 className={styles.heroTitle}>{location.name}</h2>
            <p className={styles.heroAddress}>📍 {location.address}</p>
          </div>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>{location.description}</p>

          <div className={styles.grid}>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Noise Level</div>
              <div className={styles.infoValue}>
                {NOISE_ICON[location.noiseLevel]} {NOISE_LABELS[location.noiseLevel]}
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoLabel}>Food Nearby</div>
              <div className={styles.infoValue}>{location.foodNearby ? '🍴 Yes' : '✗ No'}</div>
            </div>
            <div className={styles.infoCard} style={{ gridColumn: '1 / -1' }}>
              <div className={styles.infoLabel}>Hours</div>
              <div className={styles.infoValue}>{location.hours}</div>
            </div>
          </div>

          <section>
            <h3 className={styles.sectionTitle}>Amenities</h3>
            <div className={styles.amenities}>
              {location.amenities.map(a => (
                <span key={a} className={styles.tag}>{AMENITY_LABELS[a]}</span>
              ))}
            </div>
          </section>

          <section>
            <h3 className={styles.sectionTitle}>Live Occupancy</h3>
            <div className={styles.occupancyRow}>
              <OccupancyMeter percent={occupancy} />
              <span className={styles.occupancyPct}>{occupancy}%</span>
            </div>
            <div className={styles.checkInRow}>
              {checkedIn ? (
                <button className={`${styles.actionBtn} ${styles.checkOutBtn}`} onClick={() => onCheckOut(location.id)}>
                  Check Out
                </button>
              ) : (
                <button className={`${styles.actionBtn} ${styles.checkInBtn}`} onClick={() => onCheckIn(location.id)}>
                  Check In Here
                </button>
              )}
              <button
                className={`${styles.actionBtn} ${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
                onClick={() => onToggleFavorite(location.id)}
                aria-pressed={isFavorite}
              >
                {isFavorite ? '★ Saved' : '☆ Save'}
              </button>
            </div>
          </section>

          <section>
            <h3 className={styles.sectionTitle}>
              Comments <span className={styles.commentCount}>({comments.length})</span>
            </h3>
            <form className={styles.commentForm} onSubmit={handleCommentSubmit} noValidate>
              <textarea
                className={`${styles.textarea} ${commentError ? styles.textareaError : ''}`}
                value={commentText}
                onChange={e => { setCommentText(e.target.value); setCommentError('') }}
                placeholder="Leave a comment about this space…"
                rows={3}
                aria-label="Comment"
                aria-invalid={!!commentError}
                aria-describedby={commentError ? 'comment-error' : undefined}
              />
              {commentError && <p id="comment-error" className={styles.errorMsg}>{commentError}</p>}
              <button type="submit" className={styles.submitBtn}>Post Comment</button>
            </form>

            {comments.length === 0 ? (
              <p className={styles.emptyComments}>No comments yet. Be the first!</p>
            ) : (
              <ul className={styles.commentList}>
                {comments.map((c, i) => (
                  <li key={i} className={styles.comment}>
                    <span className={styles.commentAvatar}>👤</span>
                    <div>
                      <span className={styles.commentTime}>{c.time}</span>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
