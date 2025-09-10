import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
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
  ChevronLeft,
  ChevronRight,
  Users,
  BookOpen,
  Edit3,
  Trash2,
  Crown,
  Shirt,
  Circle,
  Sparkles,
  Menu,
} from "lucide-react";
import { useJewellery } from "../context/JewelleryContext";
import Footer from "../components/Footer";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const {
    jewellery,
    addJewellery,
    updateJewellery,
    deleteJewellery,
    getCategories,
    addBooking,
  } = useJewellery();

  const userBookings = [
    {
      id: 1,
      category: "Animals",
      jewelleryName: "Lion Pendant",
      quantity: 1,
      bookingDate: "2024-01-15",
      status: "Confirmed",
    },
    {
      id: 2,
      category: "Rings",
      jewelleryName: "Diamond Ring",
      quantity: 1,
      bookingDate: "2024-01-16",
      status: "Processing",
    },
  ];

  // Mock data for admin bookings and users
  const adminBookings = [
    {
      id: 1,
      userName: "John Doe",
      category: "Animals",
      jewelleryName: "Lion Pendant",
      quantity: 1,
      bookingDate: "2024-01-15",
    },
    {
      id: 2,
      userName: "Jane Smith",
      category: "Rings",
      jewelleryName: "Diamond Ring",
      quantity: 1,
      bookingDate: "2024-01-16",
    },
    {
      id: 3,
      userName: "Mike Johnson",
      category: "Earrings",
      jewelleryName: "Gold Hoops",
      quantity: 2,
      bookingDate: "2024-01-17",
    },
    {
      id: 4,
      userName: "Sarah Wilson",
      category: "Bracelets",
      jewelleryName: "Silver Bangle Set",
      quantity: 1,
      bookingDate: "2024-01-18",
    },
  ];

  const users = [
    { id: "user1", name: "John Doe", password: "pass123", status: "active" },
    {
      id: "user2",
      name: "Jane Smith",
      password: "pass456",
      status: "inactive",
    },
    {
      id: "user3",
      name: "Mike Johnson",
      password: "pass789",
      status: "active",
    },
    {
      id: "user4",
      name: "Sarah Wilson",
      password: "pass101",
      status: "active",
    },
    {
      id: "user5",
      name: "David Brown",
      password: "pass202",
      status: "inactive",
    },
  ];

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [newJewellery, setNewJewellery] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    image: "",
    quantity: 1,
  });

  const [activeTab, setActiveTab] = useState("catalog");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [bookingQuantities, setBookingQuantities] = useState({});
  const [wishlist, setWishlist] = useState([]);

  const sortOptions = [
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  // Prevent automatic scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Prevent any scroll behavior on category changes
    const preventScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("beforeunload", preventScroll);

    return () => {
      window.removeEventListener("beforeunload", preventScroll);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  // Responsive sidebar behavior: open on desktop, closed on mobile
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handleChange = () => {
      setSidebarOpen(mq.matches);
      setIsMobile(!mq.matches);
    };
    handleChange();
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Maintain scroll position when category changes
    const currentScroll = window.pageYOffset;
    const observer = new MutationObserver(() => {
      if (window.pageYOffset !== currentScroll) {
        window.scrollTo(0, currentScroll);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, [selectedCategory]);

  const categories = [
    "All",
    "Animals",
    "Arabic Style 21k",
    "Bracelets",
    "Mine",
    "SET",
    "Pendant",
    "Man Collection",
    "Rings",
    "Earrings",
  ];

  // Category stats
  const categoryStats = useMemo(() => {
    const stats = { All: jewellery.length };
    categories.slice(1).forEach((cat) => {
      stats[cat] = jewellery.filter((item) => item.category === cat).length;
    });
    return stats;
  }, [jewellery]);

  // Filtered and searched jewellery
  const filteredJewellery = useMemo(() => {
    let filtered = jewellery;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [jewellery, selectedCategory, searchTerm]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJewellery.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJewellery, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredJewellery.length / itemsPerPage);

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
    // Store booking data for admin to see
    cart.forEach((item) => {
      addBooking({
        userName: user?.name || "Guest User",
        category: item.category,
        jewelleryName: item.name,
        quantity: item.quantity,
        userId: user?.id || "guest",
      });
    });

    alert(`Order confirmed! ${getCartItemCount()} items booked successfully.`);
    setCart([]);
  };

  const handleQuantityChange = (itemId, quantity) => {
    setBookingQuantities({
      ...bookingQuantities,
      [itemId]: Math.max(1, quantity),
    });
  };

  const handleCategoryChange = (category) => {
    // Prevent scroll jumping when category changes
    const scrollPosition = window.pageYOffset;
    setSelectedCategory(category);
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 0);
  };

  const handleAddJewellery = (e) => {
    e.preventDefault();
    if (newJewellery.category && newJewellery.name && newJewellery.image) {
      if (editingItem) {
        // Update existing item
        updateJewellery(editingItem.id, {
          ...newJewellery,
          price: parseFloat(newJewellery.price) || 0,
        });
        alert("Product updated successfully!");
      } else {
        // Add new item
        addJewellery({
          ...newJewellery,
          price: parseFloat(newJewellery.price) || 0,
        });
        alert("Product added successfully!");
      }

      resetForm();
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      deleteJewellery(deleteConfirm.id);
      setDeleteConfirm(null);
      alert("Product deleted successfully!");
    }
  };

  const resetForm = () => {
    setNewJewellery({
      category: "",
      name: "",
      description: "",
      price: "",
      image: "",
      quantity: 1,
    });
    setImagePreview("");
    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewJewellery({
      category: item.category,
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      image: item.image,
      quantity: item.quantity,
    });
    setShowAddModal(true);
  };

  const handleLogout = () => {
    logout();
    // Navigate to home page - authentication logic will show login
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-0 left-1 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="flex fixed inset-y-0 left-0 z-40 flex-col w-80 bg-white border-r border-gray-200 shadow-xl transition-all duration-300 lg:relative lg:translate-x-0">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">AT Jeweller</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 lg:hidden"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: "catalog", label: "Jewellery Catalog", icon: Package },
              { id: "cart", label: "Shopping Cart", icon: ShoppingCart },
              { id: "bookings", label: "My Orders", icon: History },
            ].map((tab) => (
              <div key={tab.id} className="relative">
                {/* Active indicator bar */}
                {activeTab === tab.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full"></div>
                )}
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all
                    ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg ml-2"
                        : "text-gray-700 hover:bg-gray-100 hover:ml-1"
                    }`}
                  title={tab.label}
                >
                  <tab.icon className="flex-shrink-0 w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              </div>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex justify-center items-center px-4 py-3 space-x-2 w-full text-white bg-gray-600 rounded-xl transition-colors hover:bg-gray-700"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Toggle Button (when sidebar is hidden) */}
      {!sidebarOpen && (
        <div className="hidden flex-col items-center py-4 w-16 bg-white border-r border-gray-200 shadow-xl lg:flex">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 mb-4 rounded-lg transition-colors hover:bg-gray-100"
            title="Show Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Navigation Icons Only */}
          <nav className="flex-1 space-y-2">
            {[
              { id: "catalog", label: "Jewellery Catalog", icon: Package },
              { id: "cart", label: "Shopping Cart", icon: ShoppingCart },
              { id: "bookings", label: "My Orders", icon: History },
            ].map((tab) => (
              <div key={tab.id} className="relative">
                {/* Active indicator bar */}
                {activeTab === tab.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full"></div>
                )}
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl font-medium transition-all
                    ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  title={tab.label}
                >
                  <tab.icon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </nav>

          {/* Logout Icon */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="flex justify-center items-center w-12 h-12 text-gray-600 rounded-xl transition-colors hover:text-gray-800 hover:bg-gray-100"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex overflow-hidden flex-col flex-1"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Top Bar */}
        <header className="p-4 bg-white border-b border-gray-200 shadow-sm lg:p-6">
          <div className="flex flex-col justify-between items-start space-y-4 lg:flex-row lg:items-center lg:space-y-0">
            <div className="flex-1 max-w-lg"></div>

            {activeTab === "catalog" && (
              <div className="flex flex-col items-start space-y-4 w-full lg:flex-row lg:items-center lg:space-y-0 lg:w-auto">
                {/* Category Filter */}
                <div className="flex items-center space-x-2 w-full lg:w-auto">
                  <Filter className="flex-shrink-0 w-5 h-5 text-gray-600" />
                  {/* Mobile Category Dropdown */}
                  <div className="relative w-full lg:hidden">
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        if (
                          (selectedCategory !== "All" &&
                            e.target.value === "All") ||
                          (selectedCategory === "All" &&
                            e.target.value !== "All")
                        ) {
                          setCurrentPage(1);
                        }
                      }}
                      className="px-4 py-2 w-full bg-gray-100 rounded-lg appearance-none focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} ({categoryStats[cat] || 0})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Desktop Category Pills */}
                  <div className="hidden overflow-x-auto p-1 max-w-2xl bg-gray-100 rounded-lg lg:flex scrollbar-hide">
                    {categories.map((cat) => {
                      // Define icons for each category
                      const getCategoryIcon = (category) => {
                        switch (category) {
                          case "All":
                            return Package;
                          case "Animals":
                            return Heart;
                          case "Arabic Style 21k":
                            return Crown;
                          case "Bracelets":
                            return Circle;
                          case "Mine":
                            return Gem;
                          case "SET":
                            return Star;
                          case "Pendant":
                            return Heart;
                          case "Man Collection":
                            return Shirt;
                          case "Rings":
                            return Circle;
                          case "Earrings":
                            return Star;
                          default:
                            return Package;
                        }
                      };
                      const IconComponent = getCategoryIcon(cat);

                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            // Only reset to page 1 if switching from a filtered category to "All" or vice versa
                            if (
                              (selectedCategory !== "All" && cat === "All") ||
                              (selectedCategory === "All" && cat !== "All")
                            ) {
                              setCurrentPage(1);
                            }
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                            selectedCategory === cat
                              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform scale-105"
                              : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                          }`}
                        >
                          <IconComponent className="flex-shrink-0 w-4 h-4" />
                          <span>{cat}</span>
                          <span className="text-xs opacity-75">
                            ({categoryStats[cat] || 0})
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

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
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          {/* Jewellery Catalog */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {paginatedItems.length} of {filteredJewellery.length}{" "}
                  items
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </div>
              </div>

              {/* Items Grid/List */}
              {paginatedItems.length > 0 ? (
                <>
                  <div
                    className={`grid gap-6 transition-all duration-300 ease-in-out hide-scrollbar animate-fade-in ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                    }`}
                    style={{
                      minHeight: "400px",
                      maxHeight: "calc(100vh - 300px)",
                      overflowY: "auto",
                    }}
                  >
                    {paginatedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-amber-200 transition-all duration-300 overflow-hidden hover-lift ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        <div
                          className={`${
                            viewMode === "list" ? "w-32 h-32" : "aspect-square"
                          } overflow-hidden`}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="mb-1 text-xl font-bold leading-tight text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                {item.category}
                              </p>
                            </div>
                          </div>

                          <p className="mb-4 text-sm leading-relaxed text-gray-600">
                            {item.description}
                          </p>

                          <div className="flex items-center space-x-3">
                            <div className="flex items-center p-1 space-x-2 bg-gray-50 rounded-lg">
                              <button
                                onClick={() =>
                                  setBookingQuantities({
                                    ...bookingQuantities,
                                    [item.id]: Math.max(
                                      1,
                                      (bookingQuantities[item.id] || 1) - 1
                                    ),
                                  })
                                }
                                className="flex justify-center items-center w-8 h-8 text-gray-600 rounded hover:text-gray-800 hover:bg-white"
                              >
                                -
                              </button>
                              <span className="w-8 font-medium text-center">
                                {bookingQuantities[item.id] || 1}
                              </span>
                              <button
                                onClick={() =>
                                  setBookingQuantities({
                                    ...bookingQuantities,
                                    [item.id]: Math.min(
                                      item.quantity,
                                      (bookingQuantities[item.id] || 1) + 1
                                    ),
                                  })
                                }
                                className="flex justify-center items-center w-8 h-8 text-gray-600 rounded hover:text-gray-800 hover:bg-white"
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                addToCart(item, bookingQuantities[item.id] || 1)
                              }
                              className="px-4 py-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                      {/* First Button */}
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="First Page"
                      >
                        First
                      </button>

                      {/* Previous Button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      {/* Page Numbers */}
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === i + 1
                              ? "bg-amber-500 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      {/* Next Button */}
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      {/* Last Button */}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Last Page"
                      >
                        Last
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center">
                  <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No items found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? `No items match "${searchTerm}"`
                      : selectedCategory !== "All"
                      ? `No items in ${selectedCategory} category`
                      : "No jewellery items added yet"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                {cart.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {getCartItemCount()} items
                    </p>
                  </div>
                )}
              </div>

              {cart.length > 0 ? (
                <div className="space-y-6">
                  {/* Cart Items */}
                  <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200 shadow-sm">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-6 space-x-4 transition-colors hover:bg-gray-50"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-20 h-20 rounded-xl"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="mb-1 text-sm text-gray-600">
                            {item.category}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center p-2 space-x-2 bg-gray-50 rounded-xl">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="flex justify-center items-center w-8 h-8 bg-white rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 font-medium text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                              className="flex justify-center items-center w-8 h-8 bg-white rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 rounded-lg transition-colors hover:bg-red-50"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200">
                    <h3 className="mb-4 text-xl font-semibold text-gray-900">
                      Order Summary
                    </h3>

                    <div className="mb-6 space-y-3">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({getCartItemCount()} items)</span>
                        <span>Price not available</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between pt-3 text-xl font-bold text-gray-900 border-t">
                        <span>Total</span>
                        <span className="text-amber-600">
                          Price not available
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={confirmOrder}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirm Order</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
                  <ShoppingCart className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <h3 className="mb-2 text-xl font-medium text-gray-900">
                    Your cart is empty
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Add some beautiful jewellery to your cart
                  </p>
                  <button
                    onClick={() => setActiveTab("catalog")}
                    className="px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                  >
                    Browse Catalogue
                  </button>
                </div>
              )}
            </div>
          )}

          {/* My Orders Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Order History
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{userBookings.length} total orders</span>
                </div>
              </div>

              {userBookings.length > 0 ? (
                <div className="space-y-4">
                  {userBookings.map((booking, index) => (
                    <div
                      key={booking.id}
                      className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-lg"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex justify-center items-center w-8 h-8 text-sm font-semibold text-amber-600 bg-amber-100 rounded-full">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {booking.jewelleryName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Processing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status || "Confirmed"}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-gray-500">Quantity</p>
                          <p className="font-medium text-gray-900">
                            {booking.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Order Date</p>
                          <p className="font-medium text-gray-900">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium text-gray-900">
                            {booking.status || "Confirmed"}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <button className="flex items-center space-x-1 font-medium text-amber-600 hover:text-amber-700">
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>

                      {/* Order Progress */}
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Processing Time: 2-3 days
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Truck className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Delivery: 5-7 days
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Insured & Protected
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
                  <History className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                  <h3 className="mb-2 text-xl font-medium text-gray-900">
                    No orders yet
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Your order history will appear here
                  </p>
                  <button
                    onClick={() => setActiveTab("catalog")}
                    className="flex items-center px-6 py-3 space-x-2 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                  >
                    <Package className="w-4 h-4" />
                    <span>Start Shopping</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>

      {/* Add/Edit Jewellery Modal */}
      {showAddModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingItem ? "Edit Jewellery" : "Add New Jewellery"}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddJewellery} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Category */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={newJewellery.category}
                    onChange={(e) =>
                      setNewJewellery({
                        ...newJewellery,
                        category: e.target.value,
                      })
                    }
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newJewellery.name}
                    onChange={(e) =>
                      setNewJewellery({ ...newJewellery, name: e.target.value })
                    }
                    placeholder="Jewellery name"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newJewellery.price}
                    onChange={(e) =>
                      setNewJewellery({
                        ...newJewellery,
                        price: e.target.value,
                      })
                    }
                    min="0"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={newJewellery.quantity}
                    onChange={(e) =>
                      setNewJewellery({
                        ...newJewellery,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    min="1"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newJewellery.description}
                  onChange={(e) =>
                    setNewJewellery({
                      ...newJewellery,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Describe the jewellery..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={newJewellery.image}
                  onChange={(e) =>
                    setNewJewellery({ ...newJewellery, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="p-4 rounded-xl border border-gray-300">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Image Preview:
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-xl"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex pt-6 space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                >
                  {editingItem ? "Update" : "Save"} Jewellery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-6 w-full max-w-md bg-white rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center p-4 space-x-4 bg-red-50 rounded-xl border border-red-200">
                <img
                  src={deleteConfirm.image}
                  alt={deleteConfirm.name}
                  className="object-cover w-16 h-16 rounded-lg"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {deleteConfirm.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {deleteConfirm.category}
                  </p>
                  <p className="text-sm font-medium text-amber-600">
                    ₹{deleteConfirm.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-3 font-medium text-white bg-red-500 rounded-xl transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
