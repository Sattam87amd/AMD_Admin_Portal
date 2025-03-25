"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter for navigation
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
} from "react-icons/fa";

const AdminSidebar = () => {
  const router = useRouter();  // Initialize the router
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [adminLogsOpen, setAdminLogsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleToggle = (setState) => {
    setState((prevState) => !prevState);
  };

  const handleTabClick = (tabName, route) => {
    setActiveTab(tabName);  // Set the active tab
    if (route) {
      router.push(route);  // Navigate to the provided route
    }
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
            state: userManagementOpen,
            toggle: () => handleToggle(setUserManagementOpen),
            subItems: [
              { name: "Session Management", icon: <FaUserCog />, route: "/sessionmanagement" },
            ],
          },
          { name: "Experts On App", icon: <FaUserAlt />, route: "/experts" },
          { name: "Pending Expert Requests", icon: <FaRegHandshake />, route: "/pendingexpertsrequest" },
          {
            name: "Payments & Finance",
            icon: <FaCreditCard />,
            state: paymentsOpen,
            toggle: () => handleToggle(setPaymentsOpen),
            subItems: [
              { name: "Overview", icon: <FaMoneyBillAlt />, route: "/overview" },
              { name: "Transactions", icon: <FaMoneyBillAlt />, route: "/transactions" },
              { name: "Withdrawal", icon: <FaMoneyBillAlt />, route: "/withdrawal" },
            ],
          },
          { name: "Reviews/Feedback", icon: <FaThumbsUp />, route: "/review" },
          {
            name: "Admin Logs",
            icon: <FaDatabase />,
            state: adminLogsOpen,
            toggle: () => handleToggle(setAdminLogsOpen),
            subItems: [
              { name: "Discount Management", icon: <FaCogs />, route: "/discount" },
            ],
          },
          { name: "Settings", icon: <FaCogs />, route: "/settings" },
          { name: "Backup Management", icon: <FaDatabase />, route: "/backupmanagement" },
        ].map((item, index) => (
          <div key={index}>
            {/* Main Sidebar Button */}
            <div
              onClick={item.toggle ? item.toggle : () => handleTabClick(item.name, item.route)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                activeTab === item.name
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white active:bg-black active:text-white"
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
                    onClick={() => handleTabClick(subItem.name, subItem.route)}
                    className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer ${
                      activeTab === subItem.name
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white active:bg-black active:text-white"
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
