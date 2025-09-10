import { useState, useEffect } from 'react';
import {
  ArrowLeft, ShoppingCart, Heart, Share2, Plus, Minus, Star,
  Shield, Truck, Clock, Zap, Eye, ChevronLeft, ChevronRight,
  Award, Gem, Camera, MessageCircle, CheckCircle, Info
} from 'lucide-react';

const ItemDetail = () => {
  // Mock data - replace with your actual hooks and params
  const item = {
    id: 1,
    name: "Royal Diamond Necklace",
    category: "Necklaces",
    price: 85000,
    originalPrice: 95000,
    description: "Exquisite handcrafted necklace featuring premium diamonds set in 18K gold. This stunning piece combines traditional craftsmanship with contemporary elegance, making it perfect for special occasions.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&h=600&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop"
    ],
    quantity: 3,
    rating: 4.8,
    reviews: 127,
    features: ["18K Gold", "Natural Diamonds", "Handcrafted", "Certificate Included"],
    specifications: {
      material: "18K Gold with Natural Diamonds",
      weight: "25.5 grams",
      dimensions: "45cm length, adjustable",
      warranty: "Lifetime",
      certification: "GIA Certified"
    }
  };

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const navigate = (path) => console.log('Navigate to:', path);
  const addToCart = (item, qty) => console.log('Added to cart:', item.name, 'Quantity:', qty);

  const handleAddToCart = () => {
    addToCart(item, quantity);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out this beautiful ${item.name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  // Auto-play image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      if (!zoomedImage) {
        nextImage();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [zoomedImage]);

  const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 border-b shadow-sm backdrop-blur-md bg-white/80 border-gray-200/50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-900 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Catalog</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-400 fill-current" />
              {/* Rating removed - Clean Design */}
              {/* <span className="text-sm font-medium text-gray-700">{item.rating}</span>
              <span className="text-sm text-gray-500">({item.reviews} reviews)</span> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* Enhanced Image Section */}
          <div className="space-y-6">
            {/* Main Image with Zoom */}
            <div className="relative group">
              <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-xl aspect-square">
                <img
                  src={item.images[selectedImage]}
                  alt={item.name}
                  className="object-cover w-full h-full transition-transform duration-500 cursor-zoom-in hover:scale-105"
                  onClick={() => setZoomedImage(true)}
                />
                
                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="flex absolute left-4 top-1/2 justify-center items-center w-12 h-12 rounded-full shadow-lg opacity-0 backdrop-blur-sm transition-all -translate-y-1/2 bg-white/80 group-hover:opacity-100 hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="flex absolute right-4 top-1/2 justify-center items-center w-12 h-12 rounded-full shadow-lg opacity-0 backdrop-blur-sm transition-all -translate-y-1/2 bg-white/80 group-hover:opacity-100 hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Zoom indicator */}
                <div className="flex absolute right-4 bottom-4 items-center px-3 py-1 space-x-1 text-sm text-white rounded-full opacity-0 transition-opacity bg-black/60 group-hover:opacity-100">
                  <Eye className="w-4 h-4" />
                  <span>Click to zoom</span>
                </div>

                {/* Image counter */}
                <div className="absolute top-4 right-4 px-3 py-1 text-sm text-white rounded-full bg-black/60">
                  {selectedImage + 1} / {item.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex overflow-x-auto pb-2 space-x-3">
              {item.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl border-2 transition-all overflow-hidden flex-shrink-0 ${
                    selectedImage === i 
                      ? 'border-amber-500 ring-2 ring-amber-200 scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${i + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-2 gap-3">
              {item.features.map((feature, i) => (
                <div key={i} className="flex items-center p-3 space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Details Section */}
          <div className="space-y-8">
            
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-amber-800 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200">
                  <Gem className="mr-2 w-4 h-4" />
                  {item.category}
                </span>
                {discount > 0 && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-bold text-red-800 bg-red-100 rounded-full">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold leading-tight text-gray-900">{item.name}</h1>
              
              {/* Rating & Reviews - Removed */}
              {/* Rating display removed for clean design */}
              {/* <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(item.rating)
                          ? 'text-amber-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.rating}</span>
                <span className="text-gray-500">•</span>
                <button className="font-medium text-amber-600 hover:text-amber-700">
                  {item.reviews} reviews
                </button>
              </div> */}

              {/* Price - Removed */}
              {/* Price display removed for clean design */}
              {/* <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-gray-900">₹{item.price.toLocaleString()}</span>
                {item.originalPrice > item.price && (
                  <span className="text-xl text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                )}
              </div> */}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <p className="text-lg leading-relaxed text-gray-700">
                {showFullDescription ? item.description : `${item.description.slice(0, 150)}...`}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                {showFullDescription ? 'Show less' : 'Read more'}
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="p-6 space-y-4 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Quantity</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  item.quantity > 5 ? 'bg-green-100 text-green-800' :
                  item.quantity > 2 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.quantity} available
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex justify-center items-center w-12 h-12 bg-white rounded-xl border border-gray-300 shadow-sm transition-colors hover:bg-gray-100"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-bold text-gray-900">{quantity}</span>
                </div>
                <button
                  onClick={() => setQuantity(Math.min(item.quantity, quantity + 1))}
                  className="flex justify-center items-center w-12 h-12 bg-white rounded-xl border border-gray-300 shadow-sm transition-colors hover:bg-gray-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center space-x-3 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ShoppingCart className="w-6 h-6" />
                <span>Add to Cart</span>
                {/* Price removed from button */}
                {/* — ₹{(item.price * quantity).toLocaleString()} */}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-3 px-6 font-medium rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    isWishlisted
                      ? 'text-red-700 bg-red-100 border border-red-200'
                      : 'text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex justify-center items-center px-6 py-3 space-x-2 font-medium text-gray-700 bg-gray-100 rounded-xl border border-gray-300 transition-colors hover:bg-gray-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Lifetime Warranty", color: "text-green-600" },
                { icon: Truck, text: "Free Shipping", color: "text-blue-600" },
                { icon: Award, text: "Certified Quality", color: "text-purple-600" },
                { icon: Clock, text: "Easy Returns", color: "text-orange-600" }
              ].map(({ icon: Icon, text, color }, i) => (
                <div key={i} className="flex items-center p-4 space-x-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                  <Icon className={`w-6 h-6 ${color}`} />
                  <span className="text-sm font-medium text-gray-900">{text}</span>
                </div>
              ))}
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h3 className="flex items-center text-xl font-bold text-gray-900">
                <Info className="mr-2 w-5 h-5 text-amber-600" />
                Specifications
              </h3>
              <div className="overflow-hidden bg-white rounded-2xl border border-gray-200">
                {Object.entries(item.specifications).map(([key, value], i) => (
                  <div key={i} className={`flex justify-between items-center px-6 py-4 ${
                    i !== Object.entries(item.specifications).length - 1 ? 'border-b border-gray-100' : ''
                  }`}>
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/90">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setZoomedImage(false)}
              className="flex absolute top-4 right-4 z-10 justify-center items-center w-12 h-12 text-white rounded-full backdrop-blur-sm transition-colors bg-white/20 hover:bg-white/30"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={item.images[selectedImage]}
              alt={item.name}
              className="object-contain w-full h-full rounded-2xl"
            />
            <div className="absolute bottom-4 left-1/2 px-4 py-2 text-sm text-white rounded-full -translate-x-1/2 bg-black/60">
              {selectedImage + 1} of {item.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;