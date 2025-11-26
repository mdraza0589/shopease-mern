import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {
    const location = useLocation();

    // 1️⃣ BLOCK UNAUTHENTICATED USERS (unless login/register)
    if (
        !isAuthenticated &&
        !(location.pathname.includes('/login') || location.pathname.includes('/register'))
    ) {
        return <Navigate to="/auth/login" />;
    }

    // 2️⃣ REDIRECT AUTH USERS FROM LOGIN/REGISTER
    if (isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/shop/home'} />;
    }

    // 3️⃣ PREVENT WRONG ROLE ACCESS
    if (isAuthenticated && user?.role !== 'admin' && location.pathname.startsWith('/admin')) {
        return <Navigate to="/unauth-page" />;
    }

    if (isAuthenticated && user?.role === 'admin' && location.pathname.startsWith('/shop')) {
        return <Navigate to="/admin/dashboard" />;
    }

    // Allow the requested page
    return children;
};

export default CheckAuth;
