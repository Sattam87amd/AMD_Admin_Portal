"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

const Domain = () => {
  const [expertCounts, setExpertCounts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalExperts, setTotalExperts] = useState(0);

  useEffect(() => {
    const fetchExpertCounts = async () => {
      try {
        const response = await axios.get("http://localhost:5070/api/expertauth");

        // Group experts by their areaOfExpertise and count them
        const areaCounts = response.data.data.reduce((acc, expert) => {
          const area = expert.areaOfExpertise;
          if (acc[area]) {
            acc[area] += 1; // Increment count for the area
          } else {
            acc[area] = 1; // Initialize count for new area
          }
          return acc;
        }, {});

        // Calculate total experts
        const total = Object.values(areaCounts).reduce((sum, count) => sum + count, 0);
        setTotalExperts(total);

        // Convert the object into an array of objects with areaOfExpertise and count
        const formattedCounts = Object.keys(areaCounts).map((area) => ({
          areaOfExpertise: area,
          count: areaCounts[area],
        }));

        // Set the chart data with random colors
        const chartDataFormatted = formattedCounts.map((item) => ({
          domain: item.areaOfExpertise,
          value: item.count,
          fill: getRandomColor(),
        }));

        setChartData(chartDataFormatted);
        setExpertCounts(formattedCounts);
      } catch (error) {
        console.error("Error fetching expert counts:", error);
      }
    };

    fetchExpertCounts();
  }, []);

  // Helper function to generate random colors for the pie chart
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <div className="h-0.5 w-[76rem] bg-gray-300 mt-10 ml-5"></div>

      {/* Main Container */}
      <div className="w-[68.75rem] mx-[3rem] my-10 rounded-lg p-8">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold -ml-16">
            Domain-wise Experts Popularity among Users
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* LEFT SIDE: Pie Chart */}
          <div className="md:w-1/2 w-full flex flex-col items-center">
            <PieChart width={650} height={500}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0} // Increased to fill inside more
                outerRadius={160} // Increased to fill the space
                fill="#8884d8"
                paddingAngle={0}
                dataKey="value"
                label={({ index }) => chartData[index]?.domain} // Show domain names
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>

            {/* Legend Below Pie Chart */}
            <div className="flex flex-wrap gap-6 text-sm justify-center mt-4">
              {chartData.map((item) => (
                <div key={item.domain} className="flex items-center space-x-2">
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-base">{item.domain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Domain Statistics Panel */}
          <div className="md:w-1/2 w-full space-y-6">
            {expertCounts.map((item) => {
              const percentage = ((item.count / totalExperts) * 100).toFixed(2);
              return (
                <div
                  key={item.areaOfExpertise}
                  className="grid grid-cols-2 gap-6 items-center border-b pb-4"
                >
                  {/* Left Section: Domain + Percentage */}
                  <div className="flex  items-center space-x-3">
                    <div className="flex flex-col justify-between">
                      <span className="font-semibold text-[13px]">{item.areaOfExpertise}</span>
                      <span className="text-lg font-semibold">{percentage}%</span>
                    </div>
                  </div>

                  {/* Middle Section: New Users
                  <div className="text-center">
                    <span className="text-base text-muted-foreground">
                      <span className="font-semibold text-lg">N/A</span> New users
                    </span>
                  </div> */}

                  {/* Right Section: Total Users */}
                  <div className="text-right">
                    <span className="text-base text-muted-foreground">
                      Total <br />
                      <span className="font-semibold text-lg">{item.count}</span>
                      <br />
                      experts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Domain;
