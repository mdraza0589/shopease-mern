import React, { useEffect, useRef } from "react";
import axios from '../../api/axios'

const ProductImageUpload = ({
    imageFile,
    setImageFile,
    uploadImageUrl,
    setUploadImageUrl,
    isImageLoading,
    setIsImageLoading,
    isEditMode
}) => {

    const inputRef = useRef();

    const handleImageChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) setImageFile(selectedFile);
    };

    const uploadImageToCloudinary = async () => {
        try {
            setIsImageLoading(true);

            const data = new FormData();
            data.append("my_file", imageFile);

            // 🔥 Uses baseURL from axios config instead of localhost
            const response = await axios.post(`/api/admin/products/upload-image`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload response:", response.data);

            const imageUrl =
                response?.data?.url ||
                response?.data?.imageUrl ||
                response?.data?.secure_url ||
                "";

            setUploadImageUrl(imageUrl);
        } catch (error) {
            console.error("Image upload failed:", error);
        } finally {
            setIsImageLoading(false);
        }
    };

    useEffect(() => {
        if (imageFile) uploadImageToCloudinary();
    }, [imageFile]);

    const handleBoxClick = () => {
        if (!isEditMode) inputRef.current.click();
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`w-40 h-40 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition ${isEditMode ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    }`}
                onClick={handleBoxClick}
            >
                {isImageLoading && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                )}

                {!isImageLoading && uploadImageUrl && (
                    <img
                        src={uploadImageUrl}
                        alt="Uploaded Preview"
                        className="w-full h-full object-cover rounded-lg"
                    />
                )}

                {!isImageLoading && !uploadImageUrl && (
                    <span className="text-gray-500 text-sm text-center">
                        {isEditMode ? "Editing disabled" : "Click to upload image"}
                    </span>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isEditMode}
            />

            {imageFile && (
                <p className="text-sm text-gray-700 truncate w-40 text-center">
                    {imageFile.name}
                </p>
            )}
        </div>
    );
};

export default ProductImageUpload;
