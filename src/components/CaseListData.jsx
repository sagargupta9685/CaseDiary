import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseListData.module.css';

function CaseList() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 5;

  const fetchCases = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const auth = localStorage.getItem('token');
    
    try {
      const res = await axios.get(`http://localhost:5000/api/addcase/${userId}`, {
        headers: { Authorization: `Bearer ${auth}` }
      });
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markComplete = async (id) => {
    const auth = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/cases/complete/${id}`, {}, {
        headers: { Authorization: `Bearer ${auth}` }
      });

      setCases(prevCases =>
        prevCases.map(c =>
          c.id === id ? { ...c, status: 'Completed' } : c
        )
      );
      applyFilters(statusFilter, dateFilter);
    } catch (error) {
      console.error('Error marking case complete:', error);
    }
  };

  const applyFilters = (status, date) => {
    let result = [...cases];
    
    if (status !== 'All') {
      result = result.filter(c => c.status === status);
    }
    
    if (date) {
      const filterDate = new Date(date).toDateString();
      result = result.filter(c => 
        new Date(c.caseDate).toDateString() === filterDate
      );
    }
    
    setFilteredCases(result);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    applyFilters(statusFilter, dateFilter);
  }, [statusFilter, dateFilter, cases]);

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Pending': styles.statusPending,
      'Completed': styles.statusCompleted,
      'In Progress': styles.statusInProgress,
      'Cancelled': styles.statusCancelled
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h2 className={styles.pageTitle}>My Cases</h2>
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <label>Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label>Date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.dateInput}
              />
              {dateFilter && (
                <button 
                  onClick={() => setDateFilter('')}
                  className={styles.clearDate}
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Loading cases...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.caseTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Case Date</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length > 0 ? (
                    currentCases.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <div className={styles.caseTitle}>
                            <strong>{c.title}</strong>
                            <span className={styles.caseId}>#{c.caseNo}</span>
                          </div>
                        </td>
                        <td>
                          {new Date(c.caseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td>{getStatusBadge(c.status)}</td>
                        <td>
                          <div className={styles.description}>
                            {c.shortDescription}
                          </div>
                        </td>
                        <td>
                          {c.status !== 'Completed' && (
                            <button
                              onClick={() => markComplete(c.id)}
                              className={styles.completeBtn}
                            >
                              Mark Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className={styles.noCases}>
                        No cases found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredCases.length > casesPerPage && (
              <div className={styles.pagination}>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className={styles.paginationBtn}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${styles.paginationBtn} ${
                      currentPage === i + 1 ? styles.activePage : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.paginationBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CaseList;