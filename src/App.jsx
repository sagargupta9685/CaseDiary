import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import MainLayout from './components/mainLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import CaseForm from './components/CaseForm';
import CaseList from './components/CaseList';
import AddCaseForm from './components/addCase';// Import the AddCaseForm component


function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
         <Route element={<MainLayout />}>
         
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/caseform" element={<CaseForm />} />
        <Route path="/caselist" element={<CaseList />} />     
         <Route path="/addcase" element={<AddCaseForm/>} />  
         </Route>   
         </Routes>
    </Router>
   
  );
}

export default App;
