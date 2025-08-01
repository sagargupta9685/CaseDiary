import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import styles from './landRecord.module.css';

const LandRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;

  useEffect(() => {
    axios.get('http://localhost:5000/api/land/all')
      .then(res => {
        setRecords(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Loading records...</p>;

  // Filter records based on search
  const filteredRecords = records.filter((record) =>
    Object.values(record).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Excel download function
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRecords);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Land Records');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'land_records.xlsx');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>All Land Records</h1>

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
                <th>Land ID</th>
                <th>Location</th>
                <th>Area</th>
                <th>Owner</th>
                <th>Type</th>
                <th>State</th>
                <th>District</th>
                <th>Tehsil</th>
                <th>Area Type</th>
                <th>Status</th>
                <th>Market Value</th>
                <th>Remarks</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(record => (
                <tr key={record.landId}>
                  <td>{record.landId}</td>
                  <td>{record.location}</td>
                  <td>{record.area}</td>
                  <td>{record.ownershipDetails}</td>
                  <td>{record.land_type}</td>
                  <td>{record.state_name}</td>
                  <td>{record.district_name}</td>
                  <td>{record.tehsil_name}</td>
                  <td>{record.area_type_name}</td>
                  <td>{record.status}</td>
                  <td>{record.marketValue}</td>
                  <td>{record.remarks}</td>
                  <td>
                    <a href={record.file_url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  </td>
                </tr>
              ))}
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
    </div>
  );
};

export default LandRecords;
