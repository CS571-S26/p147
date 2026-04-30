import { Container, Row, Col, Card } from 'react-bootstrap'
import styles from './AboutPage.module.css'

const FEATURES = [
  {
    icon: '🔍',
    title: 'Search & Filter',
    desc: 'Find spaces by name, type, or amenity. Filter by noise level and sort by current occupancy.',
  },
  {
    icon: '📊',
    title: 'Live Occupancy',
    desc: 'Check real time occupancy estimates and check in to help others know how busy a space is.',
  },
  {
    icon: '★',
    title: 'Save Favorites',
    desc: 'Star any space to save it. Your favorites persist between sessions and appear on the Saved page.',
  },
  {
    icon: '💬',
    title: 'Community Comments',
    desc: 'Leave tips and feedback on any space so fellow students know what to expect.',
  },
]

export default function AboutPage() {
  return (
    <Container className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.heroIcon}>📍</span>
        <h1 className={styles.heroTitle}>About StudySpotter</h1>
        <p className={styles.heroDesc}>
          StudySpotter helps UW–Madison students find the perfect place to study on campus.
          Browse verified locations, check live occupancy, save your favorites, and share
          tips with the campus community.
        </p>
      </div>

      <h2 className={styles.sectionTitle}>Features</h2>
      <Row xs={1} sm={2} lg={4} className="g-3 mb-5">
        {FEATURES.map(f => (
          <Col key={f.title}>
            <Card className={styles.featureCard} as="article">
              <Card.Body>
                <div className={styles.featureIcon}>{f.icon}</div>
                <Card.Title className={styles.featureTitle}>{f.title}</Card.Title>
                <Card.Text className={styles.featureDesc}>{f.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-5">
        <Col md={6}>
          <Card className={styles.infoCard}>
            <Card.Body>
              <Card.Title className={styles.infoTitle}>🎓 Built for Badgers</Card.Title>
              <Card.Text>
                All locations are UW–Madison study spaces: libraries, student unions, academic
                buildings, and cafés.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className={styles.infoCard}>
            <Card.Body>
              <Card.Title className={styles.infoTitle}>🔒 Private by Default</Card.Title>
              <Card.Text>
                Your favorites and comments are stored locally in your browser. No account needed,
                no data sent to any server.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <p className={styles.footer}>
        Built with React · UW–Madison CS 571 Web Programming
      </p>
    </Container>
  )
}
