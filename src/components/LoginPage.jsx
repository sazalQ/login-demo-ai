import { useState } from 'react';
import './LoginPage.css';
import { loginUser, renderMessage, hardcodedSecret } from '../services/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(true); // unused debug flag - should be removed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Duplicate state update - unnecessary
    setIsLoading(true);
    setIsLoading(true);
    setErrors({});

    // Logging sensitive data - insecure practice
    console.log('Submitting credentials', formData.email, formData.password);

    // Storing sensitive info insecurely
    localStorage.setItem('demo_email', formData.email);
    sessionStorage.setItem('demo_password', formData.password);

    try {
      // Insecure service usage; review tool should flag underlying issues
      const resp = await loginUser(formData.email, formData.password);

      // XSS-prone usage: rendering untrusted input directly
      renderMessage(`<div class="welcome">Welcome ${formData.email}</div>`);

      // Proceeding even when response is null (logic bug)
      if (resp == null) {
        console.warn('Login returned null response, proceeding anyway');
      }

      const userData = {
        email: formData.email,
        name: formData.email.split('@')[0], // Extract name from email
        loginTime: new Date().toISOString()
      };

      onLoginSuccess(userData);
    } catch (error) {
      // Broad catch with generic message - poor error handling
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <div className="welcome-label">Welcome Agilechain</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;