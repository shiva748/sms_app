import React, { useEffect, useState } from "react";
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './src/components/pages/Login';
import { Register } from './src/components/pages/Register';
import { Entry } from './src/components/pages/Entry';
import { useAndroidBackButton } from './src/components/ui/AndroidBackButton';
import { RoleSelection } from './src/components/pages/RoleSelection';
import { SchoolRegistration } from './src/components/pages/SchoolRegistration';
import { useAppSelector, useAppDispatch } from "./src/store/hooks";
import { store } from "./src/store/store";
import { syncAuthFromStorageToRedux, autoPersistAuthState } from "./src/services/preferences";
import { logout, setAuthenticated, setSchool, setUser } from "./src/store/slices/authSlice";
import { API_BASE_URL as API } from "./src/components/config/api";
import { LoadingScreen } from "./src/components/ui/LoadingScreen";
import { HeadProfileSelection } from "./src/components/pages/HeadProfileSelection";
import { TeacherProfileSelection } from "./src/components/pages/TeacherProfileSelection";
import { HeadDashboard } from "./src/components/pages/HeadDashboard";


const AppLayout: React.FC = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  useAndroidBackButton();
  const dispatch = useAppDispatch();
  const { authenticated: isAuthenticated, role } = useAppSelector(state => state.auth);

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // 1️⃣ Load saved auth from Preferences → Redux
        await syncAuthFromStorageToRedux(dispatch);

        // 2️⃣ Auto persist any future changes
        autoPersistAuthState(store);

        // 3️⃣ If user was marked authenticated, verify with backend
        const saved = store.getState().auth;

        if (saved.authenticated) {
          const res = await fetch(`${API}/user/me`, {
            method: "GET",
            credentials: "include",
          });

          if (!res.ok) {
            // Session invalid → logout
            dispatch(logout());
          } else {
            const user = await res.json();
            dispatch(setAuthenticated(true));
            dispatch(setUser(user.data));
            dispatch(setSchool(saved.school));
          }
        }
      } catch (err) {
        console.error("Auth bootstrap failed:", err);
        dispatch(logout());
      } finally {
        setCheckingAuth(false);
      }
    };

    bootstrap();
  }, [dispatch]);

  // 🔥 LOADING SCREEN WHILE CHECKING AUTH
  if (checkingAuth) {
    return (
      <LoadingScreen message="Loading" />
    );
  }

  return (
    <Routes>

      {/* ====== UNAUTHENTICATED USER ====== */}
      {!isAuthenticated && (
        <>
          <Route path='/' element={<Entry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />

          {/* Any other route goes back to Entry */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}

      {/* ====== AUTHENTICATED BUT NO ROLE SELECTED ====== */}
      {isAuthenticated && !role && (
        <>
          {/* 👉 HOME SCREEN FOR AUTHENTICATED USER */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/head/select-profile" element={<HeadProfileSelection back={"/"} />} />
          <Route path="/teacher/select-profile" element={<TeacherProfileSelection back={"/"} />} />
          {/* Anything else goes to home (RoleSelection) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}

      {isAuthenticated && role && role == "SCHOOL_HEAD" && (
        <>
          <Route path="/" element={<HeadDashboard />} />
          <Route path="/change-role" element={<RoleSelection back={"/"} />} />
          <Route path="/school-registration" element={<SchoolRegistration />} />
          <Route path="/head/select-profile" element={<HeadProfileSelection back={"/change-role"} />} />
          <Route path="/teacher/select-profile" element={<TeacherProfileSelection back={"/change-role"} />} />
        </>
      )}

    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
