import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingCart,
  History,
  Package,
  LogOut,
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
  ArrowUp,
} from "lucide-react";
import { useJewellery } from "../context/JewelleryContext";
import Footer from "../components/Footer";
import Subcategories from "../components/Subcategories";

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
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [orderJustPlaced, setOrderJustPlaced] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [newJewellery, setNewJewellery] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    image: "",
    quantity: 1,
    weight: "",
  });

  const [activeTab, setActiveTab] = useState("catalog");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

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

  // Auto-clear toast after duration
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Back to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset order just placed flag when switching away from cart tab
  useEffect(() => {
    if (activeTab !== "cart") {
      setOrderJustPlaced(false);
    }
  }, [activeTab]);

  // Categories pulled from JewelleryContext to stay perfectly in sync with catalogue
  const categories = getCategories();

  // Resolve public assets with Vite base (safe join)
  const asset = (name) => {
    if (!name) return name;
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const clean = name.startsWith("/") ? name.slice(1) : name;
    return `${cleanBase}/${clean}`;
  };

  // Category images with subcategories (mirrors AdminCategoryPage)
  const [categoryImages, setCategoryImages] = useState({
    Animals: {
      Lion: [
        {
          url: asset("download.jpg"),
          description: "Beautiful lion pendant with intricate detailing",
          weight: "15g",
        },
        {
          url: asset("download (1).jpg"),
          description: "Elegant lion necklace showcasing craftsmanship",
          weight: "20g",
        },
      ],
      Tiger: [
        {
          url: asset("download (2).jpg"),
          description: "Stunning tiger brooch with vibrant colors",
          weight: "18g",
        },
      ],
      Elephant: [
        {
          url: asset("download (3).jpg"),
          description: "Majestic elephant ring symbolizing wisdom",
          weight: "25g",
        },
      ],
    },
    "Arabic Style 21k": {
      Necklace: [
        {
          url: asset("download (2).jpg"),
          description: "Traditional Arabic necklace in 21k gold",
          weight: "30g",
        },
      ],
      Bracelet: [
        {
          url: asset("images.jpg"),
          description: "Elegant Arabic bracelet with cultural motifs",
          weight: "22g",
        },
      ],
      Ring: [
        {
          url: asset("download (3).jpg"),
          description: "Authentic Arabic style ring design",
          weight: "12g",
        },
      ],
    },
    Rings: {
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Sparkling diamond ring with premium cut",
          weight: "8g",
        },
      ],
      Sapphire: [
        {
          url: asset("download (2).jpg"),
          description: "Beautiful sapphire ring with blue brilliance",
          weight: "10g",
        },
      ],
      Ruby: [
        {
          url: asset("download (3).jpg"),
          description: "Vivid ruby ring showcasing deep red color",
          weight: "9g",
        },
      ],
    },
    Earrings: {
      Pearl: [
        {
          url: asset("images.jpg"),
          description: "Classic pearl earrings with timeless appeal",
          weight: "6g",
        },
      ],
      Gold: [
        {
          url: asset("download.jpg"),
          description: "Solid gold earrings with modern design",
          weight: "14g",
        },
      ],
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Diamond stud earrings for elegance",
          weight: "5g",
        },
      ],
    },
    Bracelets: {
      Silver: [
        {
          url: asset("images.jpg"),
          description: "Sterling silver bracelet with sleek finish",
          weight: "16g",
        },
      ],
      Gold: [
        {
          url: asset("download (2).jpg"),
          description: "Luxurious gold bracelet for special occasions",
          weight: "28g",
        },
      ],
      Beaded: [
        {
          url: asset("download.jpg"),
          description: "Colorful beaded bracelet with unique patterns",
          weight: "11g",
        },
      ],
    },
    Pendant: {
      Heart: [
        {
          url: asset("download (1).jpg"),
          description: "Romantic heart pendant with delicate chain",
          weight: "7g",
        },
      ],
      Cross: [
        {
          url: asset("download (2).jpg"),
          description: "Elegant cross pendant with spiritual meaning",
          weight: "13g",
        },
      ],
      Star: [
        {
          url: asset("download (3).jpg"),
          description: "Shining star pendant for celestial beauty",
          weight: "9g",
        },
      ],
    },
    "Man Collection": {
      Chain: [
        {
          url: asset("images.jpg"),
          description: "Stylish men's chain with rugged design",
          weight: "35g",
        },
      ],
      Bracelet: [
        {
          url: asset("download.jpg"),
          description: "Masculine bracelet with bold links",
          weight: "24g",
        },
      ],
      Ring: [
        {
          url: asset("download (1).jpg"),
          description: "Men's ring with sophisticated engraving",
          weight: "17g",
        },
      ],
    },
    SET: {
      Gold: [
        {
          url: asset("download (3).jpg"),
          description: "Complete gold jewelry set for elegance",
          weight: "45g",
        },
      ],
      Diamond: [
        {
          url: asset("images.jpg"),
          description: "Diamond jewelry set with sparkling gems",
          weight: "32g",
        },
      ],
      Silver: [
        {
          url: asset("download.jpg"),
          description: "Silver jewelry set with versatile appeal",
          weight: "38g",
        },
      ],
    },
    Mine: {
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Premium mined diamond with exceptional clarity",
          weight: "4g",
        },
      ],
      Ruby: [
        {
          url: asset("download (2).jpg"),
          description: "Vivid ruby from natural mines",
          weight: "6g",
        },
      ],
    },
  });

  const getCategoryCover = (category) => {
    const group = categoryImages[category] || {};
    const firstKey = Object.keys(group)[0];
    const imgs = group[firstKey] || [];
    return imgs[0]?.url || asset("download.jpg");
  };

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
      setToast({
        message: `Updated ${item.name} quantity in cart!`,
        type: "success",
        duration: 3000,
      });
    } else {
      setCart([...cart, { ...item, quantity }]);
      setToast({
        message: `Added ${item.name} to cart!`,
        type: "success",
        duration: 3000,
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
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
    console.log("Confirming order, cart:", cart);

    // Store booking data for admin to see (if available)
    if (addBooking) {
      cart.forEach((item) => {
        addBooking({
          userName: user?.name || "Guest User",
          category: item.category,
          jewelleryName: item.name,
          quantity: item.quantity,
          userId: user?.id || "guest",
        });
      });
    }

    // Add to user's orders
    const newBookings = cart.map((item, index) => ({
      id: `${Date.now()}-${index}`,
      jewelleryName: item.name,
      category: item.category,
      quantity: item.quantity,
      bookingDate: new Date().toISOString(),
      status: "Confirmed",
    }));

    console.log("New bookings:", newBookings);

    setMyOrders((prev) => {
      console.log("Previous bookings:", prev);
      const updated = [...prev, ...newBookings];
      console.log("Updated bookings:", updated);
      return updated;
    });

    // Clear cart
    setCart([]);

    // Set order just placed flag for cart message
    setOrderJustPlaced(true);

    // Show success modal
    setShowOrderSuccessModal(true);
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
      weight: "",
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
      weight: item.weight || "",
    });
    setShowAddModal(true);
  };

  const handleLogout = () => {
    logout();
    // Navigate to home page - authentication logic will show login
    window.location.href = "/";
  };

  const clearCart = () => {
    setCart([]);
    setToast({
      message: "Cart cleared successfully!",
      type: "success",
      duration: 3000,
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex overflow-y-auto overflow-x-hidden pb-28 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 scrollbar-hide">
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
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
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="flex fixed inset-y-0 left-0 z-40 flex-col w-[85vw] max-w-xs sm:max-w-sm bg-white border-r border-gray-200 shadow-xl lg:fixed lg:inset-y-0 lg:left-0 lg:top-0 lg:h-screen lg:z-40 lg:shadow-none lg:w-72 lg:max-w-none lg:translate-x-0 lg:flex-shrink-0 pb-32 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">AT Jeweller</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
              <div className="flex items-center space-x-2 lg:hidden">
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                  title="Logout"
                >
                  Logout
                </button>
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: "catalog", label: "Catalogue", icon: Package },
              { id: "cart", label: "Cart", icon: ShoppingCart },
              { id: "bookings", label: "Orders", icon: History },
            ].map((tab) => (
              <div key={tab.id} className="relative">
                {/* Active indicator bar */}
                {activeTab === tab.id && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full"></div>
                )}
                <button
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "catalog") {
                      setSelectedCategory("All");
                      setSearchTerm("");
                      setCurrentPage(1);
                    }
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-medium transition-colors overflow-hidden min-w-0
                    ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  title={tab.label}
                >
                  <tab.icon className="flex-shrink-0 w-5 h-5" />
                  <span className="truncate whitespace-nowrap">
                    {tab.label}
                  </span>
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
              { id: "catalog", label: "Catalogue", icon: Package },
              { id: "cart", label: "Cart", icon: ShoppingCart },
              { id: "bookings", label: "Orders", icon: History },
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
        className="flex overflow-hidden flex-col flex-1 lg:ml-72"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 p-4 border-b border-gray-200 shadow-sm backdrop-blur bg-white/90 lg:p-6">
          <div className="flex gap-2 justify-between items-center">
            <div className="flex gap-2 items-center">
              {activeTab === "catalog" && selectedCategory !== "All" && (
                <button
                  onClick={handleBackToCategories}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50"
                >
                  <ChevronLeft className="mr-1 w-4 h-4" />
                  Back to Categories
                </button>
              )}
              <div className="text-base font-semibold text-gray-800">
                AT Jeweller
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="overflow-y-auto overflow-x-hidden flex-1 p-4 sm:p-6 scrollbar-hide">
          {/* Jewellery Catalog */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              {/* Categories Gallery (when All is selected) */}
              {selectedCategory === "All" && !searchTerm && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Categories
                  </h2>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {categories.slice(1).map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className="overflow-hidden relative rounded-2xl border border-gray-200 shadow-md transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1"
                      >
                        <div className="relative">
                          <img
                            src={getCategoryCover(category)}
                            alt={category}
                            className="object-cover w-full h-56 transition-transform duration-500 sm:h-52 md:h-60 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60 via-black/10" />
                          <div className="absolute right-0 bottom-0 left-0 p-4">
                            <h3 className="text-lg font-bold text-white">
                              {category}
                            </h3>
                            <p className="text-xs text-white/80">
                              Tap to view collection
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats (only when searching across all items) */}
              {selectedCategory === "All" && !!searchTerm && (
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Showing {paginatedItems.length} of{" "}
                    {filteredJewellery.length} items
                  </div>
                </div>
              )}

              {/* Category view (admin-like) when a specific category is selected */}
              {selectedCategory !== "All" && (
                <div className="space-y-6">
                  <Subcategories
                    selectedCategory={selectedCategory}
                    categoryImages={categoryImages}
                    setCategoryImages={setCategoryImages}
                    setSelectedCategory={setSelectedCategory}
                    showActions={false}
                    addToCart={addToCart}
                  />
                </div>
              )}

              {/* Items Grid/List only for search results across all */}
              {selectedCategory === "All" &&
                !!searchTerm &&
                (paginatedItems.length > 0 ? (
                  <>
                    <div
                      className={`grid gap-8 sm:gap-10 transition-all duration-300 ease-in-out animate-fade-in ${
                        viewMode === "grid"
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
                          : "grid-cols-1"
                      }`}
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
                              viewMode === "list"
                                ? "w-32 h-32"
                                : "aspect-square"
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
                              {item.weight && ` | Weight: ${item.weight}g`}
                            </p>

                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">
                                Qty: 1
                              </span>
                              <button
                                onClick={() => addToCart(item, 1)}
                                className="px-6 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all duration-300 transform hover:from-amber-600 hover:to-orange-600 hover:scale-105 active:scale-95 hover:shadow-xl"
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
                        : "No jewellery items added yet"}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Shopping Cart
                </h2>
                <div className="flex gap-3 items-center">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-200 transition-colors hover:bg-red-100 hover:text-red-700"
                      title="Clear all items from cart"
                    >
                      <Trash2 className="inline mr-1 w-4 h-4" />
                      Clear Cart
                    </button>
                  )}
                  {cart.length > 0 && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {getCartItemCount()} items • ₹
                        {getCartTotal().toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
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
                          <p className="text-sm font-medium text-amber-600">
                            ₹{item.price?.toLocaleString() || "N/A"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </span>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₹
                              {(
                                (item.price || 0) * item.quantity
                              ).toLocaleString()}
                            </p>
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
                        <span>₹{getCartTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between pt-3 text-xl font-bold text-gray-900 border-t">
                        <span>Total</span>
                        <span className="text-amber-600">
                          ₹{getCartTotal().toLocaleString()}
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
                  {orderJustPlaced ? (
                    <>
                      <CheckCircle className="mx-auto mb-4 w-16 h-16 text-green-500" />
                      <h3 className="mb-2 text-xl font-medium text-gray-900">
                        Order Placed Successfully!
                      </h3>
                      <p className="mb-6 text-gray-600">
                        Thank you for your order. Your items will be processed
                        shortly.
                      </p>
                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setOrderJustPlaced(false);
                            setActiveTab("bookings");
                          }}
                          className="px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                        >
                          View My Orders
                        </button>
                        <button
                          onClick={() => {
                            setOrderJustPlaced(false);
                            setActiveTab("catalog");
                          }}
                          className="px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                        >
                          Continue Shopping
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                  <span>{myOrders.length} total orders</span>
                </div>
              </div>

              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map((booking, index) => (
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

                {/* Weight */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Weight (g)
                  </label>
                  <input
                    type="number"
                    value={newJewellery.weight}
                    onChange={(e) =>
                      setNewJewellery({
                        ...newJewellery,
                        weight: e.target.value,
                      })
                    }
                    min="0"
                    step="0.1"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Weight in grams"
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

      {/* Order Success Modal */}
      {showOrderSuccessModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="p-8 w-full max-w-md text-center bg-white rounded-2xl shadow-xl">
            <div className="mb-6">
              <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Order Confirmed!
              </h3>
              <p className="text-gray-600">
                Your order has been successfully placed. You will receive a
                confirmation email shortly.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  setActiveTab("bookings");
                }}
                className="px-6 py-3 w-full font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
              >
                View My Orders
              </button>
              <button
                onClick={() => {
                  setShowOrderSuccessModal(false);
                  setActiveTab("catalog");
                }}
                className="px-6 py-3 w-full font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetailsModal && selectedOrder && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Details
              </h3>
              <button
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Header */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Order #{selectedOrder.id}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Placed on{" "}
                      {new Date(selectedOrder.bookingDate).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(selectedOrder.bookingDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedOrder.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : selectedOrder.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedOrder.status || "Confirmed"}
                  </span>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h5 className="font-medium text-gray-900">Order Items</h5>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <h6 className="font-medium text-gray-900">
                          {selectedOrder.jewelleryName}
                        </h6>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Quantity: {selectedOrder.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Progress */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h5 className="mb-4 font-medium text-gray-900">
                  Order Progress
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-8 h-8 bg-green-100 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Order Confirmed
                      </p>
                      <p className="text-sm text-gray-600">
                        Your order has been received and confirmed
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex justify-center items-center w-8 h-8 rounded-full ${
                        selectedOrder.status === "Processing"
                          ? "bg-yellow-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {selectedOrder.status === "Processing" ? (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`font-medium ${
                          selectedOrder.status === "Processing"
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        Processing
                      </p>
                      <p className="text-sm text-gray-600">
                        Your order is being prepared (2-3 days)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full">
                      <Truck className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Shipped</p>
                      <p className="text-sm text-gray-600">
                        Your order will be shipped soon (5-7 days total)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex justify-center items-center w-8 h-8 bg-gray-100 rounded-full">
                      <Shield className="w-4 h-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Delivered</p>
                      <p className="text-sm text-gray-600">
                        Your order will be delivered safely
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Billing Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="mb-3 font-medium text-gray-900">
                    Shipping Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Address:</span> To be
                      collected from store
                    </p>
                    <p>
                      <span className="font-medium">Method:</span> In-store
                      pickup
                    </p>
                    <p>
                      <span className="font-medium">Estimated Time:</span> 5-7
                      days
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h5 className="mb-3 font-medium text-gray-900">
                    Billing Information
                  </h5>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Payment Method:</span> Cash
                      on Delivery
                    </p>
                    <p>
                      <span className="font-medium">Subtotal:</span> Price to be
                      calculated
                    </p>
                    <p>
                      <span className="font-medium">Shipping:</span> Free
                    </p>
                    <p className="font-medium text-amber-600">
                      <span className="font-medium">Total:</span> Price to be
                      calculated
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex pt-4 space-x-4">
                <button
                  onClick={() => {
                    setShowOrderDetailsModal(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Could add functionality to reorder or contact support
                  }}
                  className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                >
                  Need Help?
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-24 z-40 p-3 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl hover:scale-110 active:scale-95 md:bottom-8 animate-fade-in-up"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-4 bottom-4 left-4 z-50 sm:bottom-6 sm:left-auto sm:right-6 animate-slide-up">
          <div
            className={`flex items-center p-3 sm:p-4 rounded-xl shadow-lg border transition-all duration-300 ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex flex-1 items-center space-x-3">
              {toast.type === "success" ? (
                <CheckCircle className="flex-shrink-0 w-4 h-4 text-green-600 sm:w-5 sm:h-5" />
              ) : (
                <X className="flex-shrink-0 w-4 h-4 text-red-600 sm:w-5 sm:h-5" />
              )}
              <p className="flex-1 text-xs font-medium sm:text-sm sm:text-base">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="flex-shrink-0 ml-2 text-gray-400 transition-colors sm:ml-4 hover:text-gray-600"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
