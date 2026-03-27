// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null); // Load token from localStorage on initial load
    const [loading, setLoading] = useState(true); // Add loading state
    const navigate = useNavigate(); // Use hook inside provider if needed, or pass down functions

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // Get stored user info

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                 setUser(JSON.parse(storedUser)); // Parse stored user JSON
            } catch (e) {
                 console.error("Failed to parse stored user", e);
                 localStorage.removeItem('user'); // Clear invalid stored user
                 localStorage.removeItem('token'); // Clear token too
                 setToken(null);
                 setUser(null);
            }
        }
        setLoading(false); // Finished loading initial auth state
    }, []);

    const login = (userData, userToken) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user info as JSON string
        setToken(userToken);
        setUser(userData);
        // Optional: redirect upon login can be handled here or in LoginPage
        // navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Remove user info on logout
        setToken(null);
        setUser(null);
        navigate('/login'); // Redirect to login page after logout
    };

    // Value provided to consuming components
    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token, // Simple check if token exists
        isLoading: loading // Provide loading state
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children} {/* Render children only after initial loading */}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};