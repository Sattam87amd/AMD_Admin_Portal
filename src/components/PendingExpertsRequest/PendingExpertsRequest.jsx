"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { Check, X, User } from "lucide-react";
import axios from "axios";

const PendingExpertsRequest = () => {
  const router = useRouter();
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedUsername, setSelectedUsername] = useState("");
  const[selectedStatus, setSelectedStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5070/api/countries");
        const countryNames = response.data.map(country => country.name.common).sort();
        setCountries(["All", ...countryNames]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5070/api/expertauth");
        const pendingExperts = data.data.filter(expert => expert.status === "Pending");
        setExperts(pendingExperts);
        setFilteredExperts(pendingExperts);
      } catch (error) {
        console.error("Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    let tempExperts = [...experts];

    if (selectedCountry !== "All") {
      tempExperts = tempExperts.filter(expert => expert.country === selectedCountry);
    }

    if (selectedUsername) {
      tempExperts = tempExperts.filter(expert =>
        expert.username.toLowerCase().includes(selectedUsername.toLowerCase())
      );
    }

    setFilteredExperts(tempExperts);
    setCurrentPage(1);
  }, [selectedCountry, selectedUsername, experts]);

  const sortTable = (key) => {
    let direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

    const sortedExperts = [...filteredExperts].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredExperts(sortedExperts);
    setSortConfig({ key, direction });
  };

  const currentItems = filteredExperts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredExperts);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "PendingExperts");
    writeFile(wb, "PendingExperts.xlsx");
  };

  const handleProfileClick = (username) => {
    router.push("/pendingexpertsrequestprofile");
  };

  const acceptRequest = async (expertId) => {
    try {
      await axios.put(`http://localhost:5070/api/adminauth/experts/${expertId}/status`, {
        status: "Approved",
      });
  
      // Update local state
      setExperts((prev) =>
        prev.map((expert) =>
          expert._id === expertId ? { ...expert, status: "Approved" } : expert
        )
      );
    } catch (error) {
      console.error("Error approving expert:", error);
    }
  };
  
  const rejectRequest = async (expertId) => {
    try {
      await axios.put(`http://localhost:5070/api/adminauth/experts/${expertId}/status`, {
        status: "Rejected",
      });
  
      // Update local state
      setExperts((prev) =>
        prev.map((expert) =>
          expert._id === expertId ? { ...expert, status: "Rejected" } : expert
        )
      );
    } catch (error) {
      console.error("Error rejecting expert:", error);
    }
  };

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-3xl font-bold mb-6 text-[#191919]">PENDING EXPERT REQUESTS</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <div>
              <h3 className="mb-2">Select Country</h3>
              <select
                className="p-2 w-48 rounded-lg border border-black bg-gray-200 text-red-600 cursor-pointer"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="mb-2">Select by Status</h3>
              <select
                className="p-2 w-48 rounded-lg border border-black bg-gray-200 text-red-600 cursor-pointer"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <h3 className="">Select by Username</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 bottom-3 transform text-gray-200 bg-red-500 rounded-full border border-red-500" size={18} />
                <input
                  type="text"
                  className="mt-2 p-2 pl-10 rounded-lg border border-black bg-gray-200 w-48 h-[2.5rem]"
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={downloadExcel}
            className="flex mt-8 items-center justify-center w-12 h-12 bg-black text-white rounded-lg"
          >
            <Download size={24} className="text-white" />
          </button>
        </div>

        <table className="w-full border-collapse border border-white">
          <thead className="border-y-2 border-red-300 bg-white">
            <tr>
              {["country", "name", "username", "email"].map((key, index) => (
                <th key={index} className="p-3 text-left font-semibold relative">
                  <div className="inline-flex items-center gap-2">
                    <span className="uppercase">{key.replace("_", " ")}</span>
                    <div className="flex flex-col items-center">
                      <FaSortUp
                        onClick={() => sortTable(key)}
                        className={`text-xs cursor-pointer ml-[5.8rem] ${sortConfig.key === key && sortConfig.direction === "asc" ? "text-gray-200" : "text-black"}`}
                      />
                      <FaSortDown
                        onClick={() => sortTable(key)}
                        className={`text-xs -mt-1 cursor-pointer ml-[5.8rem] ${sortConfig.key === key && sortConfig.direction === "desc" ? "text-gray-200" : "text-black"}`}
                      />
                    </div>
                  </div>
                  {index !== 3 && <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-9 border-l border-black"></div>}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((expert) => (
              <tr key={expert.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-5 text-left">India</td>
                <td className="text-left">{expert.firstName}</td>
                <td className="text-left">{expert.lastName}</td>
                <td className="text-left">{expert.email}</td>
                <td className="text-left">
                  <div className="flex gap-2">
                  {expert.status === "Pending" ? (
                  <>
                    <button className="w-[50px] h-[40px] bg-[#60DF7C] text-white rounded-md " onClick={() => acceptRequest(expert._id)}>
                      <Check size={28} strokeWidth={2} />
                    </button>
                    <button className="w-[50px] h-[40px] bg-[#FF2A2A] text-white rounded-md" onClick={() => rejectRequest(expert._id)}>
                      <X size={28} strokeWidth={2} />
                    </button>
                  </>
                ) : (
                  <div className={`w-[80px] h-[40px] rounded-md flex items-center justify-center ${expert.status === "Approved" ? "bg-green-500" : "bg-red-500"}`}>
                    <span className="text-white">{expert.status}</span>
                  </div>
                )}
                <button className="w-[50px] h-[40px] bg-black text-white rounded-md" onClick={() => handleProfileClick(expert.username)}>
                  <User size={28} strokeWidth={2} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="text-center text-sm mt-4 text-[#FA9E93]">
          {filteredExperts.length}{" "}
          {filteredExperts.length === 1 ? "Result" : "Total"}
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-2 p-2 border rounded-lg bg-white shadow-lg shadow-gray-400">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-red-500"
                }`}
            >
              <IoIosArrowBack size={20} />
            </button>

            {(() => {
              const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
              const pages = [];

              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => paginate(i)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-base border ${currentPage === i
                        ? "bg-red-500 text-white border-red-500"
                        : "text-[#FA9E93] bg-white border-gray-300"
                        }`}
                    >
                      {i}
                    </button>
                  );
                }
              } else {
                pages.push(
                  <button
                    key={1}
                    onClick={() => paginate(1)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-base border ${currentPage === 1
                      ? "bg-red-500 text-white border-red-500"
                      : "text-[#FA9E93] bg-white border-gray-300"
                      }`}
                  >
                    1
                  </button>
                );

                if (currentPage > 3) {
                  pages.push(<span key="ellipsis1" className="text-gray-500">...</span>);
                }

                for (
                  let i = Math.max(2, currentPage - 1);
                  i <= Math.min(totalPages - 1, currentPage + 1);
                  i++
                ) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => paginate(i)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-base border ${currentPage === i
                        ? "bg-red-500 text-white border-red-500"
                        : "text-[#FA9E93] bg-white border-gray-300"
                        }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (currentPage < totalPages - 2) {
                  pages.push(<span key="ellipsis2" className="text-gray-500">...</span>);
                }

                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => paginate(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-base border ${currentPage === totalPages
                      ? "bg-red-500 text-white border-red-500"
                      : "text-[#FA9E93] bg-white border-gray-300"
                      }`}
                  >
                    {totalPages}
                  </button>
                );
              }
              return pages;
            })()}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredExperts.length / itemsPerPage)}
              className={`p-2 rounded-lg ${currentPage === Math.ceil(filteredExperts.length / itemsPerPage)
                ? "text-gray-300 cursor-not-allowed"
                : "text-red-500"
                }`}
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingExpertsRequest;
