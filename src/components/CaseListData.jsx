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
      console.log('Fetched cases:', res.data);
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
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
      'In Progress': styles.statusInProgress,
      'Completed': styles.statusCompleted,
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
          <div className={styles.headerText}>
            <h1 className={styles.pageTitle}>My Case Portfolio</h1>
            <p className={styles.pageSubtitle}>Manage and track all your legal cases in one place</p>
          </div>
          <div className={styles.controls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Date:</label>
              <div className={styles.dateInputContainer}>
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
        </div>

        {isLoading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Loading your cases...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.caseTable}>
                <thead>
                  <tr>
                    <th className={styles.caseNoHeader}>Case No</th>
                    <th className={styles.titleHeader}>Title</th>
                    <th className={styles.dateHeader}>Date</th>
                    <th className={styles.descriptionHeader}>Description</th>
                    <th className={styles.statusHeader}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length > 0 ? (
                    currentCases.map((c) => (
                      <tr key={c.id} className={styles.caseRow}>
                        <td className={styles.caseNoCell}>
                          <span className={styles.caseNo}>#{c.caseNo}</span>
                        </td>
                        <td className={styles.titleCell}>
                          <div className={styles.caseTitle}>
                            <strong>{c.title}</strong>
                            <span className={styles.clientName}>{c.clientName}</span>
                          </div>
                        </td>
                        <td className={styles.dateCell}>
                          <div className={styles.dateWrapper}>
                            <span className={styles.dateDay}>
                              {new Date(c.caseDate).getDate()}
                            </span>
                            <span className={styles.dateMonthYear}>
                              {new Date(c.caseDate).toLocaleString('default', { month: 'short' })}
                              {' '}
                              {new Date(c.caseDate).getFullYear()}
                            </span>
                          </div>
                        </td>
                        <td className={styles.descriptionCell}>
                          <div className={styles.description}>
                            {c.shortDescription}
                            <div className={styles.viewDetails}>View Details →</div>
                          </div>
                        </td>
                        <td className={styles.statusCell}>
                          {getStatusBadge(c.status || 'Pending')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className={styles.noCases}>
                        <div className={styles.noCasesContent}>
                          <img src="/images/no-cases.svg" alt="No cases found" className={styles.noCasesImage} />
                          <h3>No cases found</h3>
                          <p>Try adjusting your filters or add a new case</p>
                          <button className={styles.addCaseBtn}>+ Add New Case</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredCases.length > casesPerPage && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  Showing {indexOfFirstCase + 1}-{Math.min(indexOfLastCase, filteredCases.length)} of {filteredCases.length} cases
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`${styles.paginationBtn} ${styles.prevBtn}`}
                  >
                    <span className={styles.arrow}>&#8249;</span> Previous
                  </button>
                  
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`${styles.pageBtn} ${
                          currentPage === i + 1 ? styles.activePage : ''
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`${styles.paginationBtn} ${styles.nextBtn}`}
                  >
                    Next <span className={styles.arrow}>&#8250;</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CaseList;