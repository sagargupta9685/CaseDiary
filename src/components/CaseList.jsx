import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './CaseList.module.css';
import { 
  FiSearch, 
  FiFile, 
  FiChevronLeft, 
  FiChevronRight,
  FiDownload,
  FiX
} from 'react-icons/fi';
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


{/* {isModalOpen && selectedFiles.length > 0 && (
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
)} */}



{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>Document Viewer ({currentFileIndex + 1}/{selectedFiles.length})</h3>
      </div>

      <iframe
        src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
        title={`Document ${currentFileIndex + 1}`}
        className={styles.documentViewer}
      />

      <div className={styles.carouselControls}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentFileIndex((prev) => Math.max(0, prev - 1));
          }}
          disabled={currentFileIndex === 0}
          className={styles.navButton}
        >
          ⬅ Prev
        </button>

        <div className={styles.thumbnailStrip}>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentFileIndex(index);
              }}
            >
              <span>Doc {index + 1}</span>
            </div>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentFileIndex((prev) => Math.min(selectedFiles.length - 1, prev + 1));
          }}
          disabled={currentFileIndex === selectedFiles.length - 1}
          className={styles.navButton}
        >
          Next ➡
        </button>
      </div>
    </div>
  </div>
)} */}



{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>Document {currentFileIndex + 1} of {selectedFiles.length}</h3>
      </div>

      <div className={styles.documentContainer}>
        <iframe
          src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
          title={`Document ${currentFileIndex + 1}`}
          className={styles.documentViewer}
        />
      </div>

      <div className={styles.navigationControls}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentFileIndex(prev => Math.max(0, prev - 1));
          }}
          disabled={currentFileIndex === 0}
          className={styles.navButton}
        >
          Previous
        </button>
        
        <div className={styles.pageIndicator}>
          {currentFileIndex + 1} / {selectedFiles.length}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentFileIndex(prev => Math.min(selectedFiles.length - 1, prev + 1));
          }}
          disabled={currentFileIndex === selectedFiles.length - 1}
          className={styles.navButton}
        >
          Next
        </button>
      </div>

      <div className={styles.thumbnailStrip}>
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(index);
            }}
          >
            <span>Doc {index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)} */}


{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>Documents ({currentFileIndex + 1}/{selectedFiles.length})</h3>
        <div className={styles.fileName}>
          {selectedFiles[currentFileIndex].split('/').pop()}
        </div>
      </div>

      <div className={styles.documentWrapper}>
        <iframe
          src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
          title={`Document ${currentFileIndex + 1}`}
          className={styles.documentViewer}
        />
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.navigationControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.max(0, prev - 1));
            }}
            disabled={currentFileIndex === 0}
            className={styles.navButton}
          >
            Previous
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.min(selectedFiles.length - 1, prev + 1));
            }}
            disabled={currentFileIndex === selectedFiles.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>

        <div className={styles.thumbnailStrip}>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentFileIndex(index);
              }}
              title={file.split('/').pop()}
            >
              <span className={styles.thumbnailNumber}>{index + 1}</span>
              <span className={styles.thumbnailExt}>
                {file.split('.').pop().toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)} */}


{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>Document Viewer ({currentFileIndex + 1}/{selectedFiles.length})</h3>
        <div className={styles.fileName}>
          {selectedFiles[currentFileIndex].split('/').pop()}
        </div>
      </div>

      <div className={styles.fullSizeDocumentContainer}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif)$/i) ? (
          <img 
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
            alt={`Document ${currentFileIndex + 1}`}
            className={styles.fullSizeImage}
            onLoad={(e) => {
              // Auto-zoom logic if needed
              const img = e.target;
              const container = img.parentElement;
              const scale = Math.min(
                container.clientWidth / img.naturalWidth,
                container.clientHeight / img.naturalHeight,
                1 // Don't scale up
              );
              img.style.transform = `scale(${scale})`;
            }}
          />
        ) : (
          <iframe
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
            title={`Document ${currentFileIndex + 1}`}
            className={styles.fullSizeIframe}
          />
        )}
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.navigationControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.max(0, prev - 1));
            }}
            disabled={currentFileIndex === 0}
            className={styles.navButton}
          >
            Previous
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.min(selectedFiles.length - 1, prev + 1));
            }}
            disabled={currentFileIndex === selectedFiles.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>

        <div className={styles.thumbnailStrip}>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentFileIndex(index);
              }}
              title={file.split('/').pop()}
            >
              <span className={styles.thumbnailNumber}>{index + 1}</span>
              <span className={styles.thumbnailExt}>
                {file.split('.').pop().toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)} */}


