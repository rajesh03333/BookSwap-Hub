// src/pages/AddBookPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth hook

const API_URL = import.meta.env.VITE_API_URL || '';

const AddBookPage = () => {
  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // File object
  const [imagePreview, setImagePreview] = useState(null); // Preview URL

  // Component State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks
  const navigate = useNavigate();
  const { token } = useAuth(); // <-- Get token from context

  // Shared Tailwind classes
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition duration-200";
  const buttonClasses = "w-full font-sans text-base font-semibold text-button-text bg-button-bg hover:bg-button-bg-hover border-none rounded-md py-3 px-6 cursor-pointer transition-colors duration-200 disabled:opacity-50";
  const labelClasses = "block text-sm font-medium text-gray-700 pb-1";

  // Image selection handler
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
       if (!file.type.startsWith('image/')) {
         setError('Please select a valid image file (PNG, JPG, WebP).');
         setImage(null);
         setImagePreview(null);
         e.target.value = null;
         return;
      }
      setError('');
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  // Form submission handler - Updated for actual API call
  const handleAddBook = async (e) => {
    e.preventDefault();
    setError('');

    // --- Frontend Validation ---
    if (!title || !author || !condition || !price) {
      setError('Please fill in all required fields (Title, Author, Condition, Price).');
      return;
    }
    if (!token) {
        setError('You must be logged in to add a book.');
        // Optionally redirect to login: navigate('/login');
        return;
    }
    // --- End Validation ---

    setLoading(true);

    // --- Prepare FormData ---
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description); // Optional, send empty if blank
    formData.append('condition', condition);
    formData.append('price', price);
    // formData.append('available', true); // Assuming default true, backend handles this
    if (image) {
      // Use a consistent key that your backend book upload middleware expects
      // If using a separate middleware for books, it might be different from profile pic key
      formData.append('bookImage', image); // Example key - **VERIFY THIS WITH YOUR BACKEND**
    }
    // ** User ID is NOT sent here - backend gets it from the token **
    // --- End FormData Preparation ---

    console.log('Submitting book data (FormData)...');

    // --- Actual API Call ---
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          // Content-Type is set automatically by browser for FormData
          'Authorization': `Bearer ${token}` // <-- Include the auth token
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Use message from backend response, or fallback
        throw new Error(data.message || `Failed to add book (Status: ${response.status})`);
      }

      console.log('Book added successfully:', data);
      alert('Book listed successfully!'); // Simple feedback
      // Redirect to the newly created book's details page
      // Ensure backend response includes the new book object with its _id
      if (data.book && data.book._id) {
         navigate(`/book/${data.book._id}`);
      } else {
         navigate('/dashboard'); // Fallback redirect
      }

    } catch (err) {
      console.error('Add book error:', err);
       if (err instanceof SyntaxError) {
          setError("Received an invalid response from the server.");
       } else {
          setError(err.message || 'An error occurred while adding the book.');
       }
    } finally {
      setLoading(false);
    }
    // --- End API Call ---
  };

  // --- JSX Structure ---
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold font-serif text-brand-brown mb-8 text-center">Add a New Book</h1>

      <form className="space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleAddBook}>
        {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm break-words">
              {error}
            </div>
          )}

        {/* Title */}
        <div>
          <label htmlFor="title" className={labelClasses}>Title <span className="text-red-500">*</span></label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className={inputClasses} />
        </div>

        {/* Author */}
        <div>
          <label htmlFor="author" className={labelClasses}>Author <span className="text-red-500">*</span></label>
          <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} required className={inputClasses} />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className={inputClasses}></textarea>
        </div>

        {/* Condition */}
        <div>
           <label htmlFor="condition" className={labelClasses}>Condition <span className="text-red-500">*</span></label>
           <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value)} required className={`${inputClasses} bg-white`}>
             <option value="" disabled>Select condition</option>
             <option value="Like New">Like New</option>
             <option value="Very Good">Very Good</option>
             <option value="Good">Good</option>
             <option value="Acceptable">Acceptable</option>
           </select>
        </div>

        {/* Price */}
         <div>
          <label htmlFor="price" className={labelClasses}>Price ($) <span className="text-red-500">*</span></label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" className={inputClasses} placeholder="e.g., 10.50" />
        </div>

        {/* Image Upload */}
        <div>
            <label htmlFor="image" className={labelClasses}>Book Cover Image (Optional)</label>
            <input
                type="file"
                id="image"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navbar-bg file:text-brand-brown hover:file:bg-gray-200 cursor-pointer"
            />
             {imagePreview && (
                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 pb-1">Image Preview:</p>
                    <img src={imagePreview} alt="Book cover preview" className="max-h-40 rounded border border-gray-300 object-contain" />
                </div>
            )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
             <button type="submit" className={buttonClasses} disabled={loading}>
               {loading ? 'Adding Book...' : 'Add Book to Listings'}
             </button>
        </div>

      </form>
    </div>
  );
};

export default AddBookPage;