import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = ({ isAuthenticated, user }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const fullText = "WELCOME TO SHOPEASE";
    const typingSpeed = 100; // milliseconds per character

    // Typing animation effect
    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timer = setTimeout(() => {
                setDisplayText(prev => prev + fullText[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, typingSpeed);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, fullText.length]);

    // Trigger redirect flag after 3 seconds
    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            setRedirect(true);
        }, 3000);
        return () => clearTimeout(redirectTimer);
    }, []);

    // Actual navigation after redirect flag becomes true
    useEffect(() => {
        if (redirect) {
            if (isAuthenticated) {
                if (user?.role === 'admin') {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/shop/home", { replace: true });
                }
            } else {
                navigate("/auth/login", { replace: true });
            }
        }
    }, [redirect, isAuthenticated, user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex flex-col items-center justify-center p-4">
            {/* Main Welcome Text with Typing Animation */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-wider font-mono">
                    {displayText}
                </h1>

                {/* Loading Bar */}
                <div className="w-64 md:w-96 h-2 bg-white bg-opacity-30 rounded-full mx-auto overflow-hidden mb-4">
                    <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{
                            animation: 'loading 3s linear forwards'
                        }}
                    />
                </div>
            </div>

            {/* Powered By Text */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-white text-opacity-70 text-sm md:text-base">
                    POWERED BY MOHAMMAD RAZA
                </p>
            </div>

            {/* CSS animation for loading bar */}
            {/* CSS animation for loading bar */}
            <style>{`
                @keyframes loading {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                `}</style>

        </div>
    );
};

export default WelcomePage;

