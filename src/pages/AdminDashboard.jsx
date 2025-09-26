import { jsPDF } from "jspdf";
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
  ArrowUp,
  FileText,
  ShoppingCart,
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
    clearAllBookings,
  } = useJewellery();

  const [activeTab, setActiveTab] = useState("categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
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
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [categoryImagePreview, setCategoryImagePreview] = useState("");

  // Resolve public assets with Vite base (safe join)
  const asset = (name) => {
    if (!name) return name;
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const clean = name.startsWith("/") ? name.slice(1) : name;
    return `${cleanBase}/${clean}`;
  };

  // Load category images from localStorage or use defaults with error handling
  const [categoryImages, setCategoryImages] = useState(() => {
    try {
      const saved = localStorage.getItem("admin-category-images-data");
      console.log("🔍 Raw localStorage data:", saved);

      if (
        saved &&
        saved !== "undefined" &&
        saved !== "{}" &&
        saved !== "null"
      ) {
        const parsedData = JSON.parse(saved);
        console.log(
          "✅ Successfully loaded category images from localStorage:",
          parsedData
        );

        // Validate the data structure
        if (
          parsedData &&
          typeof parsedData === "object" &&
          Object.keys(parsedData).length > 0
        ) {
          console.log("✅ Data structure is valid, returning loaded data");
          console.log("📊 Loaded categories:", Object.keys(parsedData));
          return parsedData;
        } else {
          console.warn("⚠️ Invalid or empty data structure, using defaults");
          console.log("📊 Parsed data:", parsedData);
        }
      } else {
        console.log(
          "ℹ️ No saved data found or data is empty/null/undefined, using defaults"
        );
        console.log("📊 Saved value:", saved);
      }
    } catch (error) {
      console.error(
        "❌ Error loading category images from localStorage:",
        error
      );
      console.log("🔄 Falling back to default data");
    }

    // Return default images if no saved data or error occurred
    console.log("📋 Using default category images");
    return getDefaultCategoryImages();
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
      return firstPhoto; // Return the base64 string directly
    } else if (firstPhoto && firstPhoto.url) {
      return asset(firstPhoto.url);
    }

    return asset("download.jpg");
  };

  const [expandedUsers, setExpandedUsers] = useState(new Set());

  const toggleUserExpansion = (userName) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userName)) {
      newExpanded.delete(userName);
    } else {
      newExpanded.add(userName);
    }
    setExpandedUsers(newExpanded);
  };

  const toggleSetExpansion = (bookingId) => {
    const newExpanded = new Set(expandedSets);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedSets(newExpanded);
  };

  // Categories from context to keep Admin and Catalogue in sync
  const [uniqueCategories, setUniqueCategories] = useState(getCategories());

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

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024;
      setIsDesktop(isDesktop);
      setSidebarOpen(isDesktop);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Verification: Ensure localStorage data is not overwritten after mount
  useEffect(() => {
    console.log(
      "🔄 AdminDashboard mounted, verifying localStorage integrity..."
    );

    const saved = localStorage.getItem("admin-category-images-data");
    console.log("🔍 Post-mount localStorage check:", saved);

    if (saved && saved !== "undefined" && saved !== "{}" && saved !== "null") {
      try {
        const parsedData = JSON.parse(saved);
        console.log("🔍 Post-mount parsed data:", parsedData);

        // Check if current state matches localStorage
        const currentKeys = Object.keys(categoryImages);
        const savedKeys = Object.keys(parsedData);

        console.log("📊 Current state categories:", currentKeys);
        console.log("📊 localStorage categories:", savedKeys);

        // If localStorage has more categories than current state, update state
        if (savedKeys.length > currentKeys.length) {
          console.log("🔄 localStorage has more data, updating state");
          setCategoryImages(parsedData);
        } else if (
          JSON.stringify(categoryImages) !== JSON.stringify(parsedData)
        ) {
          console.log("🔄 Data mismatch detected, syncing with localStorage");
          setCategoryImages(parsedData);
        } else {
          console.log("✅ Data is synchronized correctly");
        }
      } catch (error) {
        console.error("❌ Error verifying localStorage data:", error);
      }
    } else {
      console.log("ℹ️ No valid localStorage data found after mount");
    }
  }, []); // Run only once after mount

  // Auto-save categoryImages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "admin-category-images-data",
        JSON.stringify(categoryImages)
      );
      console.log("✅ Category images saved to localStorage:", categoryImages);
    } catch (err) {
      console.error("❌ Failed to save category images to localStorage:", err);
    }
  }, [categoryImages]);

  // Ensure uniqueCategories includes any categories present in categoryImages (persists after refresh)
  useEffect(() => {
    if (!categoryImages) return;
    const keys = Object.keys(categoryImages).filter((k) => k && k !== "All");
    if (!keys.length) return;

    setUniqueCategories((prev) => {
      const merged = Array.from(new Set([...(prev || []), ...keys]));
      // Always ensure "All" is at index 0
      const withoutAll = merged.filter((c) => c !== "All");
      return ["All", ...withoutAll];
    });
  }, [categoryImages]);

  // Auto-save categoryImages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "admin-category-images-data",
        JSON.stringify(categoryImages)
      );
      // Optional: console log for confirmation
      console.log("✅ Category images saved to localStorage:", categoryImages);
    } catch (err) {
      console.error("❌ Failed to save category images to localStorage:", err);
    }
  }, [categoryImages]);

  // Ensure uniqueCategories includes any categories present in categoryImages (persists after refresh)
  useEffect(() => {
    if (!categoryImages) return;
    const keys = Object.keys(categoryImages).filter((k) => k && k !== "All");
    if (!keys.length) return;

    setUniqueCategories((prev) => {
      const merged = Array.from(new Set([...(prev || []), ...keys]));
      // Always ensure "All" is at index 0 if present
      const withoutAll = merged.filter((c) => c !== "All");
      return ["All", ...withoutAll];
    });
  }, [categoryImages]);

  // Handle scroll for back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler for sidebar Logout button
  const handleLogout = () => {
    logout();
    navigate("/");
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
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setNewJewellery({ ...newJewellery, image: imageUrl });
        setImagePreview(imageUrl);
        console.log("Image loaded successfully:", imageUrl);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        alert("Error loading image. Please try again.");
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleGenerateGramsPDF = async () => {
    // Generate PDF with grams information for bookings
    const bookingsData = bookings.map((booking, index) => ({
      "#": index + 1,
      Name: booking.userName,
      Category: booking.category,
      Jewellery: booking.jewelleryName,
      Items:
        booking.bookingDetails?.totalItems ||
        booking.items ||
        booking.quantity ||
        "N/A",
      Grams: booking.bookingDetails?.totalGrams || booking.grams || "N/A",
      Date: new Date(booking.bookingDate).toLocaleDateString(),
      "Multi-Item": booking.bookingDetails?.isMultiItem
        ? `${booking.bookingDetails.itemIndex}/${booking.bookingDetails.totalItemsInBooking}`
        : "Single",
      // Primary image for backward compatibility
      Image:
        Array.isArray(booking.images) && booking.images.length
          ? booking.images[0]
          : booking.image || "",
      // Full images array for multi-image rendering
      Images:
        (Array.isArray(booking.images) && booking.images.length
          ? booking.images
          : (booking.image ? [booking.image] : [])) || [],
    }));

    // Helper: convert normal URL to dataURL (may fail due to CORS)
    const toDataURL = (src) =>
      new Promise((resolve) => {
        if (!src || typeof src !== "string" || src.startsWith("data:image")) {
          // Already a data URL or empty
          return resolve(src || "");
        }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL("image/jpeg", 0.92);
            resolve(dataURL);
          } catch (e) {
            console.warn("Canvas conversion failed, skipping image:", e);
            resolve("");
          }
        };
        img.onerror = () => resolve("");
        img.src = src;
      });

    // Preload/normalize images to data URLs (all images per booking)
    const dataWithImages = await Promise.all(
      bookingsData.map(async (b) => {
        const images = Array.isArray(b.Images) ? b.Images : [];
        const prepared = await Promise.all(images.map((src) => toDataURL(src)));
        return {
          ...b,
          Image: await toDataURL(b.Image),
          Images: prepared.filter(Boolean),
        };
      })
    );

    // Create PDF
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("Jewellery Bookings Report", 20, 20);

    let y = 30;
    const pageHeight =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const margin = 20;

    const addLine = (text, x, lineHeight = 6) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(String(text), x, y);
      y += lineHeight;
    };

    const addImageSafe = (imgSrc, x, yTop, w, h) => {
      try {
        if (!imgSrc) return false;
        let format = "JPEG";
        if (imgSrc.startsWith("data:image/")) {
          const fmt = imgSrc.slice(11, imgSrc.indexOf(";"));
          format = fmt?.toUpperCase() || "JPEG";
        }
        doc.addImage(imgSrc, format, x, yTop, w, h);
        return true;
      } catch (e) {
        console.warn("Skipping image for PDF:", e);
        return false;
      }
    };

    doc.setFontSize(12);
    dataWithImages.forEach((b, idx) => {
      // Booking header
      addLine(`Booking ${idx + 1}`, margin, 8);

      // Images block (support multiple images in rows)
      const imgHeight = 30;
      const imgWidth = 30;
      const gap = 6;
      const maxPerRow = 4; // adjust as needed
      const blockXStart = margin;
      let blockUsed = false;
      let rowIndex = 0;
      if (Array.isArray(b.Images) && b.Images.length) {
        for (let i = 0; i < b.Images.length; i++) {
          const col = i % maxPerRow;
          if (col === 0) {
            // New row: check for page space
            if (y + imgHeight > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
            rowIndex++;
          }
          const x = blockXStart + col * (imgWidth + gap);
          addImageSafe(b.Images[i], x, y, imgWidth, imgHeight);
          blockUsed = true;
          // If last col, advance to next row
          if (col === maxPerRow - 1 || i === b.Images.length - 1) {
            y += imgHeight + 4;
          }
        }
      } else if (b.Image) {
        if (y + imgHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        addImageSafe(b.Image, blockXStart, y, imgWidth, imgHeight);
        blockUsed = true;
        y += imgHeight + 4;
      }

      const textX = margin; // Text on new line beneath images for clarity
      const startY = y;

      [
        ["User", b.Name],
        ["Category", b.Category],
        ["Jewellery", b.Jewellery],
        ["Items", b.Items],
        ["Grams", b.Grams],
        ["Date", b.Date],
        ["Type", b["Multi-Item"]],
      ].forEach(([k, v]) => addLine(`${k}: ${v}`, textX, 6));

      // Advance y past the text block
      y = startY + 8;
    });

    // Save PDF
    doc.save("jewellery_bookings_report.pdf");

    // Alert user
    alert(
      `PDF generated with ${bookingsData.length} booking records including images! Check your downloads.`
    );
    console.log("PDF generated with bookings data:", bookingsData);
  };

  // Debug function to check localStorage data
  const debugLocalStorage = () => {
    const saved = localStorage.getItem("admin-category-images-data");
    console.log("🔍 Current localStorage data:", saved);
    console.log("🔍 Parsed data:", saved ? JSON.parse(saved) : "No data");
    console.log("🔍 Current state data:", categoryImages);
    console.log("🔍 State keys:", Object.keys(categoryImages));
    console.log(
      "🔍 localStorage keys:",
      saved ? Object.keys(JSON.parse(saved)) : "No data"
    );
    alert("Check console for detailed localStorage debug info");
  };

  // Function to clear localStorage (for testing)
  const clearCategoryStorage = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all category images from localStorage? This cannot be undone."
      )
    ) {
      localStorage.removeItem("admin-category-images-data");
      console.log("🗑️ localStorage cleared");
      window.location.reload(); // Reload to reset state
    }
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

    // Create new category with image
    const updatedCategoryImages = {
      ...categoryImages,
      [newCategory.name]: {
        Default: [newCategory.image], // Store as simple string for new categories
      },
    };

    console.log("Adding new category:", newCategory.name);
    console.log("New category data:", updatedCategoryImages[newCategory.name]);

    // Update local state immediately
    setUniqueCategories((prev) => [...prev, newCategory.name]);
    setCategoryImages(updatedCategoryImages);

    alert(`"${newCategory.name}" category added successfully with image!`);
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setNewCategory({ name: "", description: "", image: "" });
    setCategoryImagePreview("");
    setShowAddCategoryModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex overflow-x-hidden flex-col pb-20 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            className="fixed inset-0 z-[60] bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {sidebarOpen && (
          <div
            className="flex overflow-y-auto overflow-x-hidden fixed inset-y-0 left-0 z-[70] flex-col pb-32 w-80 bg-white border-r border-gray-200 shadow-xl lg:fixed lg:inset-y-0 lg:left-0 lg:top-0 lg:h-screen lg:z-40 lg:shadow-none lg:w-72 lg:translate-x-0 lg:flex-shrink-0 scrollbar-hide"
            style={{
              paddingBottom: "calc(env(safe-area-inset-bottom) + 5rem)",
            }}
          >
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
            <div className="p-4 pb-2 border-t border-gray-200 md:pb-4">
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
          <main className="flex-1 p-4 pb-28 sm:p-6 lg:pb-6">
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
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            className="object-cover w-full h-56 transition-transform duration-500 sm:h-52 md:h-60 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t to-transparent from-black/60 via-black/10" />
                          <div className="absolute right-0 bottom-0 left-0 p-4">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-lg font-bold text-white">
                                  {category}
                                </h3>
                                <p className="text-xs text-white/80">
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
                  <Subcategories
                    selectedCategory={selectedCategory}
                    categoryImages={categoryImages}
                    setCategoryImages={setCategoryImages}
                    setSelectedCategory={setSelectedCategory}
                    addToCart={addToCart}
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
                <div className="flex flex-col p-3 space-y-3 border-b border-gray-200 sm:flex-row sm:justify-between sm:items-center sm:p-6 sm:space-y-0">
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                    User Bookings
                  </h2>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to clear all bookings? This action cannot be undone."
                          )
                        ) {
                          clearAllBookings();
                          alert("All bookings have been cleared!");
                        }
                      }}
                      className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-red-600 rounded transition-colors hover:bg-red-700"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1">Clear All</span>
                    </button>
                    <button
                      onClick={handleGenerateGramsPDF}
                      className="flex items-center px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white bg-blue-600 rounded transition-colors hover:bg-blue-700"
                    >
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="ml-1">Essential PDF</span>
                    </button>
                  </div>
                </div>
                <div className="p-3 sm:p-6">
                  <div className="space-y-6">
                    {bookings.length ? (
                      <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center space-x-3">
                            <img
                              src={(() => {
                                const b = bookings && bookings[0];
                                if (!b) return "https://via.placeholder.com/32x32?text=No";
                                const img = Array.isArray(b.images) && b.images.length
                                  ? b.images[0]
                                  : b.image;
                                return img || "https://via.placeholder.com/32x32?text=No";
                              })()}
                              alt="Latest booking"
                              className="w-8 h-8 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/32x32?text=No";
                              }}
                            />
                            <h3 className="text-lg font-semibold text-gray-900">
                              User Bookings
                            </h3>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  User
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Image
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Items
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Weight
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Category
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Jewelry Names
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  <div className="flex items-center space-x-4">
                                    <span>Date</span>
                                    <FileText
                                      className="w-4 h-4 text-gray-400"
                                      title="PDF Available"
                                    />
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(() => {
                                const groupedBookings = bookings.reduce(
                                  (acc, booking) => {
                                    const userKey = booking.userName;
                                    if (!acc[userKey]) {
                                      acc[userKey] = [];
                                    }
                                    acc[userKey].push(booking);
                                    return acc;
                                  },
                                  {}
                                );

                                return Object.entries(groupedBookings).map(
                                  ([userName, userBookings]) => (
                                    <tr
                                      key={userName}
                                      className="hover:bg-gray-50"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 w-10 h-10">
                                            <div className="flex justify-center items-center w-10 h-10 font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                                              {userName.charAt(0).toUpperCase()}
                                            </div>
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                              {userName}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                          src={
                                            userBookings[0].image ||
                                            "https://via.placeholder.com/64x64?text=No+Image"
                                          }
                                          alt="Jewellery"
                                          className="object-cover w-16 h-16 rounded-xl"
                                        />
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        {userBookings.length} item
                                        {userBookings.length > 1 ? "s" : ""}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        {userBookings
                                          .reduce(
                                            (sum, b) =>
                                              sum +
                                              (typeof b.grams === "number"
                                                ? b.grams
                                                : parseFloat(b.grams) || 0),
                                            0
                                          )
                                          .toFixed(2)}
                                        g
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                          {Object.entries(
                                            userBookings.reduce(
                                              (acc, booking) => {
                                                acc[booking.category] =
                                                  (acc[booking.category] || 0) +
                                                  1;
                                                return acc;
                                              },
                                              {}
                                            )
                                          ).map(([category, count]) => (
                                            <span
                                              key={category}
                                              className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                                            >
                                              {category}: {count}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                          {userBookings.map((booking) => (
                                            <span
                                              key={booking.id}
                                              className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded"
                                            >
                                              {booking.jewelleryName ||
                                                booking.name}
                                            </span>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                                        {new Date(
                                          userBookings[0].bookingDate
                                        ).toLocaleDateString()}
                                      </td>
                                    </tr>
                                  )
                                );
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="py-16 text-center bg-gray-50 rounded-xl border-2 border-gray-300 border-dashed">
                        <div className="flex justify-center items-center mx-auto mb-4 w-20 h-20 bg-gray-100 rounded-full">
                          <svg
                            className="w-10 h-10 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          No bookings yet
                        </h3>
                        <p className="text-gray-600">
                          User bookings will appear here when customers make
                          purchases
                        </p>
                      </div>
                    )}
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
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
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

            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-200">
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
                        setNewJewellery({
                          ...newJewellery,
                          name: e.target.value,
                        })
                      }
                      placeholder="Jewellery name"
                      className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700 font-mFedium">
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
                    <div className="overflow-auto max-h-96 rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full min-h-48"
                      />
                    </div>
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
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
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

            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
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
                    <div className="overflow-auto max-h-96 rounded-xl border border-gray-200 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
                      <img
                        src={categoryImagePreview}
                        alt="Preview"
                        className="object-contain w-full min-h-48"
                        onError={() => setCategoryImagePreview("")}
                      />
                    </div>
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
                <div className="overflow-auto relative max-h-32 rounded-lg border border-red-200 max-w-32 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-200">
                  <img
                    src={deleteConfirm.image}
                    alt={deleteConfirm.name}
                    className="object-contain w-full h-full"
                  />

                  {/* Weight Badge Overlay - Similar to AdminCategoryPage */}
                  {deleteConfirm.grams && (
                    <div className="absolute bottom-2 left-1/2 z-20 transform -translate-x-1/2">
                      <div className="px-3 py-1 rounded-full backdrop-blur-sm bg-black/60">
                        <span className="text-xs font-semibold text-white">
                          {(() => {
                            const weightStr = String(deleteConfirm.grams);

                            // Remove any existing 'g' characters and extra spaces
                            const cleanWeight = weightStr
                              .replace(/g+/g, "") // Remove all 'g' characters
                              .replace(/\s+/g, "") // Remove all whitespace
                              .trim();

                            // Parse the numeric value
                            const numWeight = parseFloat(cleanWeight);

                            // If it's a valid number, format it with 2 decimal places
                            if (!isNaN(numWeight) && numWeight > 0) {
                              return `${numWeight.toFixed(2)}g`;
                            }

                            // If it's not a valid number, return as-is or default to 0.00g
                            return weightStr.includes("g")
                              ? weightStr
                              : `${weightStr}g`;
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
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
                  {/* Show weight in text format as well */}
                  {deleteConfirm.grams && (
                    <p className="text-sm font-medium text-blue-600">
                      Weight:{" "}
                      {(() => {
                        const weightStr = String(deleteConfirm.grams);

                        // Remove any existing 'g' characters and extra spaces
                        const cleanWeight = weightStr
                          .replace(/g+/g, "") // Remove all 'g' characters
                          .replace(/\s+/g, "") // Remove all whitespace
                          .trim();

                        // Parse the numeric value
                        const numWeight = parseFloat(cleanWeight);

                        // If it's a valid number, format it with 2 decimal places
                        if (!isNaN(numWeight) && numWeight > 0) {
                          return `${numWeight.toFixed(2)}g`;
                        }

                        // If it's not a valid number, return as-is or default to 0.00g
                        return weightStr.includes("g")
                          ? weightStr
                          : `${weightStr}g`;
                      })()}
                    </p>
                  )}
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
