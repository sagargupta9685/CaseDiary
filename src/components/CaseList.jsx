import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseList.module.css';

function CaseList() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const CASES_PER_PAGE = 10;

  const fetchCases = async () => {
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

  const openModal = (filePath) => {
    setSelectedFile(`http://localhost:5000/uploads/${filePath}`);
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
    c.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCase = currentPage * CASES_PER_PAGE;
  const indexOfFirstCase = indexOfLastCase - CASES_PER_PAGE;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / CASES_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <h4 className={styles.header}>My Cases</h4>

      <input
        type="text"
        placeholder="Search by title..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Case No</th>
              <th>Title</th>
              <th>Case Date</th>
              <th>Case Type</th>
              <th>Court</th>
              <th>Plaintiff</th>
              <th>Defender</th>
              <th>Address</th>
              <th>Description</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>View File</th>
            </tr>
          </thead>
          <tbody>
            {currentCases.map((c) => (
              <tr key={c.id}>
                <td>{c.caseNo}</td>
                <td>{c.title}</td>
                <td>{new Date(c.caseDate).toLocaleDateString()}</td>
                <td>{c.caseType}</td>
                <td>{c.court}</td>
                <td>{c.plaintiff}</td>
                <td>{c.defender}</td>
                <td>{c.address}</td>
                <td>{c.shortDescription}</td>
                <td>
                  <span className={`${styles.status} ${
                    c.status === 'Pending' ? styles.statusPending :
                    c.status === 'Completed' ? styles.statusCompleted :
                    c.status === 'Cancelled' ? styles.statusCancelled :
                    styles.statusInProgress
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    className={styles.statusDropdown}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  {c.documentPath && (
                    <button
                      className={styles.viewButton}
                      onClick={() => openModal(c.documentPath)}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`${styles.pageButton} ${currentPage === index + 1 ? styles.activePage : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {isModalOpen && selectedFile && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={closeModal}>✖</button>
            <iframe
              src={selectedFile}
              title="Document Viewer"
              width="100%"
              height="500px"
            ></iframe>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConfirmModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>
              Are you sure you want to change the status to{' '}
              <span style={{
                color:
                  newStatus === 'Completed' ? 'green' :
                  newStatus === 'Cancelled' ? 'red' :
                  '#007bff'
              }}>
                {newStatus}
              </span>?
            </h3>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={confirmStatusChange}
                style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '6px' }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '6px' }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CaseList;
