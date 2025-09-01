import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './caseList.module.css';
import { 
  FiSearch, 
  FiFile, 
  FiChevronLeft, 
  FiChevronRight,
  FiDownload,
  FiX
} from 'react-icons/fi';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner, FaPauseCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx'
import { useTranslation } from 'react-i18next';

function CaseList() {
  const { t } = useTranslation();
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFile] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const CASES_PER_PAGE = 5;
  

  const fetchCases = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const auth = localStorage.getItem('token');

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/addcase/${userId}/all`, {
        headers: { Authorization: `Bearer ${auth}` },
      });
      setCases(res.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setSelectedCaseId(id);
    setNewStatus(status);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    const auth = localStorage.getItem('token');
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/addcase/update-status/${selectedCaseId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth}` } }
      );

      setCases(prevCases =>
        prevCases.map(c =>
          c.id === selectedCaseId ? { ...c, status: newStatus } : c
        )
      );
      setShowConfirmModal(false);
      setSelectedCaseId(null);
      setNewStatus('');
    } catch (error) {
      console.error('Error confirming status update:', error);
    }
  };

 

  const openModal = (filePath) => {
  const files = filePath.split(','); // string ko array mein badlo
  setSelectedFile(files); 
  setCurrentFileIndex(0);// array set karo
  setIsModalOpen(true);
};

 

