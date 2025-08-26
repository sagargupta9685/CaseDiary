import React, { useState, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import styles from './navBar.module.css';
import { useTranslation } from 'react-i18next';

function Navbar() {
  const { t } = useTranslation();
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
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          <Link className={styles.brand} to="/dashboard">
            <span className={styles.brandIcon}>⚖️</span>
            <span>{t("brandName")}</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className={styles.desktopMenu}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>📊</span>
                  <span>{t("dashboard")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/addcase" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>➕</span>
                  <span>{t("addCase")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/addlandrecord" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>➕</span>
                  <span>{t("addLandRecord")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/addmiscellaneous" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>➕</span>
                  <span>{t("addMiscRecord")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/miscellaneous" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>📋</span>
                  <span>{t("myMiscRecord")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/LandRecord" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>📋</span>
                  <span>{t("myLandRecord")}</span>
                </NavLink>
              </li>

              <li className={styles.navItem}>
                <NavLink 
                  to="/caselist" 
                  className={({ isActive }) => 
                    isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
                  }
                >
                  <span className={styles.linkIcon}>📋</span>
                  <span>{t("myCases")}</span>
                </NavLink>
              </li>
            </ul>
            
            <div className={styles.userSection}>
              <div className={styles.userInfo}>
                <span className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className={styles.userGreeting}>
                  {user?.name || t("user")}
                </span>
              </div>
              
              <button 
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                <span className={styles.logoutIcon}>🚪</span>
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className={`${styles.toggler} ${isMenuOpen ? styles.togglerOpen : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className={styles.togglerIcon}></span>
            <span className={styles.togglerIcon}></span>
            <span className={styles.togglerIcon}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.show : ''}`}>
        
        <div className={styles.mobileMenuHeader}>
          <div className={styles.mobileMenuTitle}>{t("menu")}</div>
          <button 
            className={styles.closeMenuBtn}
            onClick={() => setIsMenuOpen(false)}
          >
            ×
          </button>
        </div>
        
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
              <span>{t("dashboard")}</span>
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
              <span>{t("addCase")}</span>
            </NavLink>
          </li>

          <li className={styles.navItem}>
            <NavLink 
              to="/addlandrecord" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.linkIcon}>➕</span>
              <span>{t("addLandRecord")}</span>
            </NavLink>
          </li>

          <li className={styles.navItem}>
            <NavLink 
              to="/addmiscellaneous" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.linkIcon}>➕</span>
              <span>{t("addMiscRecord")}</span>
            </NavLink>
          </li>

          <li className={styles.navItem}>
            <NavLink 
              to="/miscellaneous" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
            >
              <span className={styles.linkIcon}>📋</span>
              <span>{t("myMiscRecord")}</span>
            </NavLink>
          </li>

          <li className={styles.navItem}>
            <NavLink 
              to="/LandRecord" 
              className={({ isActive }) => 
                isActive ? `${styles.navLink} ${styles.activeLink}` : styles.navLink
              }
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.linkIcon}>📋</span>
              <span>{t("myLandRecord")}</span>
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
              <span>{t("myCases")}</span>
            </NavLink>
          </li>
        </ul>
        
        <div className={styles.userSectionMobile}>
          <div className={styles.userInfo}>
            <span className={styles.userAvatar}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
            <span className={styles.userGreeting}>
              {user?.name || t("user")}
            </span>
          </div>
          
          <button 
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            <span className={styles.logoutIcon}>🚪</span>
            <span>{t("logout")}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
