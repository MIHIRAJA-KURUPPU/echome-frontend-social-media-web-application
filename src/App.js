// src/App.js
import React from 'react';
import Home from './pages/home/Home'; // Importing Home component if needed later
import Profile from './pages/profile/Profile'; // Importing the Profile component
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import {
  BrowserRouter as Router,
  Routes, // Changed from Switch to Routes
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes> {/* Changed from Switch to Routes */}
        <Route path="/" element={<Home />} /> {/* Use element prop */}
        <Route path="/profile/:username" element={<Profile />} /> {/* Use element prop */}
        <Route path="/login" element={<Login />} /> {/* Use element prop */}
        <Route path="/register" element={<Register />} /> {/* Use element prop */}
      </Routes>
    </Router>
  );
}

export default App;
