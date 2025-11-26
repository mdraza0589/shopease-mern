import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 px-6">
            <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertTriangle className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                <h1 className="text-5xl font-extrabold text-gray-800 mb-2">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-3">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Oops! The page you are looking for doesn’t exist or has been moved.
                </p>

                <button
                    onClick={() => navigate("/shop/home")}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 shadow-md w-full"
                >
                    <Home className="w-5 h-5" />
                    Go to Home Page
                </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                © {new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
        </div>
    );
};

export default NotFoundPage;
