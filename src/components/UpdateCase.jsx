import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../pages/NavBar';
import styles from './updatecase.module.css';
import { FaCalendarPlus } from 'react-icons/fa';

function UpdateCase() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [hearingDates, setHearingDates] = useState([]);
   
  const [newHearingDate, setNewHearingDate] = useState(() => {
  const today = new Date().toISOString().split('T')[0];
  return today;
});
  

  const [description, setDescription] = useState('');
  const [notificationDays, setNotificationDays] = useState('');
  const [nextHearingDate, setNextHearingDate] = useState('')


  const [currentPage, setCurrentPage] = useState(1);
  const hearingsPerPage = 2;

  const token = localStorage.getItem('token');

  const fetchCaseDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cases/details/${caseId}`, {
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

  // const handleAddHearing = async () => {
  //   try {
  //     await axios.post('http://localhost:5000/api/cases/add-hearing', {
  //       caseId,
  //       hearingDate: newHearingDate,
  //       description,
  //       notificationDays: parseInt(notificationDays, 10),
  //        nextHearingDate,
  //     }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     setNewHearingDate(today);
  //     setNextHearingDate('');
  //     setDescription('');
  //     setNotificationDays('');
  //     fetchHearings();
  //     alert('Hearing date added!');
  //   } catch (err) {
  //     console.error('Error adding hearing date:', err);
  //   }
  // };


  const handleAddHearing = async () => {
  try {
    await axios.post('http://localhost:5000/api/cases/add-hearing', {
      caseId,
      hearingDate: newHearingDate,
      description,
      notificationDays: parseInt(notificationDays, 10),
      nextHearingDate,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setNewHearingDate(new Date().toISOString().split('T')[0]);
    setNextHearingDate('');
    setDescription('');
    setNotificationDays('');
    fetchHearings();
    alert('Hearing date added!');
  } catch (err) {
    console.error('Error adding hearing date:', err);
  }
};


  useEffect(() => {
    fetchCaseDetails();
    fetchHearings();
  }, [caseId]);

  useEffect(() => {
  const nextDay = new Date(newHearingDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayFormatted = nextDay.toISOString().split('T')[0];
  setNextHearingDate(nextDayFormatted);
}, [newHearingDate]);


  if (!caseData) return <p>Loading...</p>;

  // Pagination logic
  const indexOfLast = currentPage * hearingsPerPage;
  const indexOfFirst = indexOfLast - hearingsPerPage;
  const currentHearings = hearingDates.slice(indexOfFirst, indexOfLast);
  console.log(currentHearings,"current hai");

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
          {currentHearings.map((h) => (
            <li key={h.id}>
              <strong>Date:</strong> {new Date(h.hearingDate).toLocaleDateString()} <br />
              <strong>Description:</strong> {h.description || 'N/A'} <br />
              <strong>Notification Days:</strong> {h.notificationDays ?? 'N/A'} <br/>
                  <strong>Next Hearing Date:</strong>  {new Date(h.nextHearingDate).toLocaleDateString()} 
            </li>
          ))}
        </ul>

        <div className={styles.pagination}>
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage((prev) => (indexOfLast < hearingDates.length ? prev + 1 : prev))}
            disabled={indexOfLast >= hearingDates.length}
          >
            Next
          </button>
        </div>

        {/* <h3>
          <FaCalendarPlus style={{ marginRight: '8px', color: '#3498db' }} />
          Add New Hearing Date
        </h3>
        <div className={styles.hearingInputGroup}>
          <input
            type="date"
            className={styles.hearingInput}
            value={newHearingDate}
            onChange={(e) => setNewHearingDate(e.target.value)}
          />

          <textarea
            placeholder="Enter description"
            className={styles.hearingInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <input
            type="number"
            placeholder="Notification days"
            className={styles.hearingInput}
            value={notificationDays}
            onChange={(e) => setNotificationDays(e.target.value)}
          />

          <button className={styles.addHearingButton} onClick={handleAddHearing}>
            Add Hearing
          </button>
        </div> */}
        <div className={styles.hearingFormSection}>
  <h3>
    <FaCalendarPlus />
    Add New Hearing Date
  </h3>
  
  <div className={styles.formGrid}>
    <div className={styles.formGroup}>
      <label>Hearing Date</label>
      <div className={styles.dateInputContainer}>
        <input
          type="date"
          value={newHearingDate}
           min={newHearingDate || new Date().toISOString().split('T')[0]}
          onChange={(e) => setNewHearingDate(e.target.value)}
        />
      </div>
    </div>
    
    <div className={styles.formGroup}>
      <label>Notification Days</label>
      <input
        type="number"
        placeholder="Enter number of days"
        value={notificationDays}
        onChange={(e) => setNotificationDays(e.target.value)}
      />
    </div>
    
    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
      <label>Description</label>
      <textarea
        placeholder="Enter hearing description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

<div className={styles.formGroup}>
  <label>Next Hearing Date</label>
  <input
    type="date"
    value={nextHearingDate}
     min={newHearingDate}
    onChange={(e) => setNextHearingDate(e.target.value)}
  />
</div>
 


    
    <div className={styles.submitButtonContainer}>
      <button className={styles.addHearingButton} onClick={handleAddHearing}>
        Add Hearing
      </button>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}

export default UpdateCase;
