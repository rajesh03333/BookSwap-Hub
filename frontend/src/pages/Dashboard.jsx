// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Import useAuth

const API_URL = import.meta.env.VITE_API_URL || '';

const Dashboard = () => {
  const { token } = useAuth(); // <-- Get token
  const [myListings, setMyListings] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
        if (!token) {
            setError("Not authenticated"); // Should be handled by ProtectedRoute, but good check
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            // Fetch all data in parallel
            const [listingsRes, incomingReqRes, outgoingReqRes] = await Promise.all([
                fetch(`${API_URL}/api/users/me/listings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/requests/incoming`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${API_URL}/api/requests/outgoing`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            // Check responses
            if (!listingsRes.ok) throw new Error('Failed to load listings');
            if (!incomingReqRes.ok) throw new Error('Failed to load incoming requests');
            if (!outgoingReqRes.ok) throw new Error('Failed to load outgoing requests');

            // Parse JSON responses in parallel
            const [listingsData, incomingReqData, outgoingReqData] = await Promise.all([
                listingsRes.json(),
                incomingReqRes.json(),
                outgoingReqRes.json()
            ]);

            // Update state with fetched data
            setMyListings(listingsData);
            setIncomingRequests(incomingReqData);
            setOutgoingRequests(outgoingReqData);

        } catch (err) {
             setError(err.message || 'Failed to load dashboard data.');
             console.error("Dashboard fetch error:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [token]); // Re-fetch if token changes (e.g., re-login)

  // Action handlers for requests and listings
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (!response.ok) throw new Error('Failed to accept request');
      
      // Update local state to reflect the change
      setIncomingRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: 'accepted' } : req
        )
      );
    } catch (err) {
      console.error('Accept request error:', err);
      alert('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'declined' })
      });

      if (!response.ok) throw new Error('Failed to decline request');
      
      // Update local state to reflect the change
      setIncomingRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: 'declined' } : req
        )
      );
    } catch (err) {
      console.error('Decline request error:', err);
      alert('Failed to decline request');
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) throw new Error('Failed to cancel request');
      
      // Update local state to reflect the change
      setOutgoingRequests(prevRequests => 
        prevRequests.map(req => 
          req._id === requestId ? { ...req, status: 'cancelled' } : req
        )
      );
    } catch (err) {
      console.error('Cancel request error:', err);
      alert('Failed to cancel request');
    }
  };

  const handleRemoveListing = async (listingId) => {
    try {
      const response = await fetch(`${API_URL}/api/books/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove listing');
      
      // Update local state to reflect the change
      setMyListings(prevListings => 
        prevListings.filter(listing => listing._id !== listingId)
      );
    } catch (err) {
      console.error('Remove listing error:', err);
      alert('Failed to remove listing');
    }
  };

  if (loading) return <p className="text-center py-10">Loading Dashboard...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold font-serif text-brand-brown mb-8">My Dashboard</h1>

      <div className="space-y-10">

        {/* My Listings Section */}
        <section>
           <h2 className="text-2xl font-semibold font-sans text-gray-800 mb-4 border-b pb-2">My Listings</h2>
           {myListings.length === 0 ? (
                <p className="text-gray-500">You haven't listed any books yet. <Link to="/add-book" className="text-brand-brown hover:underline">Add one now!</Link></p>
           ) : (
               <ul className="space-y-3">
                 {myListings.map(listing => (
                    <li key={listing._id} className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
                        <Link to={`/book/${listing._id}`} className="text-link-text hover:text-brand-brown font-medium">{listing.title}</Link>
                        <button onClick={() => handleRemoveListing(listing._id)} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                    </li>
                 ))}
               </ul>
           )}
        </section>

         {/* Incoming Requests Section */}
        <section>
           <h2 className="text-2xl font-semibold font-sans text-gray-800 mb-4 border-b pb-2">Incoming Requests</h2>
            {incomingRequests.length === 0 ? (
                 <p className="text-gray-500">No one has requested your books yet.</p>
            ) : (
               <ul className="space-y-3">
                 {incomingRequests.map(req => (
                    <li key={req._id} className="p-3 bg-white rounded shadow-sm">
                        <p className="mb-1">
                          <span className="font-medium">{req.requester?.name || 'Someone'}</span> requested 
                          <span className="font-medium"> {req.book?.title || 'your book'}</span>
                        </p>
                        {req.requester?.email && (
                          <p className="text-sm text-gray-500 mb-1">{req.requester.email}</p>
                        )}
                        <p className="text-sm text-gray-600 mb-2">{req.message}</p>
                        {req.status === 'pending' ? (
                          <div className="flex gap-x-3 mt-2">
                              <button onClick={() => handleAcceptRequest(req._id)} className="text-sm bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded">Accept</button>
                              <button onClick={() => handleDeclineRequest(req._id)} className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded">Decline</button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Status: {req.status}</p>
                        )}
                    </li>
                 ))}
               </ul>
            )}
        </section>

         {/* Outgoing Requests Section */}
         <section>
           <h2 className="text-2xl font-semibold font-sans text-gray-800 mb-4 border-b pb-2">Outgoing Requests</h2>
             {outgoingRequests.length === 0 ? (
                 <p className="text-gray-500">You haven't requested any books.</p>
            ) : (
               <ul className="space-y-3">
                 {outgoingRequests.map(req => (
                    <li key={req._id} className="flex justify-between items-center p-3 bg-white rounded shadow-sm">
                        <div>
                          <p>Requested: <span className="font-medium">{req.book?.title || 'Unknown book'}</span></p>
                          <p className="text-sm text-gray-500">Status: {req.status}</p>
                        </div>
                        {req.status === 'pending' && (
                             <button onClick={() => handleCancelRequest(req._id)} className="text-sm text-gray-600 hover:text-red-700">Cancel</button>
                        )}
                    </li>
                 ))}
               </ul>
            )}
        </section>

      </div>
    </div>
  );
};

export default Dashboard;