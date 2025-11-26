import React, { useState, useEffect, useRef } from "react";
import { ShoppingCart } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../server/auth";
import { MdOutlineAccountCircle, MdLogout } from "react-icons/md";
import { RxDropdownMenu, RxCross2 } from "react-icons/rx";
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
    const { productList } = useSelector((state) => state.shopProducts);

    const handleRemove = () => {
        console.log("delete clicked");
    };

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
        document.body.style.overflow =
            isCartOpen || isMobileMenuOpen ? "hidden" : "auto";
    }, [isCartOpen, isMobileMenuOpen]);

    // 🚪 Logout
    const handleLogOut = () => {
        const confirmToLogout = confirm("Do you want to log out?");
        if (confirmToLogout) {
            dispatch(logoutUser());
            setIsMenuOpen(false);
            setIsMobileMenuOpen(false);
        }
    };

    const handleNavigate = (getCurrentMenuItem) => {
        setIsMobileMenuOpen(false);
        sessionStorage.removeItem("filters");

        const currentFilter =
            getCurrentMenuItem.id !== "home" &&
                getCurrentMenuItem.id !== "product"
                && getCurrentMenuItem.id !== "search"
                ? { category: [getCurrentMenuItem.id] }
                : null;

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));

        if (location.pathname.includes("listing") && currentFilter !== null) {
            setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
        } else {
            navigate(getCurrentMenuItem.path);
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-0">
                {/* Logo */}
                <button
                    onClick={() => navigate("/shop/home")}
                    className="text-2xl font-bold text-gray-800 cursor-pointer"
                >
                    Shop<span className="text-blue-600">Ease</span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:block bg-gray-50">
                    <ul className="flex justify-center gap-8 text-gray-700 font-medium text-sm">
                        {shoppingViewHeaderMenuItem.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleNavigate(item)}
                                className="hover:text-blue-600 py-7 cursor-pointer"
                            >
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Desktop Icons */}
                <div
                    className="hidden md:flex items-center gap-6 relative"
                    ref={menuRef}
                >
                    {/* 🛒 Cart Icon */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative hover:text-blue-600 cursor-pointer transition"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {cartItems?.items?.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {cartItems.items.length}
                            </span>
                        )}
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="hover:text-blue-600 w-9 h-9  flex justify-center items-center-safe cursor-pointer bg-black border rounded-full transition"
                    >
                        <span className="font-bold text-white">
                            {user?.userName ? user.userName[0].toUpperCase() : "U"}
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-14 right-0 w-44 bg-white border shadow-lg rounded-lg flex flex-col overflow-hidden animate-fadeIn">
                            <span className="px-4 py-2 text-gray-700 text-sm">
                                {user?.email ? `Login as ${user.email}` : "Guest User"}
                            </span>
                            <span
                                onClick={() => {
                                    navigate("/shop/account");
                                    setIsMenuOpen(false);
                                }}
                                className="px-4 flex font-semibold items-center gap-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <MdOutlineAccountCircle /> Account
                            </span>
                            <span
                                onClick={handleLogOut}
                                className="px-4 flex items-center gap-2 font-semibold py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                <MdLogout /> Log Out
                            </span>
                        </div>
                    )}
                </div>

                {/* ✅ Mobile Menu Icon */}
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden text-gray-800 focus:outline-none"
                >
                    <RxDropdownMenu className="w-7 h-7" />
                </button>
            </div>

            {/* ✅ Mobile Side Menu */}
            <div
                className={`fixed inset-0 z-50 bg-opacity-40 backdrop-blur-sm transform transition-all duration-300 ease-in-out 
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
            >
                <div className="absolute left-0 top-0 w-3/4 max-w-sm bg-white h-full shadow-lg p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">ShopEase</h2>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-gray-600 hover:text-black transition"
                        >
                            <RxCross2 className="w-6 h-6" />
                        </button>
                    </div>

                    <ul className="flex flex-col text-gray-700 font-medium text-base divide-y">
                        {shoppingViewHeaderMenuItem.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleNavigate(item)}
                                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                            >
                                {item.label}
                            </li>
                        ))}

                        <li
                            onClick={() => {
                                navigate("/shop/account");
                                setIsMobileMenuOpen(false);
                            }}
                            className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <MdOutlineAccountCircle /> Account
                        </li>

                        <li
                            onClick={handleLogOut}
                            className="px-4 py-3 flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <MdLogout /> Log Out
                        </li>
                    </ul>
                </div>
            </div>

            {/* 🛒 Slide-In Cart Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-xl z-[60] transform transition-transform duration-300 ease-in-out 
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-600 hover:text-black transition cursor-pointer"
                    >
                        <RxCross2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="p-4 overflow-y-auto h-[calc(100%-20px)]">
                    <CartItemWrapper
                        cartItems={
                            cartItems?.items && cartItems.items.length > 0
                                ? cartItems.items
                                : []
                        }
                        handleRemove={handleRemove}
                        setIsCartOpen={setIsCartOpen}
                    />
                </div>
            </div>
        </header>
    );
};

export default ShoppingHeader;
