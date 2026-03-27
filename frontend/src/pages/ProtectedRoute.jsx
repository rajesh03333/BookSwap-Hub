// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Show a loading indicator while checking auth status
        // TODO: Replace with a proper spinner/loading component
        return <div className="text-center py-20">Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to in state. This allows us to send them back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated, render the child components (the protected page)
    return children;
};

export default ProtectedRoute;