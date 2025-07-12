"use client";
import { Context } from "@/app/context/ContextProvider";
import { Moon, Sun } from "lucide-react";
import { useContext } from "react";

export default function Header() {
  const { theme, setTheme } = useContext(Context);
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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

  return (
    <header
      className={`${currentTheme.headerBg} border-b ${currentTheme.border}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div>
            <h1 className={`text-xl font-bold ${currentTheme.text}`}>
              S3 File Manager
            </h1>
            <p className={`text-sm ${currentTheme.textSecondary}`}>
              Manage your AWS S3 files with ease
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-colors ${currentTheme.buttonSecondary} border`}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
