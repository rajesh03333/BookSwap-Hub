import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smallBookPlaceholder } from '../assets/placeholders';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!book) return null;

  // Backend stores imageUrl as a relative path like "/uploads/filename.jpg"
  // Vite's dev proxy only covers /api, not /uploads, so we must manually
  // prepend the backend base URL for relative paths.
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const rawImageUrl = book.imageUrl;
  const imageUrl = rawImageUrl
    ? rawImageUrl.startsWith('http')
      ? rawImageUrl                     // already absolute URL, use as-is
      : `${BACKEND_URL}${rawImageUrl}`  // relative /uploads/... → prepend backend origin
    : smallBookPlaceholder;

  const title = book.title || 'Untitled Book';
  const author = book.author || 'Unknown Author';
  const price = book.price !== undefined ? `$${book.price.toFixed(2)}` : 'Price not set';
  const condition = book.condition || 'Condition unspecified';
  const id = book._id || book.id || '#';

  const handleChat = (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    const ownerId = book.user?._id;

    if (!ownerId) {
      alert("Owner not found");
      return;
    }

    navigate(`/chat/${ownerId}`);
  };

  return (
    <Link to={`/book/${id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-shadow duration-300 hover:shadow-xl">

        {/* Book Image */}
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = smallBookPlaceholder; }}
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold font-sans text-gray-800 mb-1 truncate group-hover:text-brand-brown transition-colors duration-300" title={title}>
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-2 truncate" title={author}>
            {author}
          </p>

          <p className="text-xs text-gray-500 mb-3">{condition}</p>

          <p className="text-lg font-bold text-brand-brown">{price}</p>

          {/* Chat Button */}
          <button
            onClick={handleChat}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded transition"
          >
            Chat with Owner
          </button>

        </div>
      </div>
    </Link>
  );
};

export default BookCard;