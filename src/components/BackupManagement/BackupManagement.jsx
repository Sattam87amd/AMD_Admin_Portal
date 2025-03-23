"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { MdDelete } from "react-icons/md"; // Delete Icon

import { RiArrowDropDownLine } from "react-icons/ri";

import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

const BackupManagement = () => {
    // State for search query and pagination
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProvider, setSelectedProvider] = useState('Google Drive'); // Default option

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const backupsPerPage = 5;
    // Handle selecting a provider
    const handleSelectProvider = (provider) => {
        setSelectedProvider(provider);
        setIsDropdownOpen(false); // Close dropdown after selection
    };
    // Dummy backup data
    const [backupHistoryData, setBackupHistoryData] = useState([
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Local',
        },
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Cloud(AWS)',
        },
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Google Drive',
        },
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Local',
        },
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Cloud(AWS)',
        },
        {
            dateTime: '2025-02-26 02:00 PM',
            fileName: 'backup-2025-02-26',
            fileSize: '15 MB',
            storageLocation: 'Google Drive',
        },
    ]);

    // Filter backup data based on search query
    const filteredBackups = backupHistoryData.filter((backup) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            backup.fileName.toLowerCase().includes(searchLower) ||
            backup.fileSize.toLowerCase().includes(searchLower) ||
            backup.storageLocation.toLowerCase().includes(searchLower)
        );
    });


    // Handle dropdown toggle
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    // Pagination logic
    const indexOfLastBackup = currentPage * backupsPerPage;
    const indexOfFirstBackup = indexOfLastBackup - backupsPerPage;
    const currentBackups = filteredBackups.slice(indexOfFirstBackup, indexOfLastBackup);

    // Handle delete functionality
    const handleDelete = (index) => {
        const updatedData = backupHistoryData.filter((_, i) => i !== index);
        setBackupHistoryData(updatedData);
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Change background color for storage location based on type
    const getStorageLocationClass = (storageLocation) => {
        switch (storageLocation) {
            case 'Google Drive':
                return 'w-28 bg-green-500 text-white'; // Google Drive
            case 'Cloud(AWS)':
                return 'bg-blue-400 text-white'; // Cloud(AWS)
            case 'Local':
                return 'bg-gray-200 text-black'; // Local
            default:
                return '';
        }
    };

    return (
        <div className="flex justify-center w-full min-h-screen p-6 bg-white overflow-x-scroll">
            <div className="w-full max-w-screen-xl px-4">
                <h1 className="text-2xl font-bold mb-4 text-[#191919]">BACKUP MANAGEMENT</h1>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <h2 className="text-[#191919] text-2xl">Backup History</h2>
                </div>

                {/* Backup History Table */}
                <div className="overflow-x-auto w-full ">
                    <table className="w-full">
                        <thead className="border-y-2 border-[#FA9E93]  ">
                            <tr>
                                <th className="p-2 text-center">DATE/TIME</th>
                                <th className="p-2 text-center">FILE NAME</th>
                                <th className="p-2 text-center">FILE SIZE</th>
                                <th className="p-2 text-center">STORAGE LOCATION</th>
                                <th className="p-2 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBackups.map((backup, index) => (
                                <tr key={index} className="hover:bg-gray-100  ">
                                    <td className="p-2 space-y-6 ">{backup.dateTime}</td>
                                    <td className="p-2">{backup.fileName}</td>
                                    <td className="p-2">{backup.fileSize}</td>
                                    <td className={`p-2 text-center rounded-lg ${getStorageLocationClass(backup.storageLocation)}`}>
                                        {backup.storageLocation}
                                    </td>
                                    <td className="p-2 text-center">
                                        <button
                                            className="text-[#EC6453] border border-black w-[1.6rem] h-[1.5rem] px-[0.16rem] rounded-md"
                                            onClick={() => handleDelete(index)}
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-4">
                    <div className="flex gap-6 p-2 border rounded-lg bg-white">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500'}`}
                        >
                            <MdKeyboardArrowLeft size={20} />
                        </button>

                        {/* Pagination Numbers */}
                        {[...Array(Math.ceil(filteredBackups.length / backupsPerPage)).keys()].map((number) => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`w-8 h-8 flex items-center justify-center rounded-lg text-base ${currentPage === number + 1
                                        ? 'bg-red-500 text-white'
                                        : 'text-[#FA9E93] bg-white'
                                    }`}
                            >
                                {number + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredBackups.length / backupsPerPage)}
                            className={`p-2 rounded-lg ${currentPage === Math.ceil(filteredBackups.length / backupsPerPage) ? 'text-gray-300 cursor-not-allowed' : 'text-red-500'}`}
                        >
                            <MdKeyboardArrowRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Backup Settings */}
                <div className="mt-8 border rounded-xl p-10 ">
                    <h2 className="text-xl font-bold mb-4">Backup Settings</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-[#191919]">Retention Policy (Days)</label>
                        <input
                            type="number"
                            placeholder="Enter Retention Policy"
                            className="mt-1 p-2 rounded-lg border w-full"
                        />
                        <p className='text-sm text-[#979797]  ' >Backup older than 15 days will be moved to cloud storage</p>
                    </div>
                    {/* Cloud Storage Provider Dropdown */}
                    <div className="relative mt-4 mb-4">
                        <button
                            onClick={toggleDropdown}
                            className="p-2 rounded-xl w-full border text-[#191919] flex items-center justify-between gap-3"
                        >
                            {selectedProvider}
                            <RiArrowDropDownLine size={20} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-[52rem] top-full bg-white border border-gray-300 w-40 mt-1  shadow-lg">
                                <button
                                    onClick={() => handleSelectProvider('Google Drive')}
                                    className="px-4 py-2 border-b text-sm w-full text-left hover:bg-gray-100"
                                >
                                    Google Drive
                                </button>
                                <button
                                    onClick={() => handleSelectProvider('AWS')}
                                    className="px-4 py-2 border-b text-sm w-full text-left hover:bg-gray-100"
                                >
                                    AWS
                                </button>
                                <button
                                    onClick={() => handleSelectProvider('Dropbox')}
                                    className="px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                                >
                                    Dropbox
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-start gap-4">
                        <button className="p-2 bg-[#D9D9D9] text-[#191919] rounded">Save Settings</button>
                        <button className="p-2 bg-[#D9D9D9] text-[#191919] rounded">Create Backup Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackupManagement;
