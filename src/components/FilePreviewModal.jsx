import React, { useState, useEffect } from 'react';
import styles from './FilePreviewModal.module.css';

const FilePreviewModal = ({ files, currentIndex = 0, onClose }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(currentIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFileIndex, onClose]);

  const handlePrevious = () => {
    setCurrentFileIndex((prev) => (prev > 0 ? prev - 1 : files.length - 1));
  };

  const handleNext = () => {
    setCurrentFileIndex((prev) => (prev < files.length - 1 ? prev + 1 : 0));
  };

  const renderFile = () => {
    const fileUrl = files[currentFileIndex]?.trim();
    if (!fileUrl) return null;

    const extension = fileUrl.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return (
        <div className={styles.imageContainer}>
          <img 
            src={fileUrl} 
            alt={`Document ${currentFileIndex + 1}`} 
            className={styles.fileContent}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23ccc"><rect width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="Arial" font-size="12">Image not available</text></svg>';
            }}
          />
        </div>
      );
    } else if (extension === 'pdf') {
      return (
        <div className={styles.pdfContainer}>
          <iframe 
            src={fileUrl} 
            title={`PDF Document ${currentFileIndex + 1}`}
            className={styles.fileContent}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.unsupportedFile}>
          <p>Unsupported file type: .{extension}</p>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.downloadLink}
          >
            Download File
          </a>
        </div>
      );
    }
  };

  if (!files || files.length === 0) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <div className={styles.fileWrapper}>
          {renderFile()}
        </div>
        
        <div className={styles.navigation}>
          <button 
            className={styles.navButton} 
            onClick={handlePrevious}
            aria-label="Previous file"
          >
            &larr;
          </button>
          
          <span className={styles.counter}>
            {currentFileIndex + 1} / {files.length}
          </span>
          
          <button 
            className={styles.navButton} 
            onClick={handleNext}
            aria-label="Next file"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;