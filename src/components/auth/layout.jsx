import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section - Welcome Message */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-black">
        <div className="max-w-md space-y-6 text-white text-center text-primary-foreground">
          <h1 className="text-2xl font-bold">
            Welcome to E-commerce Shopping
          </h1>
          <p>Sign in to continue or create an account to get started.</p>
        </div>
      </div>

      {/* Right Section - Auth Outlet */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
