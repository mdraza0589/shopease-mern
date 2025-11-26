import React, { useState } from "react";
import Address from "./address";
import ShoppingOrders from "../../components/shopping-view/shopping-orders";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("order");

  return (
    <div className="min-h-screen">
      {/* Top banner image */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <img
          className="w-full h-full object-cover object-center"
          src="https://cdn.pixabay.com/photo/2020/11/19/22/17/girl-5760039_1280.jpg"
          alt="banner"
        />
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-8 border-b border-gray-300 pb-2">
          <button
            onClick={() => setActiveTab("order")}
            className={`text-lg cursor-pointer font-semibold pb-2 ${activeTab === "order"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("address")}
            className={`text-lg cursor-pointer font-semibold pb-2 ${activeTab === "address"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Address
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-8 px-6">
        {activeTab === "order" && (
          <ShoppingOrders/>
        )}

        {activeTab === "address" && (
          <div>
            <Address />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountPage;
