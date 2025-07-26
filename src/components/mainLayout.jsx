import React from 'react';
import Navbar from '../pages/NavBar';
import { Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';
import Dashboard from '../pages/Dashboard';
import AddCaseForm from './addCase';

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />
       <main className={styles.mainContent}>
        <Outlet />
        {/* Default component if no route matches */}
      </main>
    </div>
  );
}

export default MainLayout;
