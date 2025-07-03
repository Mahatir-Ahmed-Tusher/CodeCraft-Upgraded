"use client";

import { useApp } from "@/contexts/AppContext";
import { useTranslation } from "@/utils/translations";
import { 
  Cog6ToothIcon, 
  XMarkIcon, 
  LanguageIcon,
  SunIcon,
  MoonIcon,
  TrashIcon,
  FolderIcon,
  QuestionMarkCircleIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function Sidebar() {
  const { 
    sidebarOpen, 
    toggleSidebar, 
    language, 
    setLanguage, 
    theme, 
    toggleTheme,
    clearAllData,
    projects 
  } = useApp();
  const t = useTranslation(language);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    if (showClearConfirm) {
      clearAllData();
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 5000);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? 'lg:w-80' : 'lg:w-0 lg:overflow-hidden'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Link 
              href="/"
              onClick={toggleSidebar}
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              CodeCraft
            </Link>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Settings Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cog6ToothIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <h3 className="font-medium text-gray-900 dark:text-white">{t.settings}</h3>
              </div>
              
              <div className="space-y-4 ml-7">
                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <LanguageIcon className="h-4 w-4 inline mr-1" />
                    {t.language}
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as "en" | "bn")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">{t.english}</option>
                    <option value="bn">{t.bengali}</option>
                  </select>
                </div>

                {/* Theme Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {theme === "light" ? (
                      <SunIcon className="h-4 w-4 inline mr-1" />
                    ) : (
                      <MoonIcon className="h-4 w-4 inline mr-1" />
                    )}
                    {t.theme}
                  </label>
                  <button
                    onClick={toggleTheme}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    {theme === "light" ? t.lightTheme : t.darkTheme}
                  </button>
                </div>

                {/* Clear All Data */}
                <div>
                  <button
                    onClick={handleClearData}
                    className={`w-full px-3 py-2 rounded-lg transition-colors text-left flex items-center gap-2 ${
                      showClearConfirm 
                        ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <TrashIcon className="h-4 w-4" />
                    {showClearConfirm ? t.confirm : t.clearAllData}
                  </button>
                  {showClearConfirm && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {t.confirmClearData}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* My Projects */}
            <div>
              <Link 
                href="/projects"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                onClick={toggleSidebar}
              >
                <FolderIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{t.myProjects}</span>
                <span className="ml-auto text-sm text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {projects.length}
                </span>
              </Link>
            </div>

            {/* Help Center */}
            <div>
              <Link 
                href="/help"
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
                onClick={toggleSidebar}
              >
                <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">{t.helpCenter}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function SidebarToggle() {
  const { toggleSidebar } = useApp();

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle sidebar"
    >
      <Bars3Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    </button>
  );
}