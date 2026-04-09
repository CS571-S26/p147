import { Navbar, Nav, Container, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

export default function AppNavBar({ favoriteCount }) {
  return (
    <Navbar expand="md" sticky="top" className={styles.navbar}>
      <Container>
        <Navbar.Brand as={NavLink} to="/" className={styles.brand}>
          <span className={styles.logo}>📍</span>
          <span className={styles.brandText}>StudySpotter</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" className={styles.toggler} />

        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto" as="ul">
            <Nav.Item as="li">
              <Nav.Link
                as={NavLink}
                to="/"
                end
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Explore
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={NavLink}
                to="/favorites"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                Saved
                {favoriteCount > 0 && (
                  <Badge bg="warning" text="dark" className={styles.badge}>
                    {favoriteCount}
                  </Badge>
                )}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link
                as={NavLink}
                to="/about"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
              >
                About
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
