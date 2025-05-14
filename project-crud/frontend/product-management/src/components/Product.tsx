/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../feature/product.slice";
import { startTransaction } from "../feature/transaction.slice";
import TopNavBar from "../components/TopNavBar";

function ProductListing() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: any) => state.products
  );
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]); // Array to store cart items
  const [quantity, setQuantity] = useState(1); // Quantity for adding products
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for transaction submission

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getAllProducts() as any);
  }, [dispatch]);

  // Format price to Indonesian Rupiah
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Calculate total price of items in cart
  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const handleViewDetail = (product: any) => {
    setSelectedProduct(product);
    setQuantity(1); // Reset quantity when viewing a new product
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddToCart = (product: any, qty: number = 1) => {
    // Check if product already exists in cart
    const existingItem = cartItems.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      // Update quantity if product already exists
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        )
      );
    } else {
      // Add new product to cart
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: qty,
        },
      ]);
    }

    // Close detail modal if open
    if (showDetailModal) {
      handleCloseModal();
    }

    // Show a success message or notification
    alert(`Added ${qty} ${product.name} to cart`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) return; // Prevent negative quantities

    setCartItems(
      cartItems.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  const handleSubmitTransaction = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        totalPrice: calculateTotalPrice(),
        products: cartItems,
      };

      console.log("cek product payload :", payload);

      // Dispatch transaction and wait for the result
      const response = await dispatch(startTransaction(payload) as any);

      // Check if the response is fulfilled and contains data
      if (
        response?.payload?.status === 200 ||
        response?.payload?.status === 201
      ) {
        alert("Transaction completed successfully!");
        setCartItems([]);
        setShowCartModal(false);
      } else {
        // Handle API errors
        const errorMessage =
          response?.payload?.message || "Transaction failed.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      alert("Failed to complete transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
    dispatch(getAllProducts() as any);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={() => {}}
      />

      {/* Cart Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowCartModal(true)}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error.message ||
                    "Failed to load products. Please try again."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Our Products
            </h2>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any) => (
                <div
                  key={product.id}
                  className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="bg-gray-200 overflow-hidden relative">
                    <img
                      src={product.image || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock < 5 && (
                      <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Stock: {product.stock}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2 h-10">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-2 mt-auto">
                    <button
                      onClick={() => handleViewDetail(product)}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity"
                onClick={handleCloseModal}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl leading-6 font-bold text-gray-900">
                          {selectedProduct.name}
                        </h3>
                        <button
                          onClick={handleCloseModal}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Image */}
                        <div className="bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={
                              selectedProduct.image ||
                              "/placeholder-product.jpg"
                            }
                            alt={selectedProduct.name}
                            className="w-full h-64 object-cover object-center"
                          />
                        </div>

                        {/* Product Details */}
                        <div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                              Category
                            </p>
                            <p className="font-medium">
                              {selectedProduct.category?.name ||
                                "Uncategorized"}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Price</p>
                            <p className="text-2xl font-bold text-indigo-600">
                              {formatPrice(selectedProduct.price)}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Stock</p>
                            <p className="font-medium flex items-center">
                              {selectedProduct.stock} units
                              {selectedProduct.stock < 5 && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Low Stock
                                </span>
                              )}
                            </p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">
                              Description
                            </p>
                            <p className="text-gray-700">
                              {selectedProduct.description}
                            </p>
                          </div>

                          {/* Quantity selector */}
                          <div className="mt-4">
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Quantity
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <button
                                type="button"
                                onClick={() =>
                                  setQuantity(Math.max(1, quantity - 1))
                                }
                                className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-l-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                name="quantity"
                                id="quantity"
                                min="1"
                                value={quantity}
                                onChange={(e) =>
                                  setQuantity(
                                    Math.max(1, parseInt(e.target.value) || 1)
                                  )
                                }
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none text-center border-gray-300"
                              />
                              <button
                                type="button"
                                onClick={() => setQuantity(quantity + 1)}
                                className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(selectedProduct, quantity)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              {/* Background overlay */}
              <div
                className="fixed inset-0 transition-opacity"
                onClick={() => setShowCartModal(false)}
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal panel */}
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full relative">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl leading-6 font-bold text-gray-900">
                          Shopping Cart
                        </h3>
                        <button
                          onClick={() => setShowCartModal(false)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="text-center py-8">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">
                            Your cart is empty
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Start adding some products to your cart.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Product
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Price
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Quantity
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Total
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative px-6 py-3"
                                  >
                                    <span className="sr-only">Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                  <tr key={item.productId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        {item.name}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-500">
                                        {formatPrice(item.price)}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.productId,
                                              item.qty - 1
                                            )
                                          }
                                          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                                        >
                                          <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M20 12H4"
                                            />
                                          </svg>
                                        </button>
                                        <span className="mx-2 text-gray-700">
                                          {item.qty}
                                        </span>
                                        <button
                                          onClick={() =>
                                            handleUpdateQuantity(
                                              item.productId,
                                              item.qty + 1
                                            )
                                          }
                                          className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                                        >
                                          <svg
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatPrice(item.price * item.qty)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={() =>
                                          handleRemoveFromCart(item.productId)
                                        }
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        Remove
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="mt-8 border-t border-gray-200 pt-6">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <p>Subtotal</p>
                              <p>{formatPrice(calculateTotalPrice())}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500">
                              Shipping and taxes calculated at checkout.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleSubmitTransaction}
                    disabled={isSubmitting || cartItems.length === 0}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                      cartItems.length === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Submit Transaction"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCartModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductListing;
