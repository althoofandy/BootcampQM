import React from "react";

interface TopNavBarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  cartItemsCount?: number;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab = "products",
  setActiveTab = () => {},
  cartItemsCount = 0,
}) => {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Shop App</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-3 py-2 mx-1 rounded-md text-sm font-medium ${
                  activeTab === "products"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab("management")}
                className={`px-3 py-2 mx-1 rounded-md text-sm font-medium ${
                  activeTab === "management"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Product Management
              </button>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setActiveTab("cart")}
                className={`p-2 rounded-md ${
                  activeTab === "cart"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
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
              </button>
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="px-2 py-3 space-y-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
              activeTab === "products"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("management")}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
              activeTab === "management"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => setActiveTab("cart")}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
              activeTab === "cart"
                ? "bg-blue-100 text-blue-800"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Cart ({cartItemsCount})
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
