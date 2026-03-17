"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed, dismissNotification, clearAllNotifications } from "@/state";
import { Bell, Menu, Moon, Settings, Sun, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isNotificationsEnabled = useAppSelector((state) => state.global.isNotificationsEnabled) ?? true;
  const notifications = useAppSelector((state) => state.global.notifications) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex justify-between items-center w-full mb-7">
      {/* LEFT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <button
          className="px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-4 h-4 dark:text-gray-300" />
        </button>

        <div className="relative">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-50 md:w-60 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer hover:text-blue-500"
            >
              <Search className="text-gray-500 dark:text-gray-400" size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex justify-between items-center gap-5">
        <div className="hidden md:flex justify-between items-center gap-5">
          <div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="cursor-pointer text-yellow-400" size={24} />
              ) : (
                <Moon className="cursor-pointer text-gray-500" size={24} />
              )}
            </button>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="cursor-pointer text-gray-500 dark:text-gray-400" size={24} />
              {isNotificationsEnabled && unreadCount > 0 && (
                <span className="absolute -top-0 -right-0 inline-flex items-center justify-center px-[0.4rem] py-1 text-xs font-semibold leading-none text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => dispatch(clearAllNotifications())}
                      className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {!isNotificationsEnabled ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Notifications are disabled</p>
                      <Link href="/settings" className="text-xs text-blue-500 hover:underline" onClick={() => setIsNotifOpen(false)}>
                        Enable in Settings
                      </Link>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${
                          !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 dark:text-gray-200">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        <button
                          onClick={() => dispatch(dismissNotification(notification.id))}
                          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <hr className="w-0 h-7 border border-solid border-l border-gray-300 dark:border-gray-600 mx-3" />
          <div className="flex items-center gap-3 cursor-pointer">
            <Image
              src="https://s3inventorymanagementfinal.s3.ap-south-1.amazonaws.com/profile.jpg"
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full h-full object-cover"
            />
            <span className="font-semibold dark:text-gray-100">Ed Roh</span>
          </div>
        </div>
        <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
