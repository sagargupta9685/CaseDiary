import React, { useState } from 'react';
import styles from './addmiscellaneous.module.css';

const Addmiscellaneous = () => {
  const [formData, setFormData] = useState({
    unit_name: '',
    description: '',
    url: '',
    noc_date: '',
    valid_till: '',
    notification_days: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Get JWT token from storage
    if (!token) {
      alert("You're not logged in.");
      return;
    }

    const data = new FormData();
    data.append('unit_name', formData.unit_name);
    data.append('description', formData.description);
    data.append('url', formData.url);
    data.append('noc_date', formData.noc_date);
    data.append('valid_till', formData.valid_till);
    data.append('notification_days', formData.notification_days);

    if (formData.file) {
      data.append('documents', formData.file); // Match backend field name
    }

    try {
      const res = await fetch('http://localhost:5000/api/other/add', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}` // ✅ Add token here
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
      } else {
        alert(result.message || 'Submission failed');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting form');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Add Miscellaneous Record</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Unit Name</label>
          <input type="text" name="unit_name" value={formData.unit_name} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className={styles.textarea}></textarea>
        </div>

        <div className={styles.formGroup}>
          <label>URL</label>
          <input type="text" name="url" value={formData.url} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>NOC Date</label>
          <input type="date" name="noc_date" value={formData.noc_date} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Valid Till</label>
          <input type="date" name="valid_till" value={formData.valid_till} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Notification Days</label>
          <input type="number" name="notification_days" value={formData.notification_days} onChange={handleChange} className={styles.input} />
        </div>

        <div className={styles.formGroup}>
          <label>Document Upload</label>
          <input type="file" name="file" onChange={handleFileChange} className={styles.input} />
        </div>

        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
    </div>
  );
};

export default Addmiscellaneous;
