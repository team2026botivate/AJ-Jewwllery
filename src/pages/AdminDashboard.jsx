import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJewellery } from "../context/JewelleryContext";
import {
  Plus,
  X,
  Trash2,
  Users,
  Package,
  BookOpen,
  LogOut,
  Search,
  Filter,
  Edit3,
  Eye,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Gem,
  Crown,
  Heart,
  Circle,
  Sparkles,
  ShoppingBag,
  Watch,
  Shirt,
  Menu,
} from "lucide-react";
import Footer from "../components/Footer";
import Subcategories from "../components/Subcategories";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    jewellery,
    addJewellery,
    updateJewellery,
    deleteJewellery,
    getCategories,
    bookings,
    addBooking,
  } = useJewellery();

  const [activeTab, setActiveTab] = useState("categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Handle navigation from category page
  useEffect(() => {
    if (location.state?.showCategories) {
      setActiveTab("categories");
      setSelectedCategory("All");
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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

  const [newJewellery, setNewJewellery] = useState({
    category: "",
    name: "",
    description: "",
    image: "",
  });

  const [categories, setCategories] = useState([
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
  ]);

  const [categoryImages, setCategoryImages] = useState({
    All: { Default: ["/download.jpg", "/images.jpg"] },
    Animals: { Default: ["/download (1).jpg", "/images (1).jpg"] },
    "Arabic Style 21k": { Default: ["/download (2).jpg", "/images (2).jpg"] },
    Bracelets: { Default: ["/download (3).jpg", "/images (3).jpg"] },
    Mine: { Default: ["/download (1).jpg", "/images (1).jpg"] },
    SET: { Default: ["/download (2).jpg", "/images (2).jpg"] },
    Pendant: { Default: ["/download (3).jpg", "/images (3).jpg"] },
    "Man Collection": { Default: ["/download (1).jpg", "/images (1).jpg"] },
    Rings: { Default: ["/download (2).jpg", "/images (2).jpg"] },
    Earrings: { Default: ["/download (3).jpg", "/images (3).jpg"] },
  });

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
    subcategory: "",
  });
  const [categoryImagePreview, setCategoryImagePreview] = useState("");

  // Filtered and unique categories for display
  const uniqueCategories = useMemo(() => {
    // Remove duplicates and ensure unique categories
    const unique = [...new Set(categories)];
    return unique.filter(cat => cat && cat.trim() !== "");
  }, [categories]);

  // Category stats for unique categories
  const categoryStats = useMemo(() => {
    const stats = { All: jewellery.length };
    uniqueCategories.slice(1).forEach((cat) => {
      stats[cat] = jewellery.filter((item) => item.category === cat).length;
    });
    return stats;
  }, [jewellery, uniqueCategories]);

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

  useEffect(() => {
    if (newJewellery.image) {
      setImagePreview(newJewellery.image);
    }
  }, [newJewellery.image]);

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

  const handleAddJewellery = (e) => {
    e.preventDefault();
    if (newJewellery.category && newJewellery.name && newJewellery.image) {
      if (editingItem) {
        // Update existing item
        updateJewellery(editingItem.id, newJewellery);
        alert("Product updated successfully!");
      } else {
        // Add new item
        addJewellery({
          ...newJewellery,
          price: 0,
          quantity: 1,
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
      image: "",
    });
    setImagePreview("");
    setShowAddModal(false);
    setEditingItem(null);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewJewellery({
      category: item.category,
      name: item.name,
      description: item.description,
      image: item.image,
    });
    setImagePreview(item.image);
    setShowAddModal(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setNewJewellery({ ...newJewellery, image: imageUrl });
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCategoryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setNewCategory({ ...newCategory, image: imageUrl });
        setCategoryImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.name && newCategory.image) {
      // Check if category already exists (case-insensitive)
      const categoryExists = uniqueCategories.some(cat =>
        cat.toLowerCase() === newCategory.name.toLowerCase()
      );

      if (categoryExists) {
        alert("Category already exists! Please choose a different name.");
        return;
      }

      setCategories([...categories, newCategory.name]);
      const subcategory = newCategory.subcategory || "Default";
      setCategoryImages({
        ...categoryImages,
        [newCategory.name]: {
          ...categoryImages[newCategory.name],
          [subcategory]: [newCategory.image],
        },
      });
      alert("Category added successfully!");
      resetCategoryForm();
    }
  };

  const resetCategoryForm = () => {
    setNewCategory({ name: "", description: "", image: "", subcategory: "" });
    setCategoryImagePreview("");
    setShowAddCategoryModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-20">
      <div className="flex flex-1">
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
                  <h1 className="text-xl font-bold text-gray-900">
                    AT Jeweller
                  </h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
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
                //
                { id: "categories", label: "Categories", icon: Package },
                { id: "bookings", label: "User Bookings", icon: BookOpen },
                { id: "users", label: "User Management", icon: Users },
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
                    title={!sidebarOpen ? tab.label : ""}
                  >
                    <tab.icon className="flex-shrink-0 w-5 h-5" />
                    {sidebarOpen && <span>{tab.label}</span>}
                  </button>
                </div>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex justify-center items-center px-4 py-3 space-x-2 w-full text-white bg-gray-600 rounded-xl transition-colors hover:bg-gray-700"
                title={!sidebarOpen ? "Logout" : ""}
              >
                <LogOut className="w-5 h-5" />
                {sidebarOpen && <span>Logout</span>}
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

              {activeTab === "jewellery" && (
                <div className="flex items-center space-x-4">
                  {/* Category Filter */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-600" />
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
                        {uniqueCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat} ({categoryStats[cat] || 0})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                    </div>
                    {/* Desktop Category Pills */}
                    <div className="hidden overflow-x-auto p-1 max-w-2xl bg-gray-100 rounded-lg lg:flex scrollbar-hide">
                      {uniqueCategories.map((cat) => {
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
                              return Sparkles;
                            case "Pendant":
                              return Heart;
                            case "Man Collection":
                              return Shirt;
                            case "Rings":
                              return Circle;
                            case "Earrings":
                              return Sparkles;
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

                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center px-6 py-2 space-x-2 text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Jewellery</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6">
            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Categories
                  </h2>
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Add Category
                  </button>
                </div>

                {!selectedCategory || selectedCategory === "All" ? (
                  <div
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 hide-scrollbar"
                    style={{
                      overflowY: "auto",
                      maxHeight: "calc(100vh - 210px)",
                      width: "100%",
                    }}
                  >
                    {uniqueCategories.slice(1).map((category) => (
                      <div
                        key={category}
                        onClick={() => {
                          navigate(`/category/${category}`);
                        }}
                        className="relative overflow-hidden rounded-2xl border border-gray-200 shadow-md group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                      >
                        <div className="relative">
                          <img
                            src={categoryImages[category][Object.keys(categoryImages[category] || {})[0]][0]}
                            alt={category}
                            className="object-cover w-full h-44 sm:h-52 md:h-60 transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-white/85 text-gray-800">
                            {Object.keys(categoryImages[category] || {}).length} subcategories
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white text-lg font-bold">
                              {category}
                            </h3>
                            <p className="text-white/80 text-xs">Tap to view collection</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Subcategories
                    selectedCategory={selectedCategory}
                    categoryImages={categoryImages}
                    setCategoryImages={setCategoryImages}
                    setSelectedCategory={setSelectedCategory}
                  />
                )}
              </div>
            )}
            {/* Jewellery Catalog */}
            {activeTab === "jewellery" && (
              <div className="space-y-6">
                {/* Items Grid/List */}
                {paginatedItems.length > 0 ? (
                  <>
                    <div
                      className={`grid gap-6 transition-all duration-300 ease-in-out hide-scrollbar animate-fade-in ${
                        viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                          className={`bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-amber-300 hover:-translate-y-1 transition-all duration-300 overflow-hidden min-h-[400px] ${
                            viewMode === "list" ? "flex" : ""
                          }`}
                        >
                          <div
                            className={`${
                              viewMode === "list"
                                ? "w-32 h-32 flex-shrink-0"
                                : "aspect-square"
                            } overflow-hidden bg-gray-100`}
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Product image"}
                                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                              />
                            ) : (
                              <div className="flex justify-center items-center w-full h-full text-gray-400">
                                <Package className="w-12 h-12" />
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <h4 className="mb-1 text-xl font-bold leading-tight text-gray-900">
                                  {item.name || "Unnamed Product"}
                                </h4>
                                <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                                  {item.category || "No category"}
                                </p>
                              </div>
                            </div>

                            <p className="flex-1 mb-4 text-sm leading-relaxed text-gray-600">
                              {item.description || "No description available"}
                            </p>

                            <div className="flex justify-end items-center mt-auto">
                              {/* Placeholder for future actions */}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center mt-12 space-x-1">
                        <button
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-xs font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-all hover:bg-gray-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
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
                          className="px-3 py-1 bg-white rounded-lg border border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:shadow-md disabled:hover:bg-white disabled:hover:shadow-none"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>

                        {/* Page Numbers */}
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                              currentPage === i + 1
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105"
                                : "border border-gray-300 bg-white hover:bg-gray-100 hover:shadow-md"
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
                          className="px-3 py-1 bg-white rounded-lg border border-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 hover:shadow-md disabled:hover:bg-white disabled:hover:shadow-none"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        {/* Last Button */}
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-xs font-medium text-gray-700 bg-white rounded-lg border border-gray-300 transition-all hover:bg-gray-100 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
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

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    User Bookings
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {[
                            "#",
                            "Name",
                            "Category",
                            "Jewellery",
                            "Qty",
                            "Date",
                          ].map((header) => (
                            <th
                              key={header}
                              className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.length ? (
                          bookings.map((b, i) => (
                            <tr key={b.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {i + 1}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {b.userName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {b.category}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {b.jewelleryName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {b.quantity}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {new Date(b.bookingDate).toLocaleDateString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              className="px-6 py-12 text-center text-gray-500"
                            >
                              <BookOpen className="mx-auto mb-4 w-12 h-12 text-gray-300" />
                              <p>No bookings yet</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                      User Management
                    </h2>
                  </div>
                  <div className="p-6">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {[
                                "Name",
                                "ID",
                                "Password",
                                "Status",
                                "Actions",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-6 py-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((u) => (
                              <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {u.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {u.id}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  {"•".repeat(u.password.length)}
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                      u.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {u.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  <button
                                    onClick={() =>
                                      console.log("Toggle user status")
                                    }
                                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                                      u.status === "active"
                                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                                        : "bg-green-100 text-green-800 hover:bg-green-200"
                                    }`}
                                  >
                                    {u.status === "active"
                                      ? "Deactivate"
                                      : "Activate"}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="space-y-4 md:hidden">
                      {users.map((u) => (
                        <div
                          key={u.id}
                          className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                                {u.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                ID: {u.id}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                                u.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {u.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              Password: {"•".repeat(u.password.length)}
                            </div>
                            <button
                              onClick={() => {
                                // Toggle user status functionality
                                const updatedUsers = users.map((user) =>
                                  user.id === u.id
                                    ? {
                                        ...user,
                                        status:
                                          user.status === "active"
                                            ? "inactive"
                                            : "active",
                                      }
                                    : user
                                );
                                // Here you would typically update the users state or call an API
                                console.log(
                                  "User status toggled for:",
                                  u.id,
                                  "New status:",
                                  u.status === "active" ? "inactive" : "active"
                                );
                                // For now, just show an alert
                                alert(
                                  `User ${u.name} status changed to ${
                                    u.status === "active"
                                      ? "inactive"
                                      : "active"
                                  }`
                                );
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                u.status === "active"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {u.status === "active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

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

              {/* Photo Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
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

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Add New Category
              </h3>
              <button
                onClick={resetCategoryForm}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Category name"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                    placeholder="Category description"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Subcategory */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.subcategory}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        subcategory: e.target.value,
                      })
                    }
                    placeholder="Subcategory name (optional)"
                    className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Photo Upload */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCategoryFileUpload}
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
              </div>
              {/* Image Preview */}
              {categoryImagePreview && (
                <div className="p-4 rounded-xl border border-gray-300">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Image Preview:
                  </p>
                  <img
                    src={categoryImagePreview}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-xl"
                    onError={() => setCategoryImagePreview("")}
                  />
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex pt-6 space-x-4">
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg transition-all hover:from-blue-600 hover:to-blue-700"
                >
                  Save Category
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

export default AdminDashboard;
