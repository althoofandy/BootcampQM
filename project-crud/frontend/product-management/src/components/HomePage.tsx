import { useState } from "react";
import TopNavBar from "./TopNavBar";
const HomePage = () => {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const [activeTab, setActiveTab] = useState("home");
  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={() => {}}
      />
      <div className="mt-24"></div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Welcome to your Dashboard
      </h1>
      <p className="text-gray-600">You're successfully logged in!</p>
    </div>
  );
};

export default HomePage;
