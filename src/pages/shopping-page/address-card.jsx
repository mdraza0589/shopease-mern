import React from "react";
import { MapPin, Phone, Pencil, Trash2, CheckCircle } from "lucide-react";

const AddressCard = ({
  addressInfo,
  handleEditAddress,
  handleDeleteAddress,
  setcurrentSelectedAddress,
  currentSelectedAddress,
}) => {
  const isSelected = currentSelectedAddress?._id === addressInfo._id;

  const handleSelect = () => {
    if (setcurrentSelectedAddress) {
      // 🔄 Toggle logic
      if (isSelected) {
        setcurrentSelectedAddress(null); // unselect
      } else {
        setcurrentSelectedAddress(addressInfo); // select
      }
    }
  };

  return (
    <div
      onClick={handleSelect}
      className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300
        ${isSelected
          ? "border-amber-500 shadow-lg ring-2 ring-amber-300 bg-amber-50"
          : "border-gray-200 hover:shadow-md"
        }`}
    >
      {/* ✅ Tick icon when selected */}

      {/* Address Info */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-amber-500" />
            {addressInfo.city || "Unknown City"}
          </h2>

          <p className="text-gray-600 mt-1">{addressInfo.address}</p>
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Pincode:</span> {addressInfo.pincode}
          </p>
          <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
            <Phone size={16} className="text-green-500" />
            {addressInfo.phone}
          </p>

          {addressInfo.notes && (
            <p className="text-gray-500 italic text-sm mt-2">
              “{addressInfo.notes}”
            </p>
          )}
        </div>

        {/* Edit & Delete buttons */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              handleEditAddress(addressInfo);
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
          >
            <Pencil size={18} />
            <span className="text-sm">Edit</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              handleDeleteAddress(addressInfo);
            }}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
          >
            <Trash2 size={18} />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
