import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {
    const location = useLocation();

    // If not authenticated and not on login/register → send to login
    if (
        !isAuthenticated &&
        !(location.pathname.includes('/login') || location.pathname.includes('/register'))
    ) {
        return <Navigate to="/auth/login" />;
    }

    // If authenticated and currently on login/register → redirect to correct dashboard
    if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" />;
        } else {
            return <Navigate to="/shop/home" />;
        }
    }

    // ✅ Allow access to WelcomePage once after login
    if (isAuthenticated && location.pathname.includes('/shop/home')) {
        return <Navigate to="/shop/home" />;
    }

    if (isAuthenticated && location.pathname === '/welcomePage') {
        return children;
    }

    // Prevent unauthorized role access
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin')) {
        return <Navigate to="/unauth-page" />;
    }

    if (isAuthenticated && user?.role === 'admin' && location.pathname.includes('/shop')) {
        return <Navigate to="/admin/dashboard" />;
    }

    return children;
};

export default CheckAuth;



