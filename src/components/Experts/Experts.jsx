"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";

// Import the necessary libraries for phone number parsing
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize the country data
countries.registerLocale(enLocale);

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [selectedSessions, setSelectedSessions] = useState("All");
  const [selectedUsername, setSelectedUsername] = useState("");
  const [error, setError] = useState(null);

  // Function to extract country from phone number - similar to UserManagement
  const getCountryFromPhone = (phoneNumber) => {
    try {
      // Check if phoneNumber is a string
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return "Unknown";
      }

      // Make sure the phone number is in international format (with +)
      let formattedNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        formattedNumber = '+' + phoneNumber;
      }

      const parsedNumber = parsePhoneNumberFromString(formattedNumber);

      if (parsedNumber && parsedNumber.country) {
        return countries.getName(parsedNumber.country, 'en');
      }

      // If parsing fails, try to match country code manually
      const countryCodeMap = {
        '1': 'United States',
        '44': 'United Kingdom',
        '91': 'India',
        '86': 'China',
        '49': 'Germany',
        '33': 'France',
        '81': 'Japan',
        '39': 'Italy',
        '7': 'Russia',
        '55': 'Brazil',
        // Add more common country codes as needed
      };

      // Extract the potential country code (first 1-3 digits after removing +)
      const strippedNumber = phoneNumber.replace(/^\+/, '');

      for (let i = 1; i <= 3; i++) {
        const potentialCode = strippedNumber.substring(0, i);
        if (countryCodeMap[potentialCode]) {
          return countryCodeMap[potentialCode];
        }
      }

      return "Unknown";
    } catch (error) {
      console.error("Error parsing phone number:", error);
      return "Unknown";
    }
  };

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data } = await axios.get("https://amd-api.code4bharat.com/api/expertauth");
        
        // Process each expert to add country based on phone number
        const processedExperts = data.data.map((expert) => {
          // If expert already has a country property, use it, otherwise derive from phone
          const countryName = expert.country || getCountryFromPhone(expert.phone);
          return {
            ...expert,
            country: countryName,
          };
        });

        // Extract unique countries for the dropdown
        const countries = [...new Set(processedExperts.map(expert => expert.country))].filter(country => country !== "Unknown");
        setUniqueCountries(countries);

        setExperts(processedExperts);
        setFilteredExperts(processedExperts);
      } catch (error) {
        console.error("Error fetching experts:", error);
        setError("Failed to fetch experts. Please try again later.");
      }
    };

    fetchExperts();
  }, []);

  useEffect(() => {
    let tempExperts = [...experts];
  
    if (selectedCountry !== "All") {
      tempExperts = tempExperts.filter((expert) => expert.country === selectedCountry);
    }
  
    if (selectedSessions !== "All") {
      tempExperts = tempExperts.filter((expert) => expert.liveSessions === parseInt(selectedSessions));
    }
  
    if (selectedUsername) {
      tempExperts = tempExperts.filter((expert) => {
        const fullName = (expert.firstName + ' ' + expert.lastName).toLowerCase();
        return fullName.includes(selectedUsername.toLowerCase());
      });
    }
  
    setFilteredExperts(tempExperts);
    setCurrentPage(1);
  }, [selectedCountry, selectedSessions, selectedUsername, experts]);
  
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExperts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredExperts);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Experts");
    writeFile(wb, "Experts.xlsx");
  };

  return (
    <div className="flex justify-center w-full h-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-3xl font-bold mb-6 text-[#191919]">EXPERTS</h1>

        {/* Display Error Message if present */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              className="float-right font-bold" 
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            {/* Select by Country */}
            <div>
              <h3 className="mb-2">Select by Country</h3>
              <select
                className="p-2 w-48 rounded-lg border border-black bg-gray-200 text-red-600 cursor-pointer"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {/* All Option */}
                <option value="All">All</option>

                {/* Map through the unique countries detected from phone numbers */}
                {uniqueCountries.map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Select by No. of Live Sessions */}
            <div>
              <h3 className="mb-2">Select by No. of Live Sessions</h3>
              <select
                className="p-2 w-48 rounded-lg border border-black bg-gray-200 text-red-600 cursor-pointer"
                value={selectedSessions}
                onChange={(e) => setSelectedSessions(e.target.value)}
              >
                <option value="All">All</option>
                {[...Array(11).keys()].map((num) => (
                  <option key={num} value={num}>
                    {num} Sessions
                  </option>
                ))}
              </select>
            </div>

            {/* Select by Username */}
            <div>
              <h3>Select by Username</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 bottom-3 transform text-gray-200 bg-red-500 rounded-full border border-red-500" size={18} />
                <input
                  type="text"
                  className="mt-2 p-2 pl-10 rounded-lg border border-black bg-gray-200 w-48"
                  value={selectedUsername}
                  onChange={(e) => setSelectedUsername(e.target.value)}
                  placeholder="Search Username"
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

        {/* Table */}
        <table className="w-[104%] border-collapse border border-white">
          <thead className="border-y-2 border-red-400 bg-white">
            <tr>
              {["COUNTRY NAME", "NAME", "LAST NAME", "EMAIL", "PHONE NUMBER", "COMPLETES LIVESESSIONS"].map((label, index) => (
                <th key={index} className="p-3 text-left font-semibold cursor-pointer">
                  <div className="flex items-center gap-1">
                    <span>{label}</span>
                    <div className="flex flex-col items-center">
                      <FaSortUp className={sortConfig.key === label && sortConfig.direction === "asc" ? "text-black" : "text-gray-300"} />
                      <FaSortDown className={sortConfig.key === label && sortConfig.direction === "desc" ? "text-black" : "text-gray-300"} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentItems.map((expert, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-3 text-center">{expert.country}</td>
                <td className="text-center">{expert.firstName}</td>
                <td className="text-center">{expert.lastName}</td>
                <td className="text-center">{expert.email}</td>
                <td className="text-center">{expert.phone}</td>
                <td className="text-center">{String(expert.liveSessions).padStart(2, "0")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="text-center text-sm mt-4 text-red-600">
          {filteredExperts.length}{" "}
          {filteredExperts.length === 1 ? "Result" : "Total"}
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-6 p-2 border rounded-lg bg-white shadow-md shadow-gray-400">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-red-500"}`}
            >
              <IoIosArrowBack size={20} />
            </button>

            {/* Pagination Numbers */}
            {[...Array(totalPages)].map((_, number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-base ${currentPage === number + 1 ? "bg-red-500 text-white" : "text-[#FA9E93] bg-white"}`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-red-500"}`}
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experts;