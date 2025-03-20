"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { MdEdit } from "react-icons/md"; // Edit Icon
import { MdDelete } from "react-icons/md"; // Delete Icon
import { RiHistoryLine } from "react-icons/ri"; // History Icon

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [lastActive, setLastActive] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  // New state for handling edit and delete popup visibility and current user data
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Dummy User Data (matches Attachment 6)
  const dummyUsers = [
    {
      country: "Belarus",
      name: "Ivan",
      username: "Ravian",
      email: "radioivan@gmail.com",
      status: "Active",
      phone: "+9876543210",
    },
    {
      country: "India",
      name: "Ram",
      username: "Ram123",
      email: "ram123@gmail.com",
      status: "Deactivate",
      phone: "+9876543210",
    },
    {
      country: "India",
      name: "Lakhan",
      username: "Lakhan123",
      email: "lakhan123@gmail.com",
      status: "Suspended",
      phone: "+9876543210",
    },
    {
      country: "UK",
      name: "Aeran",
      username: "Aeran123",
      email: "aeran123@gmail.com",
      status: "Active",
      phone: "+9876543210",
    },
    {
      country: "Netherlands",
      name: "Jiteksi",
      username: "Jiteksi123",
      email: "jiteksi123@gmail.com",
      status: "Deactivate",
      phone: "+9876543210",
    },
    {
      country: "USA",
      name: "Iranks",
      username: "Iranks123",
      email: "iranks123@gmail.com",
      status: "Active",
      phone: "+9876543210",
    },
    // Add more dummy users if needed
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
    setCurrentPage(1); // Reset to the first page whenever filters change
  }, [selectedCountry, searchQuery, users]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Download Data to Excel
  const downloadExcel = () => {
    const ws = utils.json_to_sheet(filteredUsers);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Users");
    writeFile(wb, "UserManagement.xlsx");
  };

  // Open Popup on Edit Button Click
  const handleEdit = (user) => {
    setCurrentUser(user);
    setIsPopupOpen(true);
  };

  // Handle Update - Save changes to localStorage
  const handleUpdate = () => {
    const updatedUsers = users.map((user) =>
      user.username === currentUser.username
        ? { ...user, email: currentUser.email, phone: currentUser.phone }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsPopupOpen(false);
  };

  // Handle Deactivate/Activate - Toggle user status
  const handleStatusToggle = () => {
    const updatedStatus =
      currentUser.status === "Active" ? "Deactivate" : "Active";
    const updatedUsers = users.map((user) =>
      user.username === currentUser.username
        ? { ...user, status: updatedStatus }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsPopupOpen(false);
  };

  // Open Delete Popup on Delete Button Click
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = () => {
    const updatedUsers = users.filter(
      (user) => user.username !== userToDelete.username
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsDeletePopupOpen(false);
  };

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        <h1 className="text-2xl font-bold mb-4 text-[#191919] ">
          USER MANAGEMENT
        </h1>

        {/* Filter Section */}
        <div className="flex gap-4 items-center mb-6">
          {/* Country Dropdown */}
          <div>
            <label className="block mb-1 text-md text-[#191919] ">
              Select Country
            </label>
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

          {/* Last Active Dropdown */}
          <div>
            <label className="block mb-1 text-md text-[#191919] ">
              Select by Last Active
            </label>
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

          {/* Search by Country */}
          <div>
            <label className="block mb-1 text-md text-[#191919] ">
              Select by Country
            </label>
            <div className="relative">
              <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
                <Search className="m-1 text-white" size={16} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 rounded-full border border-gray-300 w-48 bg-gray-100 text-gray-700 focus:outline-none pl-10" // Added `pl-10` to provide space for the icon
              />
            </div>
          </div>




          {/* Download Button */}
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
          <thead className="border-y-2 border-[#FA9E93]">
            <tr>
              <th className="p-2 text-center">COUNTRY NAME</th>
              <th className="p-2 text-center">NAME</th>
              <th className="p-2 text-center">USERNAME</th>
              <th className="p-2 text-center">EMAIL</th>
              <th className="p-2 text-center">STATUS</th>
              <th className="p-2 text-center">PHONE NUMBER</th>
              <th className="p-2 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-2">{user.country}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2 text-center inline-block w-40 px-3 py-1 rounded-xl border ">{user.status}</td>
                <td className="p-2">{user.phone}</td>
                <td className="p-2 flex gap-4">
                  <button
                    className="text-black border border-black w-6 h-6 rounded-md"
                    onClick={() => handleEdit(user)}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    className="text-[#EC6453] border border-black w-[1.6rem] h-[1.5rem] px-[0.16rem] rounded-md"
                    onClick={() => handleDelete(user)}
                  >
                    <MdDelete size={20} />
                  </button>
                  <button className="text-black border border-black w-7 h-6 rounded-md px-[0.16rem]">
                    <RiHistoryLine size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {Array.from(
            { length: Math.ceil(filteredUsers.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1
                    ? "bg-[#C91416] text-white"
                    : "bg-gray-200"
                  }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      {/* Edit Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 opacity-90">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg opacity-[150%]">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <div>
              <label className="block text-md mb-1">Email</label>
              <input
                type="email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded-lg"
              />
              <label className="block text-md mb-1">Phone Number</label>
              <input
                type="text"
                value={currentUser.phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-[#5858FA] text-white p-2 w-full rounded-lg"
              >
                UPDATE
              </button>
              <button
                onClick={handleStatusToggle}
                className="bg-[#5858FA] text-white p-2 w-full rounded-lg"
              >
                {currentUser.status === "Active" ? "DEACTIVATE" : "ACTIVATE"}
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsPopupOpen(false)}
                className=" border text-black p-2 w-38 px-10 rounded-lg"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-500 opacity-90">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg  ">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Confirm Delete
            </h2>
            <p className="mb-4 border border-t-[#FA9E93] border-b-[#FA9E93] border-l-white border-r-white ">
              Are you sure you want to delete user permanently? You can’t undo
              this action.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="bg-gray-300 text-black p-2 w-full rounded-lg"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white p-2 w-full rounded-lg"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
