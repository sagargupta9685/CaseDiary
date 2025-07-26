import React, { useState } from 'react';
import axios from 'axios';
import styles from './caseForm.module.css';

function AddCaseForm() {
  const [court, setCourt] = useState('');
  const [forum, setForum] = useState('');
  const [caseType, setCaseType] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [caseDate, setCaseDate] = useState('');
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [plaintiff, setPlaintiff] = useState('');
  const [defender, setDefender] = useState('');
  const [address, setAddress] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courts = ['Supreme Court', 'High Court', 'District Court', 'Family Court', 'Consumer Court', 'Labour Court', 'Tribunal'];
  
  const forumMap = {
    'High Court': ['MP High Court at Jabalpur', 'Indore Bench', 'Gwalior Bench'],
    'District Court': ['District Court Jabalpur'],
    'Family Court': ['Family Court Jabalpur'],
    'Consumer Court': ['Consumer Court Jabalpur'],
    'Labour Court': ['Labour Court Jabalpur'],
    'Tribunal': ['Tribunal Jabalpur'],
    'Supreme Court': ['Supreme Court of India'],
  };

  const forumCaseTypeMap = {
    'MP High Court at Jabalpur': ['WP', 'MA', 'FA', 'SA', 'CONT', 'CRR', 'MCRC', 'MCC', 'ARB', 'WA'],
    'District Court Jabalpur': ['Civil', 'Criminal', 'Property'],
    'Family Court Jabalpur': ['Divorce', 'Child Custody'],
    'Consumer Court Jabalpur': ['Consumer Complaint'],
    'Labour Court Jabalpur': ['Wages', 'Termination'],
    'Tribunal Jabalpur': ['Tax Appeal'],
    'Supreme Court of India': ['SLP', 'Writ', 'Appeal']
  };

  const handleCourtChange = (e) => {
    const selectedCourt = e.target.value;
    setCourt(selectedCourt);
    setForum('');
    setCaseType('');
  };

  const handleForumChange = (e) => {
    const selectedForum = e.target.value;
    setForum(selectedForum);
    setCaseType('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('userId', user?.id);
    formData.append('court', court);
    formData.append('forum', forum);
    formData.append('caseType', caseType);
    formData.append('caseNo', caseNo);
    formData.append('caseDate', caseDate);
    formData.append('title', title);
    formData.append('shortDescription', shortDescription);
    formData.append('plaintiff', plaintiff);
    formData.append('defender', defender);
    formData.append('address', address);

    for (let i = 0; i < documents.length; i++) {
      formData.append('documents', documents[i]);
    }

    try {
      await axios.post('http://localhost:5000/api/addcase/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success notification
      document.querySelector(`.${styles.notification}`).classList.add(styles.show);
      setTimeout(() => {
        document.querySelector(`.${styles.notification}`).classList.remove(styles.show);
      }, 3000);

      // Reset form
      setCourt('');
      setForum('');
      setCaseType('');
      setCaseNo('');
      setCaseDate('');
      setTitle('');
      setShortDescription('');
      setPlaintiff('');
      setDefender('');
      setAddress('');
      setDocuments([]);
    } catch (error) {
      console.error(error);
      document.querySelector(`.${styles.notificationError}`).classList.add(styles.show);
      setTimeout(() => {
        document.querySelector(`.${styles.notificationError}`).classList.remove(styles.show);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.notification}>
          <span className={styles.notificationIcon}>✓</span>
          Case added successfully!
        </div>
        <div className={styles.notificationError}>
          <span className={styles.notificationIcon}>✕</span>
          Failed to add case
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h2 className={styles.heading}>Add New Case</h2>
            <p className={styles.subHeading}>Fill in the details below to register a new case</p>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Court
                <select 
                  value={court} 
                  onChange={handleCourtChange} 
                  className={styles.formControl} 
                  required
                >
                  <option value="">Select Court</option>
                  {courts.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Forum
                <select 
                  value={forum} 
                  onChange={handleForumChange} 
                  className={styles.formControl} 
                  required
                  disabled={!court}
                >
                  <option value="">Select Forum</option>
                  {(forumMap[court] || []).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Case Type
                <select 
                  value={caseType} 
                  onChange={(e) => setCaseType(e.target.value)} 
                  className={styles.formControl} 
                  required
                  disabled={!forum}
                >
                  <option value="">Select Case Type</option>
                  {(forumCaseTypeMap[forum] || []).map((ct) => (
                    <option key={ct} value={ct}>{ct}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Case Number
                <input 
                  type="text" 
                  value={caseNo} 
                  onChange={(e) => setCaseNo(e.target.value)} 
                  className={styles.formControl} 
                  required 
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Case Date
                <input 
                  type="date" 
                  value={caseDate} 
                  onChange={(e) => setCaseDate(e.target.value)} 
                  className={styles.formControl} 
                  required 
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Case Title
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className={styles.formControl} 
                  required 
                />
              </label>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.inputLabel}>
                Short Description
                <textarea 
                  value={shortDescription} 
                  onChange={(e) => setShortDescription(e.target.value)} 
                  className={styles.formControl} 
                  rows="3" 
                  required 
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Plaintiff
                <input 
                  type="text" 
                  value={plaintiff} 
                  onChange={(e) => setPlaintiff(e.target.value)} 
                  className={styles.formControl} 
                  required 
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.inputLabel}>
                Defendant
                <input 
                  type="text" 
                  value={defender} 
                  onChange={(e) => setDefender(e.target.value)} 
                  className={styles.formControl} 
                  required 
                />
              </label>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.inputLabel}>
                Defendant Address
                <textarea 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  className={styles.formControl} 
                  rows="2" 
                  required 
                />
              </label>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.fileUploadLabel}>
                Upload Documents
                <div className={styles.fileUploadWrapper}>
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => setDocuments([...e.target.files])} 
                    className={styles.fileInput} 
                  />
                  <div className={styles.fileUploadContent}>
                    <span className={styles.fileUploadIcon}>📎</span>
                    <span className={styles.fileUploadText}>
                      {documents.length > 0 
                        ? `${documents.length} file(s) selected` 
                        : 'Click to browse or drag files here'}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              'Submit Case'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCaseForm;