"use client";

import { useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsNotificationsEnabled } from "@/state";
import { useUpdateUserMutation } from "@/state/api";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
  key?: string;
};

const Settings = () => {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isNotificationsEnabled = useAppSelector((state) => state.global.isNotificationsEnabled);
  const [updateUser] = useUpdateUserMutation();

  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("userName") || "User");
      setEmail(localStorage.getItem("userEmail") || "user@example.com");
    }
  }, []);

  const handleToggleChange = (setting: UserSetting) => {
    if (setting.key === "darkMode") {
      dispatch(setIsDarkMode(!isDarkMode));
    } else if (setting.key === "notification") {
      dispatch(setIsNotificationsEnabled(!isNotificationsEnabled));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUser({ name: username, email }).unwrap();
      localStorage.setItem("userName", username);
      localStorage.setItem("userEmail", email);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error("Failed to update settings:", err);
      alert("Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const userSettings: UserSetting[] = [
    { label: "Username", value: username, type: "text" },
    { label: "Email", value: email, type: "text" },
    { label: "Notification", value: isNotificationsEnabled, type: "toggle", key: "notification" },
    { label: "Dark Mode", value: isDarkMode, type: "toggle", key: "darkMode" },
    { label: "Language", value: "English", type: "text" },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-5">
        <Header name="User Settings" />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors duration-150 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg transition-colors">
          <thead className="bg-gray-800 dark:bg-gray-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting) => (
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors" key={setting.label}>
                <td className="py-2 px-4 text-gray-800 dark:text-gray-200">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(setting)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:border-blue-500 transition-colors w-64"
                      value={setting.value as string}
                      onChange={(e) => {
                        if (setting.label === "Username") setUsername(e.target.value);
                        else if (setting.label === "Email") setEmail(e.target.value);
                      }}
                      disabled={setting.label === "Language"} // Language remains static for now
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