const downloadExcel = () => {
  // Prepare data with custom formatting
  const excelData = cases.map((caseItem, index) => ({
    '#': index + 1,
    'Case No': caseItem.caseNo,
    'Title': caseItem.title,
    'Date': new Date(caseItem.caseDate),
    'Type': caseItem.caseType,
    'Plaintiff': caseItem.plaintiff,
    'Defender': caseItem.defender,
    'Status': caseItem.status,
    'Description': caseItem.shortDescription || 'N/A'
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const wscols = [
    {wch: 5},   // #
    {wch: 15},  // Case No
    {wch: 30},  // Title
    {wch: 12},  // Date
    {wch: 15},  // Type
    {wch: 20},  // Plaintiff
    {wch: 20},  // Defender
    {wch: 15},  // Status
    {wch: 40}   // Description
  ];
  ws['!cols'] = wscols;
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Cases Data");
  
  // Generate Excel file with current date in filename
  const date = new Date();
  const dateString = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  XLSX.writeFile(wb, `cases_export_${dateString}.xlsx`);
};




  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const filteredCases = cases.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.caseNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.plaintiff?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.defender?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCase = currentPage * CASES_PER_PAGE;
  const indexOfFirstCase = indexOfLastCase - CASES_PER_PAGE;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / CASES_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaRegCheckCircle className={styles.statusIcon} />;
      case 'Cancelled':
        return <FaRegTimesCircle className={styles.statusIcon} />;
      case 'In Progress':
        return <FaSpinner className={styles.statusIcon} />;
      case 'Pending':
        return <FaPauseCircle className={styles.statusIcon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h2 className={styles.header}>{t("myCasePortfolio")}</h2>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
                placeholder={t("searchCases")}
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <button 
            onClick={downloadExcel} 
            className={styles.exportButton}
            title={t("exportToExcel")}
          >
            <FiDownload /> {t("export")}
          </button>
        </div>

        {isLoading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
           <p>{t("loadingCases")}</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{t("caseNo")}</th>
                    <th>{t("title")}</th>
                    <th>{t("date")}</th>
                    <th>{t("type")}</th>
                    <th>{t("parties")}</th>
                    <th>{t("status")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length > 0 ? (
                    currentCases.map((c) => (
                      <tr key={c.id}>
                        <td data-label={t("caseNo")} className={styles.caseNoCell}>
                          <span className={styles.caseNoBadge}>{c.caseNo}</span>
                        </td>
                    <td data-label={t("title")} className={styles.titleCell}>
                          {c.title}
                          <div className={styles.descriptionTooltip}>
                            {c.shortDescription}
                          </div>
                        </td>
                         <td data-label={t("date")}>
                          {new Date(c.caseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td data-label={t("type")}>{c.caseType}</td>
                        <td data-label="Parties">
                          <div className={styles.parties}>
                            <span className={styles.plaintiff}>{c.plaintiff}</span>
                               <span className={styles.vs}>{t("vs")}</span>
                            <span className={styles.defender}>{c.defender}</span>
                          </div>
                        </td>
                         <td data-label={t("status")}>
                          <div className={`${styles.status} ${
                            c.status === 'Pending' ? styles.statusPending :
                            c.status === 'Completed' ? styles.statusCompleted :
                            c.status === 'Cancelled' ? styles.statusCancelled :
                            styles.statusInProgress
                          }`}>
                            {getStatusIcon(c.status)}
                              {t(c.status.toLowerCase())}
                          </div>
                        </td>
                    <td data-label={t("actions")} className={styles.actionsCell}>
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={styles.statusDropdown}
                          >
                             <option value="Pending">{t("pending")}</option>
                            <option value="In Progress">{t("inProgress")}</option>
                            <option value="Completed">{t("completed")}</option>
                            <option value="Cancelled">{t("cancelled")}</option>
                          </select>
                          {c.documentPath && (
                            <button
                              className={styles.viewButton}
                              onClick={() => openModal(c.documentPath)}
                                 title={t("viewDetails")}
                            >
                              <FiFile />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className={styles.noCases}>
                          {searchTerm ? t("noCasesFound") : t("tryAdjusting")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredCases.length > CASES_PER_PAGE && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={styles.pageNavButton}
                >
                  <FiChevronLeft />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = index + 1;
                  } else if (currentPage <= 3) {
                    pageNum = index + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + index;
                  } else {
                    pageNum = currentPage - 2 + index;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageButton} ${currentPage === pageNum ? styles.activePage : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={styles.pageNavButton}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
 

{isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      {/* Header with only close button and download */}
      <div className={styles.modalHeader}>
        <button className={styles.closeModal} onClick={closeModal}>
          <FiX />
        </button>
        <a 
          href={`${import.meta.env.VITE_API_URL}/uploads/${selectedFiles[currentFileIndex]}`} 
          download
          className={styles.downloadBtn}
        >
          <FiDownload /> Download
        </a>
      </div>

      {/* Main Content - Only Image/Document */}
      <div className={styles.documentViewer}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedFiles[currentFileIndex]}`}
            alt="Document"
            className={styles.documentImage}
          />
        ) : (
          <iframe
            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedFiles[currentFileIndex]}#view=fitH`}
            title="Document"
            className={styles.documentIframe}
          />
        )}
      </div>

      {/* Simple Navigation - Always Visible */}
      <div className={styles.navigation}>
        <button
          className={`${styles.navButton} ${currentFileIndex === 0 ? styles.disabled : ''}`}
          onClick={() => setCurrentFileIndex(p => Math.max(0, p - 1))}
          disabled={currentFileIndex === 0}
        >
          <FiChevronLeft /> {t("previous")}
        </button>
        
        <span className={styles.pageCounter}>
          {currentFileIndex + 1}/{selectedFiles.length}
        </span>
        
        <button
          className={`${styles.navButton} ${currentFileIndex === selectedFiles.length - 1 ? styles.disabled : ''}`}
          onClick={() => setCurrentFileIndex(p => Math.min(selectedFiles.length - 1, p + 1))}
          disabled={currentFileIndex === selectedFiles.length - 1}
        >
          {t("next")} <FiChevronRight />
        </button>
      </div>
    </div>
  </div>
)}




      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
                <h3>{t("confirmStatusChange")}</h3>
            <p>
            {t("areYouSure")}{" "}
              <span className={`${styles.confirmStatus} ${
                newStatus === 'Completed' ? styles.statusCompleted :
                newStatus === 'Cancelled' ? styles.statusCancelled :
                newStatus === 'In Progress' ? styles.statusInProgress :
                styles.statusPending
              }`}>
                  {t(newStatus.toLowerCase())}
              </span>?
            </p>
            <div className={styles.confirmButtons}>
              <button
                onClick={confirmStatusChange}
                className={styles.confirmButton}
              >
                 {t("confirm")}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={styles.cancelButton}
              >
                  {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseList;










