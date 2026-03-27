// src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';

const API_URL = import.meta.env.VITE_API_URL || '';

const WishlistPage = () => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/users/me/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wishlist');
        }

        const data = await response.json();
        setWishlist(data);
      } catch (err) {
        console.error('Wishlist fetch error:', err);
        setError(err.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleRemoveFromWishlist = async (bookId) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/users/me/wishlist/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove book from wishlist');
      }

      // Update wishlist state by removing the book
      setWishlist(wishlist.filter(book => book._id !== bookId));
    } catch (err) {
      console.error('Remove from wishlist error:', err);
      alert('Failed to remove book from wishlist');
    }
  };

  if (loading) return <p className="text-center py-10">Loading wishlist...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-serif text-brand-brown mb-6">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link to="/browse" className="text-brand-brown hover:underline">
            Browse books to add to your wishlist
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {wishlist.map(book => (
            <div key={book._id} className="relative">
              <BookCard book={book} />
              <button
                onClick={() => handleRemoveFromWishlist(book._id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                title="Remove from wishlist"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;