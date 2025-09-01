import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './landRecord.module.css';
import FilePreviewModal from './FilePreviewModal';
import { useTranslation } from 'react-i18next';

const LandRecords = () => {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFiles, setCurrentFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const recordsPerPage = 6;

useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userId = user?.id;

  if (!userId || !token) {
    console.error('Missing userId or token in localStorage');
    setLoading(false);
    return;
  }

  axios.get(`${import.meta.env.VITE_API_URL}/api/land/all?userId=${userId}`, {
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


  const openModal = (filesArray, index = 0) => {
    setCurrentFiles(filesArray);
    setCurrentFileIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (loading) return <p className={styles.loading}>Loading records...</p>;

  // Filter records based on search
  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Download Excel
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Land Records');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, 'land_records.xlsx');
  };

  return (
    <div className={styles.container}>
         <h1 className={styles.heading}>{t("landRecords")}</h1>

      <div className={styles.topActions}>
        <input
          type="text"
          placeholder={t("searchRecords")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={downloadExcel} className={styles.downloadButton}>
              {t("downloadExcel")}
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                 <th>{t("landId")}</th>
                <th>{t("location")}</th>
                <th>{t("area")}</th>
                <th>{t("owner")}</th>
                <th>{t("type")}</th>
                <th>{t("state")}</th>
                <th>{t("district")}</th>
                <th>{t("tehsil")}</th>
                <th>{t("areaType")}</th>
                <th>{t("status")}</th>
                <th>{t("marketValue")}</th>
                <th>{t("remarks")}</th>
                <th>{t("document")}</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((record, i) => {
                const baseURL = '${import.meta.env.VITE_API_URL}';
               const filesArray = record.file_url
  ? record.file_url.split(',').map((url) => url.trim())
  : [];

                return (
                  <tr key={i}>
                    <td>{record.landId}</td>
                    <td>{record.location}</td>
                    <td>{record.area}</td>
                    <td>{record.ownershipDetails}</td>
                    <td>{record.land_type}</td>
                    <td>{record.state_name}</td>
                    <td>{record.district_name}</td>
                    <td>{record.tehsil_name}</td>
                    <td>{record.area_type}</td>
                    <td>{record.status}</td>
                    <td>{record.marketValue}</td>
                    <td>{record.remarks}</td>
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
                {t("next")}
              </button>
            </li>
          </ul>
        </>
      )}

      {modalOpen && (
        <FilePreviewModal files={currentFiles} currentIndex={currentFileIndex} onClose={closeModal} />
      )}
    </div>
  );
};

export default LandRecords;
