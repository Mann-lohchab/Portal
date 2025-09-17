import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './components/HomePage';
import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import StudentDashboard from './components/Student/StudentDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import './App.css';


// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole: string }> = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  console.log('ProtectedRoute: Checking access', {
    isAuthenticated,
    userRole: user?.role,
    allowedRole,
    hasUser: !!user
  });
  
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: Not authenticated, redirecting to home');
    return React.createElement(Navigate, { to: '/', replace: true });
  }
  
  if (user.role !== allowedRole) {
    console.log('ProtectedRoute: Incorrect role, redirecting to home');
    return React.createElement(Navigate, { to: '/', replace: true });
  }
  
  console.log('ProtectedRoute: Access granted');
  return React.createElement(React.Fragment, null, children);
};

function App() {
  return React.createElement(AuthProvider, null,
    React.createElement(Router, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(HomePage) }),
        React.createElement(Route, { 
          path: '/student-login', 
          element: React.createElement(Login, { userType: 'student' })
        }),
        React.createElement(Route, { 
          path: '/teacher-login', 
          element: React.createElement(Login, { userType: 'teacher' })
        }),
        React.createElement(Route, { 
          path: '/admin-login', 
          element: React.createElement(Login, { userType: 'admin' })
        }),
        React.createElement(Route, { 
          path: '/student-dashboard', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'student', children: React.createElement(StudentDashboard) })
        }),
        React.createElement(Route, { 
          path: '/teacher-dashboard', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'teacher', children: React.createElement(TeacherDashboard) })
        }),
        React.createElement(Route, { 
          path: '/admin-dashboard', 
          element: React.createElement(ProtectedRoute, { allowedRole: 'admin', children: React.createElement(AdminDashboard) })
        }),
        React.createElement(Route, { 
          path: '*', 
          element: React.createElement(Navigate, { to: '/', replace: true })
        })
      )
    )
  );
}

export default App;