import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../../../server/search";
import { clearSearch } from "../../store/shop/search-slice/search-slice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingProductTile from "../../components/shopping-view/product-tile";
import Loading from "../../components/Loding/Loading";
import ProductDetailsDialog from "../../components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "../../../server/cart";
import { fetchProductDetails } from "../../../server/product";

const Search = () => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const { searchResult, isLoading, error } = useSelector((state) => state.search);
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { productDetails } = useSelector((state) => state.shopProducts);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    // 🔍 Auto-search (debounced)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (keyword.trim().length > 0) {
                dispatch(searchProducts(keyword));
            } else {
                dispatch(clearSearch());
            }
        }, 500); // wait 0.5 sec after user stops typing

        return () => clearTimeout(delayDebounce);
    }, [keyword, dispatch]);

    // 🛒 Add to Cart
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

    // 🔍 Product Details
    const handleGetProductDetails = (productId) => {
        dispatch(fetchProductDetails(productId))
            .unwrap()
            .then(() => setOpenDetailsDialog(true))
            .catch((err) => console.error("Error fetching product details:", err));
    };

    const handleCloseDialog = () => setOpenDetailsDialog(false);

    // auto-open details dialog
    useEffect(() => {
        if (productDetails) setOpenDetailsDialog(true);
    }, [productDetails]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <ToastContainer />

            {/* 🔎 Search Bar */}
            <div className="max-w-3xl mx-auto flex gap-3">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search Products / Brand / Category ... "
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {keyword && (
                    <button
                        onClick={() => {
                            setKeyword("");
                            dispatch(clearSearch());
                        }}
                        className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* 🧾 Search Results */}
            <div className="max-w-6xl mx-auto mt-10">
                {isLoading && <Loading />}

                {error && (
                    <div className="text-center text-red-500 mt-4">❌ {error}</div>
                )}

                {!isLoading && searchResult.length > 0 && (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {searchResult.map((item) => (
                            <ShoppingProductTile
                                key={item._id}
                                product={item}
                                handleGetProductDetails={() =>
                                    handleGetProductDetails(item._id)
                                }
                                handleAddToCart={() =>
                                    handleAddToCart(item._id, item.totalStock)
                                }
                            />
                        ))}
                    </div>
                )}

                {!isLoading && searchResult.length === 0 && keyword && !error && (
                    <div className="text-center text-gray-500 mt-10">
                        No products found for "<span className="font-semibold">{keyword}</span>"
                    </div>
                )}
            </div>

            {/* ✅ Product Details Dialog */}
            {openDetailsDialog && <ProductDetailsDialog onClose={handleCloseDialog} />}
        </div>
    );
};

export default Search;

