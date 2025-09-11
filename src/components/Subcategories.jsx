import { useState } from "react";
import { Plus, X } from "lucide-react";

const Subcategories = ({
  selectedCategory,
  categoryImages,
  setCategoryImages,
  setSelectedCategory,
}) => {
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [newSubcategoryImage, setNewSubcategoryImage] = useState("");
  const subcategories = Object.keys(categoryImages[selectedCategory] || {});
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategories[0] || null
  );
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const images = (categoryImages[selectedCategory]?.[selectedSubcategory] || []);

  const handleSubcategoryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setNewSubcategoryImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategoryImage && selectedCategory && selectedSubcategory) {
      setCategoryImages({
        ...categoryImages,
        [selectedCategory]: {
          ...categoryImages[selectedCategory],
          [selectedSubcategory]: [
            ...(categoryImages[selectedCategory][selectedSubcategory] || []),
            newSubcategoryImage,
          ],
        },
      });
      alert("Subcategory photo added successfully!");
      resetSubcategoryForm();
    }
  };

  const resetSubcategoryForm = () => {
    setNewSubcategoryImage("");
    setShowAddSubcategoryModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % images.length);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {selectedCategory} Photos
          </h2>
          <p className="text-sm text-gray-600 sm:text-base">
            Browse through our {selectedCategory.toLowerCase()} collection
          </p>
        </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/80">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 text-white">
            <div className="text-sm sm:text-base opacity-80">
              {selectedCategory} • {selectedSubcategory} • Photo {lightboxIndex + 1} / {images.length}
            </div>
            <button
              onClick={closeLightbox}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm"
              aria-label="Close"
            >
              Close ✕
            </button>
          </div>

          {/* Main Image Area */}
          <div className="relative flex-1 flex items-center justify-center px-2 sm:px-6">
            {/* Prev */}
            <button
              onClick={prevImage}
              className="hidden sm:flex absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center"
              aria-label="Previous"
            >
              ‹
            </button>

            <img
              src={images[lightboxIndex]}
              alt={`${selectedCategory} ${selectedSubcategory} ${lightboxIndex + 1}`}
              className="max-h-[70vh] w-auto rounded-lg shadow-2xl object-contain"
            />

            {/* Next */}
            <button
              onClick={nextImage}
              className="hidden sm:flex absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center"
              aria-label="Next"
            >
              ›
            </button>
          </div>

          {/* Thumbnails */}
          <div className="px-3 sm:px-6 py-3 bg-black/60">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border ${
                    i === lightboxIndex ? 'border-white' : 'border-white/30'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                >
                  <img src={thumb} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                  {i === lightboxIndex && (
                    <span className="absolute inset-0 ring-2 ring-white rounded-lg"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
        <div className="self-start text-xs text-gray-500 sm:text-sm sm:self-center">
          {subcategories.length} subcategories
        </div>
      </div>

      {/* Subcategory Selector */}
      {subcategories.length > 1 && (
        <div className="p-3 bg-white rounded-lg border border-gray-200 sm:p-4 lg:p-6">
          <h3 className="mb-3 text-base font-medium text-gray-900 sm:text-lg sm:mb-4">
            Browse by Subcategory
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md font-medium transition-all duration-200 touch-manipulation ${
                  selectedSubcategory === sub
                    ? "bg-blue-500 text-white shadow-md transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      <div
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 scrollbar-hide"
        style={{
          height: "auto",
          minHeight: "250px",
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        }}
      >
        {(categoryImages[selectedCategory][selectedSubcategory] || []).map(
          (img, idx) => (
            <div
              key={idx}
              className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 group hover:shadow-lg active:scale-95 touch-manipulation cursor-zoom-in"
              onClick={() => openLightbox(idx)}
            >
              <div className="overflow-hidden aspect-square">
                <img
                  src={img}
                  alt={`${selectedCategory} ${selectedSubcategory} ${idx + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="mb-1 text-sm font-medium text-gray-900 truncate sm:text-base sm:mb-2">
                  Photo {idx + 1}
                </h3>
                <p className="text-xs text-gray-600 truncate sm:text-sm">
                  {selectedCategory} • {selectedSubcategory}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Empty State */}
      {(!categoryImages[selectedCategory][selectedSubcategory] ||
        categoryImages[selectedCategory][selectedSubcategory].length === 0) && (
        <div className="py-8 mx-4 text-center bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed sm:py-12 sm:mx-0">
          <div className="flex justify-center items-center mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full sm:w-16 sm:h-16">
            <Plus className="w-6 h-6 text-blue-500 sm:w-8 sm:h-8" />
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-900 sm:text-lg">
            No Photos Yet
          </h3>
          <p className="px-4 text-sm text-gray-600 sm:text-base">
            This subcategory doesn't have any photos yet.
          </p>
        </div>
      )}
      {showAddSubcategoryModal && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Subcategory Photo
              </h3>
              <button
                onClick={resetSubcategoryForm}
                className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Upload Photo for {selectedCategory}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSubcategoryFileUpload}
                  className="px-4 py-3 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  required
                />
              </div>

              {newSubcategoryImage && (
                <div className="p-4 rounded-xl border border-gray-300">
                  <p className="mb-3 text-sm font-medium text-gray-700">
                    Image Preview:
                  </p>
                  <img
                    src={newSubcategoryImage}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-xl"
                    onError={() => setNewSubcategoryImage("")}
                  />
                </div>
              )}

              <div className="flex pt-6 space-x-4">
                <button
                  type="button"
                  onClick={resetSubcategoryForm}
                  className="flex-1 px-6 py-3 font-medium text-gray-700 bg-gray-100 rounded-xl transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSubcategory}
                  className="flex-1 px-6 py-3 font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg transition-all hover:from-green-600 hover:to-green-700"
                >
                  Add Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
