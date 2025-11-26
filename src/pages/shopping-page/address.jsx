import { useEffect, useState } from "react";
import CommonForm from "../../components/common/form";
import { addressFormControls } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import {
    addNewAddress,
    deleteAddress,
    editAddress,
    fetchAllAddress,
} from "../../../server/address";
import AddressCard from "./address-card";

// ✅ Correct imports for React Toastify v11+
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialAddressFormData = {
    address: "",
    city: "",
    phone: "",
    pincode: "",
    notes: "",
};

const Address = ({ setcurrentSelectedAddress, currentSelectedAddress }) => {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { addressList } = useSelector((state) => state.shopAddress);

    // ✅ Add / Edit Address handler
    const handleManageAddress = () => {
        if (!user?.id) {
            toast.error("Please login to manage addresses.");
            return;
        }

        if (addressList.length >= 3 && !currentEditedId) {
            toast.error("You can add max 3 address")
            setFormData(initialAddressFormData)
            return;
        }

        if (currentEditedId) {
            // Editing existing address
            dispatch(
                editAddress({
                    userId: user.id,
                    addressId: currentEditedId,
                    formData,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    toast.success("Address updated successfully!");
                    dispatch(fetchAllAddress(user.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                } else {
                    toast.error("Failed to update address!");
                }
            });
        } else {
            // Adding new address
            dispatch(
                addNewAddress({
                    ...formData,
                    userId: user.id,
                })
            ).then((data) => {
                if (data?.payload?.success) {
                    toast.success("Address added successfully!");
                    dispatch(fetchAllAddress(user.id));
                    setFormData(initialAddressFormData);
                } else {
                    toast.error("Failed to add address!");
                }
            });
        }
    };

    // ✅ Delete Address handler
    const handleDeleteAddress = (address) => {
        dispatch(deleteAddress({ userId: user.id, addressId: address._id })).then(
            (data) => {
                if (data?.payload?.success) {
                    toast.success("Address deleted successfully!");
                    dispatch(fetchAllAddress(user.id));
                } else {
                    toast.error("Failed to delete address!");
                }
            }
        );
    };

    // ✅ Edit Address handler (load data into form)
    const handleEditAddress = (address) => {
        setCurrentEditedId(address._id);
        setFormData({
            address: address.address,
            city: address.city,
            phone: address.phone,
            pincode: address.pincode,
            notes: address.notes,
        });
        toast.info("Editing address...");
    };

    // ✅ Fetch all addresses on mount
    useEffect(() => {
        if (user?.id) {
            dispatch(fetchAllAddress(user.id));
        }
    }, [dispatch, user?.id]);

    // ✅ Validate form
    const isFormValid = () =>
        Object.keys(formData).every((key) => formData[key].trim() !== "");

    return (
        <div className="py-10">
            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />

            <h2 className="text-2xl font-semibold text-center mb-6">
                {currentEditedId ? "Edit Address" : "Add New Address"}
            </h2>

            {/* Address List */}
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {addressList?.length > 0 ? (
                    addressList.map((item) => (
                        <AddressCard
                            key={item._id}
                            addressInfo={item}
                            handleDeleteAddress={handleDeleteAddress}
                            handleEditAddress={handleEditAddress}
                            setcurrentSelectedAddress={setcurrentSelectedAddress}
                            currentSelectedAddress={currentSelectedAddress}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No address added yet.
                    </p>
                )}
            </div>

            {/* Address Form */}
            <div className="flex justify-center">
                <div className="space-y-6 w-full max-w-lg">
                    <CommonForm
                        formControls={addressFormControls}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={currentEditedId ? "Update" : "Add"}
                        onSubmit={handleManageAddress}
                        isBtnDisabled={!isFormValid()}
                    />

                    {currentEditedId && (
                        <button
                            onClick={() => {
                                setCurrentEditedId(null);
                                setFormData(initialAddressFormData);
                                toast.info("Edit cancelled.");
                            }}
                            className="w-full mt-2 bg-gray-200 text-gray-800 rounded-lg py-2 hover:bg-gray-300 transition"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Address;
