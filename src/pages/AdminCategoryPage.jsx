import { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
} from "lucide-react";
import Footer from "../components/Footer";

const AdminCategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { jewellery } = useJewellery();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("weight");
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    subcategory: "",
    description: "",
    weight: "",
    image: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
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
  const [selectedCategory, setSelectedCategory] = useState(
    normalizeCategoryName(categoryName)
  );
  // Resolve public assets with Vite base (safe join)
  const asset = (name) => {
    if (!name) return name;
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const clean = name.startsWith("/") ? name.slice(1) : name;
    return `${cleanBase}/${clean}`;
  };
  const [categoryImages, setCategoryImages] = useState({
    Animals: {
      Lion: [
        {
          url: asset("download.jpg"),
          description: "Lion pendant",
          weight: "18g",
        },
        {
          url: asset("download (1).jpg"),
          description: "Lion necklace",
          weight: "22g",
        },
      ],
      Tiger: [
        {
          url: asset("download (2).jpg"),
          description: "Tiger brooch",
          weight: "25g",
        },
      ],
      Elephant: [
        {
          url: asset("download (3).jpg"),
          description: "Elephant charm",
          weight: "20g",
        },
      ],
    },
    "Arabic Style 21k": {
      Necklace: [
        {
          url: asset("download (2).jpg"),
          description: "Arabic necklace",
          weight: "30g",
        },
      ],
      Bracelet: [
        {
          url: asset("images.jpg"),
          description: "Arabic bracelet",
          weight: "28g",
        },
      ],
      Ring: [
        {
          url: asset("download (3).jpg"),
          description: "Arabic ring",
          weight: "12g",
        },
      ],
    },
    Rings: {
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Diamond ring",
          weight: "8g",
        },
      ],
      Sapphire: [
        {
          url: asset("download (2).jpg"),
          description: "Sapphire ring",
          weight: "10g",
        },
      ],
      Ruby: [
        {
          url: asset("download (3).jpg"),
          description: "Ruby ring",
          weight: "9g",
        },
      ],
    },
    Earrings: {
      Pearl: [
        {
          url: asset("images.jpg"),
          description: "Pearl earrings",
          weight: "6g",
        },
      ],
      Gold: [
        {
          url: asset("download.jpg"),
          description: "Gold earrings",
          weight: "14g",
        },
      ],
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Diamond earrings",
          weight: "7g",
        },
      ],
    },
    Bracelets: {
      Silver: [
        {
          url: asset("images.jpg"),
          description: "Silver bracelet",
          weight: "16g",
        },
      ],
      Gold: [
        {
          url: asset("download (2).jpg"),
          description: "Gold bracelet",
          weight: "24g",
        },
      ],
      Beaded: [
        {
          url: asset("download.jpg"),
          description: "Beaded bracelet",
          weight: "11g",
        },
      ],
    },
    Pendant: {
      Heart: [
        {
          url: asset("download (1).jpg"),
          description: "Heart pendant",
          weight: "5g",
        },
      ],
      Cross: [
        {
          url: asset("download (2).jpg"),
          description: "Cross pendant",
          weight: "8g",
        },
      ],
      Star: [
        {
          url: asset("download (3).jpg"),
          description: "Star pendant",
          weight: "6g",
        },
      ],
    },
    "Man Collection": {
      Chain: [
        { url: asset("images.jpg"), description: "Men chain", weight: "35g" },
      ],
      Bracelet: [
        {
          url: asset("download.jpg"),
          description: "Men bracelet",
          weight: "28g",
        },
      ],
      Ring: [
        {
          url: asset("download (1).jpg"),
          description: "Men ring",
          weight: "15g",
        },
      ],
    },
    SET: {
      Gold: [
        {
          url: asset("download (3).jpg"),
          description: "Gold set",
          weight: "45g",
        },
      ],
      Diamond: [
        { url: asset("images.jpg"), description: "Diamond set", weight: "32g" },
      ],
      Silver: [
        {
          url: asset("download.jpg"),
          description: "Silver set",
          weight: "38g",
        },
      ],
    },
    Mine: {
      Diamond: [
        {
          url: asset("download (1).jpg"),
          description: "Mined diamond",
          weight: "4g",
        },
      ],
      Ruby: [
        {
          url: asset("download (2).jpg"),
          description: "Mined ruby",
          weight: "6g",
        },
      ],
    },
  });

  // Flattened and filtered items for the gallery (by weight, search, and sort)
  const galleryItems = useMemo(() => {
    const group = categoryImages[selectedCategory] || {};
    const items = [];
    Object.entries(group).forEach(([subcategory, images]) => {
      (images || []).forEach((image, index) => {
        const imageUrl = typeof image === "string" ? image : image.url;
        const imageDesc =
          typeof image === "string"
            ? `${selectedCategory} ${subcategory}`
            : image.description || `${selectedCategory} ${subcategory}`;
        const imageWeight = typeof image === "string" ? "" : image.weight || "";
        const weightNum = parseFloat(String(imageWeight).replace("g", "")) || 0;

        // Weight filter
        const min = minWeight ? parseFloat(minWeight) : 0;
        const max = maxWeight ? parseFloat(maxWeight) : Infinity;
        if (weightNum < min || weightNum > max) return;

        // Search filter (by description or subcategory)
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          if (
            !(
              imageDesc.toLowerCase().includes(q) ||
              subcategory.toLowerCase().includes(q) ||
              String(selectedCategory).toLowerCase().includes(q)
            )
          )
            return;
        }

        items.push({
          id: `${selectedCategory}-${subcategory}-${index}`,
          subcategory,
          url: imageUrl,
          desc: imageDesc,
          weight: imageWeight,
          weightNum,
          name: `${selectedCategory} ${subcategory}`,
          category: selectedCategory,
        });
      });
    });

    items.sort((a, b) => {
      switch (sortBy) {
        case "weight-desc":
          return b.weightNum - a.weightNum;
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "weight":
        default:
          return a.weightNum - b.weightNum;
      }
    });

    return items;
  }, [
    categoryImages,
    selectedCategory,
    minWeight,
    maxWeight,
    searchTerm,
    sortBy,
  ]);

  // Add Photo handlers
  const existingSubcategories = useMemo(
    () => Object.keys(categoryImages[selectedCategory] || {}),
    [categoryImages, selectedCategory]
  );

  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result;
        setNewPhoto((p) => ({ ...p, image: url }));
        setPhotoPreview(url);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetPhotoForm = () => {
    setNewPhoto({ subcategory: "", description: "", weight: "", image: "" });
    setPhotoPreview("");
    setShowAddPhotoModal(false);
  };

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!newPhoto.subcategory || !newPhoto.image) {
      alert("Please enter a subcategory and choose an image.");
      return;
    }
    setCategoryImages((prev) => {
      const group = prev[selectedCategory] || {};
      const sub = newPhoto.subcategory;
      const updatedSub = [
        ...(group[sub] || []),
        {
          url: newPhoto.image,
          description:
            newPhoto.description ||
            `${selectedCategory} ${newPhoto.subcategory}`,
          weight: newPhoto.weight || "",
        },
      ];
      return {
        ...prev,
        [selectedCategory]: {
          ...group,
          [sub]: updatedSub,
        },
      };
    });
    resetPhotoForm();
  };

  // Set selected category based on URL parameter - runs on mount and when categoryName changes
  useEffect(() => {
    setSelectedCategory(normalizeCategoryName(categoryName));
  }, [categoryName]);

  const handleBack = () => {
    navigate("/", { state: { showCategories: true } });
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
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
              {galleryItems.length} items
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Sticky Search Bar */}
        <div className="sticky top-16 z-30 p-4 mb-6 bg-white rounded-lg border border-gray-200 shadow-sm">
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
            <div className="overflow-visible bg-white rounded-lg border border-gray-200 shadow-sm">
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

                {/* Sticky Filter/Sort Controls */}
                <div className="sticky top-32 z-50 p-3 bg-white rounded-md border border-gray-200 shadow-sm">
                  <div className="flex flex-wrap gap-2 justify-between items-center md:gap-4">
                    <div className="flex flex-wrap gap-2 items-center md:gap-3">
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                      </button>

                      {/* Sort Dropdown */}
                      <div className="relative">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="block px-3 py-2 pr-8 w-full text-sm text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          <option value="weight">Weight: Low to High</option>
                          <option value="weight-desc">
                            Weight: High to Low
                          </option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="flex p-1 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`p-2 rounded ${
                            viewMode === "grid" ? "bg-white shadow-sm" : ""
                          }`}
                          title="Grid View"
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`p-2 rounded ${
                            viewMode === "list" ? "bg-white shadow-sm" : ""
                          }`}
                          title="List View"
                        >
                          <List className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => setShowAddPhotoModal(true)}
                        className="px-4 py-2 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-md transition-all hover:from-green-600 hover:to-emerald-600"
                      >
                        Add Photo
                      </button>
                    </div>
                  </div>

                  {/* Expanded Filters */}
                  {showFilters && (
                    <div className="sticky top-48 z-40 p-3 mt-3 bg-gray-50 rounded-xl border border-gray-200">
                      <h3 className="mb-2 text-sm font-semibold text-gray-700">
                        Filter by Weight (grams)
                      </h3>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <label className="block mb-1 text-xs text-gray-600">
                            Min Weight
                          </label>
                          <input
                            type="number"
                            value={minWeight}
                            onChange={(e) => setMinWeight(e.target.value)}
                            placeholder="Min"
                            className="block px-3 py-2 w-full text-sm text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block mb-1 text-xs text-gray-600">
                            Max Weight
                          </label>
                          <input
                            type="number"
                            value={maxWeight}
                            onChange={(e) => setMaxWeight(e.target.value)}
                            placeholder="Max"
                            className="block px-3 py-2 w-full text-sm text-gray-700 bg-white rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items Grid */}
                <div
                  className={`grid gap-4 sm:gap-6 mt-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {galleryItems.map((gi) => (
                    <div
                      key={gi.id}
                      className={`overflow-hidden relative rounded-xl border border-gray-200 shadow-md transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 ${
                        viewMode === "list" ? "flex" : ""
                      }`}
                    >
                      <div
                        className={`${
                          viewMode === "list" ? "w-32 h-32" : "aspect-square"
                        } overflow-hidden relative`}
                      >
                        <img
                          src={gi.url}
                          alt={gi.desc}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div
                        className={`${
                          viewMode === "list"
                            ? "flex-1 p-4"
                            : "absolute inset-0 bg-gradient-to-t to-transparent from-black/60 via-black/10"
                        }`}
                      >
                        <div
                          className={`${
                            viewMode === "list"
                              ? "flex justify-between items-start"
                              : "absolute right-0 bottom-0 left-0 p-4"
                          }`}
                        >
                          <div>
                            {/* Subcategory name removed */}
                          </div>
                        </div>

                        {gi.weight && viewMode !== "list" && (
                          <div className="absolute bottom-2 left-1/2 z-20 transform -translate-x-1/2 sm:bottom-4">
                            <div className="px-3 py-1 rounded-full backdrop-blur-sm bg-black/60 sm:bg-black/50">
                              <span className="text-xs font-semibold text-white sm:text-sm">
                                {parseFloat(
                                  String(gi.weight).replace("g", "")
                                ).toFixed(2)}{" "}
                                g
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
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

      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/50">
          <div className="p-6 w-full max-w-lg bg-white rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Photo to {selectedCategory}
              </h3>
              <button
                onClick={resetPhotoForm}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPhotoSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <input
                  type="text"
                  list="subcategoryList"
                  value={newPhoto.subcategory}
                  onChange={(e) =>
                    setNewPhoto((p) => ({ ...p, subcategory: e.target.value }))
                  }
                  placeholder="e.g. Lion, Gold, Diamond"
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
                <datalist id="subcategoryList">
                  {existingSubcategories.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={newPhoto.description}
                  onChange={(e) =>
                    setNewPhoto((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Short description"
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Weight (g, optional)
                </label>
                <input
                  type="number"
                  value={newPhoto.weight}
                  onChange={(e) =>
                    setNewPhoto((p) => ({ ...p, weight: e.target.value }))
                  }
                  placeholder="e.g. 12"
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileUpload}
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  required
                />
              </div>

              {photoPreview && (
                <div className="p-4 rounded-xl border border-gray-300">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Image Preview:
                  </p>
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-xl"
                    onError={() => setPhotoPreview("")}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetPhotoForm}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg transition-all hover:from-amber-600 hover:to-orange-600"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminCategoryPage;
