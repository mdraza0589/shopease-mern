import { brandOptionMap, categoryOptionMap } from '../../config';

const ShoppingProductTile = ({ product, handleGetProductDetails, handleAddToCart }) => {
    const isOutOfStock = product?.totalStock <= 0;
    const isLowStock = product?.totalStock > 0 && product?.totalStock < 10;

    return (
        <div className="rounded-lg p-4 shadow hover:shadow-lg transition duration-300">
            <div
                onClick={() => handleGetProductDetails(product?._id)}
                className={`cursor-pointer relative`}
            >
                <div className="w-full h-44 flex items-center justify-center overflow-hidden mb-4 relative">
                    <img
                        src={product.image}
                        alt={product.title}
                        className={`object-cover h-full w-full rounded-xl ${isOutOfStock ? 'opacity-60' : ''}`}
                    />

                    {/* 🛑 Out of Stock Badge */}
                    {isOutOfStock && (
                        <span className="absolute cursor-pointer top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                            Out of Stock
                        </span>
                    )}

                    {/* ⚠️ Low Stock Badge */}
                    {isLowStock && (
                        <span className="absolute cursor-pointer top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                            Only {product.totalStock} left
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{product.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{product.description}</p>

                    <div className="flex justify-between text-sm text-gray-500">
                        <p>{brandOptionMap[product.brand]}</p>
                        <p>{categoryOptionMap[product?.category]}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {product.salePrice > 0 ? (
                            <>
                                <span className="text-red-500 font-bold">₹{product.salePrice}</span>
                                <span className="line-through text-gray-400">₹{product.price}</span>
                            </>
                        ) : (
                            <span className="font-bold">₹{product.price}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* 🛒 Add to Cart Button */}
            <button
                onClick={() => !isOutOfStock && handleAddToCart(product._id, product.totalStock)}
                disabled={isOutOfStock}
                className={`w-full cursor-pointer mt-3 py-2 rounded-md font-medium transition
                    ${isOutOfStock
                        ? 'bg-gray-400 cursor-not-allowed text-gray-100'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default ShoppingProductTile;

