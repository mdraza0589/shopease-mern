import React from "react";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UnauthPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-center px-6">
            <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
                <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                        <Lock className="w-10 h-10 text-red-600" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Access Denied
                </h1>
                <p className="text-gray-600 mb-6">
                    You are not authorized to view this page.
                    Please log in to continue.
                </p>

                <button
                    onClick={() => navigate("/login")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 shadow-md"
                >
                    Go to Login
                </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                © {new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
        </div>
    );
};

export default UnauthPage;
