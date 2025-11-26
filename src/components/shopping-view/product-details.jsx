import { useDispatch, useSelector } from "react-redux";
import { X, Star } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToCart, fetchCartItems } from "../../../server/cart";
import StarRating from "../common/star-rating";
import React, { useEffect, useState } from "react";
import { addProductReview, getProductReview } from "../../../server/review";

const ProductDetailsDialog = ({ onClose }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { productDetails } = useSelector((state) => state.shopProducts);
    const { reviews, loading } = useSelector((state) => state.review);

    const [reviewMessage, setReviewMessage] = useState("");
    const [ratingValue, setRatingValue] = useState(0);

    if (!productDetails) return null;
    const product = productDetails;

    const isOutOfStock = product?.totalStock <= 0;
    const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;

    const handleRatingChange = (value) => {
        setRatingValue(value);
    };

    /* 🛒 Add to Cart */
    const handleAddToCart = (getId) => {
        if (!user?.id) {
            toast.warn("⚠️ Please log in to add items to cart!", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        dispatch(
            addToCart({
                userId: user.id,
                productId: getId,
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
            .catch(() => {
                toast.error("❌ Something went wrong!", {
                    position: "top-right",
                    autoClose: 2000,
                });
            });
    };

    /* ⭐ Submit Review */
    const handleSubmitReview = async () => {
        if (!user?.id) {
            toast.warn("⚠️ Please log in to add a review!", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        if (!ratingValue || !reviewMessage.trim()) {
            toast.warn("Please add both rating and review message!", {
                position: "top-right",
                autoClose: 1500,
            });
            return;
        }

        const reviewData = {
            userId: user.id,
            productId: product._id,
            rating: ratingValue,
            comment: reviewMessage,
        };

        try {
            const result = await dispatch(addProductReview(reviewData)).unwrap();

            if (result?._id) {
                toast.success("✅ Review submitted successfully!", {
                    position: "top-right",
                    autoClose: 1500,
                });
                setReviewMessage("");
                setRatingValue(0);
                dispatch(getProductReview(product._id)); // Refresh reviews
            }
        } catch (error) {
            toast.error(error || "❌ Failed to submit review!");
        }
    };

    /* 📦 Fetch reviews on product load */
    useEffect(() => {
        if (product?._id) {
            dispatch(getProductReview(product._id));
        }
    }, [dispatch, product?._id]);

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center overflow-y-auto py-10">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-auto relative my-10 mx-4">
                {/* ❌ Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                    <X size={20} />
                </button>

                {/* 🖼️ Product Info */}
                <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="relative flex justify-center items-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className={`w-full h-[300px] object-cover rounded-xl ${isOutOfStock ? "opacity-60" : ""
                                }`}
                        />

                        {/* 🛑 Out of Stock Badge */}
                        {isOutOfStock && (
                            <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                Out of Stock
                            </span>
                        )}

                        {/* ⚠️ Low Stock Badge */}
                        {isLowStock && (
                            <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                                Only {product.totalStock} left
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {product.title}
                        </h2>
                        <p className="text-gray-600 text-sm">{product.description}</p>

                        <div className="flex gap-4 mt-3 items-center">
                            <span className="text-2xl font-bold text-green-600">
                                ₹{product.salePrice}
                            </span>
                            {product.price && (
                                <span className="text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                            )}
                        </div>

                        {/* ⭐ Average Rating */}
                        <div className="flex items-center gap-1.5">
                            {(() => {
                                const avgRating =
                                    reviews && reviews.length > 0
                                        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                                        : 0;

                                return (
                                    <>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={
                                                    i < Math.round(avgRating)
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500">
                                            ({avgRating.toFixed(1)})
                                        </span>
                                    </>
                                );
                            })()}
                        </div>

                        <div className="mt-4 text-sm text-gray-700 space-y-1">
                            <p><strong>Brand:</strong> {product.brand}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <p>
                                <strong>Stock:</strong>{" "}
                                {isOutOfStock
                                    ? "Out of Stock"
                                    : isLowStock
                                        ? `Only ${product.totalStock} left`
                                        : product.totalStock}
                            </p>
                        </div>

                        {/* 🛒 Add to Cart Button */}
                        <button
                            onClick={() => !isOutOfStock && handleAddToCart(product?._id)}
                            disabled={isOutOfStock}
                            className={`mt-6 cursor-pointer px-5 py-2 rounded-lg font-medium transition 
                                ${isOutOfStock
                                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }`}
                        >
                            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </button>
                    </div>
                </div>

                {/* ⭐ Review Section */}
                <div className="px-6 pb-6 bg-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">
                        Customer Reviews
                    </h3>

                    {loading ? (
                        <p className="text-gray-500 text-sm">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                            No reviews yet. Be the first to review!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((r, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-semibold text-gray-800">
                                            {r.userName || "Anonymous"}
                                        </h4>
                                        <div className="flex items-center">
                                            {[...Array(r.rating)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className="text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">{r.comment}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ✍️ Add Review Input */}
                    <div className="mt-6 bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-gray-800 mb-3">Add Your Review</h4>
                        <StarRating onRatingChange={handleRatingChange} />
                        <textarea
                            value={reviewMessage}
                            onChange={(e) => setReviewMessage(e.target.value)}
                            placeholder="Write your review here..."
                            rows={3}
                            className="w-full mt-3 border border-gray-300 rounded-md p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSubmitReview}
                            className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsDialog;
