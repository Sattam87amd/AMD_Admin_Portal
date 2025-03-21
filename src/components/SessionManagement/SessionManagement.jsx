"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";


const SessionManagement = () => {
  // State for active session type (Action Session or Session History)
  const [activeSession, setActiveSession] = useState("Action Session");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy session data (similar to user data structure)
  const dummySessions = [
    { sessionId: "1", sessionName: "Session 1", status: "Ongoing", date: "2025-03-20" },
    { sessionId: "2", sessionName: "Session 2", status: "Completed", date: "2025-03-18" },
    { sessionId: "3", sessionName: "Session 3", status: "Canceled", date: "2025-03-17" },
    // More sessions as needed
  ];

  // Filter sessions based on status
  const filteredSessions = dummySessions.filter((session) => {
    if (statusFilter === "All Status") return true;
    return session.status === statusFilter;
  });

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-2xl font-bold mb-4 text-[#191919]">SESSION MANAGEMENT</h1>

        {/* Buttons for Action Session and Session History */}
        <div className="flex gap-6 mb-2">
          <button
            onClick={() => setActiveSession("Action Session")}
            className={`py-2 px-4 rounded-lg ${activeSession === "Action Session" ? "bg-black text-white" : "bg-white text-black border"}`}
          >
            Action Session
          </button>
          <button
            onClick={() => setActiveSession("Session History")}
            className={`py-2 px-4 rounded-lg ${activeSession === "Session History" ? "bg-black text-white" : "bg-white text-black border"}`}
          >
            Session History
          </button>
        </div>

        {/* Search Bar and Status Dropdown */}
        <div className="flex items-center gap-6 mb-6">
          {/* Search Bar */}
          <div className="relative  ">
            <div>
                <h2 className="text-[#191919]  " >Search by Session </h2>
            </div>
            <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
              <Search className="m-1 text-white" size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-xl border border-gray-300 w-68 bg-gray-100 text-gray-700 focus:outline-none pl-10"
              placeholder="Search by Session"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button className="p-2 rounded-xl w-48 border  text-[#191919] flex items-center gap-2">
              {statusFilter} <span className="text-gray-500"> <RiArrowDropDownLine />
              </span>
            </button>
            <div className="absolute bg-white border border-gray-300 w-40 mt-2 rounded-lg shadow-lg">
              <button onClick={() => setStatusFilter("Ongoing")} className=" px-4 py-2 text-sm w-full text-left">
                Ongoing
              </button>
              <button onClick={() => setStatusFilter("Completed")} className=" px-4 py-2 text-sm w-full text-left">
                Completed
              </button>
              <button onClick={() => setStatusFilter("Canceled")} className=" px-4 py-2 text-sm w-full text-left">
                Canceled
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <table className="w-full">
          <thead className="border-y-2 border-[#FA9E93]">
            <tr>
              <th className="p-2 text-center">SESSION ID</th>
              <th className="p-2 text-center">SESSION NAME</th>
              <th className="p-2 text-center">STATUS</th>
              <th className="p-2 text-center">DATE</th>
            </tr>
          </thead>
          <tbody>
            {filteredSessions.map((session, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2">{session.sessionId}</td>
                <td className="p-2">{session.sessionName}</td>
                <td className="p-2 text-center">{session.status}</td>
                <td className="p-2">{session.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Download CSV Button */}
        <div className="ml-auto mt-6">
          <button className="p-2 bg-black text-white rounded flex items-center gap-2">
            Export as CSV Format
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
