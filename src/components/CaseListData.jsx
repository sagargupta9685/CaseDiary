import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseList.module.css'; // Import the CSS Module

function CaseList() {
  const [cases, setCases] = useState([]);

  const fetchCases = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const auth = localStorage.getItem('token');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/addcase/${userId}`, {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      });
      console.log('Fetched cases:', res.data); // Log the fetched cases
      setCases(res.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const markComplete = async (id) => {
     const auth = localStorage.getItem('token');
    try {
     await axios.put(`http://localhost:5000/api/cases/complete/${id}`, {}, {
      headers: {
        Authorization: `Bearer ${auth}`, // ✅ Send token
      }
    }); 


      // ✅ Update status in UI directly
      setCases(prevCases =>
        prevCases.map(c =>
          c.Id === id ? { ...c, status: 'Completed' } : c
        )
      );
    } catch (error) {
      console.error('Error marking case complete:', error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  return (
    <div className={styles.container}>
      <Navbar />
      <h4 className={styles.header}>My Cases</h4>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Case Date</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td>{c.title}</td>
                <td>{new Date(c.caseDate).toLocaleDateString()}</td>
                 <td>{c.status}</td>
                 <td>{c.description}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CaseList;
