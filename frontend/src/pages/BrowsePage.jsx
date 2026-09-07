// src/pages/BrowsePage.jsx
import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';

const API_URL = import.meta.env.VITE_API_URL || '';

const BrowsePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();

        queryParams.append('page', page);

        if (searchTerm.trim()) {
          queryParams.append('search', searchTerm);
        }

        const response = await fetch(
          `${API_URL}/api/books?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();

        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchBooks, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const inputClasses =
    'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-brown focus:border-transparent transition duration-200';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif text-brand-brown mb-6">
        Browse Books
      </h1>

      {/* Search */}
      <div className="mb-8 max-w-lg">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={inputClasses}
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading books...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-center text-red-500">
          Error: {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && books.length === 0 && (
        <p className="text-center text-gray-500">
          No books found.
        </p>
      )}

      {/* Books */}
      {!loading && !error && books.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book) => (
              <BookCard
                key={book._id || book.id}
                book={book}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">

            {/* Previous */}
            <button
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, index) => {
                const startPage = Math.max(
                  1,
                  Math.min(page - 2, totalPages - 4)
                );

                const pageNumber = startPage + index;

                if (pageNumber > totalPages) return null;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-4 py-2 rounded border ${
                      page === pageNumber
                        ? 'bg-brand-brown text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            {/* Next */}
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

          </div>
        </>
      )}
    </div>
  );
};

export default BrowsePage;