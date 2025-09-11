import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useJewellery } from "../context/JewelleryContext";
import {
  Plus,
  X,
  Grid3X3,
  List,
  Search,
  Filter,
  ChevronLeft,
} from "lucide-react";
import Footer from "../components/Footer";
import Subcategories from "../components/Subcategories";

const AdminCategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { jewellery, getCategories } = useJewellery();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  // Normalize category names from URL to match our keys (e.g., 'Earring' -> 'Earrings')
  const normalizeCategoryName = (name) => {
    if (!name) return "All";
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
    const key = decodeURIComponent(name).replace(/-/g, " ").toLowerCase();
    return map[key] || decodeURIComponent(name);
  };
  const [selectedCategory, setSelectedCategory] = useState(normalizeCategoryName(categoryName));
  // Resolve public assets with Vite base (safe join)
  const asset = (name) => {
    if (!name) return name;
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
    const clean = name.startsWith('/') ? name.slice(1) : name;
    return `${cleanBase}/${clean}`;
  };
  const [categoryImages, setCategoryImages] = useState({
    Animals: {
      Lion: [asset('download.jpg'), asset('download (1).jpg')],
      Tiger: [asset('download (2).jpg')],
      Elephant: [asset('download (3).jpg')],
    },
    "Arabic Style 21k": {
      Necklace: [asset('download (2).jpg')],
      Bracelet: [asset('images.jpg')],
      Ring: [asset('download (3).jpg')],
    },
    Rings: {
      Diamond: [asset('download (1).jpg')],
      Sapphire: [asset('download (2).jpg')],
      Ruby: [asset('download (3).jpg')],
    },
    Earrings: {
      Pearl: [asset('images.jpg')],
      Gold: [asset('download.jpg')],
      Diamond: [asset('download (1).jpg')],
    },
    Bracelets: {
      Silver: [asset('images.jpg')],
      Gold: [asset('download (2).jpg')],
      Beaded: [asset('download.jpg')],
    },
    Pendant: {
      Heart: [asset('download (1).jpg')],
      Cross: [asset('download (2).jpg')],
      Star: [asset('download (3).jpg')],
    },
    "Man Collection": {
      Chain: [asset('images.jpg')],
      Bracelet: [asset('download.jpg')],
      Ring: [asset('download (1).jpg')],
    },
    SET: {
      Gold: [asset('download (3).jpg')],
      Diamond: [asset('images.jpg')],
      Silver: [asset('download.jpg')],
    },
    Mine: {
      Diamond: [asset('download (1).jpg')],
      Ruby: [asset('download (2).jpg')],
    },
  });

  // Set selected category based on URL parameter - runs on mount and when categoryName changes
  useEffect(() => {
    setSelectedCategory(normalizeCategoryName(categoryName));
  }, [categoryName]);

  const handleBack = () => {
    navigate("/", { state: { showCategories: true } });
  };

  const filteredItems = jewellery.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Simple Header */}
      <div className="sticky top-0 z-40 border-b border-gray-200 shadow-sm backdrop-blur-md bg-white/80">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedCategory} Collection
            </h1>
            <div className="text-sm text-gray-500">
              {filteredItems.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-6">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search within this collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2 pr-4 pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Category Content */}
        <div className="space-y-6">
          {selectedCategory && selectedCategory !== "All" ? (
            <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedCategory} Gallery
                    </h2>
                    <p className="text-gray-600">
                      Explore our {selectedCategory.toLowerCase()} collection
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {Object.keys(categoryImages[selectedCategory] || {}).length}{" "}
                    subcategories
                  </div>
                </div>

                <Subcategories
                  selectedCategory={selectedCategory}
                  categoryImages={categoryImages}
                  setCategoryImages={setCategoryImages}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </div>
          ) : (
            <div className="py-16 text-center bg-white rounded-lg border border-gray-200">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                Category not found
              </h3>
              <p className="text-gray-500">
                The category "{categoryName}" does not exist in our collection.
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-2 mt-4 text-white bg-blue-500 rounded-lg transition-colors hover:bg-blue-600"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminCategoryPage;
