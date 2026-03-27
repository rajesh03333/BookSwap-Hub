import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { smallBookPlaceholder } from '../assets/placeholders';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!book) return null;

  const imageUrl = book.imageUrl || smallBookPlaceholder;
  const title = book.title || 'Untitled Book';
  const author = book.author || 'Unknown Author';
  const price = book.price !== undefined ? `$${book.price.toFixed(2)}` : 'Price not set';
  const condition = book.condition || 'Condition unspecified';
  const id = book._id || book.id || '#';

  const handleChat = (e) => {
    e.preventDefault(); // 🔥 stops card navigation

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
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold font-sans text-gray-800 mb-1 truncate group-hover:text-brand-brown transition-colors duration-300" title={title}>
            {title}
          </h3>

          <p className="text-sm text-gray-600 mb-2 truncate" title={author}>
            {author}
          </p>

          <p className="text-xs text-gray-500 mb-3">{condition}</p>

          <p className="text-lg font-bold text-brand-brown">{price}</p>

          {/* 🔥 CHAT BUTTON */}
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