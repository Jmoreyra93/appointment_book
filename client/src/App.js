import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import ApplyProfessional from './pages/ApplyProfessional';
import Notifications from './pages/Notifications';
import Userslist from './pages/Admin/Userslist';
import ProfessionalsList from './pages/Admin/ProfessionalsList';

function App() {
  const { loading } = useSelector(state => state.alerts)
  return (
    <BrowserRouter>
      {loading && <div className='spinner-parent'>

        <div className="spinner-border" role="status">
        </div>

      </div>}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route
          path='/login'
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>} />
        <Route
          path='/register'
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>} />
        <Route
          path='/apply-professional'
          element={
            <ProtectedRoute>
              <ApplyProfessional />
            </ProtectedRoute>
          } />
        <Route
          path='/notifications'
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <Userslist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/professionalslist"
          element={
            <ProtectedRoute>
              <ProfessionalsList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
