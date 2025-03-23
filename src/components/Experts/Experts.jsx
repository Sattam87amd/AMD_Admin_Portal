"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    // Fetch countries from API
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
    // Set initial dummy expert data
    const dummyExperts = [
      { country: "Belarus", name: "Ivan", username: "raivan", email: "radioxivan@gmail.com", phone: "+9876543210", liveSessions: 3 },
      { country: "India", name: "Ram", username: "Ram123", email: "ram123@gmail.com", phone: "+9876543210", liveSessions: 2 },
      { country: "India", name: "Lakhan", username: "Lakhan123", email: "lakhan123@gmail.com", phone: "+9876543210", liveSessions: 1 },
      { country: "United Kingdom", name: "Aeran", username: "Aeran123", email: "aeran123@gmail.com", phone: "+9876543210", liveSessions: 2 },
      { country: "Netherlands", name: "Jiteksi", username: "jiteksi123", email: "jiteksi123@gmail.com", phone: "+9876543210", liveSessions: 3 },
      { country: "United States", name: "Irnakis", username: "Irnakis123", email: "irnakis123@gmail.com", phone: "+9876543210", liveSessions: 1 },
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

  const sortTable = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sortedExperts = [...filteredExperts].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredExperts(sortedExperts);
    setSortConfig({ key, direction });
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
    utils.book_append_sheet(wb, ws, "Experts");
    writeFile(wb, "Experts.xlsx");
  };

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-3xl font-bold mb-6 text-[#191919]">EXPERTS</h1>

        {/* Filters */}
        <div className="flex gap-4 items-center mb-6">
          <select
            className="p-3 rounded-lg border border-gray-300 bg-white text-red-600 shadow-sm"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>

          <select className="p-3 rounded-lg border border-gray-300 bg-white text-black shadow-sm">
            <option>All Time</option>
          </select>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              className="p-3 pl-10 rounded-lg border border-gray-300 bg-white w-full shadow-sm"
              placeholder="Search by Country"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button onClick={downloadExcel} className="ml-auto">
            <Download size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead className="border-y-2 border-red-400 bg-gray-100">
            <tr>
              {[
                { key: "country", label: "COUNTRY NAME" },
                { key: "name", label: "NAME" },
                { key: "username", label: "USERNAME" },
                { key: "email", label: "EMAIL" },
                { key: "phone", label: "PHONE NUMBER" },
                { key: "liveSessions", label: "COMPLETES LIVESESSIONS" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="p-3 text-left font-semibold cursor-pointer"
                  onClick={() => sortTable(key)}
                >
                  <div className="flex items-center gap-1">
                    <span>{label}</span>
                    <div className="flex flex-col items-center">
                      <FaSortUp className={sortConfig.key === key && sortConfig.direction === "asc" ? "text-black" : "text-gray-300"} />
                      <FaSortDown className={sortConfig.key === key && sortConfig.direction === "desc" ? "text-black" : "text-gray-300"} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((expert, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-3 text-left">{expert.country}</td>
                <td className="text-left">{expert.name}</td>
                <td className="text-left">{expert.username}</td>
                <td className="text-left">{expert.email}</td>
                <td className="text-left">{expert.phone}</td>
                <td className="text-left">{String(expert.liveSessions).padStart(2, "0")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex justify-center items-center">
          <span className="text-red-600 font-semibold mr-4">144 Total</span>
          <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 rounded hover:bg-gray-100">
            <IoIosArrowBack />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => paginate(i + 1)} className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-red-600 text-white" : "text-black hover:bg-gray-100"}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-1 rounded hover:bg-gray-100">
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experts;