import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { LoginCredentials } from '../../types';
import './Login.css';

interface LoginProps {
  userType: 'student' | 'teacher' | 'admin';
}

const LoginComponent: React.FC<LoginProps> = ({ userType }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Starting login process for:', userType);

    try {
      let response;
      console.log('Submitting credentials:', { ...credentials, password: '***' });
      
      switch (userType) {
        case 'student':
          response = await authAPI.studentLogin(credentials);
          break;
        case 'teacher':
          response = await authAPI.teacherLogin(credentials);
          break;
        case 'admin':
          response = await authAPI.adminLogin(credentials);
          break;
      }

      console.log('Received response:', JSON.stringify(response, null, 2));

      if (!response || !response.token) {
        throw new Error('No token received in response');
      }

      // Create a properly structured user object
      const user = {
        ...response.user,
        id: credentials.id,  // Ensure our ID is used
        role: userType      // Ensure correct role is set
      };

      console.log('Created user object:', JSON.stringify(user, null, 2));

      // Login and wait for it to complete
      await login(user, response.token);
      console.log('Login successful, auth state updated');

      // Force a re-render before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dashboardPath = `/${userType}-dashboard`;
      console.log('Navigating to:', dashboardPath);
      navigate(dashboardPath, { replace: true });

    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const getIdLabel = () => {
    switch (userType) {
      case 'student':
        return 'Student ID';
      case 'teacher':
        return 'Teacher ID';
      case 'admin':
        return 'Admin ID';
      default:
        return 'ID';
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          {userType.charAt(0).toUpperCase() + userType.slice(1)} Login
        </h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="id" className="form-label">{getIdLabel()}</label>
            <input
              type="text"
              id="id"
              name="id"
              value={credentials.id}
              onChange={handleInputChange}
              className="form-input"
              placeholder={`Enter your ${getIdLabel().toLowerCase()}`}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-links">
          <p>Don't have an account?</p>
          {userType === 'student' && (
            <a href="/register" className="link">
              Register as Student
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;