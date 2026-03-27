// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null); // State for the file object
  const [profilePicturePreview, setProfilePicturePreview] = useState(null); // State for image preview URL
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Shared input/button styles (ensure these match your theme)
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition duration-200";
  const buttonClasses = "w-full font-sans text-base font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-md py-3 px-6 cursor-pointer transition-colors duration-200 disabled:opacity-50";
  const labelClasses = "block text-sm font-medium text-gray-700 pb-1";

  const API_URL = import.meta.env.VITE_API_URL || '';

  // Handler for profile picture file selection
  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation (optional: check file size, type more strictly)
      if (!file.type.startsWith('image/')) {
         setError('Please select a valid image file (PNG, JPG, WebP).');
         setProfilePictureFile(null);
         setProfilePicturePreview(null);
         e.target.value = null; // Reset file input
         return;
      }
      setError(''); // Clear previous file errors
      setProfilePictureFile(file);

      // Create a URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result); // Set preview URL once file is read
      };
      reader.readAsDataURL(file); // Read the file as Data URL
    } else {
      // Handle case where user cancels file selection
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);

    const formData = new FormData();
    // Append text fields to FormData
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    
    // Append profile picture if one was selected
    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    }

    console.log('Submitting signup data (FormData)...');

    // --- Actual API Call ---
    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        body: formData,
        // No Content-Type header needed for FormData
      });
      
       const data = await response.json(); // Now this expects a valid JSON response from /api/users/register

      if (!response.ok) {
        throw new Error(data.message || `Signup failed with status ${response.status}`);
      }

      // ... (rest of success handling) ...
       console.log('Signup successful:', data);
       alert('Signup successful! Please login.');
       navigate('/login');

    } catch (err) {
      // ... (error handling - check if the error is now different after fixing 404) ...
        console.error('Signup error:', err);
       // If the error persists, check if the backend is sending valid JSON even on errors
       if (err instanceof SyntaxError) {
           setError("Received an invalid response from the server. Check server logs.");
       } else {
           setError(err.message || 'An error occurred during signup.');
       }
    } finally {
      setLoading(false);
    }
    // --- End API Call ---
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-theme(space.20))] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold font-serif text-brand-brown">
            Create Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
           {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm break-words"> {/* Added break-words */}
              {error}
            </div>
          )}

          {/* Name Input */}
          <div>
             <label htmlFor="name" className={labelClasses}>Name <span className="text-red-500">*</span></label>
             <input id="name" name="name" type="text" required className={inputClasses} placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Email Input */}
          <div className="pt-4">
            <label htmlFor="email-address" className={labelClasses}>Email address <span className="text-red-500">*</span></label>
            <input id="email-address" name="email" type="email" autoComplete="email" required className={inputClasses} placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {/* Password Input */}
           <div className="pt-4">
            <label htmlFor="password" className={labelClasses}>Password <span className="text-red-500">*</span></label>
            <input id="password" name="password" type="password" autoComplete="new-password" required className={inputClasses} placeholder="Password (min. 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* Confirm Password Input */}
          <div className="pt-4">
            <label htmlFor="confirm-password" className={labelClasses}>Confirm Password <span className="text-red-500">*</span></label>
            <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required className={inputClasses} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {/* Profile Picture Upload */}
          <div className="pt-4">
            <label htmlFor="profile-picture" className={labelClasses}>Profile Picture (Optional)</label>
            <input
                type="file"
                id="profile-picture"
                name="profilePicture" // Name attribute is good practice, though not strictly needed for controlled file input
                accept="image/png, image/jpeg, image/webp" // Specify acceptable image types
                onChange={handleProfilePictureChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navbar-bg file:text-brand-brown hover:file:bg-gray-200 cursor-pointer"
            />
             {profilePicturePreview && ( // Conditionally render the preview
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 pb-1">Preview:</p>
                    <img src={profilePicturePreview} alt="Profile preview" className="max-h-32 rounded border border-gray-300 object-contain" />
                </div>
            )}
          </div>


          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" className={buttonClasses} disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Link to Login */}
        <div className="text-sm text-center pt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-brand-brown hover:text-link-text hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;