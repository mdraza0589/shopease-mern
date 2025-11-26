import React, { useEffect, useState, useRef } from "react";
import ProductFilter from "../../components/shopping-view/filter";
import { FaArrowDownWideShort } from "react-icons/fa6";
import { sortOptions } from "../../config";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    fetchFilteredProduct,
    fetchProductDetails,
} from "../../../server/product";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import Loading from "../../components/Loding/Loading";
import ProductDetailsDialog from "../../components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "../../../server/cart";
import { useSearchParams } from "react-router-dom";

const ShoppingListingPage = () => {
    const dispatch = useDispatch();
    const { productList, isLoading, productDetails } = useSelector(
        (state) => state.shopProducts
    );
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);

    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState("price-lowToHigh");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [searchParams] = useSearchParams();
    const categorySearchParams = searchParams.get("category");

    /* ---------------------- 🛒 ADD TO CART ---------------------- */
    const handleAddToCart = (productId, totalStock) => {
        if (!user?.id) {
            toast.warn("⚠️ Please log in to add items to cart!", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        const getCartItems = cartItems?.items || [];
        const currentItemIndex = getCartItems.findIndex(
            (item) => item.productId === productId
        );

        if (currentItemIndex > -1) {
            const currentQuantity = getCartItems[currentItemIndex].quantity;
            if (currentQuantity + 1 > totalStock) {
                toast.error(`Only ${totalStock} item(s) available.`, {
                    position: "top-right",
                    autoClose: 1500,
                });
                return;
            }
        }

        
        dispatch(
            addToCart({
                userId: user.id,
                productId,
                quantity: 1,
            })
        )
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id));
                    toast.success("🛍️ Product added to cart!", {
                        position: "top-right",
                        autoClose: 1000,
                    });
                } else {
                    toast.error("❌ Failed to add item!", {
                        position: "top-right",
                        autoClose: 1000,
                    });
                }
            })
            .catch((error) => {
                console.error("Error adding to cart:", error);
                toast.error("❌ Something went wrong!", {
                    position: "top-right",
                    autoClose: 2000,
                });
            });
    };

    /* ---------------------- 🔍 PRODUCT DETAILS ---------------------- */
    const handleGetProductDetails = (itemId) => {
        dispatch(fetchProductDetails(itemId))
            .unwrap()
            .then(() => setOpenDetailsDialog(true))
            .catch((err) => console.error("Error fetching product details:", err));
    };

    /* ---------------------- 🧩 FILTER HANDLING ---------------------- */
    const handleFilter = (sectionId, currentOption) => {
        setFilters((prev) => {
            const options = Array.isArray(prev[sectionId])
                ? [...prev[sectionId]]
                : [];
            const index = options.indexOf(currentOption);

            if (index === -1) options.push(currentOption);
            else options.splice(index, 1);

            const newFilters = { ...prev, [sectionId]: options };
            sessionStorage.setItem("filters", JSON.stringify(newFilters));
            return newFilters;
        });
    };

    const handleSortClick = (value) => {
        setSort(value);
        setIsSortOpen(false);
    };

    const handleCloseDialog = () => setOpenDetailsDialog(false);

    /* ---------------------- 🌐 EFFECTS ---------------------- */
    useEffect(() => {
        try {
            const savedFilters =
                JSON.parse(sessionStorage.getItem("filters")) || {};
            setFilters(savedFilters);
        } catch (err) {
            console.error("Failed to load filters:", err);
            setFilters({});
        }
    }, [categorySearchParams]);

    useEffect(() => {
        dispatch(fetchFilteredProduct({ filterParams: filters, sortParams: sort }));
    }, [dispatch, filters, sort]);

    useEffect(() => {
        if (productDetails) setOpenDetailsDialog(true);
    }, [productDetails]);

    // Close sort dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        return () => window.removeEventListener("click", handleClickOutside);
    }, []);

    /* ---------------------- 🧾 RENDER ---------------------- */
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* ✅ Toast Container */}
            <ToastContainer />

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] px-4 md:px-8 gap-6 mt-6">
                {/* Sidebar Filter */}
                <ProductFilter filters={filters} handleFilter={handleFilter} />

                {/* Product Section */}
                <div className="w-full">
                    {/* Top Bar */}
                    <div className="flex flex-wrap justify-between items-center relative mb-6 bg-white shadow-sm rounded-lg px-4 py-3 border">
                        <h2 className="font-semibold text-lg text-gray-800">All Products</h2>

                        <div className="flex items-center gap-6 text-base text-gray-700">
                            <span className="text-gray-500">
                                {productList?.length || 0} Products
                            </span>

                            {/* Sort Dropdown */}
                            <div ref={sortRef} className="relative">
                                <div
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                                >
                                    <FaArrowDownWideShort />
                                    <h1 className="font-medium">Sort by</h1>
                                </div>

                                {isSortOpen && (
                                    <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg z-20 w-48 overflow-hidden">
                                        {sortOptions.map((sortItem) => (
                                            <div
                                                onClick={() => handleSortClick(sortItem.id)}
                                                key={sortItem.id}
                                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-sm font-medium"
                                            >
                                                {sortItem.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
                            {productList && productList.length > 0 ? (
                                productList.map((item) => (
                                    <ShoppingProductTile
                                        key={item._id || item.id}
                                        product={item}
                                        handleGetProductDetails={handleGetProductDetails}
                                        handleAddToCart={(id) =>
                                            handleAddToCart(id, item.totalStock)
                                        }
                                    />
                                ))
                            ) : (
                                <div className="col-span-full flex flex-col justify-center items-center h-[60vh] text-gray-500 text-lg font-medium">
                                    <span>No products found 😊</span>
                                    <span>Please select another category</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Product Details Dialog */}
            {openDetailsDialog && <ProductDetailsDialog onClose={handleCloseDialog} />}
        </div>
    );
};

export default ShoppingListingPage;
