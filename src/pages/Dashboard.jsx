import React from 'react';
import CaseForm from '../components/CaseForm';
import CaseData from '../components/CaseListData'
import Navbar  from './NavBar';
import CaseList from '../components/CaseList';

function Dashboard() {
  return (
    <div className="container mt-4">
    
      <CaseData />
     
    </div>
  );
}

export default Dashboard;
