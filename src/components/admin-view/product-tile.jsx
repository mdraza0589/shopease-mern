import React from "react";
import { ImageOff } from "lucide-react"; // placeholder icon

const AdminProductTile = ({
    product,
    handleDelete,
    handleEdit
}) => {


    return (
        <div className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col md:flex-row items-center gap-4 bg-white">

            <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {product?.image ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageOff className="w-10 h-10 mb-1 opacity-60" />
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </div>

            {/* 📄 Product Details */}
            <div className="flex-1 flex flex-col gap-1 text-center md:text-left">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {product.title || "Untitled Product"}
                </h2>

                <p className="text-gray-600 text-sm">
                    Stock: <span className="font-medium text-gray-800">{product.totalStock}</span>
                </p>

                {product?.salePrice > 0 && (
                    <p className="text-sm text-green-600 font-medium">
                        Sale Price: ₹{product.salePrice}
                    </p>
                )}
            </div>

            {/* ⚙️ Action Buttons */}
            <div className="flex gap-2 mt-2 md:mt-0">
                <button
                    onClick={() => handleEdit(product)}
                    className="px-4 py-2 cursor-pointer bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(product._id)}
                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default AdminProductTile;
