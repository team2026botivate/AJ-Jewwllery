import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  ShoppingCart,
  History,
  Package,
  LogOut,
  Plus,
  Minus,
  X,
  Eye,
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  Star,
  ChevronDown,
  CheckCircle,
  Clock,
  Truck,
  Shield,
  User,
  Bell,
  Settings,
  Gem,
  Award,
  TrendingUp,
  ArrowRight,
  Calendar,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useJewellery } from "../context/JewelleryContext";
import Footer from "../components/Footer";
import Subcategories from "../components/Subcategories";

const CategoryPage = () => {
  const { user, logout } = useAuth();
  const { categoryName } = useParams();
  const { jewellery } = useJewellery();

  // Decode the category name from URL (convert kebab-case back to original)
  const decodedCategoryName = categoryName
    ? decodeURIComponent(categoryName).replace(/-/g, " ")
    : "All";

  // Normalize category naming (singular/plural) so URL always maps to our keys
  const normalizeCategoryName = (name) => {
    const map = {
      earring: "Earrings",
      earrings: "Earrings",
      bracelet: "Bracelets",
      bracelets: "Bracelets",
      ring: "Rings",
      set: "SET",
      men: "Man Collection",
      "man collection": "Man Collection",
    };
    const key = name.toLowerCase();
    return map[key] || name;
  };
  const normalizedCategoryName = normalizeCategoryName(decodedCategoryName);

  // Resolve public assets with Vite base; keep data URLs intact if used later
  const asset = (name) =>
    new URL(name.replace(/^\//, ""), import.meta.env.BASE_URL).pathname;

  // Demo subcategory images (using only existing public assets)
  const [categoryImages, setCategoryImages] = useState({
    Animals: {
      Lion: [asset("download.jpg"), asset("download (1).jpg")],
      Tiger: [asset("download (2).jpg")],
      Elephant: [asset("download (3).jpg")],
    },
    "Arabic Style 21k": {
      Necklace: [asset("download (2).jpg")],
      Bracelet: [asset("images.jpg")],
      Ring: [asset("download (3).jpg")],
    },
    Rings: {
      Diamond: [asset("download (1).jpg")],
      Sapphire: [asset("download (2).jpg")],
      Ruby: [asset("download (3).jpg")],
    },
    Earrings: {
      Pearl: [asset("images.jpg")],
      Gold: [asset("download.jpg")],
      Diamond: [asset("download (1).jpg")],
    },
    Bracelets: {
      Silver: [asset("images.jpg")],
      Gold: [asset("download (2).jpg")],
      Beaded: [asset("download.jpg")],
    },
    Pendant: {
      Heart: [asset("download (1).jpg")],
      Cross: [asset("download (2).jpg")],
      Star: [asset("download (3).jpg")],
    },
    "Man Collection": {
      Chain: [asset("images.jpg")],
      Bracelet: [asset("download.jpg")],
      Ring: [asset("download (1).jpg")],
    },
    SET: {
      Gold: [asset("download (3).jpg")],
      Diamond: [asset("images.jpg")],
      Silver: [asset("download.jpg")],
    },
    Mine: {
      Diamond: [asset("download (1).jpg")],
      Ruby: [asset("download (2).jpg")],
    },
  });
  const [bookingQuantities, setBookingQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Filtered and sorted jewellery for the specific category
  const filteredJewellery = useMemo(() => {
    let filtered = jewellery.filter((item) => {
      if (decodedCategoryName === "All") return true;
      return item.category.toLowerCase() === decodedCategoryName.toLowerCase();
    });

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [jewellery, decodedCategoryName, searchTerm, sortBy]);

  const addToCart = (item, quantity) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateCartQuantity(item.id, existingItem.quantity + quantity);
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const toggleWishlist = (itemId) => {
    setWishlist((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const getCartItemCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const confirmOrder = () => {
    alert(`Order confirmed! ${getCartItemCount()} items booked successfully.`);
    setCart([]);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setBookingQuantities({
      ...bookingQuantities,
      [itemId]: Math.max(1, quantity),
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 shadow-sm backdrop-blur-md bg-white/80">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center p-2 space-x-2 text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">AT</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">AT Jeweller</h1>
                <p className="text-sm text-gray-500">
                  {decodedCategoryName} Collection
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-gray-900">AT Jeweller</h1>
                <p className="text-xs text-gray-500">{decodedCategoryName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center px-4 py-2 space-x-2 bg-gray-100 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user?.name}
                </span>
              </div>
              <button
                onClick={() => alert("Notifications feature coming soon!")}
                className="p-2 text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 space-x-2 text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Gallery Section */}
        {normalizedCategoryName && normalizedCategoryName !== "All" && (
          <div className="mb-6">
            <Subcategories
              selectedCategory={normalizedCategoryName}
              categoryImages={categoryImages}
              setCategoryImages={setCategoryImages}
              setSelectedCategory={() => {}}
            />
          </div>
        )}
        {/* Search and Filters */}
        <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search jewellery..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 pr-4 pl-10 w-full rounded-xl border border-gray-300 appearance-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 w-full bg-white rounded-xl border border-gray-300 appearance-none focus:ring-2 focus:ring-amber-500 lg:w-auto"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex justify-between items-center lg:justify-center">
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-white shadow-sm" : ""
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <span className="ml-4 text-sm text-gray-600 lg:ml-0">
                {filteredJewellery.length} items
              </span>
            </div>
          </div>
        </div>

        {/* Jewellery Grid */}
        {filteredJewellery.length > 0 ? (
          <div
            className={`grid gap-6 mt-8 animate-fade-in ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {filteredJewellery.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300 overflow-hidden hover-lift group ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-48 h-48" : "aspect-square"
                  } overflow-hidden`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Removed Stock Status */}
                </div>

                <div className="flex-1 p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-3 py-1 mb-2 text-xs font-medium text-amber-800 bg-amber-100 rounded-full">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-amber-600">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Rating Removed - Clean Design */}
                    {/* Stars, rating number, and reviews count removed */}

                    {/* Remove Price Display for Users */}
                    {/* Price was displayed here */}

                    {/* Quantity Selector */}
                    <div className="flex items-center p-3 space-x-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-700">
                        Qty:
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (bookingQuantities[item.id] || 1) - 1
                            )
                          }
                          className="flex justify-center items-center w-8 h-8 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 font-medium text-center">
                          {bookingQuantities[item.id] || 1}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              (bookingQuantities[item.id] || 1) + 1
                            )
                          }
                          className="flex justify-center items-center w-8 h-8 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons - Only Add to Cart for Users */}
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() =>
                          addToCart(item, bookingQuantities[item.id] || 1)
                        }
                        className="flex justify-center items-center px-6 py-3 space-x-2 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                      {/* Remove View and other admin buttons */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 mt-8 text-center bg-white rounded-2xl border border-gray-200">
            <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or check back later
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
