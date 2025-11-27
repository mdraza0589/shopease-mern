import React, { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../server/auth";
import { MdOutlineAccountCircle, MdLogout } from "react-icons/md";
import CartItemWrapper from "./cart-wrapper";
import { fetchCartItems } from "../../../server/cart";
import { shoppingViewHeaderMenuItem } from "../../config";

const ShoppingHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const menuRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    const cartItemsCount = cartItems?.items?.length || 0;

    // 🧭 Fetch Cart Items when user logs in
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id));
        }
    }, [dispatch, user?.id]);

    // ✅ Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Disable scroll when menu or cart open
    useEffect(() => {
        if (isCartOpen || isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isCartOpen, isMobileMenuOpen]);

    // 🚪 Logout
    const handleLogOut = useCallback(() => {
        const confirmToLogout = window.confirm("Do you want to log out?");
        if (confirmToLogout) {
            dispatch(logoutUser());
            setIsMenuOpen(false);
            setIsMobileMenuOpen(false);
        }
    }, [dispatch]);

    const handleNavigate = useCallback((getCurrentMenuItem) => {
        setIsMobileMenuOpen(false);
        sessionStorage.removeItem("filters");

        const currentFilter =
            getCurrentMenuItem.id !== "home" &&
                getCurrentMenuItem.id !== "product" &&
                getCurrentMenuItem.id !== "search"
                ? { category: [getCurrentMenuItem.id] }
                : null;

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        if (location.pathname.includes("listing") && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
        } else {
            navigate(getCurrentMenuItem.path);
        }
    }, [location.pathname, navigate, setSearchParams]);

    const handleRemove = useCallback(() => {
        console.log("delete clicked");
    }, []);

    // Cart icon component to reuse across desktop and mobile
    const CartIcon = ({ className = "", onClick }) => (
        <button
            onClick={onClick}
            className={`relative hover:text-blue-600 cursor-pointer transition ${className}`}
            aria-label={`Shopping cart with ${cartItemsCount} items`}
        >
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </span>
            )}
        </button>
    );

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <button
                    onClick={() => navigate("/shop/home")}
                    className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                    aria-label="Go to homepage"
                >
                    Shop<span className="text-blue-600">Ease</span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:block">
                    <ul className="flex items-center gap-8 text-gray-700 font-medium text-sm">
                        {shoppingViewHeaderMenuItem.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleNavigate(item)}
                                className="hover:text-blue-600 py-4 cursor-pointer transition-colors border-b-2 border-transparent hover:border-blue-600"
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Desktop Icons */}
                <div
                    className="hidden md:flex items-center gap-4 relative"
                    ref={menuRef}
                >
                    {/* 🛒 Cart Icon */}
                    <CartIcon onClick={() => setIsCartOpen(true)} />

                    {/* Profile Button */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="hover:text-blue-600 w-9 h-9 flex justify-center items-center cursor-pointer bg-gray-800 border rounded-full transition-all hover:bg-gray-700"
                        aria-label="User menu"
                    >
                        {user?.userName ? (
                            <span className="font-bold text-white text-sm">
                                {user.userName[0].toUpperCase()}
                            </span>
                        ) : (
                            <User className="w-4 h-4 text-white" />
                        )}
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 shadow-lg rounded-lg flex flex-col overflow-hidden animate-fadeIn z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                    {user?.userName || "Guest"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "Not logged in"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate("/shop/account");
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <MdOutlineAccountCircle className="w-5 h-5" />
                                <span className="text-sm">Account</span>
                            </button>
                            <button
                                onClick={handleLogOut}
                                className="px-4 flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-100"
                            >
                                <MdLogout className="w-5 h-5" />
                                <span className="text-sm">Log Out</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Icons */}
                <div className="flex md:hidden items-center gap-4">
                    {/* 🛒 Mobile Cart Icon */}
                    <CartIcon
                        onClick={() => setIsCartOpen(true)}
                        className="mr-2"
                    />

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="text-gray-800 hover:text-blue-600 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Side Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-opacity-50 backdrop-blur-sm">
                    <div className="absolute left-0 top-0 w-80 max-w-full bg-white h-full shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-600 hover:text-black transition p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <p className="text-sm font-medium text-gray-800">
                                {user?.userName ? `Hello, ${user.userName}` : "Hello, Guest"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || "Sign in to your account"}
                            </p>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 overflow-y-auto">
                            <ul className="flex flex-col text-gray-700 font-medium">
                                {shoppingViewHeaderMenuItem.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleNavigate(item)}
                                        className="px-6 py-4 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100"
                                    >
                                        <span className="text-gray-800 hover:text-blue-600">
                                            {item.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Account Actions */}
                        <div className="border-t border-gray-200">
                            <button
                                onClick={() => {
                                    navigate("/shop/account");
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
                            >
                                <MdOutlineAccountCircle className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-800">Account</span>
                            </button>
                            <button
                                onClick={handleLogOut}
                                className="w-full px-6 py-4 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <MdLogout className="w-5 h-5 text-gray-600" />
                                <span className="text-gray-800">Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Drawer */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60]  bg-opacity-50 backdrop-blur-sm">
                    <div className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Your Cart ({cartItemsCount})
                            </h2>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-600 hover:text-black transition p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Close cart"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <CartItemWrapper
                                cartItems={cartItems?.items || []}
                                handleRemove={handleRemove}
                                setIsCartOpen={setIsCartOpen}
                            />
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default ShoppingHeader;