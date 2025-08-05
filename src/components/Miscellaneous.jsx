import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './landRecord.module.css';
import FilePreviewModal from './FilePreviewModal';

const Miscellaneous = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const recordsPerPage = 6;

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:5000/api/other/records', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const openModal = (filePath, index = 0) => {
    const filesArray = filePath?.split(',').map(url => url.trim());
    setCurrentFiles(filesArray || []);
    setCurrentFileIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) return <p className={styles.loading}>Loading records...</p>;

  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Miscellaneous Records');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'miscellaneous_records.xlsx');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Miscellaneous Records</h1>

      <div className={styles.topActions}>
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={downloadExcel} className={styles.downloadButton}>
          Download Excel
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Unit Name</th>
                <th>Description</th>
                <th>URL</th>
                <th>NOC Date</th>
                <th>Valid Till</th>
                <th>Notification Days</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, i) => (
                <tr key={i}>
                  <td>{record.unit_name}</td>
                  <td>{record.description}</td>
                  <td>
                    <a href={record.url} target="_blank" rel="noreferrer">
                      {record.url}
                    </a>
                  </td>
                  <td>{record.noc_date}</td>
                  <td>{record.valid_till}</td>
                  <td>{record.notification_days}</td>
                  <td>
                    {record.document_path ? (
                      record.document_path.split(',').map((url, index) => (
                        <div key={index}>
                          <button
                            onClick={() => openModal(record.document_path, index)}
                            className={styles.viewButton}
                          >
                            View {index + 1}
                          </button>
                        </div>
                      ))
                    ) : (
                      <span>No Document</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className={styles.pagination}>
            <li>
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <li key={number}>
                <button
                  className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li>
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </>
      )}

      {modalOpen && (
        <FilePreviewModal
          files={currentFiles}
          currentIndex={currentFileIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Miscellaneous;
