import React from 'react';
import Navbar from '../pages/NavBar';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

function MainLayout() {
  return (
    <div>
      <Navbar />
      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
