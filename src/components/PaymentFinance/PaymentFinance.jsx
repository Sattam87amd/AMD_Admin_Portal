"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FiDownload } from "react-icons/fi";

const PaymentFinance = () => {
  // State for active session type (Action Session or Session History)
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Dummy session data (matching the new structure)
  const dummySessions = [
    {
      sessionId: "#01",
      user: "Ivan",
      amount: "$100",
      method: "Credit Card",
      status: "Completed",
    },
    {
      sessionId: "#02",
      user: "Sarah",
      amount: "$150",
      method: "PayPal",
      status: "Pending",
    },
    {
      sessionId: "#03",
      user: "Mike",
      amount: "$120",
      method: "Debit Card",
      status: "Completed",
    },
    {
      sessionId: "#04",
      user: "John",
      amount: "$80",
      method: "Wire Transfer",
      status: "Pending",
    },
    {
      sessionId: "#05",
      user: "Emma",
      amount: "$200",
      method: "Credit Card",
      status: "Completed",
    },
  ];

  // Filter sessions based on status
  const filteredSessions = dummySessions.filter((session) => {
    if (statusFilter === "All Status") return true;
    return session.status === statusFilter;
  });

  // Handle status selection and close dropdown
  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setDropdownVisible(false);
  };

  return (
    <div className="flex justify-center w-full p-6 bg-white -mt-">
      <div className="w-11/12">
        <h1 className="text-2xl font-bold mb-4 text-[#191919]">
          PAYMENTS AND FINANCE
        </h1>

        {/* Search Bar, Status Dropdown, and Export Button in Same Line */}
        <div className="flex items-center justify-between space-x-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-1/3">
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
          <div className="relative w-1/3">
            <button
              onClick={() => setDropdownVisible(!dropdownVisible)}
              className="p-2 rounded-xl w-full border text-[#191919] flex items-center justify-between focus:outline-none"
            >
              {statusFilter}
              <RiArrowDropDownLine size={24} />
            </button>

            {dropdownVisible && (
              <div className="absolute bg-white border border-gray-300 w-full mt-2 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => handleStatusSelect("All Status")}
                  className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  All Status
                </button>
                <button
                  onClick={() => handleStatusSelect("Completed")}
                  className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  Completed
                </button>
                <button
                  onClick={() => handleStatusSelect("Pending")}
                  className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                >
                  Pending
                </button>
              </div>
            )}
          </div>

          {/* Export as CSV Button */}
          <button className="text-red-500 flex items-center gap-2 hover:underline cursor-pointer">
            Export as CSV Format
            <FiDownload className="text-black" />
          </button>
        </div>

        {/* Data Table with Increased Height and Row Gap */}
        <div className="overflow-y-auto max-h-screen  border-gray-300 rounded-lg mt-10">
          <table className="w-full border-collapse">
            <thead className="border-y-1 border-[#FA9E93] bg-gray-100 ">
              <tr>
                <th className="p-5 text-center ">SESSION ID</th>
                <th className="p-5 text-center">USER/EXPERT</th>
                <th className="p-5 text-center">AMOUNT</th>
                <th className="p-5 text-center">METHOD</th>
                <th className="p-5 text-center">STATUS</th>
                <th className="p-5 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="space-y-10">
              {filteredSessions.map((session, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 text-center border-b border-gray-300"
                >
                  <td className="p-5">{session.sessionId}</td>
                  <td className="p-5">{session.user}</td>
                  <td className="p-5">{session.amount}</td>
                  <td className="p-5">{session.method}</td>
                  <td className="p-5">
                    <span
                      className={`text-white px-2 py-1 rounded-full ${
                        session.status === "Completed"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Count */}
        <div className="text-center text-red-500 mt-3 -ml-20">
          {filteredSessions.length} Total
        </div>
        {/* Pagination inside Rectangle Panel */}
        <div className="flex justify-center items-center  p-4 border border-gray-300 rounded-lg bg-gray-50 w-[300px] mx-88">
        <button className="text-red-500">&lt;</button>

          <button className="p-2 border bg-white text-[#191919] mx-1 w-8 h-8 flex items-center justify-center rounded-lg">
            1
          </button>
          <button className="p-2 border bg-white text-[#191919] mx-1 w-8 h-8 flex items-center justify-center rounded-lg">
            2
          </button>
          <button className="p-2 border bg-white text-[#191919] mx-1 w-8 h-8 flex items-center justify-center rounded-lg">
            3
          </button>
          <button className="text-red-500">&gt;</button>
        </div>

      </div>
    </div>
  );
};

export default PaymentFinance;
