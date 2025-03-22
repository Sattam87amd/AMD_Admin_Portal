"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // For redirect
import { Search } from "lucide-react";
import { FaDownload, FaRegFlag } from "react-icons/fa";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

const Review = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;
  const router = useRouter(); // Use Next.js router for navigation

  // Dummy review data 
  const dummyReviews = [
    {
      reviewId: "A3J933",
      expert: "raihan",
      rating: "4 STARS",
      content: "radiovan@gmail.com",
    },
    {
      reviewId: "A3J934",
      expert: "john",
      rating: "5 STARS",
      content: "john.doe@example.com",
    },
    {
      reviewId: "A3J935",
      expert: "alex",
      rating: "3 STARS",
      content: "alex@example.com",
    },
    {
      reviewId: "A3J933",
      expert: "raihan",
      rating: "4 STARS",
      content: "radiovan@gmail.com",
    },
    {
      reviewId: "A3J933",
      expert: "raihan",
      rating: "4 STARS",
      content: "radiovan@gmail.com",
    },
    {
      reviewId: "A3J936",
      expert: "raihan",
      rating: "4 STARS",
      content: "radiovan@gmail.com",
    },
    {
      reviewId: "A3J933",
      expert: "raihan",
      rating: "4 STARS",
      content: "radiovan@gmail.com",
    },
    {
      reviewId: "A3J935",
      expert: "alex",
      rating: "3 STARS",
      content: "alex@example.com",
    },
  ];

  // Filter reviews based on search query
  const filteredReviews = dummyReviews.filter((review) =>
    review.expert.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle button click for CSV Export
  const handleExport = () => {
    router.push("/export-page"); // Redirect to /export-page
  };

  // Handle Approve/Reject/Flag action
  const handleAction = (action, reviewId) => {
    if (action === "approve") {
      alert(`✅ Review ${reviewId} has been approved.`);
    } else if (action === "reject") {
      alert(`❌ Review ${reviewId} has been rejected.`);
    } else if (action === "flag") {
      alert(` Review ${reviewId} has been flagged for review.`);
    }
  };

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex justify-center w-full p-6 bg-white">
      <div className="w-11/12">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-[#191919]">
            REVIEWS/FEEDBACK
          </h1>

          {/* Export as CSV Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 text-red-500 text-sm cursor-pointer"
          >
            <FaDownload />
            Export as CSV Format
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6 w-1/3">
          <div>
            <h2 className="text-[#191919]">Search by Name</h2>
          </div>
          <div className="absolute h-6 w-6 bg-[#EC6453] rounded-full mt-2 ml-2">
            <Search className="m-1 text-white" size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 rounded-xl border border-gray-300 w-72 bg-gray-100 text-gray-700 focus:outline-none pl-10"
            placeholder="Search by Name"
          />
        </div>

        {/* Data Table */}
        <table className="w-full">
          <thead className="bg-white border-y-2 border-[#FA9E93]">
            <tr>
              <th className="p-3 text-center">REVIEW ID</th>
              <th className="p-3 text-center">EXPERT</th>
              <th className="p-3 text-center">RATING</th>
              <th className="p-3 text-center">CONTENT</th>
              <th className="p-3 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {currentReviews.length > 0 ? (
              currentReviews.map((review, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 border-b border-gray-200"
                >
                  <td className="p-3 text-center">{review.reviewId}</td>
                  <td className="p-3 text-center">{review.expert}</td>
                  <td className="p-3 text-center">{review.rating}</td>
                  <td className="p-3 text-center">{review.content}</td>
                  <td className="p-3 flex justify-center items-center gap-3">
                    {/* Approve Button */}
                    <button
                      onClick={() => handleAction("approve", review.reviewId)}
                      className="bg-green-500 text-white px-3 py-2 rounded-lg text-lg cursor-pointer"
                    >
                      ✔️
                    </button>
                    {/* Reject Button */}
                    <button
                      onClick={() => handleAction("reject", review.reviewId)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-lg cursor-pointer"
                    >
                      ✖️
                    </button>
                    {/* Flag Button */}
                    <button
                      onClick={() => handleAction("flag", review.reviewId)}
                      className="bg-black text-white px-3 py-2 rounded-lg text-lg cursor-pointer"
                    >
                      <FaRegFlag />
                    </button>
                  </td>
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
          <div className="flex gap-6 p-2 border rounded-lg bg-white">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-500"
              }`}
            >
              <MdKeyboardArrowLeft size={20} />
            </button>

            {/* Pagination Numbers */}
            {[...Array(Math.ceil(filteredReviews.length / reviewsPerPage)).keys()].map(
              (number) => (
                <button
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-base ${
                    currentPage === number + 1
                      ? "bg-red-500 text-white"
                      : "text-[#FA9E93] bg-white"
                  }`}
                >
                  {number + 1}
                </button>
              )
            )}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)
              }
              className={`p-2 rounded-lg ${
                currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-red-500"
              }`}
            >
              <MdKeyboardArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Review;
