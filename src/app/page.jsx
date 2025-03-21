"use client";

import React from "react";
import Navbar from "@/components/Layout/Navbar";
import AdminSidebar from "@/components/Layout/Sidebar";
import LatestRegistration from "@/components/Dashboard/LatestRegistration";
import ExpertsPopularity from "@/components/Dashboard/ExpertsPopularity ";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1) Fixed Navbar at the top */}
      <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-md">
        <Navbar />
      </header>

      {/*
        2) Content Wrapper:
        - "pt-[80px]" matches the navbar height (adjust if your navbar is taller/shorter)
        - "flex-1" makes this fill all space below the navbar
      */}
      <div className="flex flex-1 pt-[80px]">
        {/*
          3) Sidebar (not fixed):
             - "w-[20%]" to take 20% width
             - "h-full" so it only fills the available space (not the entire screen)
             - "overflow-y-auto" if you want it scrollable when content grows
        */}
        <aside className="w-[20%] bg-[#E6E6E6] p-4 mt-14 h-full overflow-y-auto ml-2 rounded-3xl">
          <AdminSidebar />
        </aside>

        {/*
          4) Main Content:
             - "w-[80%]" to fill the remaining width
             - "overflow-y-auto" to scroll independently if content is large
        */}
        <main className="w-[80%] p-6 overflow-y-auto mt-0">
          <LatestRegistration />
          <ExpertsPopularity/>
        </main>
      </div>
    </div>
  );
};

export default Page;
