import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseListData.module.css';
import { useNavigate } from 'react-router-dom';

function CaseList() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 6;
  const navigate = useNavigate();

const handleViewDetails = (caseId) => {
  navigate(`/updatecase/${caseId}`);
};


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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <div className={styles.headerText}>
            <h1 className={styles.pageTitle}>My Case Portfolio</h1>
            <p className={styles.pageSubtitle}>Track and manage all your legal matters in one place</p>
          </div>
          <div className={styles.controls}>
            <div className={styles.filterCard}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Filter by Status</label>
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
                <label className={styles.filterLabel}>Filter by Date</label>
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
        </div>

        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              <p>Loading your cases...</p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.caseGrid}>
              {currentCases.length > 0 ? (
                currentCases.map((c) => (
                  <div key={c.id} className={styles.caseCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.caseNo}>#{c.caseNo}</div>
                      <div className={styles.cardStatus}>
                        {getStatusBadge(c.status || 'Pending')}
                      </div>
                    </div>
                    <div className={styles.cardBody}>
                      <h3 className={styles.caseTitle}>{c.title}</h3>
                      <p className={styles.clientName}>{c.clientName}</p>
                      <p className={styles.caseDescription}>{c.shortDescription}</p>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.caseDate}>
                        <svg className={styles.dateIcon} viewBox="0 0 24 24">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>
                        </svg>
                        {formatDate(c.caseDate)}
                      </div>
                   <button className={styles.viewDetailsBtn} onClick={() => handleViewDetails(c.id)}>
  View Details
  <svg className={styles.arrowIcon} viewBox="0 0 24 24">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
  </svg>
</button>

                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noCases}>
                  <div className={styles.noCasesContent}>
                    <img src="/images/no-cases.svg" alt="No cases found" className={styles.noCasesImage} />
                    <h3>No cases found</h3>
                    <p>Try adjusting your filters or add a new case</p>
                    <button
  className={styles.addCaseBtn}
  onClick={() => navigate('/addcase')}
>
  <svg className={styles.plusIcon} viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
  Add New Case 
</button>
                  </div>
                </div>
              )}
            </div>

            {filteredCases.length > casesPerPage && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  Showing <span className={styles.boldText}>{indexOfFirstCase + 1}-{Math.min(indexOfLastCase, filteredCases.length)}</span> of <span className={styles.boldText}>{filteredCases.length}</span> cases
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`${styles.paginationBtn} ${styles.prevBtn}`}
                  >
                    <svg className={styles.paginationArrow} viewBox="0 0 24 24">
                      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                    </svg>
                    Previous
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
                    Next
                    <svg className={styles.paginationArrow} viewBox="0 0 24 24">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
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