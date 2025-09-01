import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './caseListData.module.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function CaseList() {
   const { t } = useTranslation();
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
      const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/addcase/user/${userId}/all`,
      { headers: { Authorization: `Bearer ${auth}` } }
    );
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
         {t(status.toLowerCase())}
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
            <h1 className={styles.pageTitle}>{t("myCasePortfolio")}</h1>
            <p className={styles.pageSubtitle}>{t("trackAndManage")}</p>
          </div>
          <div className={styles.controls}>
            <div className={styles.filterCard}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t("filterByStatus")}</label>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="All">{t("allStatuses")}</option>
                  <option value="Pending">{t("pending")}</option>
                  <option value="In Progress">{t("inProgress")}</option>
                  <option value="Completed">{t("completed")}</option>
                  <option value="Cancelled">{t("cancelled")}</option>
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>{t("filterByDate")}</label>
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
              <p>{t("loadingCases")}</p>
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
                        {formatDate(c.caseDate)}
                      </div>
                      <button className={styles.viewDetailsBtn} onClick={() => handleViewDetails(c.id)}>
                        {t("viewDetails")}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noCases}>
                  <div className={styles.noCasesContent}>
                    <h3>{t("noCasesFound")}</h3>
                    <p>{t("tryAdjusting")}</p>
                    <button
                      className={styles.addCaseBtn}
                      onClick={() => navigate('/addcase')}
                    >
                      {t("addNewCase")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredCases.length > casesPerPage && (
              <div className={styles.paginationContainer}>
                <div className={styles.paginationInfo}>
                  {t("showing")} <span className={styles.boldText}>{indexOfFirstCase + 1}-{Math.min(indexOfLastCase, filteredCases.length)}</span> {t("ofCases")} <span className={styles.boldText}>{filteredCases.length}</span>
                </div>
                <div className={styles.paginationControls}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`${styles.paginationBtn} ${styles.prevBtn}`}
                  >
                    {t("previous")}
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
                    {t("next")}
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
