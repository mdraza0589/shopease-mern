import { useNavigate, useLocation } from "react-router-dom";
import { useState, useCallback, useMemo } from "react";
import { CiShop, CiShoppingTag } from "react-icons/ci";
import { MdOutlineShop2 } from "react-icons/md";
import { TbGrowth } from "react-icons/tb";

// Constants
const ADMIN_SIDEBAR_MENU_ITEMS = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <CiShop className="w-5 h-5" />,
    },
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: <CiShoppingTag className="w-5 h-5" />,
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <MdOutlineShop2 className="w-5 h-5" />,
    },
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Memoized navigation handler
    const handleNavigation = useCallback((path) => {
        navigate(path);
        setIsMobileOpen(false);
    }, [navigate]);

    // Check if menu item is active
    const isActiveItem = useCallback((path) => {
        return location.pathname === path;
    }, [location.pathname]);

    // Close mobile sidebar when clicking overlay
    const handleOverlayClick = useCallback(() => {
        setIsMobileOpen(false);
    }, []);

    // Prevent event propagation in sidebar
    const handleSidebarClick = useCallback((e) => {
        e.stopPropagation();
    }, []);

    // Memoized logo component to avoid repetition
    const Logo = useMemo(() => (
        <div
            onClick={() => handleNavigation("/admin/dashboard")}
            className="flex items-center gap-2 cursor-pointer group"
        >
            <TbGrowth className="w-7 h-7 lg:w-6 lg:h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Admin Panel
            </h1>
        </div>
    ), [handleNavigation]);

    // Memoized menu items rendering
    const MenuItems = useMemo(() => (
        <nav className="flex flex-col gap-1 mt-4">
            {ADMIN_SIDEBAR_MENU_ITEMS.map((menuItem) => {
                const isActive = isActiveItem(menuItem.path);

                return (
                    <button
                        key={menuItem.id}
                        onClick={() => handleNavigation(menuItem.path)}
                        className={`
                            flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer
                            transition-all duration-200 text-base font-medium w-full text-left
                            ${isActive
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            }
                        `}
                    >
                        <span className={`transition-colors ${isActive ? "text-blue-600" : "text-gray-400"}`}>
                            {menuItem.icon}
                        </span>
                        <span>{menuItem.label}</span>
                    </button>
                );
            })}
        </nav>
    ), [handleNavigation, isActiveItem]);

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-center py-3 border-b bg-white shadow-sm top-0 z-30">

                {/* Absolute positioned toggle button */}
                <button
                    onClick={() => setIsMobileOpen(prev => !prev)}
                    className="absolute left-4 top-8 transform -translate-y-1/2 p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label="Toggle menu"
                    aria-expanded={isMobileOpen}
                >
                    <div className="w-5 h-5 flex items-center justify-center">
                        {isMobileOpen ? "✕" : "☰"}
                    </div>
                </button>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col border-r bg-white p-6 sticky top-0 h-screen">
                {Logo}
                {MenuItems}
            </aside>

            {/* Mobile Sidebar Overlay - Hidden by default, only shows when isMobileOpen is true */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={handleOverlayClick}
                    role="presentation"
                >
                    <div
                        className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col transform transition-transform duration-300 ease-in-out"
                        onClick={handleSidebarClick}
                    >
                        <div className="flex items-center justify-between mb-6">
                            {Logo}
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors lg:hidden"
                                aria-label="Close menu"
                            >
                                <div className="w-5 h-5 flex items-center justify-center">✕</div>
                            </button>
                        </div>
                        {MenuItems}
                    </div>
                </div>
            )}
        </>
    );
}