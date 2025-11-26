import React, { useEffect, useState } from "react";
import CommonForm from "../../components/common/form";
import { addProductFormElements } from "../../config";
import ProductImageUpload from "../../components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProduct,
    addNewProduct,
    editProduct,
    deleteProduct,
} from "../../../server/product";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProductTile from "../../components/admin-view/product-tile";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    category: "",
};

const AdminProduct = () => {
    const [openCreateProductDialog, setOpenProductDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadImageUrl, setUploadImageUrl] = useState("");
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);

    const { productList } = useSelector((state) => state.adminproducts || {});
    const dispatch = useDispatch();

    // Fetch all products on mount
    useEffect(() => {
        dispatch(fetchProduct());
    }, [dispatch]);


    const handleDelete = (id) => {
        const confirmToDelete = confirm("Do you want to delete this product?");
        if (confirmToDelete) {
            dispatch(deleteProduct(id)).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchProduct());
                    toast.success("Product deleted successfully!");
                } else {
                    toast.error("Failed to delete product");
                }
            });
        }
    };

    // Submit form for add/edit
    const onSubmit = async (data) => {
        const productData = { ...data, image: uploadImageUrl };

        try {
            if (currentProductId !== null) {
                // Edit existing product
                const res = await dispatch(
                    editProduct({ id: currentProductId, formData: productData })
                ).unwrap();
                console.log("Product updated:", res);
                toast.success("Product updated successfully!");
            } else {
                // Add new product
                const res = await dispatch(addNewProduct(productData)).unwrap();
                console.log("Product added:", res);
                toast.success("Product added successfully!");
            }

            dispatch(fetchProduct());
            setCurrentProductId(null);
            setFormData(initialFormData);
            setImageFile(null);
            setUploadImageUrl("");
            setOpenProductDialog(false);
        } catch (error) {
            console.error("Failed to add or update product:", error);
            toast.error(error || "Something went wrong");
        }
    };

    // Handle edit product
    const handleEditProduct = (productItem) => {
        setFormData({
            title: productItem.title,
            description: productItem.description,
            brand: productItem.brand,
            price: productItem.price,
            salePrice: productItem.salePrice,
            totalStock: productItem.totalStock,
            category: productItem.category,
        });
        setUploadImageUrl(productItem.image || "");
        setCurrentProductId(productItem._id);
        setOpenProductDialog(true);
    };

    return (
        <div className="relative p-4">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Add Product Button */}
            <div className="mb-5 flex justify-end">
                <button
                    className="p-4 rounded-2xl m-2 hover:bg-amber-300 cursor-pointer shadow shadow-amber-500"
                    onClick={() => {
                        setOpenProductDialog(true);
                        setFormData(initialFormData);
                        setImageFile(null);
                        setUploadImageUrl("");
                        setCurrentProductId(null);
                    }}
                >
                    Add New Product
                </button>
            </div>

            {/* Product List */}
            <div>
                {productList && productList.length > 0 ? (
                    productList.map((productItem, index) => (
                        <AdminProductTile
                            key={productItem._id || productItem.id || index}
                            setFormData={setFormData}
                            setOpenProductDialog={setOpenProductDialog}
                            setCurrentProductId={setCurrentProductId}
                            product={productItem}
                            handleDelete={handleDelete}
                            handleEdit={handleEditProduct}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            We couldn't find any products on this page. Try adding a new one.
                        </p>
                    </div>
                )}
            </div>

            {/* Product Form Drawer */}
            {openCreateProductDialog && (
                <section className="transition-all duration-300 ease-in-out overflow-scroll pb-20 shadow shadow-amber-300 top-0 bg-white h-screen fixed right-0 w-100 md:w-2/3 lg:w-100">
                    <div className="p-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg">
                                {currentProductId ? "Edit Product" : "Add Product"}
                            </h2>
                            <button
                                className="cursor-pointer p-2 font-bold"
                                onClick={() => {
                                    setOpenProductDialog(false);
                                    setCurrentProductId(null);
                                    setFormData(initialFormData);
                                    setUploadImageUrl("");
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Image Upload */}
                        <ProductImageUpload
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                            uploadImageUrl={uploadImageUrl}
                            setUploadImageUrl={setUploadImageUrl}
                            isImageLoading={isImageLoading}
                            setIsImageLoading={setIsImageLoading}
                            isEditMode={currentProductId !== null}
                        />

                        {/* Product Form */}
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentProductId ? "Edit Product" : "Add Product"}
                            formControls={addProductFormElements}
                        />
                    </div>
                </section>
            )}
        </div>
    );
};

export default AdminProduct;


