import { useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Camera, Image, FolderPlus, Edit3 } from "lucide-react";

const Subcategories = ({
  selectedCategory,
  categoryImages,
  setCategoryImages,
  setSelectedCategory,
}) => {
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newSubcategoryImage, setNewSubcategoryImage] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newPhotoDescription, setNewPhotoDescription] = useState("");
  const subcategories = Object.keys(categoryImages[selectedCategory] || {});
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    subcategories[0] || null
  );
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
    if (newSubcategoryName.trim() && selectedCategory) {
      const subcategoryName = newSubcategoryName.trim();
      setCategoryImages({
        ...categoryImages,
        [selectedCategory]: {
          ...categoryImages[selectedCategory],
          [subcategoryName]: [],
        },
      });
      setSelectedSubcategory(subcategoryName);
      alert(`Subcategory "${subcategoryName}" added successfully!`);
      resetSubcategoryForm();
    }
  };

  const handleAddPhoto = () => {
    if (newSubcategoryImage && selectedCategory && selectedSubcategory) {
      const photoData = {
        url: newSubcategoryImage,
        description: newPhotoDescription.trim() || `Beautiful ${selectedSubcategory} photo`,
        timestamp: new Date().toISOString()
      };

      setCategoryImages({
        ...categoryImages,
        [selectedCategory]: {
          ...categoryImages[selectedCategory],
          [selectedSubcategory]: [
            ...(categoryImages[selectedCategory][selectedSubcategory] || []),
            photoData,
          ],
        },
      });
      alert("Photo added successfully!");
      resetPhotoForm();
    }
  };

  const resetSubcategoryForm = () => {
    setNewSubcategoryName("");
    setShowAddSubcategoryModal(false);
  };

  const resetPhotoForm = () => {
    setNewSubcategoryImage("");
    setNewPhotoDescription("");
    setShowAddPhotoModal(false);
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % images.length);

  // Handle both old string format and new object format for images
  const getImageUrl = (img) => typeof img === 'string' ? img : img.url;
  const getImageDescription = (img) => typeof img === 'string' ? 'No description' : (img.description || 'No description');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="px-3 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
        
        {/* Header Section */}
        <div className="relative mb-6 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r rounded-2xl blur-xl from-blue-600/10 via-purple-600/10 to-pink-600/10 sm:rounded-3xl"></div>
          <div className="relative p-4 rounded-2xl border shadow-xl backdrop-blur-md bg-white/80 sm:rounded-3xl sm:p-8 border-white/20">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="space-y-2 sm:space-y-3">
                <h1 className="text-2xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 sm:text-4xl lg:text-5xl">
                  {selectedCategory} Gallery
                </h1>
                <p className="max-w-2xl text-sm text-gray-600 sm:text-lg">
                  Discover our curated collection of stunning {selectedCategory.toLowerCase()} photography
                </p>
                <div className="flex flex-wrap gap-3 items-center text-xs text-gray-500 sm:gap-4 sm:text-sm">
                  <div className="flex gap-2 items-center">
                    <Image className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{images.length} photos</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{subcategories.length} subcategories</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => setShowAddSubcategoryModal(true)}
                  className="relative px-4 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg transition-all duration-300 group sm:px-8 sm:py-4 sm:rounded-2xl hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 transition-opacity duration-300 sm:rounded-2xl group-hover:opacity-100"></div>
                  <div className="flex relative gap-2 justify-center items-center sm:gap-3">
                    <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Add Subcategory</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowAddPhotoModal(true)}
                  disabled={!selectedSubcategory}
                  className="relative px-4 py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transition-all duration-300 group sm:px-8 sm:py-4 sm:rounded-2xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 transition-opacity duration-300 sm:rounded-2xl group-hover:opacity-100"></div>
                  <div className="flex relative gap-2 justify-center items-center sm:gap-3">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Add Photo</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subcategory Navigation */}
        {subcategories.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="p-4 rounded-xl border shadow-lg backdrop-blur-md bg-white/70 sm:rounded-2xl sm:p-6 border-white/30">
              <h3 className="flex gap-2 items-center mb-3 text-lg font-semibold text-gray-800 sm:text-xl sm:mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Browse Collections
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-xs sm:text-base ${
                      selectedSubcategory === sub
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                    }`}
                  >
                    <span className="block sm:inline">{sub}</span>
                    <span className="ml-1 text-xs opacity-75 sm:ml-2">
                      {(categoryImages[selectedCategory][sub] || []).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photo Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => openLightbox(idx)}
            >
              <div className="overflow-hidden aspect-square">
                <img
                  src={getImageUrl(img)}
                  alt={`${selectedCategory} ${selectedSubcategory} ${idx + 1}`}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-300 from-black/70 group-hover:opacity-100"></div>
              <div className="absolute right-0 bottom-0 left-0 p-3 text-white transition-transform duration-300 transform translate-y-full sm:p-4 group-hover:translate-y-0">
                <h3 className="text-sm font-semibold truncate sm:text-lg">{selectedSubcategory}</h3>
                <p className="text-xs opacity-90 sm:text-sm line-clamp-2">{getImageDescription(img)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - No Photos */}
        {images.length === 0 && selectedSubcategory && (
          <div className="py-12 text-center sm:py-20">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="flex relative justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full sm:w-24 sm:h-24 sm:mb-6">
                <Image className="w-8 h-8 text-white sm:w-12 sm:h-12" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:text-2xl sm:mb-4">No Photos Yet</h3>
            <p className="px-4 mx-auto mb-6 max-w-md text-sm text-gray-600 sm:text-base sm:mb-8">
              This collection is waiting for its first masterpiece. Start building your gallery today!
            </p>
            <button
              onClick={() => setShowAddPhotoModal(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg transition-all duration-300 transform sm:px-8 sm:py-4 sm:rounded-2xl hover:shadow-xl hover:scale-105 sm:text-base"
            >
              Add First Photo
            </button>
          </div>
        )}

        {/* Empty State - No Subcategories */}
        {subcategories.length === 0 && (
          <div className="py-12 text-center sm:py-20">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
              <div className="flex relative justify-center items-center mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full sm:w-24 sm:h-24 sm:mb-6">
                <FolderPlus className="w-8 h-8 text-white sm:w-12 sm:h-12" />
              </div>
            </div>
            <h3 className="mb-3 text-xl font-bold text-gray-800 sm:text-2xl sm:mb-4">No Subcategories Yet</h3>
            <p className="px-4 mx-auto mb-6 max-w-md text-sm text-gray-600 sm:text-base sm:mb-8">
              Create your first subcategory to organize your {selectedCategory.toLowerCase()} photos.
            </p>
            <button
              onClick={() => setShowAddSubcategoryModal(true)}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg transition-all duration-300 transform sm:px-8 sm:py-4 sm:rounded-2xl hover:shadow-xl hover:scale-105 sm:text-base"
            >
              Create Subcategory
            </button>
          </div>
        )}

        {/* Lightbox Modal */}
        {isLightboxOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/95">
            {/* Header */}
            <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b to-transparent from-black/80">
              <div className="flex justify-between items-center p-3 sm:p-6">
                <div className="text-white">
                  <h3 className="text-base font-semibold sm:text-lg">{selectedCategory} • {selectedSubcategory}</h3>
                  <p className="text-xs opacity-75 sm:text-sm">Photo {lightboxIndex + 1} of {images.length}</p>
                  <p className="mt-1 max-w-xs text-xs truncate opacity-75 sm:text-sm sm:max-w-md">
                    {getImageDescription(images[lightboxIndex])}
                  </p>
                </div>
                <button
                  onClick={closeLightbox}
                  className="flex justify-center items-center w-10 h-10 text-white rounded-lg transition-colors sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 sm:rounded-xl"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="flex justify-center items-center px-2 py-16 h-full sm:px-4 sm:py-20">
              <button
                onClick={prevImage}
                className="flex absolute left-2 z-10 justify-center items-center w-10 h-10 text-white rounded-full transition-all sm:left-6 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              <img
                src={getImageUrl(images[lightboxIndex])}
                alt={`${selectedCategory} ${selectedSubcategory} ${lightboxIndex + 1}`}
                className="object-contain max-w-full max-h-full rounded-lg shadow-2xl"
              />

              <button
                onClick={nextImage}
                className="flex absolute right-2 z-10 justify-center items-center w-10 h-10 text-white rounded-full transition-all sm:right-6 sm:w-14 sm:h-14 bg-white/10 hover:bg-white/20"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="absolute right-0 bottom-0 left-0 p-3 bg-gradient-to-t to-transparent from-black/80 sm:p-6">
              <div className="flex overflow-x-auto gap-2 justify-center pb-2 sm:gap-3">
                {images.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-20 sm:h-20 rounded-lg overflow-hidden transition-all ${
                      i === lightboxIndex 
                        ? 'ring-2 ring-white scale-110 shadow-xl' 
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={getImageUrl(thumb)} alt={`Thumbnail ${i + 1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Subcategory Modal */}
        {showAddSubcategoryModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-3 backdrop-blur-sm sm:p-4 bg-black/50">
            <div className="overflow-hidden w-full max-w-md bg-white rounded-2xl shadow-2xl sm:rounded-3xl">
              <div className="p-4 text-white bg-gradient-to-r from-green-500 to-emerald-500 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold sm:text-2xl">Add Subcategory</h3>
                  <button
                    onClick={resetSubcategoryForm}
                    className="flex justify-center items-center w-8 h-8 rounded-full transition-colors sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="mt-2 text-sm opacity-90 sm:text-base">Create a new collection in {selectedCategory}</p>
              </div>

              <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700 sm:mb-3">
                    Subcategory Name
                  </label>
                  <input
                    type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name..."
                    className="px-3 py-2 w-full text-sm rounded-lg border border-gray-300 transition-all sm:px-4 sm:py-3 sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-base"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-2 sm:gap-4 sm:pt-4">
                  <button
                    onClick={resetSubcategoryForm}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg transition-colors sm:px-6 sm:py-3 hover:bg-gray-200 sm:rounded-xl sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSubcategory}
                    disabled={!newSubcategoryName.trim()}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg transition-all sm:px-6 sm:py-3 hover:from-green-600 hover:to-emerald-600 sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl sm:text-base"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Photo Modal */}
        {showAddPhotoModal && (
          <div className="flex fixed inset-0 z-50 justify-center items-center p-3 backdrop-blur-sm sm:p-4 bg-black/50">
            <div className="overflow-hidden w-full max-w-md bg-white rounded-2xl shadow-2xl sm:rounded-3xl">
              <div className="p-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 sm:p-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold sm:text-2xl">Add Photo</h3>
                  <button
                    onClick={resetPhotoForm}
                    className="flex justify-center items-center w-8 h-8 rounded-full transition-colors sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                <p className="mt-2 text-sm opacity-90 sm:text-base">Upload to {selectedCategory} • {selectedSubcategory}</p>
              </div>

              <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700 sm:mb-3">
                    Choose Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSubcategoryFileUpload}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="p-4 text-center rounded-xl border-2 border-gray-300 border-dashed transition-colors sm:rounded-2xl sm:p-8 hover:border-blue-500 hover:bg-blue-50/50">
                      <Camera className="mx-auto mb-2 w-8 h-8 text-gray-400 sm:w-12 sm:h-12 sm:mb-4" />
                      <p className="text-sm font-medium text-gray-600 sm:text-base">Click to upload photo</p>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700 sm:mb-3">
                    Description
                  </label>
                  <textarea
                    value={newPhotoDescription}
                    onChange={(e) => setNewPhotoDescription(e.target.value)}
                    placeholder="Describe your photo..."
                    rows="3"
                    className="px-3 py-2 w-full text-sm rounded-lg border border-gray-300 transition-all resize-none sm:px-4 sm:py-3 sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-base"
                  />
                </div>

                {newSubcategoryImage && (
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Preview</label>
                    <div className="overflow-hidden rounded-xl border-2 border-gray-200 sm:rounded-2xl">
                      <img
                        src={newSubcategoryImage}
                        alt="Preview"
                        className="object-cover w-full h-32 sm:h-48"
                        onError={() => setNewSubcategoryImage("")}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2 sm:gap-4 sm:pt-4">
                  <button
                    onClick={resetPhotoForm}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg transition-colors sm:px-6 sm:py-3 hover:bg-gray-200 sm:rounded-xl sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPhoto}
                    disabled={!newSubcategoryImage}
                    className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg transition-all sm:px-6 sm:py-3 hover:from-blue-600 hover:to-purple-600 sm:rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl sm:text-base"
                  >
                    Add Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subcategories;