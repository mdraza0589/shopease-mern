import ProductImageUpload from "../../components/admin-view/image-upload";
import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
};

function AdminProducts() {
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);

    const { productList } = useSelector((state) => state.adminProducts);
    const dispatch = useDispatch();

    function onSubmit(event) {
        event.preventDefault();

        if (currentEditedId !== null) {
            dispatch(editProduct({ id: currentEditedId, formData })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setFormData(initialFormData);
                    setOpenCreateProductsDialog(false);
                    setCurrentEditedId(null);
                }
            });
        } else {
            dispatch(addNewProduct({ ...formData, image: uploadedImageUrl })).then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllProducts());
                    setOpenCreateProductsDialog(false);
                    setImageFile(null);
                    setFormData(initialFormData);
                    alert("Product added successfully!");
                }
            });
        }
    }

    function handleDelete(id) {
        dispatch(deleteProduct(id)).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllProducts());
            }
        });
    }

    function isFormValid() {
        return Object.keys(formData)
            .filter((key) => key !== "averageReview")
            .map((key) => formData[key] !== "")
            .every((item) => item);
    }

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <Fragment>
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
                <button onClick={() => setOpenCreateProductsDialog(true)}>Add New Product</button>
            </div>

            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {productList && productList.length > 0
                    ? productList.map((productItem) => (
                        <div key={productItem.id} style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
                            <h3>{productItem.title}</h3>
                            <p>{productItem.description}</p>
                            <button
                                onClick={() => {
                                    setFormData(productItem);
                                    setOpenCreateProductsDialog(true);
                                    setCurrentEditedId(productItem.id);
                                }}
                            >
                                Edit
                            </button>
                            <button onClick={() => handleDelete(productItem.id)}>Delete</button>
                        </div>
                    ))
                    : <p>No products found.</p>}
            </div>

            {openCreateProductsDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        width: "400px",
                        height: "100%",
                        background: "#fff",
                        borderLeft: "1px solid #ccc",
                        overflowY: "auto",
                        padding: "20px",
                        boxShadow: "-2px 0 5px rgba(0,0,0,0.2)"
                    }}
                >
                    <h2>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</h2>
                    <button
                        style={{ marginBottom: "10px" }}
                        onClick={() => {
                            setOpenCreateProductsDialog(false);
                            setCurrentEditedId(null);
                            setFormData(initialFormData);
                        }}
                    >
                        Close
                    </button>

                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />

                    <div style={{ paddingTop: "20px" }}>
                        {openCreateProductsDialog && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    right: 0,
                                    width: "400px",
                                    height: "100%",
                                    background: "#fff",
                                    borderLeft: "1px solid #ccc",
                                    overflowY: "auto",
                                    padding: "20px",
                                    boxShadow: "-2px 0 5px rgba(0,0,0,0.2)",
                                }}
                            >
                                <h2>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</h2>
                                <button
                                    style={{ marginBottom: "10px" }}
                                    onClick={() => {
                                        setOpenCreateProductsDialog(false);
                                        setCurrentEditedId(null);
                                        setFormData(initialFormData);
                                    }}
                                >
                                    Close
                                </button>

                                <ProductImageUpload
                                    imageFile={imageFile}
                                    setImageFile={setImageFile}
                                    uploadedImageUrl={uploadedImageUrl}
                                    setUploadedImageUrl={setUploadedImageUrl}
                                    setImageLoadingState={setImageLoadingState}
                                    imageLoadingState={imageLoadingState}
                                    isEditMode={currentEditedId !== null}
                                />

                                <form onSubmit={onSubmit} style={{ paddingTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {addProductFormElements.map((controlItem) => {
                                        const value = formData[controlItem.name] || "";
                                        return (
                                            <div key={controlItem.name} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                <label htmlFor={controlItem.name} style={{ fontWeight: "bold" }}>
                                                    {controlItem.label}
                                                </label>

                                                {controlItem.componentType === "input" && (
                                                    <input
                                                        type={controlItem.type || "text"}
                                                        id={controlItem.name}
                                                        name={controlItem.name}
                                                        placeholder={controlItem.placeholder}
                                                        value={value}
                                                        onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
                                                        style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
                                                    />
                                                )}

                                                {controlItem.componentType === "textarea" && (
                                                    <textarea
                                                        id={controlItem.name}
                                                        name={controlItem.name}
                                                        placeholder={controlItem.placeholder}
                                                        value={value}
                                                        onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
                                                        style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
                                                    />
                                                )}

                                                {controlItem.componentType === "select" && (
                                                    <select
                                                        id={controlItem.name}
                                                        name={controlItem.name}
                                                        value={value}
                                                        onChange={(e) => setFormData({ ...formData, [controlItem.name]: e.target.value })}
                                                        style={{ padding: "8px", width: "100%" }}
                                                    >
                                                        <option value="">{controlItem.label}</option>
                                                        {controlItem.options?.map((option) => (
                                                            <option key={option.id} value={option.id}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        );
                                    })}

                                    <button
                                        type="submit"
                                        disabled={!isFormValid()}
                                        style={{ marginTop: "12px", padding: "10px", width: "100%" }}
                                    >
                                        {currentEditedId !== null ? "Edit" : "Add"}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
}

export default AdminProducts;

