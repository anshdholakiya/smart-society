import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import SetupPassword from './SetupPassword';
import LandingPage from './LandingPage'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Root is now Landing Page */}
        <Route path="/login" element={<Login />} />   {/* Login is now /login */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* THIS IS THE ROUTE FOR THE INVITE LINK */}
        <Route path="/setup-password/:token" element={<SetupPassword />} />

      </Routes>
    </Router>
  );
};

export default App;