"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [lastActive, setLastActive] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy User Data (matches Attachment 6)
  const dummyUsers = [
    { country: "Belarus", name: "Ivan", username: "Ravian", email: "radioivan@gmail.com", status: "Active", phone: "+9876543210" },
    { country: "India", name: "Ram", username: "Ram123", email: "ram123@gmail.com", status: "Deactivate", phone: "+9876543210" },
    { country: "India", name: "Lakhan", username: "Lakhan123", email: "lakhan123@gmail.com", status: "Suspended", phone: "+9876543210" },
    { country: "UK", name: "Aeran", username: "Aeran123", email: "aeran123@gmail.com", status: "Active", phone: "+9876543210" },
    { country: "Netherlands", name: "Jiteksi", username: "Jiteksi123", email: "jiteksi123@gmail.com", status: "Deactivate", phone: "+9876543210" },
    { country: "USA", name: "Iranks", username: "Iranks123", email: "iranks123@gmail.com", status: "Active", phone: "+9876543210" },
  ];

  // Fetch country data from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const countryList = data.map((country) => ({
          name: country.name.common,
          flag: country.flags.png,
        }));
        // Sort countries alphabetically
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();

    // Load users from local storage or use dummy data
    const storedUsers = JSON.parse(localStorage.getItem("users")) || dummyUsers;
    setUsers(storedUsers);
    setFilteredUsers(storedUsers);

    // Save users to local storage whenever they change
    localStorage.setItem("users", JSON.stringify(storedUsers));
  }, []);

  // Filter users based on selected country or search query
  useEffect(() => {
    let tempUsers = [...users];

    // Filter by selected country
    if (selectedCountry !== "All") {
      tempUsers = tempUsers.filter((user) => user.country === selectedCountry);
    }

    // Filter by search query
    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        user.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(tempUsers);
  }, [selectedCountry, searchQuery, users]);

  // Download Data to Excel
  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredUsers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "UserManagement.xlsx");
  };

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-2xl font-bold mb-4 text-[#191919] ">USER MANAGEMENT</h1>

        {/* Filter Section (Attachment 5) */}
        <div className="flex gap-4 items-center mb-6">
          {/* Country Dropdown (Attachment 1) */}
          <div>
            <label className="block mb-1 text-md  text-[#191919] ">Select Country</label>
            <select
              className="p-2 rounded-full border border-gray-300 w-44 bg-gray-100 text-[#C91416] focus:outline-none"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="All">ALL</option>
              {countries.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Last Active Dropdown (Attachment 2) */}
          <div>
            <label className="block mb-1 text-md  text-[#191919] ">Select by Last Active</label>
            <select
              className="p-2 px-3 rounded-2xl border border-gray-300 w-48 bg-gray-100 text-[#C91416] focus:outline-none"
              value={lastActive}
              onChange={(e) => setLastActive(e.target.value)}
            >
              <option>All Time</option>
              <option>1 Day</option>
              <option>1 Week</option>
              <option>2 Week</option>
              <option>1 Month</option>
              <option>3 Month</option>
              <option>6 Month</option>
              <option>1 Year</option>
              <option>1+ Year</option>
            </select>
          </div>

          {/* Search by Country (Attachment 3) */}
          <div>
            <label className="block mb-1 text-md  text-[#191919] ">Select by Country</label>
            <div className="relative">
              <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2 " >
            <Search className=" m-1  right-2 top-2  text-white" size={16} />
            </div>

              <input
                type="text"
                placeholder=""
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 rounded-full border border-gray-300 w-48  bg-gray-100 text-gray-700 focus:outline-none"
              />
            </div>
          </div>

          {/* Download Button (Attachment 4) */}
          <div className="ml-auto mt-6 ">
            <button
              onClick={downloadExcel}
              className="p-2 bg-black text-white rounded flex items-center gap-2"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Data Table (Attachment 6) */}
        <table className="w-full ">
        <thead className="border-y-2 border-[#FA9E93]">
  <tr>
    <th className="p-2 text-center relative">
      COUNTRY NAME
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center relative">
      NAME
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center relative">
      USERNAME
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center relative">
      EMAIL
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center relative">
      STATUS
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center relative">
      PHONE NUMBER
      <span className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gray-400"></span>
    </th>
    <th className="p-2 text-center">ACTION</th>
  </tr>
</thead>


          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className=" p-2">{user.country}</td>
                <td className=" p-2">{user.name}</td>
                <td className=" p-2">{user.username}</td>
                <td className=" p-2">{user.email}</td>
                <td className="p-2 text-center">
  <span
    className={`inline-block w-40 px-3 py-1 rounded-xl border ${
      user.status === "Active"
        ? "bg-white text-black"
        : user.status === "Deactivate"
        ? "bg-white text-black"
        : "bg-white text-black"
    }`}
  >
    {user.status}
  </span>
</td>

                <td className=" p-2">{user.phone}</td>
                <td className="p-2 flex gap-4">
  {/* Edit Button */}
  <button className="text-blue-600 hover:text-blue-800">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  </button>

  {/* Delete Button */}
  <button className="text-red-600 hover:text-red-800">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  </button>

  {/* History Button */}
  <button className="text-gray-600 hover:text-gray-800">
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M13 3l9 9-9 9M4 12H21"></path>
    </svg>
  </button>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;