{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      <div className={styles.modalHeader}>
        <h3>{selectedFiles[currentFileIndex].split('/').pop()}</h3>
        <div className={styles.fileCounter}>
          {currentFileIndex + 1} of {selectedFiles.length}
        </div>
      </div>

      <div className={styles.documentContainer}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
          // Image Viewer
          <div className={styles.imageViewer}>
            <img
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
              alt={`Document ${currentFileIndex + 1}`}
              className={styles.documentImage}
              onLoad={(e) => {
                // Auto-fit logic
                const img = e.target;
                const container = img.parentElement.parentElement;
                const scale = Math.min(
                  container.clientWidth / img.naturalWidth,
                  container.clientHeight / img.naturalHeight,
                  1 // Don't scale up
                );
                img.style.transform = `scale(${scale})`;
              }}
            />
            <div className={styles.zoomControls}>
              <button onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest(`.${styles.imageViewer}`).querySelector('img');
                const currentScale = parseFloat(img.style.transform.replace('scale(', '').replace(')', '')) || 1;
                img.style.transform = `scale(${Math.min(currentScale + 0.2, 3)})`;
              }}>+</button>
              <button onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest(`.${styles.imageViewer}`).querySelector('img');
                const currentScale = parseFloat(img.style.transform.replace('scale(', '').replace(')', '')) || 1;
                img.style.transform = `scale(${Math.max(currentScale - 0.2, 0.5)})`;
              }}>-</button>
              <button onClick={(e) => {
                e.stopPropagation();
                const img = e.target.closest(`.${styles.imageViewer}`).querySelector('img');
                img.style.transform = 'scale(1)';
              }}>Reset</button>
            </div>
          </div>
        ) : selectedFiles[currentFileIndex].match(/\.(pdf)$/i) ? (
          // PDF Viewer
          <div className={styles.pdfViewer}>
            <iframe
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}#view=fitH`}
              title={`Document ${currentFileIndex + 1}`}
              className={styles.documentIframe}
            />
          </div>
        ) : (
          // Generic Viewer (for other file types)
          <div className={styles.genericViewer}>
            {selectedFiles[currentFileIndex].match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i) ? (
              <div className={styles.officeFileMessage}>
                <p>This document type cannot be previewed directly. Please download the file to view it.</p>
                <a 
                  href={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`} 
                  download
                  className={styles.downloadButton}
                >
                  Download File
                </a>
              </div>
            ) : (
              <iframe
                src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
                title={`Document ${currentFileIndex + 1}`}
                className={styles.documentIframe}
              />
            )}
          </div>
        )}
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.navigationControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.max(0, prev - 1));
            }}
            disabled={currentFileIndex === 0}
            className={styles.navButton}
          >
            Previous
          </button>
          
          <div className={styles.thumbnailStrip}>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFileIndex(index);
                }}
                title={file.split('/').pop()}
              >
                {file.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                  <img 
                    src={`http://localhost:5000/uploads/${file}`} 
                    alt={`Thumbnail ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                ) : (
                  <div className={styles.fileTypeIcon}>
                    {file.split('.').pop().toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.min(selectedFiles.length - 1, prev + 1));
            }}
            disabled={currentFileIndex === selectedFiles.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>

        <div className={styles.documentActions}>
          <a 
            href={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`} 
            download
            className={styles.downloadButton}
          >
            Download
          </a>
          <span className={styles.fileInfo}>
            {selectedFiles[currentFileIndex].split('/').pop()} • 
            {selectedFiles[currentFileIndex].split('.').pop().toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  </div>
)} */}

{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      

      <div className={styles.documentWrapper}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
          <div className={styles.imageContainer}>
            <img
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
              alt={`Document ${currentFileIndex + 1}`}
              className={styles.documentImage}
              onLoad={(e) => {
                const img = e.target;
                const container = e.target.parentElement;
            
                if (img.naturalWidth > container.clientWidth || 
                    img.naturalHeight > container.clientHeight) {
                  const scale = Math.min(
                    container.clientWidth / img.naturalWidth,
                    container.clientHeight / img.naturalHeight
                  );
                  img.style.transform = `scale(${scale})`;
                }
              }}
            />
          </div>
        ) : (
          <iframe
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
            title={`Document ${currentFileIndex + 1}`}
            className={styles.documentIframe}
          />
        )}
      </div>

    
      <div className={styles.fixedControls}>
        <div className={styles.navigationControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.max(0, prev - 1));
            }}
            disabled={currentFileIndex === 0}
            className={styles.navButton}
          >
            Previous
          </button>
          
          <div className={styles.thumbnailStrip}>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentFileIndex(index);
                }}
              >
                {file.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                  <img 
                    src={`http://localhost:5000/uploads/${file}`} 
                    alt={`Thumbnail ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                ) : (
                  <div className={styles.fileTypeIcon}>
                    {file.split('.').pop().toUpperCase()}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentFileIndex(prev => Math.min(selectedFiles.length - 1, prev + 1));
            }}
            disabled={currentFileIndex === selectedFiles.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  
)} */}

{/* 
{isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeModal} onClick={closeModal}>✖</button>
      
      <div className={styles.modalHeader}>
        <h3>{selectedFiles[currentFileIndex].split('/').pop()}</h3>
        <div className={styles.fileCounter}>
          {currentFileIndex + 1} / {selectedFiles.length}
        </div>
      </div>

    
      <div className={styles.documentArea}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
          <div className={styles.imageViewer}>
            <img
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
              alt="Document"
              className={styles.documentImage}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        ) : selectedFiles[currentFileIndex].match(/\.(pdf)$/i) ? (
          <div className={styles.pdfViewer}>
            <iframe
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}#view=fitH`}
              title="PDF Document"
              className={styles.pdfIframe}
            />
          </div>
        ) : (
          <div className={styles.genericViewer}>
            <iframe
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
              title="Document"
              className={styles.genericIframe}
            />
          </div>
        )}
      </div>

     
      <div className={styles.bottomControls}>
        <button
          className={styles.navButton}
          onClick={() => setCurrentFileIndex(p => Math.max(0, p - 1))}
          disabled={currentFileIndex === 0}
        >
          Previous
        </button>
        
        <div className={styles.thumbnailStrip}>
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className={`${styles.thumbnail} ${currentFileIndex === index ? styles.activeThumbnail : ''}`}
              onClick={() => setCurrentFileIndex(index)}
            >
              {file.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
                <img 
                  src={`http://localhost:5000/uploads/${file}`} 
                  alt="Thumbnail"
                  className={styles.thumbnailImage}
                />
              ) : (
                <div className={styles.fileTypeIcon}>
                  {file.split('.').pop().toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <button
          className={styles.navButton}
          onClick={() => setCurrentFileIndex(p => Math.min(selectedFiles.length - 1, p + 1))}
          disabled={currentFileIndex === selectedFiles.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  </div>
)} */}


