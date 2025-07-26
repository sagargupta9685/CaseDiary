import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link className={styles.brand} to="/dashboard">
          <span className={styles.brandIcon}>⚖️</span>
          <span>CaseDiary Pro</span>
        </Link>
        
        <button 
          className={`${styles.toggler} ${isMenuOpen ? styles.togglerOpen : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className={styles.togglerIcon}></span>
          <span className={styles.togglerIcon}></span>
          <span className={styles.togglerIcon}></span>
        </button>

        {/* <div className={`${styles.navbarCollapse} ${isMenuOpen ? styles.show : ''}`}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.linkIcon}>📊</span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink 
                to="/caseform" 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.linkIcon}>✏️</span>
                <span>Edit Case</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink 
                to="/addcase" 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.linkIcon}>➕</span>
                <span>Add Case</span>
              </NavLink>
            </li>

            <li className={styles.navItem}>
              <NavLink 
                to="/caselist" 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.linkIcon}>📋</span>
                <span>My Cases</span>
              </NavLink>
            </li>
          </ul>
          
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userAvatar}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
              <span className={styles.userGreeting}>
                {user?.name || 'User'}
              </span>
            </div>
            
            <button 
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <span className={styles.logoutIcon}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div> */}

<div className={`${styles.navbarCollapse} ${isMenuOpen ? styles.show : ''}`}>
  <div className={styles.navItemsWrapper}>
   <ul className={styles.navList}>
  <li className={styles.navItem}>
    <NavLink
      to="/dashboard"
      className={({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
      }
      onClick={() => setIsMenuOpen(false)}
    >
      <span className={styles.linkIcon}>📊</span>
      <span>Dashboard</span>
    </NavLink>
  </li>

  <li className={styles.navItem}>
    <NavLink
      to="/caseform"
      className={({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
      }
      onClick={() => setIsMenuOpen(false)}
    >
      <span className={styles.linkIcon}>✏️</span>
      <span>Edit Case</span>
    </NavLink>
  </li>

  <li className={styles.navItem}>
    <NavLink
      to="/addcase"
      className={({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
      }
      onClick={() => setIsMenuOpen(false)}
    >
      <span className={styles.linkIcon}>➕</span>
      <span>Add Case</span>
    </NavLink>
  </li>

  <li className={styles.navItem}>
    <NavLink
      to="/caselist"
      className={({ isActive }) =>
        isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
      }
      onClick={() => setIsMenuOpen(false)}
    >
      <span className={styles.linkIcon}>📋</span>
      <span>My Cases</span>
    </NavLink>
  </li>

<div className={styles.userSection}>
      <div className={styles.userInfo}>
        <span className={styles.userAvatar}>
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
        <span className={styles.userGreeting}>
          {user?.name || 'User'}
        </span>
      </div>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        <span className={styles.logoutIcon}>🚪</span>
        <span>Logout</span>
      </button>
    </div>

</ul>

       


    
  </div>
</div>


      </div>
    </nav>
  );
}

export default Navbar;