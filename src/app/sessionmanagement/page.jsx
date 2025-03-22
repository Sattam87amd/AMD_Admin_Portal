"use client";
import Navbar from "@/components/Layout/Navbar";
import AdminSidebar from "@/components/Layout/Sidebar";
import SessionManagement from "@/components/SessionManagement/SessionManagement";
import React from "react";

const Page = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="w-full">
        <Navbar />
      </div>

      <div className="flex flex-1">
        <div className="w-1/5 min-w-[250px] mt-10 ml-4">
          <AdminSidebar />
        </div>

        <div className="flex-1 p-6">
          <SessionManagement />
        </div>
      </div>
    </div>
  );
};

export default Page;
