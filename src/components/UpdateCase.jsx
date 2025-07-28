import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './updateCase.module.css';
import { FaCalendarPlus } from 'react-icons/fa';
function UpdateCase() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [hearingDates, setHearingDates] = useState([]);
  const [newHearingDate, setNewHearingDate] = useState('');

  const token = localStorage.getItem('token');

  const fetchCaseDetails = async () => {
    try {
      const res =await axios.get(`http://localhost:5000/api/cases/details/${caseId}`, {
  headers: { Authorization: `Bearer ${token}` }
});

      setCaseData(res.data);
    } catch (err) {
      console.error('Error fetching case:', err);
    }
  };

  const fetchHearings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cases/hearings/${caseId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
      setHearingDates(res.data);
    } catch (err) {
      console.error('Error fetching hearings:', err);
    }
  };

  const handleAddHearing = async () => {
  try {
    await axios.post('http://localhost:5000/api/cases/add-hearing', {
      caseId,
      hearingDate: newHearingDate, // ✅ Use the state variable
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNewHearingDate('');
    fetchHearings(); // refresh list
    alert('Hearing date added!');
  } catch (err) {
    console.error('Error adding hearing date:', err);
  }
};


  useEffect(() => {
    fetchCaseDetails();
    fetchHearings();
  }, [caseId]);

 

  if (!caseData) return <p>Loading...</p>;

  return (
    <div className={styles.formContainer}>
      <Navbar />
      <div className={styles.caseForm}>
        <h2>Case Details</h2>
        <p><strong>Case No:</strong> {caseData.caseNo}</p>
        <p><strong>Title:</strong> {caseData.title}</p>
        <p><strong>Description:</strong> {caseData.shortDescription}</p>
       <p><strong>Date:</strong> 
  {caseData.caseDate 
    ? new Date(caseData.caseDate).toLocaleDateString() 
    : 'N/A'}
</p>


        <h3>Previous Hearing Dates</h3>
        <ul className={styles.hearingList}>
          {hearingDates.map(h => (
            <li key={h.id}>{new Date(h.hearingDate).toLocaleDateString()}</li>
          ))}
        </ul>

      <h3><FaCalendarPlus style={{ marginRight: '8px', color: '#3498db' }} />Add New Hearing Date</h3>
        <div className={styles.hearingInputGroup}>
  <input
    type="date"
    className={styles.hearingInput}
    value={newHearingDate}
    onChange={(e) => setNewHearingDate(e.target.value)}
  />
  <button className={styles.addHearingButton} onClick={handleAddHearing}>
    Add Hearing
  </button>
</div>
      </div>
    </div>
  );
}

export default UpdateCase;
