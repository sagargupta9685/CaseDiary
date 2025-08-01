import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/mainLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
 import AddCaseForm from './components/addCase';
import CaseList from './components/CaseList';
 import LandRecordForm from './components/AddLandRecord';
 import GetLandRecords from './components/LandRecords';
 
import UpdateCase from './components/UpdateCase';


function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
         <Route element={<MainLayout />}>
         
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/updatecase/:caseId" element={<UpdateCase/>} />
        <Route path="/caselist" element={<CaseList />} />     
         <Route path="/addcase" element={<AddCaseForm/>} />  
         <Route path="/addlandrecord" element={<LandRecordForm/>} />
         <Route path="/landRecord" element={<GetLandRecords/>} />


       
         </Route>   
         </Routes>
    </Router>
   
  );
}

export default App;
