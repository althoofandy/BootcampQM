/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../feature/product.slice.js";
import { ProductFormType, ProductType } from "../types/product.type.js";
import TopNavBar from "../components/TopNavBar";

function App() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: any) => state.products
  );

  // State for modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<ProductFormType | null>(
    null
  );

  // State for tab navigation
  const [activeTab, setActiveTab] = useState("products");

  // Form data state
  const [formData, setFormData] = useState<ProductFormType>({
    id: "",
    name: "",
    stock: 0,
    price: 0,
    category: "",
    description: "",
    image: "",
    isCart: false,
  });

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getAllProducts() as any);
  }, [dispatch]);

  // Form input change handler
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock" ? parseFloat(value) || 0 : value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      await dispatch(updateProduct(formData) as any);
      dispatch(getAllProducts() as any);
    } else {
      dispatch(createProduct(formData) as any);
    }
    resetForm();
  };

  // Product deletion handler
  const handleDelete = async () => {
    if (currentProduct) {
      await dispatch(deleteProduct(currentProduct.id) as any);
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    }
  };

  // Add to cart handler
  const handleAddToCart = async (product: ProductType) => {
    const updatedProduct = { ...product, isCart: true };
    await dispatch(updateProduct(updatedProduct) as any);
    dispatch(getAllProducts() as any);
  };

  // Remove from cart handler
  const handleRemoveFromCart = async (product: ProductType) => {
    const updatedProduct = { ...product, isCart: false };
    await dispatch(updateProduct(updatedProduct) as any);
    dispatch(getAllProducts() as any);
  };

  // Modal control functions
  const openEditModal = (product: ProductFormType) => {
    setCurrentProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: ProductFormType) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (product: ProductFormType) => {
    setCurrentProduct(product);
    setIsViewModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      stock: 0,
      price: 0,
      category: "",
      description: "",
      image: "",
      isCart: false,
    });
    setIsModalOpen(false);
  };

  // To prevent modal backdrop clicks from closing the modal
  const preventBackdropClose = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Price formatting function
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined || isNaN(price)) {
      return "0.00";
    }
    return price.toFixed(2);
  };

  // Calculate cart items count
  const cartItemsCount = products
    ? products.filter((p: ProductType) => p.isCart).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartItemsCount={cartItemsCount}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>
              {error.message || "An error occurred while fetching products."}
            </p>
          </div>
        )}

        {/* Products Display Tab */}
        {activeTab === "products" && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              All Products
            </h2>
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product: ProductType) => (
                  <div
                    key={product.id}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => openViewModal(product)}
                    >
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={product.image || "/api/placeholder/300/200"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.category}
                        </p>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                          ${formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 flex justify-between">
                      {!product.isCart ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          disabled={product.stock <= 0}
                        >
                          {product.stock > 0 ? (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
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
                              Add to Cart
                            </>
                          ) : (
                            "Out of Stock"
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRemoveFromCart(product)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Remove
                        </button>
                      )}
                      <span className="text-sm text-gray-500 self-center">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <p className="text-gray-500">No products available.</p>
              </div>
            )}
          </div>
        )}

        {/* Product Management Tab */}
        {activeTab === "management" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Product Management
              </h2>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Product
              </button>
            </div>

            {/* Product List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {products && products.length > 0 ? (
                  products.map((product: ProductType) => (
                    <li
                      key={product?.id}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        {product?.image && (
                          <div className="flex-shrink-0 h-16 w-16 mr-4">
                            <img
                              className="h-16 w-16 rounded-md object-cover"
                              src={product?.image}
                              alt={product?.name}
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {product?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ${formatPrice(product?.price)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product?.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(product)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-md hover:bg-yellow-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="px-3 py-1 bg-red-200 text-red-700 rounded-md hover:bg-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-6 py-12 text-center text-gray-500">
                    {!loading && (
                      <p>No products found. Add your first product!</p>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === "cart" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {products &&
              products.filter((p: ProductType) => p.isCart).length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {products
                    .filter((product: ProductType) => product.isCart)
                    .map((product: ProductType) => (
                      <li
                        key={product?.id}
                        className="px-6 py-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {product?.image && (
                            <div className="flex-shrink-0 h-16 w-16 mr-4">
                              <img
                                className="h-16 w-16 rounded-md object-cover"
                                src={product?.image}
                                alt={product?.name}
                              />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {product?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${formatPrice(product?.price)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {product?.category}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(product)}
                          className="px-3 py-1 bg-red-200 text-red-700 rounded-md hover:bg-red-300"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="px-6 py-12 text-center text-gray-500">
                  <p>Your cart is empty.</p>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {products &&
              products.filter((p: ProductType) => p.isCart).length > 0 && (
                <div className="mt-6 bg-white p-6 shadow sm:rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Order Summary
                  </h3>
                  <div className="flex justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      $
                      {formatPrice(
                        products
                          .filter((p: ProductType) => p.isCart)
                          .reduce(
                            (sum: number, p: ProductType) =>
                              sum + (p.price || 0),
                            0
                          )
                      )}
                    </p>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full bg-blue-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
          </div>
        )}
      </main>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full"
            onClick={preventBackdropClose}
          >
            <form onSubmit={handleSubmit}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {currentProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price || 0}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    id="stock"
                    value={formData.stock || 0}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    value={formData.category || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    id="image"
                    value={formData.image || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {currentProduct ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {isViewModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full"
            onClick={preventBackdropClose}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {currentProduct?.image && (
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-32 w-32 sm:mx-0 sm:h-32 sm:w-32">
                    <img
                      className="h-32 w-32 rounded-md object-cover"
                      src={currentProduct?.image}
                      alt={currentProduct?.name}
                    />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-xl font-medium text-gray-900">
                    {currentProduct?.name}
                  </h3>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-gray-900">
                      ${formatPrice(currentProduct?.price)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Stock: {currentProduct?.stock || 0}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Category: {currentProduct?.category}
                    </p>
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Description:
                      </h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {currentProduct?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
              {!currentProduct.isCart ? (
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(currentProduct as any);
                    setIsViewModalOpen(false);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={currentProduct.stock <= 0}
                >
                  {currentProduct.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveFromCart(currentProduct as any);
                    setIsViewModalOpen(false);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Remove from Cart
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full"
            onClick={preventBackdropClose}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Delete Product
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{currentProduct?.name}"?
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
