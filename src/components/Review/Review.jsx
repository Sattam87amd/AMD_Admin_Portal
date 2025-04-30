"use client"

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Download } from "lucide-react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5070/api/adminauth/review";

const Review = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const reviewsPerPage = 6;

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5070/api/adminauth/review`);
        console.log("API Response:", response.data);
        
        if (response.data.success) {
          // Map the backend data to match our frontend structure
          const formattedReviews = response.data.feedback.map((item, index) => ({
            reviewId: item._id.toString().slice(-4) || `review-${index}`,
            expert: item.expertName || "Unknown Expert",
            rating: item.Rating ? `${item.Rating} STARS` : "No Rating",
            content: item.comment || "No Comment"
          }));
          
          setReviews(formattedReviews);
        } else {
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Sort table data
  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    
    const sortedReviews = [...reviews].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    setReviews(sortedReviews);
  };

  // Filter reviews based on search query
  const filteredReviews = reviews.filter((review) =>
    review.expert.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Approve/Reject/Flag action - commented out as not needed
  /*
  const handleAction = async (action, reviewId) => {
    try {
      // This is a placeholder - you need to implement the actual API endpoints
      if (action === "approve") {
        // await axios.patch(`${API_BASE_URL}/approve/${reviewId}`);
        alert(`✅ Review ${reviewId} has been approved.`);
      } else if (action === "reject") {
        // await axios.patch(`${API_BASE_URL}/reject/${reviewId}`);
        alert(`❌ Review ${reviewId} has been rejected.`);
      } else if (action === "flag") {
        // await axios.patch(`${API_BASE_URL}/flag/${reviewId}`);
        alert(`🚩 Review ${reviewId} has been flagged for further review.`);
      }
      
      // Refresh the reviews list after action
      const response = await axios.get(`http://localhost:5070/api/adminauth/review`);
      if (response.data.success) {
        const formattedReviews = response.data.feedback.map((item, index) => ({
          reviewId: item._id || `review-${index}`,
          expert: item.expertName || "Unknown Expert",
          rating: item.Rating ? `${item.Rating} STARS` : "No Rating",
          content: item.comment || "No Comment"
        }));
        setReviews(formattedReviews);
      }
    } catch (err) {
      alert(`Failed to perform action: ${err.message}`);
    }
  };
  */

  // Export to Excel
  const exportToExcel = () => {
    const dataForExport = filteredReviews.map(review => ({
      "REVIEW ID": review.reviewId,
      "EXPERT": review.expert,
      "RATING": review.rating,
      "COMMENT": review.content
    }));
    
    const ws = utils.json_to_sheet(dataForExport);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Reviews");
    writeFile(wb, "expert_reviews.xlsx");
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Define column headers
  const columns = [
    { key: "reviewId", label: "REVIEW ID" },
    { key: "expert", label: "EXPERT" },
    { key: "rating", label: "RATING" },
    { key: "content", label: "COMMENT" }
  ];

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#191919]">REVIEWS/FEEDBACK</h1>

          {/* Export as Excel Button */}
          <div className="ml-auto mt-6">
            <button
              onClick={exportToExcel}
              className="p-2 bg-black text-white rounded flex items-center gap-2"
            >
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 w-1/3">
          <div>
            <h2 className="text-[#191919]">Search by Expert</h2>
          </div>
          <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
            <Search className="m-1 text-white" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-xl border border-black w-72 bg-[#E6E6E6] text-gray-700 focus:outline-none pl-10"
            placeholder="Search expert name..."
          />
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            {/* Data Table */}
            <table className="w-full border-collapse border border-white">
              <thead className="border-y-2 border-red-300 bg-white">
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} className="p-3 text-center font-semibold relative">
                      <div className="inline-flex items-center gap-2">
                        <span className="uppercase">{column.label}</span>
                        <div className="flex flex-col items-center">
                          <FaSortUp
                            onClick={() => sortTable(column.key)}
                            className={`text-xs cursor-pointer ml-4 ${sortConfig.key === column.key && sortConfig.direction === "asc" ? "text-gray-200" : "text-black"}`}
                          />
                          <FaSortDown
                            onClick={() => sortTable(column.key)}
                            className={`text-xs -mt-1 cursor-pointer ml-4 ${sortConfig.key === column.key && sortConfig.direction === "desc" ? "text-gray-200" : "text-black"}`}
                          />
                        </div>
                      </div>
                      {index !== columns.length - 1 && <div className="absolute right-0 top-1/2 transform -translate-y-1/2 h-9 border-l border-black"></div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReviews.length > 0 ? (
                  currentReviews.map((review, index) => (
                    <tr key={index} className="hover:bg-gray-100 border-b border-gray-200">
                      <td className="p-3 text-center">{review.reviewId}</td>
                      <td className="p-3 text-center">{review.expert}</td>
                      <td className="p-3 text-center">{review.rating}</td>
                      <td className="p-3 text-center">{review.content}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                      No reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Total Count */}
            <div className="text-center text-sm mt-4 text-[#FA9E93]">
              {filteredReviews.length}{" "}
              {filteredReviews.length === 1 ? "Result" : "Total"}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-4">
              <div className="flex gap-2 p-2 border rounded-lg bg-white shadow-lg shadow-gray-400">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-red-500"
                    }`}
                >
                  <MdKeyboardArrowLeft size={20} />
                </button>

                {/* Page Numbers with Ellipsis */}
                {(() => {
                  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
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

                {/* Next Button */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)}
                  className={`p-2 rounded-lg ${currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-500"
                    }`}
                >
                  <MdKeyboardArrowRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Review;