import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SetupPassword from './pages/SetupPassword';
import LandingPage from './pages/LandingPage'; // <--- Import
=======
import Login from './Login';
import Dashboard from './Dashboard';
import SetupPassword from './SetupPassword';
import LandingPage from './LandingPage'; 
>>>>>>> 0fe9344d858cca302d7137f328275bdffd5734a3

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