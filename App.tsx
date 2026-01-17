import React from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './src/components/pages/Login';
import { Register } from './src/components/pages/Register';
import { Entry } from './src/components/pages/Entry';
import { useAndroidBackButton } from './src/components/ui/AndroidBackButton';
import { RoleSelection } from './src/components/pages/RoleSelection';
import { SchoolRegistration } from './src/components/pages/SchoolRegistration';

const AppLayout: React.FC = () => {
  useAndroidBackButton();   // ✅ Now INSIDE the Router

  return (
    <Routes>
      <Route path='/' element={<Entry/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/school-registration" element={<SchoolRegistration/>} />
      <Route path="/role-selection" element={<RoleSelection/>}/>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />   {/* 👈 IMPORTANT */}
    </Router>
  );
};

export default App;
