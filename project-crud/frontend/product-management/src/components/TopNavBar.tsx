/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Home,
  Package,
  LogOut,
  Menu,
  X,
  Edit,
  Grid,
  Users,
} from "lucide-react";
import { setToken } from "../feature/auth.slice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface TopNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const TopNavBar = ({ activeTab, onTabChange, onLogout }: TopNavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cookies = Cookies.get("token"); // atau dari localStorage/session
  if (!cookies) return;

  const decoded: any = jwtDecode(cookies);

  let role = "";
  let name = "";
  if (decoded?.___) {
    const payloadStr = atob(decoded.___);
    const userData = JSON.parse(payloadStr);
    role = userData.role;
    name = userData.name;
  }

  const getTabs = () => {
    const commonTabs = [
      { id: "home", name: "Home", icon: Home },
      { id: "products", name: "Products", icon: Package },
    ];

    // Additional tabs for admin role
    const adminTabs = [
      { id: "edit-products", name: "Edit Products", icon: Edit },
      { id: "categories", name: "Categories", icon: Grid },
      { id: "user-management", name: "User Management", icon: Users },
    ];

    return role === "admin" ? [...commonTabs, ...adminTabs] : commonTabs;
  };

  const tabs = getTabs();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    const path = tab === "home" ? "/" : `/${tab}`;
    navigate(path);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    dispatch(setToken(null));
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <span className="text-white font-bold text-xl">MyStore</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "border-white text-white"
                        : "border-transparent text-indigo-100 hover:border-indigo-300 hover:text-white"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200`}
                  >
                    <Icon className="mr-1 h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side menu items */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Display user role badge */}
            <span className="bg-indigo-800 text-indigo-100 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {role === "admin" ? "Admin" : "Cashier"}
            </span>

            {/* User menu dropdown */}
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={toggleUserMenu}
                  className="bg-indigo-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold">
                    {name}
                  </div>
                </button>
              </div>

              {/* User menu dropdown panel */}
              {showUserMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Signed in as
                  </div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 truncate border-b border-gray-100">
                    {name} ({role})
                  </div>
                  <a
                    href="#profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Your Profile
                  </a>
                  <a
                    href="#settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleTabChange(tab.id);
                    onTabChange(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`${
                    activeTab === tab.id
                      ? "bg-indigo-700 text-white"
                      : "text-indigo-100 hover:bg-indigo-500 hover:text-white"
                  } block pl-3 pr-4 py-2 border-l-4 ${
                    activeTab === tab.id ? "border-white" : "border-transparent"
                  } text-base font-medium w-full text-left flex items-center`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Mobile user menu */}
          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-800 font-bold text-lg">
                  {name}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{name}</div>
                <div className="text-sm font-medium text-indigo-200">
                  {role === "admin" ? "Administrator" : "Cashier"}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="#profile"
                className="block px-4 py-2 text-base font-medium text-indigo-100 hover:text-white hover:bg-indigo-500 flex items-center"
              >
                <User className="mr-3 h-5 w-5" />
                Your Profile
              </a>
              <a
                href="#settings"
                className="block px-4 py-2 text-base font-medium text-indigo-100 hover:text-white hover:bg-indigo-500 flex items-center"
              >
                <svg
                  className="mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </a>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-base font-medium text-red-300 hover:text-white hover:bg-red-500 flex items-center"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNavBar;
