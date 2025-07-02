import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Star, Filter, Search, Clock, MapPin, CreditCard, Truck, CheckCircle, User, Phone, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  deliveryTime: string;
  seller: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface DeliveryAddress {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export const Shopping: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'upi' | 'netbanking'>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderConfirmationData, setOrderConfirmationData] = useState<{
    orderId: string;
    estimatedDelivery: string;
    totalAmount: number;
    deliveryBoy: {
      name: string;
      phone: string;
      location: string;
    };
  } | null>(null);

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️' },
    { id: 'fresh', name: 'Fresh Produce', icon: '🥬' },
    { id: 'pantry', name: 'Pantry Staples', icon: '🏺' },
    { id: 'spices', name: 'Spices & Herbs', icon: '🌿' },
    { id: 'equipment', name: 'Kitchen Tools', icon: '🔪' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      price: 399,
      originalPrice: 549,
      rating: 4.5,
      reviews: 128,
      image: '🍅',
      category: 'fresh',
      inStock: true,
      deliveryTime: '2-4 hours',
      seller: 'Fresh Farm Co.'
    },
    {
      id: '2',
      name: 'Premium Olive Oil',
      price: 1049,
      rating: 4.8,
      reviews: 256,
      image: '🫒',
      category: 'pantry',
      inStock: true,
      deliveryTime: 'Same day',
      seller: 'Mediterranean Oils'
    },
    {
      id: '3',
      name: 'Chef\'s Knife Set',
      price: 7299,
      originalPrice: 9999,
      rating: 4.9,
      reviews: 89,
      image: '🔪',
      category: 'equipment',
      inStock: true,
      deliveryTime: '1-2 days',
      seller: 'Kitchen Pro'
    },
    {
      id: '4',
      name: 'Himalayan Pink Salt',
      price: 749,
      rating: 4.6,
      reviews: 174,
      image: '🧂',
      category: 'spices',
      inStock: true,
      deliveryTime: 'Same day',
      seller: 'Spice World'
    },
    {
      id: '5',
      name: 'Fresh Basil',
      price: 299,
      rating: 4.3,
      reviews: 67,
      image: '🌿',
      category: 'fresh',
      inStock: false,
      deliveryTime: '2-4 hours',
      seller: 'Herb Garden'
    },
    {
      id: '6',
      name: 'Artisan Coffee Beans',
      price: 1399,
      rating: 4.7,
      reviews: 203,
      image: '☕',
      category: 'beverages',
      inStock: true,
      deliveryTime: '1-2 days',
      seller: 'Roast Masters'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddressChange = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = () => {
    // Validate address
    const requiredFields: (keyof DeliveryAddress)[] = ['fullName', 'phoneNumber', 'address', 'city', 'state', 'pincode'];
    const isValid = requiredFields.every(field => deliveryAddress[field] && deliveryAddress[field].trim() !== '');
    
    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    
    // Generate order confirmation data
    const deliveryBoys = [
      { name: 'Raj Kumar', phone: '+91 98765 43210', location: 'Near City Mall' },
      { name: 'Amit Singh', phone: '+91 87654 32109', location: 'Main Market Area' },
      { name: 'Rohit Sharma', phone: '+91 76543 21098', location: 'Central Square' },
      { name: 'Vikash Gupta', phone: '+91 65432 10987', location: 'Bus Stand' }
    ];
    
    const randomDeliveryBoy = deliveryBoys[Math.floor(Math.random() * deliveryBoys.length)];
    const totalAmount = getTotalPrice();
    const orderId = 'ORD' + Date.now().toString().slice(-6);
    
    // Calculate estimated delivery time (30-60 minutes from now)
    const deliveryMinutes = Math.floor(Math.random() * 30) + 30;
    const estimatedTime = new Date(Date.now() + deliveryMinutes * 60000);
    const estimatedDelivery = estimatedTime.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });

    setTimeout(() => {
      setOrderConfirmationData({
        orderId,
        estimatedDelivery,
        totalAmount,
        deliveryBoy: randomDeliveryBoy
      });
      setShowOrderConfirmation(true);
      setOrderPlaced(false);
      setCart([]);
      setShowCart(false);
      setShowCheckout(false);
    }, 2000);
  };

  // Checkout Page
  if (showCheckout) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Truck className="w-7 h-7 mr-3 text-orange-600" />
              Checkout
            </h1>
            <button
              onClick={() => setShowCheckout(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Cart
            </button>
          </div>

          {orderPlaced ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Order...</h3>
              <p className="text-gray-600">Please wait while we confirm your order.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Delivery Address Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-orange-600" />
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={deliveryAddress.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={deliveryAddress.phoneNumber}
                    onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <textarea
                    placeholder="Address *"
                    value={deliveryAddress.address}
                    onChange={(e) => handleAddressChange('address', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent md:col-span-2"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={deliveryAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={deliveryAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={deliveryAddress.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Landmark (Optional)"
                    value={deliveryAddress.landmark}
                    onChange={(e) => handleAddressChange('landmark', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-orange-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💵</span>
                      <div>
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when your order arrives</p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💳</span>
                      <div>
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                        <p className="text-sm text-gray-600">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      <div>
                        <p className="font-semibold text-gray-900">UPI</p>
                        <p className="text-sm text-gray-600">PhonePe, GooglePay, Paytm</p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="netbanking"
                      checked={paymentMethod === 'netbanking'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'netbanking')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏦</span>
                      <div>
                        <p className="font-semibold text-gray-900">Net Banking</p>
                        <p className="text-sm text-gray-600">All major banks supported</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Items ({getTotalItems()})</span>
                    <span>₹{getTotalPrice().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span>₹{getTotalPrice().toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-red-700 transition-all"
              >
                Place Order - ₹{getTotalPrice().toFixed(0)}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Cart Page
  if (showCart) {
    return (
      <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-7 h-7 mr-3 text-orange-600" />
              Shopping Cart ({getTotalItems()} items)
            </h1>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some delicious ingredients to get started!</p>
              <button
                onClick={() => setShowCart(false)}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{item.image}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.seller}</p>
                        <p className="text-lg font-bold text-gray-900">₹{item.price.toFixed(0)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-semibold text-gray-900">Total: ₹{getTotalPrice().toFixed(0)}</span>
                  <div className="flex space-x-3">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      Save for Later
                    </button>
                    <button 
                      onClick={() => setShowCheckout(true)}
                      className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main Shopping Page
  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 md:pb-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
              <ShoppingCart className="w-8 h-8 mr-3 text-orange-600" />
              Recipe Market
            </h1>
            <p className="text-gray-600">Get fresh ingredients and cooking tools delivered to your door!</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold"
          >
            <ShoppingCart className="w-5 h-5 mr-2 inline" />
            Cart ({getTotalItems()})
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for ingredients, tools, or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-auto space-x-4 mb-8 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Featured Deal */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">🎉 Daily Deal</h2>
            <p className="opacity-90 mb-4">Get 30% off on all organic vegetables today only!</p>
            <button className="bg-white text-green-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </div>
          <div className="hidden md:block text-6xl opacity-20">🥕</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{product.image}</span>
                {!product.inStock && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.seller}</p>
              
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews})</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(0)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(0)}</span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {product.deliveryTime}
                </div>
              </div>
              
              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  product.inStock
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && orderConfirmationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600">Your order has been placed successfully</p>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Order ID</span>
                  <span className="text-sm font-bold text-gray-900">{orderConfirmationData.orderId}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-green-600">₹{orderConfirmationData.totalAmount.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Estimated Delivery</span>
                  <span className="text-sm font-bold text-orange-600">{orderConfirmationData.estimatedDelivery}</span>
                </div>
              </div>

              {/* Delivery Boy Details */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Your Delivery Partner
                </h3>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{orderConfirmationData.deliveryBoy.name}</p>
                      <p className="text-sm text-gray-600">Delivery Executive</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-900">{orderConfirmationData.deliveryBoy.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600">Currently near {orderConfirmationData.deliveryBoy.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => {
                    setShowOrderConfirmation(false);
                    // You can add order tracking functionality here
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Track Order
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowOrderConfirmation(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
