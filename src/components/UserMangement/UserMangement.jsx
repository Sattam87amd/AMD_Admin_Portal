"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RiHistoryLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import axios from "axios";

// Import the necessary libraries for phone number parsing
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

// Initialize the country data
countries.registerLocale(enLocale);

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [lastActive, setLastActive] = useState("All Time");
  const [searchName, setSearchName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [error, setError] = useState(null); // Add error state

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Popup and History state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [userHistory, setUserHistory] = useState([]);

  // Dummy history data
  const dummyHistory = [
    { bookingId: "B001", date: "2025-04-01", service: "Hotel Booking", status: "Completed", amount: "$250" },
    { bookingId: "B002", date: "2025-04-10", service: "Car Rental", status: "Active", amount: "$120" },
    { bookingId: "B003", date: "2025-04-15", service: "Tour Package", status: "Completed", amount: "$350" },
    { bookingId: "B004", date: "2025-04-20", service: "Flight Booking", status: "Active", amount: "$580" },
  ];

  // Function to extract country from phone number - FIXED VERSION
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
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("http://localhost:5070/api/userauth/users");

        // Process each user to add country based on phone number
        const processedUsers = data.data.map((user) => {
          const countryName = getCountryFromPhone(user.phone);
          return {
            ...user,
            status: "Active", // Static status for all users
            country: countryName,
          };
        });

        // Extract unique countries for the dropdown
        const countries = [...new Set(processedUsers.map(user => user.country))].filter(country => country !== "Unknown");
        setUniqueCountries(countries);

        setUsers(processedUsers);
        setFilteredUsers(processedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let tempUsers = [...users];
    const currentDate = new Date();

    // Country filter
    if (selectedCountry !== "All") {
      tempUsers = tempUsers.filter((user) => user.country === selectedCountry);
    }

    // Name search filter
    if (searchName) {
      tempUsers = tempUsers.filter((user) =>
        (user.firstName && user.firstName.toLowerCase().includes(searchName.toLowerCase())) ||
        (user.lastName && user.lastName.toLowerCase().includes(searchName.toLowerCase()))
      );
    }

    // Last active filter
    if (lastActive !== "All Time") {
      const days = parseInt(lastActive);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      tempUsers = tempUsers.filter((user) => {
        if (!user.lastActive) return true;
        const userDate = new Date(user.lastActive);
        return userDate >= cutoffDate;
      });
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1);
  }, [selectedCountry, searchName, lastActive, users]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(sortedData);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredUsers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "UserManagement.xlsx");
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsPopupOpen(true);
  };

  const handleUpdate = () => {
    // Update the country when phone number changes
    let updatedUser = { ...currentUser };
    if (currentUser.phone) {
      updatedUser.country = getCountryFromPhone(currentUser.phone);
    }

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsPopupOpen(false);
  };

  const handleDeactivate = () => {
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? { ...user, status: user.status === "Active" ? "Deactivated" : "Active" }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsPopupOpen(false);
  };

  const handleDelete = async (user) => {
    try {
      setUserToDelete(user); // Set the user to delete
      setIsDeletePopupOpen(true); // Show confirmation popup
      
      // This used to be the direct deletion, but now we've moved it to handleConfirmDelete
      // after the user confirms in the popup
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || "Failed to delete user");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Corrected URL and better error handling
      const response = await fetch(
        `http://localhost:5070/api/userauth/deleteuser/${userToDelete._id}`, 
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Handle non-successful responses
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete user');
      }
  
      // Safe JSON parsing
      let data;
      try {
        data = await response.json();
      } catch (error) {
        data = { message: 'User deleted successfully' };
      }
  
      // Update UI
      setIsDeletePopupOpen(false);
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userToDelete._id));
  
      console.log(data.message);
  
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message || "Failed to delete user");
    }
  };

 // Replace your current handleHistory function with this corrected version
 const handleHistory = async (user) => {
  try {
    // Log the full user object to see its structure
    console.log("User object:", user);
    console.log("User ID type:", typeof user._id);
    console.log("User ID value:", user._id);
    
    // Include authentication token in the request headers
    const response = await axios.get(
      `http://localhost:5070/api/adminauth/bookings?userId=${user._id}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Full API response:", response);
    
    if (response.data.success) {
      setUserHistory(response.data.bookings);
      setIsHistoryPopupOpen(true);
      
      // If there are no bookings, show a message but still open the popup
      if (response.data.bookings.length === 0) {
        setError("This user has no booking history.");
      }
    } else {
      setError("Failed to fetch booking history: " + (response.data.message || "Unknown error"));
    }
  } catch (error) {
    console.error('Error fetching booking history:', error);
    console.error('Error details:', error.response?.data);
    
    // Extract the specific error message from the response if available
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Failed to fetch booking history";
                        
    setError(errorMessage);
    
    // Still open the popup but it will show no results
    setUserHistory([]);
    setIsHistoryPopupOpen(true);
  }
};

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-2xl font-bold mb-4 text-[#191919]">USER MANAGEMENT</h1>

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

        {/* Filter Section */}
        <div className="flex gap-4 items-center mb-6">
          <div>
            <label className="block mb-1 text-md text-[#191919]">Select Country</label>
            <select
              className="p-2 rounded-full border border-gray-300 w-44 bg-gray-100 text-[#C91416] focus:outline-none"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="All">All</option>

              {/* Map through the unique countries detected from phone numbers */}
              {uniqueCountries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-md text-[#191919]">Last Active</label>
            <select
              className="p-2 rounded-full border border-gray-300 w-44 bg-gray-100 text-[#C91416] focus:outline-none"
              value={lastActive}
              onChange={(e) => setLastActive(e.target.value)}
            >
              <option value="All Time">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-md text-[#191919]">Search by Name</label>
            <div className="relative">
              <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
                <Search className="m-1 text-white" size={16} />
              </div>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="p-2 rounded-full border border-gray-300 w-48 bg-gray-100 text-gray-700 focus:outline-none pl-10"
                placeholder="Search by name..."
              />
            </div>
          </div>

          <div className="ml-auto mt-6">
            <button
              onClick={downloadExcel}
              className="p-2 bg-black text-white rounded flex items-center gap-2"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <table className="w-full">
          {/* Table Header */}
          <thead className="border-y-2 border-red-400 bg-white">
            <tr>
              {["COUNTRY", "NAME", "LASTNAME", "EMAIL", "STATUS", "PHONE", "ACTIONS"].map((label, index) => (
                <th
                  key={index}
                  className="p-4 text-center font-semibold cursor-pointer"
                  onClick={() => requestSort(label.toLowerCase())}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>{label}</span>
                    <div className="flex flex-col items-center">
                      <FaSortUp className={sortConfig.key === label.toLowerCase() && sortConfig.direction === "asc" ? "text-black" : "text-gray-300"} />
                      <FaSortDown className={sortConfig.key === label.toLowerCase() && sortConfig.direction === "desc" ? "text-black" : "text-gray-300"} />
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-3 text-center">{user.country}</td>
                <td className="text-center">{user.firstName}</td>
                <td className="text-center">{user.lastName}</td>

                {/* EMAIL Column with Word Wrapping */}
                <td className="text-center break-words p-3">
                  {user.email}
                </td>

                {/* STATUS Column with Proper Alignment */}
                <td className="p-2 text-center">
                  <div
                    className={`inline-block w-40 px-3 py-1 rounded-xl border ${user.status === "Active"
                      ? "bg-green-100 border-green-300"
                      : "bg-red-100 border-red-300"
                      }`}
                  >
                    {user.status}
                  </div>
                </td>

                <td className="p-2 text-center">{user.phone}</td>

                {/* ACTIONS Column */}
                <td className="p-2 flex gap-4 justify-center">
                  {/* 
                     Edit Button:
                     This button was originally used in the Admin Panel to trigger the editing of a specific user's information.
                     When clicked, it would call the handleEdit(user) function, passing the current user object.
                     The handleEdit function was expected to open a modal or form pre-filled with the user's data for editing.
                     This code is currently commented out because the admin considered this functionality to be illogical or unnecessary.
                 */}
                  {/* 
                     <button
                       className="text-black border border-black w-6 h-6 rounded-md"
                       onClick={() => handleEdit(user)}
                     >
                       <MdEdit size={20} />                   
                     </button> 
                   */}

                  <button
                    className="text-[#EC6453] border border-black w-[1.6rem] h-[1.5rem] px-[0.16rem] rounded-md"
                    onClick={() => handleDelete(user)}
                  >
                    <MdDelete size={20} />
                  </button>
                  <button
                    className="text-black border border-black w-7 h-6 rounded-md px-[0.16rem]"
                    onClick={() => handleHistory(user)}
                  >
                    <RiHistoryLine size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-4">
          {/* Display Total Sessions */}
          <div className="text-md text-[red] mb-2">
            Total: {filteredUsers.length}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mb-[7rem]">
          <div className="flex gap-6 p-2 border rounded-lg bg-white shadow-md shadow-gray-400">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-500 cursor-not-allowed" : "text-red-500"
                }`}
            >
              <IoIosArrowBack size={20} />
            </button>

            {/* Pagination Numbers */}
            {[...Array(totalPages)].map((_, number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-base ${currentPage === number + 1 ? "bg-red-500 text-white" : "text-[#FA9E93] bg-white"
                  }`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages ? "text-gray-500 cursor-not-allowed" : "text-red-500"
                }`}
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl w-[50vw] shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div className="mb-4">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                className="p-2 w-full border border-gray-300 rounded-lg"
                value={currentUser?.email || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Phone Number</label>
              <input
                type="tel"
                className="p-2 w-full border border-gray-300 rounded-lg"
                value={currentUser?.phone || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
              />
              <p className="text-sm text-gray-500 mt-1">
                Country will be automatically updated based on phone number
              </p>
            </div>

            <div className="flex justify-center w-full gap-[5rem]">
              <div className="flex w-full justify-evenly">
                <button
                  onClick={handleUpdate}
                  className="w-[40%] px-6 py-4 mb-5 bg-blue-500 text-white rounded-lg "
                >
                  Update
                </button>
                <button
                  onClick={handleDeactivate}
                  className="w-[40%] px-6 py-4 mb-5 bg-blue-500 text-white rounded-lg"
                >
                  Deactivate
                </button>
              </div>
            </div>
            <div className="flex justify-center ">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="w-52 px-6 py-4 bg-gray-300 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl w-[40vw] shadow-lg border border-gray-300">
            <h2 className="text-xl text-left font-semibold mb-4">Confirm Delete</h2><hr className="border-red-600" />
            <p className="mb-6 mt-4 text-left text-gray-600">
              Are you sure you want to delete this user permanently?
              <br /> You can't undo this action.
            </p><hr className="border-red-600 mb-5" />
            <div className="flex justify-between">
              <button
                onClick={handleConfirmDelete}
                className="px-14 py-2 bg-red-500 text-white rounded-lg text-md font-semibold"
              >
                DELETE
              </button>
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-14 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-lg font-semibold"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Popup */}
      {isHistoryPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl w-[50vw] shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4">Booking History</h2>
            <table className="w-full rounded-md border border-[#D9D9D9] shadow-md">
              <thead className="border-y-2 border-[#D9D9D9] bg-[#D9D9D9]">
                <tr>
                  <th className="p-2 text-left">Booking Id</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Service</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {userHistory.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="p-2">{booking.bookingId}</td>
                    <td className="p-2">{booking.date}</td>
                    <td className="p-2">{booking.areaOfExpertise}</td>
                    <td
                      className={`p-2 border text-center ${booking.status === "Completed"
                        ? "bg-[#4CB269] text-white"
                        : "bg-[#FFA629] text-white"
                        }`}
                    >
                      {booking.status}
                    </td>
                    <td className="p-2">{booking.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-right">
              <button
                onClick={() => setIsHistoryPopupOpen(false)}
                className="text-black mt-4 px-6 py-2 rounded-lg border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;