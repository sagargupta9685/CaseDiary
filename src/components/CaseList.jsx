import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseList.module.css';
import { FiSearch, FiFile, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaRegCheckCircle, FaRegTimesCircle, FaSpinner, FaPauseCircle } from 'react-icons/fa';

function CaseList() {
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
      const res = await axios.get(`http://localhost:5000/api/addcase/${userId}`, {
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
      await axios.put(`http://localhost:5000/api/addcase/update-status/${selectedCaseId}`,
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

  // const openModal = (filePath) => {
  //   setSelectedFile(`http://localhost:5000/uploads/${filePath}`);
  //   setIsModalOpen(true);
  // };

  const openModal = (filePath) => {
  const files = filePath.split(','); // string ko array mein badlo
  setSelectedFile(files); 
  setCurrentFileIndex(0);// array set karo
  setIsModalOpen(true);
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
          <h2 className={styles.header}>My Cases</h2>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search cases..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Loading cases...</p>
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Case No</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Parties</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length > 0 ? (
                    currentCases.map((c) => (
                      <tr key={c.id}>
                        <td data-label="Case No" className={styles.caseNoCell}>
                          <span className={styles.caseNoBadge}>{c.caseNo}</span>
                        </td>
                        <td data-label="Title" className={styles.titleCell}>
                          {c.title}
                          <div className={styles.descriptionTooltip}>
                            {c.shortDescription}
                          </div>
                        </td>
                        <td data-label="Date">
                          {new Date(c.caseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td data-label="Type">{c.caseType}</td>
                        <td data-label="Parties">
                          <div className={styles.parties}>
                            <span className={styles.plaintiff}>{c.plaintiff}</span>
                            <span className={styles.vs}>vs</span>
                            <span className={styles.defender}>{c.defender}</span>
                          </div>
                        </td>
                        <td data-label="Status">
                          <div className={`${styles.status} ${
                            c.status === 'Pending' ? styles.statusPending :
                            c.status === 'Completed' ? styles.statusCompleted :
                            c.status === 'Cancelled' ? styles.statusCancelled :
                            styles.statusInProgress
                          }`}>
                            {getStatusIcon(c.status)}
                            {c.status}
                          </div>
                        </td>
                        <td data-label="Actions" className={styles.actionsCell}>
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={styles.statusDropdown}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          {c.documentPath && (
                            <button
                              className={styles.viewButton}
                              onClick={() => openModal(c.documentPath)}
                              title="View document"
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
                        {searchTerm ? 'No cases match your search' : 'No cases found'}
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

      {/* {isModalOpen && selectedFile && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>✖</button>
            <div className={styles.modalHeader}>
              <h3>Document Viewer</h3>
            </div>
             
            <div className={styles.modalScrollArea}>
            {selectedFile.map((file, index) => (
  <iframe
    key={index}
    src={`http://localhost:5000/uploads/${file}`}
    title={`Document ${index + 1}`}
    className={styles.documentViewer}
  />
))}
</div>
          </div>
        </div>
      )} */}


{isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>Document Viewer</h3>
      </div>

      <iframe
        src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
        title={`Document ${currentFileIndex + 1}`}
        className={styles.documentViewer}
      />

      <div className={styles.carouselControls}>
        <button
          onClick={() => setCurrentFileIndex((prev) => prev - 1)}
          disabled={currentFileIndex === 0}
          className={styles.navButton}
        >
          ⬅ Prev
        </button>

        <span className={styles.fileCount}>
          {currentFileIndex + 1} / {selectedFiles.length}
        </span>

        <button
          onClick={() => setCurrentFileIndex((prev) => prev + 1)}
          disabled={currentFileIndex === selectedFiles.length - 1}
          className={styles.navButton}
        >
          Next ➡
        </button>
      </div>
    </div>
  </div>
)}



      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Status Change</h3>
            <p>
              Are you sure you want to change the status to{' '}
              <span className={`${styles.confirmStatus} ${
                newStatus === 'Completed' ? styles.statusCompleted :
                newStatus === 'Cancelled' ? styles.statusCancelled :
                newStatus === 'In Progress' ? styles.statusInProgress :
                styles.statusPending
              }`}>
                {newStatus}
              </span>?
            </p>
            <div className={styles.confirmButtons}>
              <button
                onClick={confirmStatusChange}
                className={styles.confirmButton}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseList;