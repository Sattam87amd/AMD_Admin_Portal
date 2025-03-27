"use client";

import React, { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { utils, writeFile } from "xlsx";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { RiHistoryLine } from "react-icons/ri";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Popup and History state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isHistoryPopupOpen, setIsHistoryPopupOpen] = useState(false);
  const [userHistory, setUserHistory] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

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
      country: "United States",
      name: "John",
      username: "JohnDoe",
      email: "john.doe@example.com",
      status: "Active",
      phone: "+1234567890",
    },
    {
      country: "Canada",
      name: "Alice",
      username: "Alice2023",
      email: "alice@example.com",
      status: "Deactivate",
      phone: "+1122334455",
    },
    {
      country: "Germany",
      name: "Hans",
      username: "HansG",
      email: "hans.g@example.com",
      status: "Active",
      phone: "+49876543210",
    },
    {
      country: "France",
      name: "Marie",
      username: "MarieF",
      email: "marie.f@example.com",
      status: "Active",
      phone: "+33123456789",
    },
  ];

  const dummyHistory = [
    { bookingId: "Bk-001", date: "2025-02-10", service: "Consultation", status: "Completed", amount: "$150" },
    { bookingId: "Bk-002", date: "2025-02-10", service: "Consultation", status: "Pending", amount: "$75" },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const countryList = data.map((country) => ({
          name: country.name.common,
          flag: country.flags.png,
        }));
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();

    const storedUsers = JSON.parse(localStorage.getItem("users")) || dummyUsers;
    setUsers(storedUsers);
    setFilteredUsers(storedUsers);
    localStorage.setItem("users", JSON.stringify(storedUsers));
  }, []);

  useEffect(() => {
    let tempUsers = [...users];

    if (selectedCountry !== "All") {
      tempUsers = tempUsers.filter((user) => user.country === selectedCountry);
    }

    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        user.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1);
  }, [selectedCountry, searchQuery, users]);

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
    const updatedUsers = users.map((user) =>
      user.username === currentUser.username
        ? { ...user, ...currentUser }
        : user
    );
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setIsPopupOpen(false);
  };

  const handleHistory = (user) => {
    setUserHistory(dummyHistory);
    setIsHistoryPopupOpen(true);
  };

  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDeletePopupOpen(true);
  };

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
        <h1 className="text-2xl font-bold mb-4 text-[#191919]">USER MANAGEMENT</h1>

        {/* Filter Section */}
        <div className="flex gap-4 items-center mb-6">
          <div>
            <label className="block mb-1 text-md text-[#191919]">Select Country</label>
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

          <div>
            <label className="block mb-1 text-md text-[#191919]">Search by Country</label>
            <div className="relative">
              <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
                <Search className="m-1 text-white" size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 rounded-full border border-gray-300 w-48 bg-gray-100 text-gray-700 focus:outline-none pl-10"
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
            {currentItems.map((user) => (
              <tr key={user.username} className="hover:bg-gray-100">
                <td className="p-2 text-center">{user.country}</td>
                <td className="p-2 text-center">{user.name}</td>
                <td className="p-2 text-center">{user.username}</td>
                <td className="p-2 text-center">{user.email}</td>
                <td className="p-2 text-center">
                  <div className={`inline-block w-40 px-3 py-1 rounded-xl border ${
                    user.status === 'Active' 
                      ? 'bg-green-100 border-green-300' 
                      : 'bg-red-100 border-red-300'
                  }`}>
                    {user.status}
                  </div>
                </td>
                <td className="p-2 text-center">{user.phone}</td>
                <td className="p-2 flex gap-4 justify-center">
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

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <div className="flex gap-2 p-2 border rounded-lg bg-white shadow-lg shadow-gray-400">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-red-500"
                }`}
            >
              <IoIosArrowBack size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
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
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg ${currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-red-500"
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
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Phone</label>
              <input
                type="tel"
                className="p-2 w-full border border-gray-300 rounded-lg"
                value={currentUser?.phone || ""}
                onChange={(e) => setCurrentUser({ ...currentUser, phone: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Status</label>
              <select
                value={currentUser?.status}
                onChange={(e) => setCurrentUser({ ...currentUser, status: e.target.value })}
                className="p-2 w-full border border-gray-300 rounded-lg"
              >
                <option value="Active">Active</option>
                <option value="Deactivate">Deactivate</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
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
          <div className="bg-white p-6 rounded-2xl w-[50vw] shadow-lg border border-white">
            <h2 className="text-xl font-bold mb-4">Delete User</h2>
            <p className="mb-4">Are you sure you want to delete this user?</p>
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeletePopupOpen(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;