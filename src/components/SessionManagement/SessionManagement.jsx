"use client";

import React, { useState } from "react";
import { Download, Search } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";

const SessionManagement = () => {
  // State for active session type (Action Session or Session History)
  const [activeSession, setActiveSession] = useState("Action Session");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Dummy session data (similar to user data structure)
  const dummySessions = [
    { sessionId: "#01", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Completed" },
    { sessionId: "#02", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Ongoing" },
    { sessionId: "#03", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Completed" },
    { sessionId: "#04", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Completed" },
    { sessionId: "#05", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Canceled" },
    { sessionId: "#06", user: "Ivan", expert: "Jane Smith", date: "2025-02-26 ", time: "10:00 AM", status: "Completed" },
  ];

  // Filter sessions based on status
  const filteredSessions = dummySessions.filter((session) => {
    if (statusFilter === "All Status") return true;
    return session.status === statusFilter;
  });

  // Handle dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle status selection
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setIsDropdownOpen(false); // Close dropdown after selecting
  };

  return (
    <div className="flex justify-center w-full min-h-screen p-6 bg-white overflow-x-scroll">
      <div className="w-full max-w-screen-xl px-4">
        <h1 className="text-2xl font-bold mb-4 text-[#191919]">SESSION MANAGEMENT</h1>

        {/* Buttons for Action Session and Session History */}
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setActiveSession("Action Session")}
            className={`py-2 px-6 ${activeSession === "Action Session" ? "bg-black text-white" : "bg-white text-black shadow-lg"}`}
          >
            Action Session
          </button>
          <button
            onClick={() => setActiveSession("Session History")}
            className={`py-2 px-6 ${activeSession === "Session History" ? "bg-black text-white" : "bg-white text-black shadow-lg"}`}
          >
            Session History
          </button>
        </div>

        {/* Search Bar and Status Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
          {/* Search Bar */}
          <div className="relative w-full sm:w-1/3">
            <div>
              <h2 className="text-[#191919]">Search by Session</h2>
            </div>
            <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
              <Search className="m-1 text-white" size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-xl border border-gray-300 w-full bg-gray-100 text-gray-700 focus:outline-none pl-10"
              placeholder="Search by Session"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative mt-8 sm:mt-0">
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-xl w-full sm:w-48 border text-[#191919] flex items-center gap-2"
            >
              {statusFilter} <RiArrowDropDownLine size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 w-40 mt-2 rounded-lg shadow-lg">
                <button onClick={() => handleStatusSelect("Ongoing")} className="px-4 py-2 text-sm w-full text-left">
                  Ongoing
                </button>
                <button onClick={() => handleStatusSelect("Completed")} className="px-4 py-2 text-sm w-full text-left">
                  Completed
                </button>
                <button onClick={() => handleStatusSelect("Canceled")} className="px-4 py-2 text-sm w-full text-left">
                  Canceled
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CSV Component */}
        <div className="flex justify-end gap-4 sm:-mt-24 pb-10 mb-10">
          {/* Export as CSV Format Text */}
          <div className="flex items-center text-red-500">
            <span className="text-sm">Export as CSV Format</span>
          </div>

          {/* Download Button */}
          <div>
            <button className="p-2 bg-black text-white rounded flex items-center">
              <Download size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {/* Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead className="border-y-2 border-[#FA9E93]">
                <tr>
                  <th className="p-2 text-center">SESSION ID</th>
                  <th className="p-2 text-center">USER</th>
                  <th className="p-2 text-center">EXPERT</th>
                  <th className="p-2 text-center">DATE/TIME</th>
                  <th className="p-2 text-center">STATUS</th>
                  <th className="p-2 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2">{session.sessionId}</td>
                    <td className="p-2">{session.user}</td>
                    <td className="p-2">{session.expert}</td>
                    <td className="p-2">{session.date}<br />{session.time}</td>
                    <td className="p-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-lg ${
                          session.status === "Ongoing"
                            ? "bg-yellow-400 text-black"
                            : session.status === "Completed"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button className="p-2 bg-black text-white rounded-md">
                        <IoEyeOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
