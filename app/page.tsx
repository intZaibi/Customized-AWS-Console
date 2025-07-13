"use client";
import React, { useContext, useState } from "react";
import { FileText, Folder } from "lucide-react";
import { FileItem, Tab } from "@/utils/types";
import Tabs from "@/components/Tabs";
import Header from "@/components/Header";
import { Context } from "./context/ContextProvider";

const S3FileManager: React.FC = () => {
  const { theme } = useContext(Context);
  const [activeTab, setActiveTab] = useState<Tab>("files");

  const themeClasses = {
    light: {
      bg: "bg-gray-50",
      cardBg: "bg-white",
      headerBg: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      tabActive: "border-blue-500 text-blue-600",
      tabInactive:
        "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonSecondary:
        "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
    },
    dark: {
      bg: "bg-slate-900",
      cardBg: "bg-slate-800",
      headerBg: "bg-slate-800",
      text: "text-white",
      textSecondary: "text-gray-300",
      border: "border-slate-700",
      tabActive: "border-blue-400 text-blue-400",
      tabInactive:
        "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      buttonSecondary:
        "bg-slate-700 hover:bg-slate-600 text-gray-300 border-slate-600",
    },
  };

  const currentTheme = themeClasses[theme];

  const tabs = [
    { id: "files" as Tab, label: "File Management", icon: FileText },
    { id: "buckets" as Tab, label: "Buckets", icon: Folder },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors`}>
      {/* Header */}
      <Header />

      {/* Navigation Tabs */}
      <nav className={`${currentTheme.headerBg} border-b ${currentTheme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? currentTheme.tabActive
                      : currentTheme.tabInactive
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {<Tabs activeTab={activeTab} currentTheme={currentTheme} />}
      </main>
    </div>
  );
};

export default S3FileManager;
