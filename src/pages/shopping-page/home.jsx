import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { FiUser, FiUserCheck, FiSmile, FiShoppingBag, FiWatch } from "react-icons/fi";
import { RiRemixiconFill } from "react-icons/ri";
import { RiContrastFill } from "react-icons/ri";
import { FaTshirt } from "react-icons/fa";
import { RiContrast2Fill } from "react-icons/ri";
import { RiContrastDrop2Fill } from "react-icons/ri";
import { FaFonticonsFi } from "react-icons/fa6";
import { RiContrastDropLine } from "react-icons/ri";
import { RiContractLeftRightFill } from "react-icons/ri";
import { FaIcons } from "react-icons/fa";

import {
  fetchFilteredProduct,
  fetchProductDetails,
} from "../../../server/product";
import { addToCart, fetchCartItems } from "../../../server/cart";

import ShoppingProductTile from "../../components/shopping-view/product-tile";
import Loading from "../../components/Loding/Loading";
import ProductDetailsDialog from "../../components/shopping-view/product-details";

/* ---------------------------- Constants ---------------------------- */
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

const brandList = [
  { id: "nike", label: "Nike", icon: <RiRemixiconFill size={30} /> },
  { id: "adidas", label: "Adidas", icon: <RiContrastFill size={30} /> },
  { id: "puma", label: "Puma", icon: <RiContrast2Fill size={30} /> },
  { id: "levis", label: "Levi's", icon: <RiContrastDrop2Fill size={30} /> },
  { id: "woodland", label: "Woodland", icon: <FaFonticonsFi size={30} /> },
  { id: "hm", label: "H&M", icon: <RiContrastDropLine size={30} /> },
  { id: "mufti", label: "Mufti", icon: <RiContractLeftRightFill size={30} /> },
  { id: "zara", label: "Zara", icon: <FaIcons size={30} /> },
];


const categoryItemsList = [
  { id: "men", label: "Men", icon: <FiUser size={30} /> },
  { id: "women", label: "Women", icon: <FiUserCheck size={30} /> },
  { id: "kids", label: "Kids", icon: <FiSmile size={30} /> },
  { id: "footwear", label: "Footwear", icon: <FiShoppingBag size={30} /> },
  { id: "accessories", label: "Accessories", icon: <FiWatch size={30} /> },
];

const ShoppingHome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { productList, isLoading, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { user } = useSelector((state) => state.auth);

  /* ---------------------------- 🛒 Add to Cart ---------------------------- */
  const handleAddToCart = async (productId) => {
    if (!user?.id) {
      toast.warn("⚠️ Please log in to add items to cart!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    try {
      const result = await dispatch(
        addToCart({
          userId: user.id,
          productId: productId,
          quantity: 1,
        })
      ).unwrap();

      if (result?.success) {
        dispatch(fetchCartItems(user.id));
        toast.success("🛍️ Product added to cart!", {
          position: "top-right",
          autoClose: 1000,
        });
      } else {
        toast.error("❌ Failed to add item to cart!", {
          position: "top-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("❌ Something went wrong!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  /* ---------------------------- 🔍 Product Details ---------------------------- */
  const handleGetProductDetails = async (itemId) => {
    try {
      await dispatch(fetchProductDetails(itemId)).unwrap();
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("❌ Failed to load product details!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleCloseDialog = () => setOpenDetailsDialog(false);

  /* ---------------------------- Fetch featured products ---------------------------- */
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await dispatch(fetchFilteredProduct({
          filterParams: {},
          sortParams: "latest"
        })).unwrap();
      } catch (error) {
        console.error("Error fetching featured products:", error);
        toast.error("❌ Failed to load featured products!", {
          position: "top-right",
          autoClose: 2000,
        });
      }
    };

    loadFeaturedProducts();
  }, [dispatch]);

  // Update featured products when productList changes
  useEffect(() => {
    if (productList && Array.isArray(productList)) {
      setFeaturedProducts(productList.slice(0, 12));
    }
  }, [productList]);

  /* ---------------------------- Navigation Handlers ---------------------------- */
  const handleCategoryNavigate = (getCurrentItem, section) => {
    try {
      sessionStorage.removeItem("filters");
      const currentFilter = { [section]: [getCurrentItem.id] };
      sessionStorage.setItem("filters", JSON.stringify(currentFilter));
      navigate("/shop/listing");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleSlideChanged = (e) => {
    setActiveIndex(e.item);
  };

  /* ---------------------------- Hero Carousel ---------------------------- */
  const carouselItems = imageUrls.map((url, index) => (
    <div className="relative w-full h-[70vh] md:h-[90vh]" key={index}>
      <img
        src={url}
        alt={`Slide ${index + 1}`}
        className="w-full h-full object-cover"
        draggable="false"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center">
        <div
          className={`text-center text-white px-4 transition-all duration-700 ${activeIndex === index
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
            }`}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {slideTexts[index]?.title || "Fashion Collection"}
          </h2>
          <p className="text-lg md:text-2xl font-light mb-6 drop-shadow-md">
            {slideTexts[index]?.description || "Discover amazing products"}
          </p>
          <button
            onClick={() => navigate("/shop/listing")}
            className="bg-amber-500 cursor-pointer hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-full transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  ));

  /* ---------------------------- JSX ---------------------------- */
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* 🌄 Hero Section */}
      <section className="relative">
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
          items={carouselItems}
          onSlideChanged={handleSlideChanged}
        />
      </section>

      {/* 🛍️ Category Section */}
      <section className="max-w-6xl mx-auto mt-12 mb-16 px-4">
        <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">
          Shop by Category
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          {categoryItemsList.map((item, index) => (
            <button
              onClick={() => handleCategoryNavigate(item, "category")}
              key={item.id}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-5 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 w-full border border-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <div className="text-amber-500 mb-3">{item.icon}</div>
              <p className="text-gray-800 font-semibold text-lg capitalize">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 🏷️ Brand Section */}
      <section className="max-w-6xl mx-auto mt-12 mb-16 px-4">
        <h1 className="text-3xl text-center font-bold mb-8 text-gray-800">
          Shop by Brand
        </h1>

        <div className="flex flex-wrap justify-center gap-6">
          {brandList.map((item) => (
            <button
              onClick={() => handleCategoryNavigate(item, "brand")}
              key={item.id}
              className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-4 w-[100px] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <div className="text-amber-500 mb-2">{item.icon}</div>
              <p className="text-gray-800 font-semibold text-sm text-center capitalize">
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ⭐ Featured Products Section */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Featured Products
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loading />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((item) => (
                <ShoppingProductTile
                  key={item._id || item.id}
                  product={item}
                  handleAddToCart={handleAddToCart}
                  handleGetProductDetails={handleGetProductDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No featured products available</p>
                <button
                  onClick={() => navigate("/shop/listing")}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-2 rounded-full transition duration-300"
                >
                  Browse All Products
                </button>
              </div>
            )}
          </div>
        )}

        {featuredProducts.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/shop/listing")}
              className="bg-amber-500 cursor-pointer hover:bg-amber-400 text-white font-semibold px-8 py-3 rounded-full transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              View All Products
            </button>
          </div>
        )}
      </section>

      {/* 🧩 Product Details Dialog */}
      {openDetailsDialog && (
        <ProductDetailsDialog
          onClose={handleCloseDialog}
          productDetails={productDetails}
        />
      )}
    </div>
  );
};

export default ShoppingHome;