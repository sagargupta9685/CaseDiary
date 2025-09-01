import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './Miscellaneous.module.css';
import FilePreviewModal from './FilePreviewModal';
import { useTranslation } from 'react-i18next';

const Miscellaneous = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const recordsPerPage = 6;

  // Fetch records
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios
      .get('${import.meta.env.VITE_API_URL}/api/other/records', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Open modal with files and selected index
  const openModal = (filesArray, index = 0) => {
    setCurrentFiles(filesArray || []);
    setCurrentFileIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) return <p className={styles.loading}>Loading records...</p>;

  // Filter search results
  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Download Excel
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t("miscellaneousRecords")}</h1>

      <div className={styles.topActions}>
        <input
          type="text"
          placeholder="Search records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={downloadExcel} className={styles.downloadButton}>
            {t("downloadExcel")}
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <p>{t("noRecordsFound")}</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t("unit_name")}</th>
                <th>{t("description")}</th>
                <th>{t("url")}</th>
                <th>{t("noc_date")}</th>
                <th>{t("valid_till")} </th>
                <th> {t("notification_days")}</th>
                <th>{t("document_upload")}</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, i) => {
                const baseURL = '${import.meta.env.VITE_API_URL}';
                const filesArray = record.document_path
                  ? record.document_path.split(',').map((u) => `${baseURL}/${u.trim()}`)
                  : [];

                return (
                  <tr key={i}>
                    <td>{record.unit_name}</td>
                    <td>{record.description}</td>
                    <td>
                      <a href={record.url} target="_blank" rel="noreferrer">
                        {record.url}
                      </a>
                    </td>
                    <td>{formatDate(record.noc_date)}</td>
                    <td>{formatDate(record.valid_till)}</td>
                    <td>{record.notification_days}</td>
                    <td>
                      {filesArray.length > 0 ? (
                        filesArray.map((file, index) => (
                          <div key={index}>
                            <button
                              onClick={() => openModal(filesArray, index)}
                              className={styles.viewButton}
                            >
                                {t("view")} {index + 1}
                            </button>
                          </div>
                        ))
                      ) : (
                      <span>{t("noDocument")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <ul className={styles.pagination}>
            <li>
              <button
                className={styles.paginationButton}
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t("previous")}
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <li key={number}>
                <button
                  className={`${styles.paginationButton} ${
                    currentPage === number ? styles.active : ''
                  }`}
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
                {t("next")}
              </button>
            </li>
          </ul>
        </>
      )}

      {/* File Preview Modal */}
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
