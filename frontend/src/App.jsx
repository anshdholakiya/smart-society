import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SetupPassword from './pages/SetupPassword';
import LandingPage from './pages/LandingPage'; // <--- Import

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