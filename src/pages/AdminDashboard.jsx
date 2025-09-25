import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJewellery } from "../context/JewelleryContext";
import { fetchSheetData, addCategory } from "../services/googleSheetsService";
import {
  Plus,
  X,
  Trash2,
  Users,
  Package,
  BookOpen,
  LogOut,
  Search,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
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
  ArrowUp,
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
  const [sheetData, setSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  // Initialize sidebar state based on current viewport to prevent desktop layout jump
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(min-width: 1024px)").matches
  );
  const [sidebarOpen, setSidebarOpen] = useState(isDesktop);
  const [isMobile, setIsMobile] = useState(!isDesktop);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  // LocalStorage keys for dashboard persistence
  const DASH_CATEGORY_IMAGES_KEY = "adminDash.categoryImages";
  const DASH_UNIQUE_CATEGORIES_KEY = "adminDash.uniqueCategories";

  // Apply categories & images from Google Sheet response into local state
  const applyCategoriesFromSheet = (data) => {
    try {
      // Normalize to an array of row objects
      const rows = Array.isArray(data)
        ? data
        : Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data?.data)
        ? data.data
        : [];

      if (!Array.isArray(rows) || rows.length === 0) return;

      // Extract fields defensively from various possible shapes
      const extracted = rows
        .map((r) => {
          const name =
            r?.category ||
            r?.name ||
            r?.Category ||
            (Array.isArray(r) ? r[0] : undefined);
          const image =
            r?.image ||
            r?.Image ||
            r?.imageUrl ||
            r?.url ||
            (Array.isArray(r) ? r[2] : undefined);
          const description =
            r?.description || r?.desc || (Array.isArray(r) ? r[1] : "");
          return { name, image, description };
        })
        .filter((x) => x.name);

      if (extracted.length === 0) return;

      // Update categories
      setUniqueCategories((prev) => {
        const set = new Set(prev);
        extracted.forEach(({ name }) => {
          if (name) set.add(String(name));
        });
        return Array.from(set);
      });

      // Update category images
      setCategoryImages((prev) => {
        const updated = { ...prev };
        extracted.forEach(({ name, image, description }) => {
          if (!name || !image) return;
          const url = asset(image);
          const entry = { url, description: description || "", weight: "" };
          const category = updated[name] || {};
          const def = Array.isArray(category.Default) ? category.Default : [];
          const exists = def.some(
            (i) => (typeof i === "string" ? i : i.url) === url
          );
          if (!exists) {
            updated[name] = { ...category, Default: [...def, entry] };
          } else {
            updated[name] = { ...category, Default: def };
          }
        });
        return updated;
      });
    } catch (err) {
      console.error("Failed to apply categories from sheet", err);
    }
  };

  // Resolve public assets with Vite base (safe join) and keep http/data URLs intact
  const asset = (name) => {
    if (!name) return name;
    if (typeof name !== "string") return name;
    if (name.startsWith("data:")) return name;
    if (name.startsWith("http://") || name.startsWith("https://")) return name;
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const clean = name.startsWith("/") ? name.slice(1) : name;
    return `${cleanBase}/${clean}`;
  };

  const [categoryImages, setCategoryImages] = useState({
    All: { Default: [asset("download.jpg"), asset("images.jpg")] },
    Animals: {
      Lion: [
        {
          url: asset("download (1).jpg"),
          description: "Beautiful lion pendant with intricate detailing",
          weight: "15g",
        },
        {
          url: asset("images (1).jpg"),
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
    },
    Rings: {
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Sparkling diamond ring with premium cut",
          weight: "8g",
        },
      ],
      Gold: [
        {
          url: asset("download (2).jpg"),
          description: "Beautiful gold ring with classic design",
          weight: "12g",
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
    },
    "Man Collection": {
      Chain: [
        {
          url: asset("images.jpg"),
          description: "Stylish men's chain with rugged design",
          weight: "35g",
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
    const categoryData = categoryImages[category];
    if (!categoryData) return asset("download.jpg");

    // Get the first subcategory
    const firstSubcategory = Object.keys(categoryData)[0];
    if (!firstSubcategory) return asset("download.jpg");

    // Get the first photo from the first subcategory
    const photos = categoryData[firstSubcategory];
    if (!photos || !Array.isArray(photos) || photos.length === 0)
      return asset("download.jpg");

    // Handle both string URLs and photo objects
    const firstPhoto = photos[0];
    if (typeof firstPhoto === "string") {
      return asset(firstPhoto);
    } else if (firstPhoto && firstPhoto.url) {
      return asset(firstPhoto.url);
    }

    return asset("download.jpg");
  };

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [categoryImagePreview, setCategoryImagePreview] = useState("");
  // LocalStorage key for persisting category image draft
  const CATEGORY_IMAGE_DRAFT_KEY = "admin.category.imageDraft";

  // Rehydrate any draft category image on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CATEGORY_IMAGE_DRAFT_KEY);
      if (saved) {
        setNewCategory((prev) => ({ ...prev, image: saved }));
        setCategoryImagePreview(saved);
      }
    } catch (err) {
      console.error("Failed to read draft image from localStorage", err);
    }
  }, []);

  // Categories from context to keep Admin and Catalogue in sync
  const [uniqueCategories, setUniqueCategories] = useState(getCategories());

  // Rehydrate persisted dashboard state on mount (after state declarations)
  useEffect(() => {
    try {
      const savedCats = localStorage.getItem(DASH_UNIQUE_CATEGORIES_KEY);
      if (savedCats) {
        const parsed = JSON.parse(savedCats);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUniqueCategories((prev) => {
            const set = new Set(parsed.concat(prev));
            return Array.from(set);
          });
        }
      }
    } catch (e) {
      console.error("Failed to rehydrate uniqueCategories", e);
    }

    try {
      const savedImages = localStorage.getItem(DASH_CATEGORY_IMAGES_KEY);
      if (savedImages) {
        const parsed = JSON.parse(savedImages);
        if (parsed && typeof parsed === "object") {
          setCategoryImages((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.error("Failed to rehydrate categoryImages", e);
    }
  }, []);

  // Category stats for unique categories
  const categoryStats = useMemo(() => {
    const stats = { All: jewellery.length };
    uniqueCategories.slice(1).forEach((cat) => {
      stats[cat] = jewellery.filter((item) => item.category === cat).length;
    });
    return stats;
  }, [jewellery, uniqueCategories]);

  // Persist dashboard state when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        DASH_UNIQUE_CATEGORIES_KEY,
        JSON.stringify(uniqueCategories)
      );
    } catch (e) {
      console.error("Failed to persist uniqueCategories", e);
    }
  }, [uniqueCategories]);

  useEffect(() => {
    try {
      localStorage.setItem(
        DASH_CATEGORY_IMAGES_KEY,
        JSON.stringify(categoryImages)
      );
    } catch (e) {
      console.error("Failed to persist categoryImages", e);
    }
  }, [categoryImages]);

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

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsDesktop(isDesktop);
      setSidebarOpen(isDesktop);
    };

    const loadSheetData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSheetData();
        setSheetData(data);
        applyCategoriesFromSheet(data);
      } catch (err) {
        console.error("Failed to load sheet data:", err);
        setError("Failed to load data from Google Sheets");
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    loadSheetData();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        // Persist the uploaded image so it survives refresh
        try {
          localStorage.setItem(CATEGORY_IMAGE_DRAFT_KEY, imageUrl);
        } catch (err) {
          console.error("Failed to save draft image to localStorage", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.image) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if category already exists (case-insensitive)
    const categoryExists = uniqueCategories.some(
      (cat) => cat.toLowerCase() === newCategory.name.toLowerCase()
    );

    if (categoryExists) {
      alert("Category already exists! Please choose a different name.");
      return;
    }

    try {
      // Show loading state
      setIsLoading(true);
      setError(null);

      // Add category to Google Sheet
      await addCategory({
        name: newCategory.name,
        description: newCategory.description || "",
        image: newCategory.image,
      });

      // Update local state if API call is successful
      // Compute next states so we can persist immediately
      const nextUnique = Array.from(
        new Set([...uniqueCategories, newCategory.name])
      );
      const nextImages = {
        ...categoryImages,
        [newCategory.name]: {
          Default: [newCategory.image],
        },
      };

      setUniqueCategories(nextUnique);
      setCategoryImages(nextImages);

      // Persist immediately to localStorage to survive refresh
      try {
        localStorage.setItem(
          DASH_UNIQUE_CATEGORIES_KEY,
          JSON.stringify(nextUnique)
        );
        localStorage.setItem(
          DASH_CATEGORY_IMAGES_KEY,
          JSON.stringify(nextImages)
        );
      } catch (e) {
        console.error("Failed to persist new category to localStorage", e);
      }

      alert(`"${newCategory.name}" category added successfully!`);
      // Clear draft image from localStorage upon success
      try {
        localStorage.removeItem(CATEGORY_IMAGE_DRAFT_KEY);
      } catch (err) {
        console.error("Failed to clear draft image from localStorage", err);
      }
      resetCategoryForm();

      // Refresh the sheet data to get the latest changes
      const updatedData = await fetchSheetData();
      setSheetData(updatedData);
      applyCategoriesFromSheet(updatedData);
    } catch (error) {
      console.error("Error adding category:", error);
      setError(`Failed to add category: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetCategoryForm = () => {
    setNewCategory({ name: "", description: "", image: "" });
    setCategoryImagePreview("");
    setShowAddCategoryModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
    // Also clear any persisted draft
    try {
      localStorage.removeItem(CATEGORY_IMAGE_DRAFT_KEY);
    } catch (err) {
      console.error("Failed to clear draft image from localStorage", err);
    }
  };

  return (
    <div className="flex overflow-x-hidden flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-1">
        {/* Mobile Menu Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg lg:hidden"
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
          <div className="flex overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 flex-col pb-12 w-80 h-screen bg-white border-r border-gray-200 shadow-xl lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:z-40 lg:shadow-none lg:w-72 lg:translate-x-0 lg:flex-shrink-0 scrollbar-hide">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    AT Jeweller
                  </h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
                <div className="flex items-center space-x-2 lg:hidden">
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
                    className={`w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-medium transition-colors overflow-hidden min-w-0
                    ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    title={!sidebarOpen ? tab.label : ""}
                  >
                    <tab.icon className="flex-shrink-0 w-5 h-5" />
                    {sidebarOpen && (
                      <span className="truncate whitespace-nowrap">
                        {tab.label}
                      </span>
                    )}
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
          className="flex overflow-hidden overflow-x-hidden flex-col flex-1 min-w-0 lg:ml-72"
          style={{ scrollBehavior: "auto" }}
        >
          {/* Content Area */}
          <main className="flex-1 p-4 pt-20 pb-28 min-h-screen sm:p-6 lg:pb-6 lg:pt-6">
            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 justify-between items-start sm:flex-row sm:items-center sm:gap-0">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Categories
                  </h2>
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2 w-full text-white bg-blue-500 rounded-lg transition-colors sm:w-auto hover:bg-blue-600"
                  >
                    Add Category
                  </button>
                </div>

                {!selectedCategory || selectedCategory === "All" ? (
                  uniqueCategories.length > 1 ? (
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {uniqueCategories.slice(1).map((category) => (
                        <div
                          key={category}
                          onClick={() => {
                            navigate(`/category/${category}`);
                          }}
                          className="overflow-hidden relative rounded-2xl border border-gray-200 shadow-md transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1"
                        >
                          <div className="relative">
                            <img
                              src={getCategoryCover(category)}
                              alt={category}
                              className="object-cover w-full h-48 transition-transform duration-500 sm:h-52 md:h-56 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60 via-black/10" />
                            <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-4">
                              <div className="flex justify-between items-end">
                                <div>
                                  <h3 className="text-base font-bold text-white sm:text-lg">
                                    {category}
                                  </h3>
                                  <p className="text-xs sm:text-sm text-white/80">
                                    Tap to view collection
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
                      <Package className="mx-auto mb-4 w-16 h-16 text-gray-300" />
                      <h3 className="mb-2 text-xl font-medium text-gray-900">
                        No categories yet
                      </h3>
                      <p className="mb-6 text-gray-600">
                        Create your first category to organize your jewellery
                        collection
                      </p>
                      <button
                        onClick={() => setShowAddCategoryModal(true)}
                        className="px-6 py-3 text-white bg-blue-500 rounded-xl shadow-lg transition-colors hover:bg-blue-600"
                      >
                        Create First Category
                      </button>
                    </div>
                  )
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
                      className={`grid gap-4 sm:gap-6 transition-all duration-300 ease-in-out animate-fade-in ${
                        viewMode === "grid"
                          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "grid-cols-1"
                      }`}
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
                    {uniqueCategories.slice(1).map((cat) => (
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

      <Footer />
    </div>
  );
};

export default AdminDashboard;
