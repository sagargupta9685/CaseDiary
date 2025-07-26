import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('userId', userId); // simulate login
    navigate('/dashboard');
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <input
        className="form-control"
        type="number"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button className="btn btn-primary mt-2" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default LoginPage;
