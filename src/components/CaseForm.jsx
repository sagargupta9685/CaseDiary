import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './caseForm.module.css';


function CaseForm() {
  const [title, setTitle] = useState('');
  const [caseNo, setCaseNo] = useState('');
  const [notificationDays, setNotificationDays] = useState('');
  const [description, setDescription] = useState('');
  const [caseDate, setCaseDate] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userId = user ? user.id : null;
    console.log('User ID:', userId);
    console.log('user:', user);

  try {
    await axios.post(
      'http://localhost:5000/api/cases',
      {
        userId,
        title,
        description,
        caseDate,
        notificationDays,
        caseNo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    alert('Case Added!');
    setTitle('');
    setCaseNo('');  
    setNotificationDays('');
    setDescription('');
    setCaseDate('');
  
  } catch (error) {
    console.error('Error adding case:', error.response?.data || error.message);
    alert('Unauthorized! Please login again.');
  }
};

  return (
    <div class= {styles['container']}>
     
    <Navbar />
    <form onSubmit={handleSubmit}>

      <h3>Case Entry</h3>
      <div className={styles['form-group']}>
        <label>Case No</label>
        <input className={styles['form-control']} value={caseNo} onChange={(e) => setCaseNo(e.target.value)} required />
      </div>

        <div className={styles['form-group']}>
        <label>Case Title</label>
        <input className={styles['form-control']} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
        <div className={styles['form-group']}>
        <label>Case Date</label>
        <input type="date" className={styles['form-control']} value={caseDate} onChange={(e) => setCaseDate(e.target.value)} required />
      </div>
        <div className={styles['form-group']}>
        <label>Description</label>
        <textarea className={styles['form-control']} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

        <div className={styles['form-group']}>
        <label>Notification days</label>
        <input className={styles['form-control']} value={notificationDays} onChange={(e) => setNotificationDays(e.target.value)} required />
      </div>
      <button className="btn btn-success mt-3" type="submit">Add Case</button>
    </form>
    </div>
  );
}

export default CaseForm;
