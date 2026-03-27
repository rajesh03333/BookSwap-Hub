// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth hook
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // <-- Get login function from context

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Login handler updated to use AuthContext
  // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Google authentication failed');
      }

      // Use AuthContext to store token and user data
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'An error occurred during Google login.');
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, { // Backend login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Use message from backend response, or fallback
        throw new Error(data.message || `Failed to login with status ${response.status}`);
      }

      // --- Use AuthContext to store token and user data ---
      login(data.user, data.token); // Call the login function from context
      // --- End AuthContext update ---

      console.log('Login successful:', data);
      // No need for alert here, context handles state, navigate to dashboard
      navigate('/dashboard'); // Redirect to dashboard after successful login

    } catch (err) {
      console.error('Login error:', err);
       // Better error handling might be needed depending on backend responses
       if (err instanceof SyntaxError) {
          setError("Received an invalid response from the server.");
       } else {
          setError(err.message || 'An error occurred during login.');
       }
    } finally {
      setLoading(false);
    }
  };

  // Shared input field styling
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition duration-200";
  // Shared button styling (ensure matches Navbar button if desired)
  const buttonClasses = "w-full font-sans text-base font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-md py-3 px-6 cursor-pointer transition-colors duration-200 disabled:opacity-50"; // Added disabled style


  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.20))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold font-serif text-brand-brown">
            Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {/* Display Login Errors */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm break-words"> {/* Added break-words */}
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="rounded-md shadow-sm"> {/* Removed -space-y-px for cleaner look */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 pb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={inputClasses}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

           {/* Password Input */}
           <div className="rounded-md shadow-sm pt-4"> {/* Added pt-4 for spacing */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 pb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={inputClasses}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className={buttonClasses}
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Logging in...' : 'Login with Email'} {/* Show loading text */}
            </button>
          </div>
          
          {/* Google Login */}
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError('Google login failed. Please try again.');
                }}
                useOneTap
              />
            </div>
          </div>
        </form>

        {/* Link to Signup */}
        <div className="text-sm text-center pt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="font-medium text-brand-brown hover:text-link-text hover:underline">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;