{/* {isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <div className={styles.fileInfo}>
          <h3 className={styles.fileName}>{selectedFiles[currentFileIndex].split('/').pop()}</h3>
          <span className={styles.fileDate}>{new Date().toLocaleDateString()}</span>
        </div>
        <div className={styles.headerActions}>
          <a 
            href={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`} 
            download
            className={styles.downloadBtn}
          >
            <FiDownload /> Download
          </a>
          <button className={styles.closeModal} onClick={closeModal}>
            <FiX />
          </button>
        </div>
      </div>

      <div className={styles.documentContainer}>
        {selectedFiles[currentFileIndex].match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i) ? (
          <div className={styles.imageViewer}>
            <img
              src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
              alt="Document"
              className={styles.documentImage}
            />
          </div>
        ) : (
          <iframe
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}#view=fitH`}
            title="Document"
            className={styles.documentIframe}
          />
        )}
      </div>

      

        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${currentFileIndex === 0 ? styles.disabled : ''}`}
            onClick={() => setCurrentFileIndex(p => Math.max(0, p - 1))}
            disabled={currentFileIndex === 0}
          >
            <FiChevronLeft /> Previous
          </button>
          
          <div className={styles.pageIndicator}>
            {currentFileIndex + 1} of {selectedFiles.length}
          </div>
          
          <button
            className={`${styles.navButton} ${currentFileIndex === selectedFiles.length - 1 ? styles.disabled : ''}`}
            onClick={() => setCurrentFileIndex(p => Math.min(selectedFiles.length - 1, p + 1))}
            disabled={currentFileIndex === selectedFiles.length - 1}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  
)} */}

{isModalOpen && selectedFiles.length > 0 && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      {/* Header with only close button and download */}
      <div className={styles.modalHeader}>
        <button className={styles.closeModal} onClick={closeModal}>
          <FiX />
        </button>
        <a 
          href={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`} 
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
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}`}
            alt="Document"
            className={styles.documentImage}
          />
        ) : (
          <iframe
            src={`http://localhost:5000/uploads/${selectedFiles[currentFileIndex]}#view=fitH`}
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
          <FiChevronLeft /> Previous
        </button>
        
        <span className={styles.pageCounter}>
          {currentFileIndex + 1}/{selectedFiles.length}
        </span>
        
        <button
          className={`${styles.navButton} ${currentFileIndex === selectedFiles.length - 1 ? styles.disabled : ''}`}
          onClick={() => setCurrentFileIndex(p => Math.min(selectedFiles.length - 1, p + 1))}
          disabled={currentFileIndex === selectedFiles.length - 1}
        >
          Next <FiChevronRight />
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










