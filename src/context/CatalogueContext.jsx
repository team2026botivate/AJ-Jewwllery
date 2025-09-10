import { createContext, useContext, useState, useEffect } from 'react';

const CatalogueContext = createContext();

export const useCatalogue = () => {
  const context = useContext(CatalogueContext);
  if (!context) {
    throw new Error('useCatalogue must be used within a CatalogueProvider');
  }
  return context;
};

export const CatalogueProvider = ({ children }) => {
  // Initial jewellery data
  const [jewellery, setJewellery] = useState([
    // Animals Category
    {
      id: 1,
      category: 'Animals',
      name: 'Golden Elephant Pendant',
      description: 'Beautiful handcrafted golden elephant pendant symbolizing wisdom and strength. Features intricate detailing and a secure gold chain.',
      price: 1899,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 15
    },
    {
      id: 2,
      category: 'Animals',
      name: 'Silver Lion Ring',
      description: 'Majestic silver lion ring with intricate detailing and ruby eyes. Crafted with premium sterling silver and genuine gemstones.',
      price: 2599,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 8
    },
    {
      id: 3,
      category: 'Animals',
      name: 'Gold Butterfly Necklace',
      description: 'Delicate gold butterfly necklace with emerald accents, perfect for elegance. Lightweight design with secure clasp.',
      price: 3299,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 12
    },
    {
      id: 4,
      category: 'Animals',
      name: 'Diamond Peacock Brooch',
      description: 'Exquisite diamond peacock brooch with colorful gemstone tail feathers. A stunning piece for special occasions.',
      price: 4999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 5
    },

    // Arabic Style 21k Category
    {
      id: 5,
      category: 'Arabic Style 21k',
      name: 'Arabic Gold Chain',
      description: 'Traditional 21k gold Arabic style chain with intricate Islamic patterns.',
      price: 8999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 6
    },
    {
      id: 6,
      category: 'Arabic Style 21k',
      name: '21k Gold Arabic Ring',
      description: 'Authentic 21k gold ring with Arabic calligraphy and traditional design.',
      price: 3999,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'
      ],
      quantity: 10
    },

    // Bracelets Category
    {
      id: 7,
      category: 'Bracelets',
      name: 'Gold Chain Bracelet',
      description: 'Classic gold chain bracelet with lobster clasp for everyday elegance.',
      price: 1299,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 20
    },
    {
      id: 8,
      category: 'Bracelets',
      name: 'Diamond Tennis Bracelet',
      description: 'Sparkling diamond tennis bracelet with pave setting and white gold.',
      price: 15999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 3
    },
    {
      id: 9,
      category: 'Bracelets',
      name: 'Silver Bangle Set',
      description: 'Set of three sterling silver bangles with engraved patterns.',
      price: 899,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 25
    },

    // Mine Category (assuming this is a custom category)
    {
      id: 10,
      category: 'Mine',
      name: 'Emerald Cut Diamond Ring',
      description: 'Stunning emerald cut diamond in platinum setting with side stones.',
      price: 24999,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 2
    },
    {
      id: 11,
      category: 'Mine',
      name: 'Ruby and Diamond Necklace',
      description: 'Luxurious ruby and diamond necklace with gold chain and pendant.',
      price: 18999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 4
    },

    // SET Category
    {
      id: 12,
      category: 'SET',
      name: 'Diamond Earrings and Necklace Set',
      description: 'Matching diamond earrings and necklace set in white gold.',
      price: 8999,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 7
    },
    {
      id: 13,
      category: 'SET',
      name: 'Pearl Jewelry Set',
      description: 'Complete pearl jewelry set including necklace, earrings, and bracelet.',
      price: 5999,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 9
    },

    // Pendant Category
    {
      id: 14,
      category: 'Pendant',
      name: 'Heart Diamond Pendant',
      description: 'Delicate heart-shaped diamond pendant on gold chain.',
      price: 2999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 18
    },
    {
      id: 15,
      category: 'Pendant',
      name: 'Cross Pendant',
      description: 'Elegant gold cross pendant with small diamond accents.',
      price: 1899,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 22
    },
    {
      id: 16,
      category: 'Pendant',
      name: 'Initial Pendant',
      description: 'Personalized initial pendant in gold with birthstone option.',
      price: 1299,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 30
    },

    // Man Collection Category
    {
      id: 17,
      category: 'Man Collection',
      name: 'Gold Cufflinks',
      description: 'Classic gold cufflinks with engraved patterns for formal occasions.',
      price: 2499,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 14
    },
    {
      id: 18,
      category: 'Man Collection',
      name: 'Silver Tie Pin',
      description: 'Elegant silver tie pin with small diamond accent.',
      price: 899,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 16
    },
    {
      id: 19,
      category: 'Man Collection',
      name: 'Gold Watch Chain',
      description: 'Traditional gold watch chain with vintage styling.',
      price: 3999,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 8
    },

    // Rings Category
    {
      id: 20,
      category: 'Rings',
      name: 'Gold Diamond Ring',
      description: 'Beautiful 18k gold ring with premium diamonds. Perfect for special occasions.',
      price: 2999,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 12
    },
    {
      id: 21,
      category: 'Rings',
      name: 'Platinum Wedding Band',
      description: 'Classic platinum wedding band with comfort fit design.',
      price: 4999,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 6
    },
    {
      id: 22,
      category: 'Rings',
      name: 'Silver Promise Ring',
      description: 'Delicate silver promise ring with heart-shaped birthstone.',
      price: 1299,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 15
    },

    // Earrings Category
    {
      id: 23,
      category: 'Earrings',
      name: 'Silver Stud Earrings',
      description: 'Elegant silver stud earrings with crystal accents. Comfortable and stylish.',
      price: 499,
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 28
    },
    {
      id: 24,
      category: 'Earrings',
      name: 'Gold Hoop Earrings',
      description: 'Classic gold hoop earrings in various sizes for different styles.',
      price: 1899,
      image: 'https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 20
    },
    {
      id: 25,
      category: 'Earrings',
      name: 'Diamond Stud Earrings',
      description: 'Timeless diamond stud earrings in white gold setting.',
      price: 7999,
      image: 'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=400',
      quantity: 10
    }
  ]);

  // Bookings data
  const [bookings, setBookings] = useState([]);

  // Users data for admin management
  const [users, setUsers] = useState([
    {
      id: 'user',
      name: 'Regular User',
      password: 'user123',
      status: 'active'
    }
  ]);

  // Add new jewellery
  const addJewellery = (newJewellery) => {
    setJewellery([...jewellery, { ...newJewellery, id: Date.now() }]);
  };

  // Delete jewellery
  const deleteJewellery = (id) => {
    setJewellery(jewellery.filter(item => item.id !== id));
  };

  // Update user status
  const updateUserStatus = (userId, status) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status } : user
    ));
  };

  // Add booking
  const addBooking = (booking) => {
    setBookings([...bookings, { ...booking, id: Date.now(), bookingDate: new Date().toISOString() }]);
  };

  // Get bookings for current user
  const getUserBookings = (userId) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const value = {
    jewellery,
    bookings,
    users,
    addJewellery,
    updateUserStatus,
    addBooking,
    getUserBookings
  };

  return (
    <CatalogueContext.Provider value={value}>
      {children}
    </CatalogueContext.Provider>
  );
};
