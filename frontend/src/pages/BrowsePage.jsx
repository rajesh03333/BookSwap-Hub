// src/pages/BrowsePage.jsx
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

// Placeholder data - Replace with API call
const placeholderBooks = [
  { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, condition: 'Good', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Book1' },
  { _id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 10.50, condition: 'Very Good', imageUrl: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Book2' },
  { _id: '3', title: '1984', author: 'George Orwell', price: 8.75, condition: 'Acceptable', imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Book3' },
  { _id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.00, condition: 'Like New', imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Book4' },
  { _id: '5', title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 9.25, condition: 'Good' }, // No image example
  { _id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 14.00, condition: 'Very Good', imageUrl: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Book6' },
];

const API_URL = import.meta.env.VITE_API_URL || '';

const BrowsePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query string for search term
        const queryParams = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
        
        // Fetch books from API
        const response = await fetch(`${API_URL}/api/books${queryParams}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err.message);
        setBooks([]); // Clear books on error
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // Refetch when searchTerm changes

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Shared input field styling
  const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition duration-200";


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif text-brand-brown mb-6">Browse Books</h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-lg">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={inputClasses}
        />
        {/* TODO: Add Filter dropdowns/buttons here (Genre, Condition, Price Range) */}
      </div>

      {/* Book Grid */}
      {loading && <p className="text-center text-gray-500">Loading books...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">No books found matching your criteria.</p>
      )}
      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {books.map((book) => (
            <BookCard key={book._id || book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;