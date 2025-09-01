import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './addland.module.css';
import { useTranslation } from 'react-i18next';

const LandRecordForm = () => {
   const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  // const [tehsils, setTehsils] = useState([]);
  // const [ruralUrbanAreas, setRuralUrbanAreas] = useState([]);

  const [formData, setFormData] = useState({
    landId: '',
    location: '',
    area: '',
    ownershipDetails: '',
    land_type: '',                
    state_id: '',                
    district_id: '',              
    tehsil_id: '',               
    rural_urban_area_id: '',      
    khasra_number: '',
    status: '',
    marketValue: '',             
    remarks: '',                  
    file: []
  });

  useEffect(() => {

    axios.get(`${import.meta.env.VITE_API_URL}/api/land/states`)

      .then(res => setStates(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.state_id) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/land/districts/${formData.state_id}`)
        .then(res => setDistricts(res.data));
    } else {
      setDistricts([]);
    }
    setFormData(prev => ({ ...prev, district_id: '' }));

  }, [formData.state_id]);

   

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
     setFormData(prev => ({ ...prev, file: Array.from(e.target.files) }));
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  if (!userId) {
    alert('Invalid user session. Please login again.');
    return;
  }

  data.append('user_id', userId);

  for (const key in formData) {
    if (key === 'file') {
      formData.file.forEach(f => data.append('files', f)); // append files array
    } else {
      data.append(key, formData[key]);
    }
  }

  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/land/add`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Land record saved successfully!');
    // Reset form
    setFormData({
      landId: '', location: '', area: '', ownershipDetails: '',
      land_type: '', state_id: '', district_id: '', tehsil_id: '',
      rural_urban_area_id: '', khasra_number: '', status: '',
      marketValue: '', remarks: '', file: []
    });
    setDistricts([]);
  } catch (error) {
    console.error(error);
    alert('Error saving land record.');
  }
};

  
return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('landRecordManagement')}</h1>
        <p className={styles.subtitle}>{t('fillDetails')}</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>{t('landId')}</label>
          <input
            className={styles.formInput}
            name="landId"
            placeholder={t('enterLandId')}
            value={formData.landId}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('location')}</label>
          <input
            className={styles.formInput}
            name="location"
            placeholder={t('enterLocation')}
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('area')}</label>
          <input
            className={styles.formInput}
            name="area"
            placeholder={t('enterArea')}
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('ownershipDetails')}</label>
          <input
            className={styles.formInput}
            name="ownershipDetails"
            placeholder={t('enterOwnership')}
            value={formData.ownershipDetails}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('landType')}</label>
          <input
            className={styles.formInput}
            name="land_type"
            placeholder={t('enterLandType')}
            value={formData.land_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('state')}</label>
          <select
            className={styles.formSelect}
            name="state_id"
            value={formData.state_id}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectState')}</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>{t('district')}</label>
          <select
            className={styles.formSelect}
            name="district_id"
            value={formData.district_id}
            onChange={handleChange}
            required
          >
            <option value="">{t('selectDistrict')}</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>{t('tehsil')}</label>
          <input
            className={styles.formInput}
            name="tehsil_id"
            placeholder={t('enterTehsil')}
            value={formData.tehsil_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('areaType')}</label>
          <input
            className={styles.formInput}
            name="rural_urban_area_id"
            placeholder={t('enterAreaType')}
            value={formData.rural_urban_area_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('khasra')}</label>
          <input
            className={styles.formInput}
            name="khasra_number"
            placeholder={t('enterKhasra')}
            value={formData.khasra_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('status')}</label>
          <input
            className={styles.formInput}
            name="status"
            placeholder={t('enterStatus')}
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>{t('marketValue')}</label>
          <input
            className={styles.formInput}
            name="marketValue"
            placeholder={t('enterMarketValue')}
            value={formData.marketValue}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label>{t('remarks')}</label>
          <textarea
            className={styles.formTextarea}
            name="remarks"
            placeholder={t('enterRemarks')}
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        <div className={styles.fileInputContainer} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.fileInputLabel}>{t('uploadDoc')}</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className={styles.fileInput}
            multiple
            required
          />
        </div>

        <button type="submit" className={styles.submitButton} style={{ gridColumn: '1 / -1' }}>
          {t('registerLand')}
        </button>
      </form>
    </div>
  );
};
export default LandRecordForm;