import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './addland.module.css';

const LandRecordForm = () => {
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
    axios.get('http://localhost:5000/api/land/states')
      .then(res => setStates(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.state_id) {
      axios.get(`http://localhost:5000/api/land/districts/${formData.state_id}`)
        .then(res => setDistricts(res.data));
    } else {
      setDistricts([]);
    }
    setFormData(prev => ({ ...prev, district_id: '' }));

  }, [formData.state_id]);

  // useEffect(() => {
  //   if (formData.district_id) {
  //     axios.get(`http://localhost:5000/api/land/tehsils/${formData.district_id}`)
  //       .then(res => setTehsils(res.data));
  //   } else {
  //     setTehsils([]);
  //   }
  //   setFormData(prev => ({ ...prev, tehsil_id: '' }));
  // }, [formData.district_id]);

  // useEffect(() => {
  //   if (formData.tehsil_id) {
  //     axios.get(`http://localhost:5000/api/land/rural-urban/${formData.tehsil_id}`)
  //       .then(res => setRuralUrbanAreas(res.data))
  //       .catch(err => console.error(err));
  //   } else {
  //     setRuralUrbanAreas([]);
  //   }
  // }, [formData.tehsil_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
     setFormData(prev => ({ ...prev, file: Array.from(e.target.files) }));
  };

//  const handleSubmit = async e => {
//   e.preventDefault();
//   const data = new FormData();

//   // Add user_id from localStorage
//  const user = JSON.parse(localStorage.getItem('user'));
    
//   data.append('user_id', userId);

//   for (const key in formData) {
//     if (key === 'file') {
//       formData.file.forEach(f => data.append('files', f)); // append files array
//     } else {
//       data.append(key, formData[key]);
//     }
//   }

//   try {
//     await axios.post('http://localhost:5000/api/land/add', data, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     alert('Land record saved successfully!');
//     // Reset form
//     setFormData({
//       landId: '', location: '', area: '', ownershipDetails: '',
//       land_type: '', state_id: '', district_id: '', tehsil_id: '',
//       rural_urban_area_id: '', khasra_number: '', status: '',
//       marketValue: '', remarks: '', file: []
//     });
//     setDistricts([]);
//   } catch (error) {
//     console.error(error);
//     alert('Error saving land record.');
//   }
// };

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
    await axios.post('http://localhost:5000/api/land/add', data, {
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
        <h1 className={styles.title}>Land Record Management</h1>
        <p className={styles.subtitle}>Fill in the details to register new land record</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Land ID</label>
          <input
            className={styles.formInput}
            name="landId"
            placeholder="Enter unique land ID"
            value={formData.landId}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Location</label>
          <input
            className={styles.formInput}
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Area (sq ft)</label>
          <input
            className={styles.formInput}
            name="area"
            placeholder="Enter area in square feet"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Ownership Details</label>
          <input
            className={styles.formInput}
            name="ownershipDetails"
            placeholder="Enter ownership details"
            value={formData.ownershipDetails}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Type of Land</label>
          <input
            className={styles.formInput}
            name="land_type"
            placeholder="Enter land type"
            value={formData.land_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>State</label>
          <select
            className={styles.formSelect}
            name="state_id"
            value={formData.state_id}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>District</label>
          <select
            className={styles.formSelect}
            name="district_id"
            value={formData.district_id}
            onChange={handleChange}
            required
          >
            <option value="">Select District</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Tehsil</label>
          <input
            className={styles.formSelect}
            name="tehsil_id"
              placeholder="Enter Tehsil"
            value={formData.tehsil_id}
            onChange={handleChange}
            required
          />
            
        </div>

        <div className={styles.formGroup}>
          <label>Area Type</label>
          <input
            className={styles.formSelect}
            name="rural_urban_area_id"
               placeholder="Enter Area Type"
            value={formData.rural_urban_area_id}
            onChange={handleChange}
            required
          />
             
          
        </div>

        <div className={styles.formGroup}>
          <label>Khasra Number</label>
          <input
            className={styles.formInput}
            name="khasra_number"
            placeholder="Enter Khasra number"
            value={formData.khasra_number}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Status</label>
          <input
            className={styles.formInput}
            name="status"
            placeholder="Enter current status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Market Value</label>
          <input
            className={styles.formInput}
            name="marketValue"
            placeholder="Enter market value"
            value={formData.marketValue}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
          <label>Remarks</label>
          <textarea
            className={styles.formTextarea}
            name="remarks"
            placeholder="Enter any additional remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </div>

        <div className={styles.fileInputContainer} style={{ gridColumn: '1 / -1' }}>
          <label className={styles.fileInputLabel}>Upload Document</label>
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
          Register Land Record
        </button>
      </form>
    </div>
  );

};

export default LandRecordForm;