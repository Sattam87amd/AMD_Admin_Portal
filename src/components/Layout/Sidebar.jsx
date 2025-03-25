"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUserAlt,
  FaCreditCard,
  FaThumbsUp,
  FaCogs,
  FaDatabase,
  FaAngleDown,
  FaAngleUp,
  FaUserCog,
  FaMoneyBillAlt,
  FaRegHandshake,
  FaCalendar,
} from "react-icons/fa";

const AdminSidebar = () => {
  const router = useRouter(); // Initialize router
  const pathname = usePathname(); // Get current route path

  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [adminLogsOpen, setAdminLogsOpen] = useState(false); // State for Admin Logs dropdown

  const handleToggle = (setState) => {
    setState((prevState) => !prevState); // Toggle dropdown state
  };

  const handleTabClick = (route, toggle = false) => {
    if (route) {
      router.push(route); // Navigate to the provided route
    }

    if (toggle) {
      toggle(); // Toggle dropdown if the item has a dropdown
    }
  };

  // Check if the route is active or default to Dashboard if no route is selected
  const isActive = (route) => {
    return pathname === route || (pathname === "/" && route === "/dashboard");
  };

  return (
    <div className="w-full h-auto bg-[#E6E6E6] p-4 rounded-3xl">
      <div className="space-y-2">
        {/* Sidebar Button Component */}
        {[ 
          { name: "Dashboard", icon: <FaTachometerAlt />, route: "/dashboard" },
          {
            name: "User Management",
            icon: <FaUserAlt />,
            route: "/usermanagement",
            state: userManagementOpen,
            toggle: () => handleToggle(setUserManagementOpen),
            subItems: [
              {
                name: "Session Management",
                icon: <FaUserCog />,
                route: "/sessionmanagement",
              },
            ],
          },
          {
            name: "Experts On App",
            icon: <FaUserAlt />,
            route: "/experts",
          },
          {
            name: "Pending Expert Requests",
            icon: <FaRegHandshake />,
            route: "/pendingexpertsrequest",
          },
          {
            name: "Payments & Finance",
            icon: <FaCreditCard />,
            route: "/paymentfinance",
            state: paymentsOpen,
            toggle: () => handleToggle(setPaymentsOpen),
            subItems: [
              { name: "Overview", icon: <FaMoneyBillAlt />, route: "/overview" },
              {
                name: "Transactions",
                icon: <FaMoneyBillAlt />,
                route: "/transactions",
              },
              {
                name: "Withdrawal",
                icon: <FaMoneyBillAlt />,
                route: "/withdrawal",
              },
            ],
          },
          {
            name: "Reviews/Feedback",
            icon: <FaThumbsUp />,
            route: "/review",
          },
          {
            name: "Admin Logs",
            icon: <FaCalendar />,
            state: adminLogsOpen,
            toggle: () => handleToggle(setAdminLogsOpen),
            subItems: [
              { name: "Discount Management", icon: <FaCogs />, route: "/discount" },
            ],
            route: "/adminlogs",
          },
          {
            name: "Settings",
            icon: <FaCogs />,
            route: "/settings",
          },
          {
            name: "Backup Management",
            icon: <FaDatabase />,
            route: "/backupmanagement",
          },
        ].map((item, index) => (
          <div key={index}>
            {/* Main Sidebar Button */}
            <div
              onClick={
                item.toggle
                  ? () => handleTabClick(item.route, item.toggle) // If toggle is present, call toggle function and navigate
                  : () => handleTabClick(item.route) // Just navigate if no toggle
              }
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                isActive(item.route) && !item.subItems
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {item.toggle && (item.state ? <FaAngleUp /> : <FaAngleDown />)}
            </div>

            {/* Sub Items */}
            {item.subItems && item.state && (
              <div className="pl-6 space-y-2">
                {item.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => handleTabClick(subItem.route)}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      isActive(subItem.route)
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
                    }`}
                  >
                    {subItem.icon}
                    <span>{subItem.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
