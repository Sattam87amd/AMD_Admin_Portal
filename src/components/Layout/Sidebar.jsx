"use client";

import { useState } from "react";
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
  const [userManagementOpen, setUserManagementOpen] = useState(false);
  const [paymentsOpen, setPaymentsOpen] = useState(false);
  const [adminLogsOpen, setAdminLogsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleToggle = (setState) => {
    setState((prevState) => !prevState);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-full h-auto bg-[#E6E6E6] p-4 rounded-3xl">
      <div className="space-y-2">
        {/* Sidebar Button Component */}
        {[
          { name: "Dashboard", icon: <FaTachometerAlt routes/> },
          {
            name: "User Management",
            icon: <FaUserAlt />,
            state: userManagementOpen,
            toggle: () => handleToggle(setUserManagementOpen),
            subItems: [
              { name: "Session Management", icon: <FaUserCog /> },
            ],
          },
          { name: "Experts On App", icon: <FaUserAlt /> },
          { name: "Pending Expert Requests", icon: <FaRegHandshake /> },
          {
            name: "Payments & Finance",
            icon: <FaCreditCard />,
            state: paymentsOpen,
            toggle: () => handleToggle(setPaymentsOpen),
            subItems: [
              { name: "Overview", icon: <FaMoneyBillAlt /> },
              { name: "Transactions", icon: <FaMoneyBillAlt /> },
              { name: "Withdrawal", icon: <FaMoneyBillAlt /> },
            ],
          },
          { name: "Reviews/Feedback", icon: <FaThumbsUp /> },
          {
            name: "Admin Logs",
            icon: <FaDatabase />,
            state: adminLogsOpen,
            toggle: () => handleToggle(setAdminLogsOpen),
            subItems: [
              { name: "Discount Management", icon: <FaCogs /> },
            ],
          },
          { name: "Settings", icon: <FaCogs /> },
          { name: "Backup Management", icon: <FaDatabase /> },
        ].map((item, index) => (
          <div key={index}>
            {/* Main Sidebar Button */}
            <div
              onClick={item.toggle ? item.toggle : () => handleTabClick(item.name)}
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
                    onClick={() => handleTabClick(subItem.name)}
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
