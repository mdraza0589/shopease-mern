import React, { useState, useEffect } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { GiLoincloth } from "react-icons/gi";
import { TbBrandAnsible } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchFilteredProduct,
  fetchProductDetails,
} from "../../../server/product";
import { addToCart, fetchCartItems } from "../../../server/cart";

import ShoppingProductTile from "../../components/shopping-view/product-tile";
import Loading from "../../components/Loding/Loading";
import ProductDetailsDialog from "../../components/shopping-view/product-details";

/* ---------------------------- Hero Images ---------------------------- */
const imageUrls = [
  "https://cdn.pixabay.com/photo/2017/01/14/10/03/fashion-1979136_1280.jpg",
  "https://cdn.pixabay.com/photo/2015/06/10/13/23/clothesline-804812_1280.jpg",
  "https://cdn.pixabay.com/photo/2016/03/27/19/57/woman-1284031_1280.jpg",
  "https://cdn.pixabay.com/photo/2017/08/01/15/00/blue-2566082_1280.jpg",
  "https://cdn.pixabay.com/photo/2022/02/25/13/25/clothesline-7034166_1280.jpg",
];

const slideTexts = [
  {
    title: "Style That Speaks",
    description: "Discover trendy outfits that match your unique personality."
  },
  {
    title: "Fresh Arrivals Daily",
    description: "Stay ahead of the fashion curve with our latest collections."
  },
  {
    title: "Comfort Meets Class",
    description: "Experience premium quality clothing designed for everyday wear."
  },
  {
    title: "Your Wardrobe, Upgraded",
    description: "From casuals to formals — find everything you need in one place."
  },
  {
    title: "Fashion for Everyone",
    description: "Explore styles for men, women, and kids at unbeatable prices."
  },
];

/* ---------------------------- Brand + Category ---------------------------- */
const brandList = [
  { id: "nike", label: "nike", icon: <TbBrandAnsible size={30} /> },
  { id: "adidas", label: "adidas", icon: <TbBrandAnsible size={30} /> },
  { id: "puma", label: "puma", icon: <TbBrandAnsible size={30} /> },
  { id: "levis", label: "levis", icon: <TbBrandAnsible size={30} /> },
  { id: "woodland", label: "woodland", icon: <TbBrandAnsible size={30} /> },
  { id: "hm", label: "hm", icon: <TbBrandAnsible size={30} /> },
  { id: "mufti", label: "mufti", icon: <TbBrandAnsible size={30} /> },
  { id: "zara", label: "zara", icon: <TbBrandAnsible size={30} /> },
];

const categoryItemsList = [
  { id: "men", label: "Men", icon: <GiLoincloth size={30} /> },
  { id: "women", label: "Women", icon: <GiLoincloth size={30} /> },
  { id: "kids", label: "Kids", icon: <GiLoincloth size={30} /> },
  { id: "footwear", label: "Footwear", icon: <GiLoincloth size={30} /> },
  { id: "accessories", label: "Accessories", icon: <GiLoincloth size={30} /> },
];

const ShoppingHome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList, isLoading, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);

  /* ---------------------------- 🛒 Add to Cart ---------------------------- */
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
          dispatch(fetchCartItems(user.id));
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

  /* ---------------------------- 🔍 Product Details ---------------------------- */
  const handleGetProductDetails = (itemId) => {
    dispatch(fetchProductDetails(itemId))
      .unwrap()
      .then(() => setOpenDetailsDialog(true))
      .catch((err) => console.error("Error fetching product details:", err));
  };

  const handleCloseDialog = () => setOpenDetailsDialog(false);

  /* ---------------------------- Fetch featured products ---------------------------- */
  useEffect(() => {
    dispatch(fetchFilteredProduct({ filterParams: {}, sortParams: "latest" }));
  }, [dispatch]);

  const handleCategoryNavigate = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = { [section]: [getCurrentItem.id] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  };

  const handleSlideChanged = (e) => setActiveIndex(e.item);

  /* ---------------------------- Hero Carousel ---------------------------- */
  const items = imageUrls.map((url, index) => (
    <div className="relative w-full h-[70vh] md:h-[90vh]" key={index}>
      <img
        src={url}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        draggable="false"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
        <div
          className={`text-center text-white px-4 transition-all duration-700 ${activeIndex === index
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
            }`}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {slideTexts[index].title}
          </h2>
          <p className="text-lg md:text-2xl font-light mb-6 drop-shadow-md">
            {slideTexts[index].description}
          </p>
          <button
            onClick={() => navigate("/shop/listing")}
            className="bg-amber-500 cursor-pointer hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-full transition duration-300 shadow-lg"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  ));

  /* ---------------------------- JSX ---------------------------- */
  return (
    <div className="w-full bg-gray-50">
      <ToastContainer />

      {/* 🌄 Hero Section */}
      <AliceCarousel
        autoPlay
        infinite
        autoPlayInterval={2500}
        animationDuration={1200}
        animationType="fadeout"
        disableDotsControls
        disableButtonsControls
        mouseTracking={false}
        touchTracking={false}
        autoPlayStrategy="default"
        items={items}
        onSlideChanged={handleSlideChanged}
      />

      {/* 🛍️ Category Section */}
      <div className="max-w-6xl mx-auto mt-12 mb-16 px-4">
        <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">
          Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          {categoryItemsList.map((item, index) => (
            <div
              onClick={() => handleCategoryNavigate(item, "category")}
              key={index}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-amber-500 mb-3">{item.icon}</div>
              <p className="text-gray-800 font-semibold text-lg capitalize">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 🏷️ Brand Section */}
      <div className="max-w-6xl mx-auto mt-12 mb-16 px-4">
        <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">
          Shop by Brand
        </h1>

        <div className="flex flex-wrap justify-between gap-6">
          {brandList.map((item, index) => (
            <div
              onClick={() => handleCategoryNavigate(item, "brand")}
              key={index}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-4 w-[100px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="text-amber-500 mb-2">{item.icon}</div>
              <p className="text-gray-800 font-semibold text-sm text-center capitalize">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ⭐ Featured Products */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Featured Products
        </h2>

        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0 ? (
              productList.slice(0, 12).map((item) => (
                <ShoppingProductTile
                  key={item._id || item.id}
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 w-full col-span-full">
                No products available
              </p>
            )}
          </div>
        )}


        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/shop/listing")}
            className="bg-amber-500 cursor-pointer hover:bg-amber-400 text-white font-semibold px-8 py-3 rounded-full transition duration-300 shadow-md"
          >
            View All Products
          </button>
        </div>
      </div>

      {/* 🧩 Product Details Dialog */}
      {openDetailsDialog && <ProductDetailsDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default ShoppingHome;
