"use client";

import React, { useState, useEffect } from "react";
import { Download, Search } from "lucide-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoEyeOutline } from "react-icons/io5";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { utils, writeFile } from "xlsx"; // For Excel download
import axios from "axios";

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]); // <-- Updated
  const [loading, setLoading] = useState(true);
  const [activeSession, setActiveSession] = useState("Action Session");
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;

  // 🚀 Fetch sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get("https://amd-api.code4bharat.com/api/sessions/getallsessions");
        const formatted = [];

        res.data.userToExpertSessions.forEach((session, idx) => {
          formatted.push({
            sessionId: `U-${session._id.slice(-4)}`,
            user: `${session.firstName || 'N/A'}`,
            expert: session.expertId?.firstName || 'Expert',
            date: session.sessionDate?.split("T")[0],
            time: session.sessionTime,
            status: session.status,
            amount: "$0", // You can adjust if amount is present
            cancelReason: session.status === "rejected" ? "Expert" : null,
          });
        });

        res.data.expertToExpertSessions.forEach((session, idx) => {
          formatted.push({
            sessionId: `E-${session._id.slice(-4)}`,
            user: `${session.firstName || 'N/A'}`,
            expert: session.expertId?.firstName || 'Expert',
            date: session.sessionDate?.split("T")[0],
            time: session.sessionTime,
            status: session.status,
            amount: "$0", // Update if amount exists
            cancelReason: session.status === "rejected" ? "Expert" : null,
          });
        });

        setSessions(formatted);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // 🔍 Filter logic
  const filteredSessions = sessions
    .filter((session) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        session.sessionId.toLowerCase().includes(searchLower) ||
        session.user.toLowerCase().includes(searchLower) ||
        session.expert.toLowerCase().includes(searchLower) ||
        session.date.toLowerCase().includes(searchLower) ||
        session.time.toLowerCase().includes(searchLower)
      );
    })
    .filter((session) => {
      if (statusFilter === "All Status") return true;
      return session.status === statusFilter;
    });

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleStatusSelect = (status) => {
    setStatusFilter(status);
    setIsDropdownOpen(false);
  };

  const openPopup = (session) => {
    setSelectedSession(session);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedSession(null);
  };

  const exportToExcel = () => {
    // Extract only the fields displayed in the table
    const tableData = filteredSessions.map((session) => ({
      "Session ID": session.sessionId,
      User: session.user,
      Expert: session.expert,
      "Date/Time": `${session.date} ${session.time}`,
      Status: session.status,
    }));

    const ws = utils.json_to_sheet(tableData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sessions");
    writeFile(wb, "SessionManagement.xlsx");
  };

  const Sessionedirect = () => {
    router.push("/components/SessionManagement/SessionHistory");
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
            className={`py-2 px-6 ${activeSession === "Session History" ? "bg-black text-white" : "bg-white text-black shadow-lg"}`}
          >
            <Link href="/sessionhistory">
              Session History
            </Link>
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
              className="p-2 mt-6 rounded-xl w-full sm:w-48 border text-[#191919] flex items-center gap-20"
            >
              {statusFilter} <RiArrowDropDownLine size={20} />
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 w-40 mt-2 rounded-lg shadow-lg">
                <button
                  onClick={() => handleStatusSelect("All Status")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  All Status
                </button>
                <button
                  onClick={() => handleStatusSelect("pending")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  pending
                </button>
                <button
                  onClick={() => handleStatusSelect("unconfirmed")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  unconfirmed
                </button>

                <button
                  onClick={() => handleStatusSelect("confirmed")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  confirmed
                </button>

                <button
                  onClick={() => handleStatusSelect("completed")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  completed
                </button>


                <button
                  onClick={() => handleStatusSelect("rejected")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  rejected
                </button>

                <button
                  onClick={() => handleStatusSelect("Rating Submitted")}
                  className="px-4 py-2 text-sm w-full text-left"
                >
                  Rating Submitted
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CSV Component */}
        <div className="flex justify-end gap-4 sm:-mt-24 pb-10 mb-10">
          <div className="flex items-center text-red-500">
            {/* <span className="text-sm">Export as Excel Format</span> */}
          </div>

          <div>
            <button onClick={exportToExcel} className="p-2 bg-black text-white rounded flex items-center">
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
                {currentSessions.map((session, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-2 text-center">{session.sessionId}</td>
                    <td className="p-2 text-center">{session.user}</td>
                    <td className="p-2 text-center">{session.expert}</td>
                    <td className="p-2 text-center">{session.date}<br />{session.time}</td>
                    <td className="p-2 text-center">
                    <span
                    className={`px-2 py-1 rounded-lg ${
                      session.status.toLowerCase() === "pending"
                        ? "bg-yellow-400 text-black"
                        : session.status.toLowerCase() === "unconfirmed"
                        ? "bg-red-500 text-white"
                        : session.status.toLowerCase() === "confirmed"
                        ? "bg-blue-500 text-white"
                        : session.status.toLowerCase() === "completed"
                        ? "bg-red-500 text-white"
                        : session.status.toLowerCase() === "rejected"
                        ? "bg-red-500 text-white"
                        : session.status.toLowerCase() === "Rating Submitted"
                        ? "bg-purple-500 text-white"
                        : "bg-purple-500 text-white"
                        
                    }`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => openPopup(session)}
                        className="p-2 bg-black text-white rounded-md"
                      >
                        <IoEyeOutline size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center items-center mt-4 mb-4">
  <div className="text-md text-[red]">
    Totals: {filteredSessions.length}
  </div>
</div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-6 p-2 border rounded-lg bg-white">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-red-500"}`}
            >
              <MdKeyboardArrowLeft size={20} />
            </button>

            {/* Pagination Numbers */}
            {[...Array(Math.ceil(filteredSessions.length / sessionsPerPage)).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-base ${
                  currentPage === number + 1
                    ? "bg-red-500 text-white"
                    : "text-[#FA9E93] bg-white"
                }`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredSessions.length / sessionsPerPage)}
              className={`p-2 rounded-lg ${currentPage === Math.ceil(filteredSessions.length / sessionsPerPage) ? "text-gray-300 cursor-not-allowed" : "text-red-500"}`}
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && selectedSession && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#191919]">Session History</h2>
              <button onClick={closePopup} className="text-black text-2xl">
                ×
              </button>
            </div>

            {/* Horizontal Table Layout */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">Session Id</span>
                <span className="font-normal w-2/3 text-right">{selectedSession.sessionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">Date</span>
                <span className="font-normal w-2/3 text-right">{selectedSession.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">User</span>
                <span className="font-normal w-2/3 text-right">{selectedSession.user}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">Expert</span>
                <span className="font-normal w-2/3 text-right">{selectedSession.expert}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">Amount</span>
                <span className="font-normal w-2/3 text-right">{selectedSession.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#191919] font-medium w-1/3">Status</span>
                <span className="font-normal w-2/3 text-right">
                  {selectedSession.status === "Canceled"
                    ? `Canceled by ${selectedSession.cancelReason}`
                    : selectedSession.status}
                </span>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-center">
              <button onClick={closePopup} className="p-2 bg-gray-500 text-white rounded-md">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionManagement;
