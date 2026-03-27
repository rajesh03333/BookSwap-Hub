import React, { useState } from 'react';
import { largeBookPlaceholder } from '../assets/placeholders';

const SwapRequestModal = ({ isOpen, onClose, book, onSendRequest, token, userEmail }) => {
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('email');
  const [email, setEmail] = useState(userEmail || '');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!message.trim()) {
      setError('Message to Seller is required.');
      return;
    }
    if (contactMethod === 'email' && !email.trim()) {
      setError('Email is required.');
      return;
    }
    if (contactMethod === 'phone' && !phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    setLoading(true);
    try {
      await onSendRequest({
        bookId: book._id,
        message,
        contactMethod,
        contactDetails: contactMethod === 'email' ? email : phone,
      });
    } catch (err) {
      setError(err.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 relative">
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold mb-6">Swap Request</h2>
          {/* Book Info */}
          <div className="flex items-center bg-gray-100 rounded-lg p-4 mb-6">
            <img
              src={book?.imageUrl || largeBookPlaceholder}
              alt={book?.title}
              className="w-20 h-28 object-cover rounded mr-4 bg-gray-200"
            />
            <div>
              <div className="font-semibold text-lg text-gray-800 mb-1">{book?.title}</div>
              <div className="text-gray-600 text-sm mb-1">{book?.author}</div>
              <div className="text-gray-500 text-sm mb-1">Seller: {book?.seller?.name}</div>
              <div className="text-xl font-bold text-gray-800">{book?.price ? `$${book.price}` : ''}</div>
            </div>
          </div>

          {/* Message */}
          <label className="block font-medium mb-1" htmlFor="message">Message to Seller<span className="text-red-500">*</span></label>
          <textarea
            id="message"
            className="w-full border border-gray-300 rounded-md p-2 mb-4 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-brand-brown"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />

          {/* Contact Method */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Preferred Contact Method</label>
            <div className="flex gap-6 mt-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="contactMethod"
                  value="email"
                  checked={contactMethod === 'email'}
                  onChange={() => setContactMethod('email')}
                  className="form-radio text-brand-brown"
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="contactMethod"
                  value="phone"
                  checked={contactMethod === 'phone'}
                  onChange={() => setContactMethod('phone')}
                  className="form-radio text-brand-brown"
                />
                <span className="ml-2">Phone</span>
              </label>
            </div>
          </div>

          {/* Email/Phone Inputs */}
          {contactMethod === 'email' && (
            <div className="mb-4">
              <label className="block font-medium mb-1" htmlFor="email">Email<span className="text-red-500">*</span></label>
              <input
                id="email"
                type="email"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          {contactMethod === 'phone' && (
            <div className="mb-4">
              <label className="block font-medium mb-1" htmlFor="phone">Phone<span className="text-red-500">*</span></label>
              <input
                id="phone"
                type="tel"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-brown"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-5 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-800 font-medium hover:bg-gray-200"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-brand-brown text-white font-semibold hover:bg-opacity-90 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapRequestModal; 