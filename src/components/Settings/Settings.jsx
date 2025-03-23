"use client";

import React, { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [platformName, setPlatformName] = useState("");
  const [platformDescription, setPlatformDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const tabs = [
    "General", "Payment", "User", "Session", "Notification", "Security", "Backup"
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-4xl bg-white p-8">
        {/* Tabs Container */}
        <div className="bg-[#D9D9D9] rounded-t-2xl px-4">
          <div className="flex flex-wrap gap-x-6 border-b border-gray-300">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 text-sm font-medium ${
                  activeTab === tab
                    ? "text-black"
                    : "text-black hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        

        {/* Content Area */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">1. GENERAL SETTINGS</h2>
          
          {/* Platform Name */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Platform Name
            </label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400"
              placeholder="Enter Platform Name"
            />
          </div>

          {/* Platform Description */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Platform Description
            </label>
            <textarea
              value={platformDescription}
              onChange={(e) => setPlatformDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 h-32 placeholder-gray-400"
              placeholder="Enter Platform Description"
            />
          </div>

          {/* Logo Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Logo
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-300 border border-gray-400">
                Choose File
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <span className="text-sm text-gray-500">
                {selectedFile || "No File chosen"}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-12">
            <button className="bg-red-600 text-white px-14 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;