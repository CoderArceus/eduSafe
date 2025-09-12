import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

// The component itself is defined here
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Using useCallback makes the logout function stable and prevents re-renders
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log("Session expired or user logged out. Token cleared.");
    }, []);

    // This useEffect runs once to load the session from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // This watches every response from the server for authentication errors.
    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response, // Pass through successful responses
            (error) => {
                // Check if the error is 401 (Unauthorized) or 403 (Forbidden)
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // If it is, the token is bad, so we automatically log out.
                    logout();
                }
                return Promise.reject(error);
            }
        );

        // This is a cleanup function to remove the interceptor when it's no longer needed
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, [logout]);

    const login = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// The component is now the default export
export default AuthProvider;