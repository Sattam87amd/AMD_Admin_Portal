"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { Check, X, User } from "lucide-react";

const PendingExpertsRequest = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedLastActive, setSelectedLastActive] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [rotationCount, setRotationCount] = useState(0);
  const [visiblePages, setVisiblePages] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(["All", ...countryNames]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const dummyExperts = [
      { id: 1, country: "Belarus", name: "Ivan", username: "raivan", email: "radioxivan@gmail.com" },
      { id: 2, country: "India", name: "Ram", username: "Ram123", email: "ram123@gmail.com" },
      { id: 3, country: "India", name: "Lakhan", username: "Lakhan123", email: "lakhan123@gmail.com" },
      { id: 4, country: "United Kingdom", name: "Aeran", username: "Aeran123", email: "aeran123@gmail.com" },
      { id: 5, country: "Netherlands", name: "Jiteksi", username: "jiteksi123", email: "jiteksi123@gmail.com" },
      { id: 6, country: "United States", name: "Irnakis", username: "Irnakis123", email: "irnakis123@gmail.com" },
    ];

    setExperts(dummyExperts);
    setFilteredExperts(dummyExperts);
  }, []);

  useEffect(() => {
    let tempExperts = [...experts];

    if (selectedCountry !== "All") {
      tempExperts = tempExperts.filter((expert) => expert.country === selectedCountry);
    }

    if (searchQuery) {
      tempExperts = tempExperts.filter((expert) =>
        expert.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredExperts(tempExperts);
    setCurrentPage(1);
  }, [selectedCountry, searchQuery, experts]);

  const generatePagination = () => {
    const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
    let pages = [];
    
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages.filter((page, index, array) => 
      array.indexOf(page) === index
    );
  };

  useEffect(() => {
    setVisiblePages(generatePagination());
  }, [filteredExperts, currentPage]);

  const sortTable = (key, direction) => {
    let newExperts = [...filteredExperts];
    
    if (rotationCount === 0 || sortConfig.key !== key) {
      newExperts.sort((a, b) => {
        if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
        return 0;
      });
    } else {
      if (direction === "asc") {
        newExperts = [...newExperts.slice(1), newExperts[0]];
      } else {
        newExperts = [newExperts[newExperts.length - 1], ...newExperts.slice(0, -1)];
      }
    }

    setFilteredExperts(newExperts);
    setRotationCount(prev => sortConfig.key === key ? (prev + 1) % filteredExperts.length : 0);
    setSortConfig({ key, direction });
  };

  const acceptRequest = (id) => {
    setExperts((prevExperts) => prevExperts.filter((expert) => expert.id !== id));
  };

  const rejectRequest = (id) => {
    setExperts((prevExperts) => prevExperts.filter((expert) => expert.id !== id));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExperts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredExperts);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "PendingExperts");
    writeFile(wb, "PendingExperts.xlsx");
  };

  const PaginationControls = () => (
    <div className="flex items-center justify-center mt-6">
      <div className="text-red-500">
        {filteredExperts.length} Total
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`p-2 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <IoIosArrowBack size={20} />
        </button>

        {visiblePages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-3">...</span>
          ) : (
            <button
              key={index}
              onClick={() => paginate(page)}
              className={`w-8 h-8 rounded ${
                currentPage === page 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`p-2 ${currentPage === totalPages ? 'text-red-500' : 'text-gray-600'}`}
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>
    </div>
  );

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
              <h3 className="mb-2">Select by Last Active</h3>
              <select
                className="p-2 w-48 rounded-lg border border-black bg-gray-200 text-red-600 cursor-pointer"
                value={selectedLastActive}
                onChange={(e) => setSelectedLastActive(e.target.value)}
              >
                <option value="All Time">All Time</option>
                <option value="Last 15 Days">Last 15 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
              </select>
            </div>

            <div className="relative w-64">
              <h3>Select by Country</h3>
              <Search className="absolute left-3 top-3/5 transform text-gray-200 bg-red-500 rounded-lg border border-red-500" size={18} />
              <input
                type="text"
                className="mt-2 p-2 pl-10 rounded-lg border border-black bg-gray-200 w-48"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={downloadExcel} 
            className="flex mt-8 items-center justify-center w-12 h-12 bg-black text-white rounded-lg"
          >
            <Download size={24} className="text-white" />
          </button>
        </div>

        <table className="w-full border-collapse border border-gray-300">
          <thead className="border-y-2 border-red-300 bg-white">
            <tr>
              {["country", "name", "username", "email"].map((key, index) => (
                <th key={index} className="p-3 text-left font-semibold relative">
                  <div className="inline-flex items-center gap-2">
                    <span className="uppercase">{key.replace("_", " ")}</span>
                    <div className="h-4 border-r border-gray-400 mx-2"></div>
                    <div className="flex flex-col items-center">
                      <FaSortUp 
                        onClick={() => sortTable(key, "asc")}
                        className={`text-xs cursor-pointer ${
                          sortConfig.key === key && sortConfig.direction === "asc" 
                            ? "text-black" 
                            : "text-gray-400"
                        }`}
                      />
                      <FaSortDown 
                        onClick={() => sortTable(key, "desc")}
                        className={`text-xs -mt-1 cursor-pointer ${
                          sortConfig.key === key && sortConfig.direction === "desc" 
                            ? "text-black" 
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                  {index !== 3 && <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 border-l border-gray-400"></div>}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((expert) => (
              <tr key={expert.id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-5 text-left">{expert.country}</td>
                <td className="text-left">{expert.name}</td>
                <td className="text-left">{expert.username}</td>
                <td className="text-left">{expert.email}</td>
                <td className="text-left">
                  <div className="flex gap-2">
                    <button
                      className="flex items-center justify-center w-[50px] h-[40px] mt-[3px] bg-[#50C878] text-white rounded-md"
                      onClick={() => acceptRequest(expert.id)}
                    >
                      <Check size={28} strokeWidth={2} className="text-white" />
                    </button>
                    <button
                      className="flex items-center justify-center w-[50px] h-[40px] mt-[3px] bg-[#E63946] text-white rounded-md"
                      onClick={() => rejectRequest(expert.id)}
                    >
                      <X size={28} strokeWidth={2} className="text-white" />
                    </button>
                    <button
                      className="flex items-center justify-center w-[50px] h-[40px] mt-[3px] bg-black text-white rounded-md"
                    >
                      <User size={28} strokeWidth={2} className="text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaginationControls />
      </div>
    </div>
  );
};

export default PendingExpertsRequest;