import React, { useState } from 'react';
import axios from 'axios';
import styles from './caseForm.module.css';
import { useTranslation } from 'react-i18next';

function AddCaseForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

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
    setCourt(e.target.value);
    setForum('');
    setCaseType('');
  };

  const handleForumChange = (e) => {
    setForum(e.target.value);
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
      await axios.post('${import.meta.env.VITE_API_URL}/api/addcase/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      document.querySelector(`.${styles.notification}`).classList.add(styles.show);
      setTimeout(() => {
        document.querySelector(`.${styles.notification}`).classList.remove(styles.show);
      }, 3000);

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
      setStep(1);
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

  const renderStep1 = () => (
    <>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>
          {t('court')}
          <select value={court} onChange={handleCourtChange} className={styles.formControl} required>
            <option value="">{t('selectCourt')}</option>
            {courts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>
          {t('forum')}
          <select value={forum} onChange={handleForumChange} className={styles.formControl} required disabled={!court}>
            <option value="">{t('selectForum')}</option>
            {(forumMap[court] || []).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>
          {t('caseType')}
          <select value={caseType} onChange={(e) => setCaseType(e.target.value)} className={styles.formControl} required disabled={!forum}>
            <option value="">{t('selectCaseType')}</option>
            {(forumCaseTypeMap[forum] || []).map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>{t('caseNo')}
          <input type="text" value={caseNo} onChange={(e) => setCaseNo(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>{t('caseDate')}
          <input type="date" value={caseDate} onChange={(e) => setCaseDate(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>{t('caseTitle')}
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.inputLabel}>{t('shortDescription')}
          <textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>{t('plaintiff')}
          <input type="text" value={plaintiff} onChange={(e) => setPlaintiff(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.inputLabel}>{t('defendant')}
          <input type="text" value={defender} onChange={(e) => setDefender(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.inputLabel}>{t('defendantAddress')}
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className={styles.formControl} required />
        </label>
      </div>
    </>
  );

 const renderStep3 = () => (
    <>
      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
        <label className={styles.fileUploadLabel}>{t('uploadDocuments')}
          <div className={styles.fileUploadWrapper}>
            <input type="file" multiple onChange={(e) => setDocuments([...e.target.files])} className={styles.fileInput} />
            <div className={styles.fileUploadContent}>
              <span className={styles.fileUploadIcon}>📎</span>
              <span className={styles.fileUploadText}>
                {documents.length > 0
                  ? `${documents.length} ${t('filesSelected')}`
                  : t('uploadHint')}
              </span>
            </div>
          </div>
        </label>
      </div>
    </>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.notification}><span className={styles.notificationIcon}>✓</span> {t('caseAdded')}</div>
        <div className={styles.notificationError}><span className={styles.notificationIcon}>✕</span> {t('caseAddFailed')}</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formHeader}>
            <h2 className={styles.heading}>{t('addNewCase')}</h2>
            <p className={styles.subHeading}>{t('step')} {step} {t('of')} 3</p>
          </div>

          <div className={styles.formGrid}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>

          <div className={styles.buttonGroup}>
            {step > 1 && (
              <button type="button" onClick={() => setStep(step - 1)} className={styles.submitButton}>{t('back')}</button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className={styles.submitButton}
              >
                {t('next')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || documents.length === 0}
                className={styles.submitButton}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span> {t('processing')}
                  </>
                ) : (
                  t('submitCase')
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCaseForm;
