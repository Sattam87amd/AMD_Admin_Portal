<<<<<<< HEAD
"use client"
import AdminSidebar from '@/components/Layout/Sidebar'
import SessionManagement from '@/components/SessionManagement/SessionManagement'
import React from 'react'
=======
"use client";
import Navbar from "@/components/Layout/Navbar";
import AdminSidebar from "@/components/Layout/Sidebar";
import SessionManagement from "@/components/SessionManagement/SessionManagement";
import React from "react";
>>>>>>> 338e4b5f9302c5668137d931bc81bc988d7bf04f

const Page = () => {
  return (
<<<<<<< HEAD
    <div>
      <AdminSidebar />
    <div className='w-5/6 md:block' >
        <SessionManagement />
    </div>
    
    </div>
  )
}
=======
    <div className="h-screen flex flex-col">
      <div className="w-full">
        <Navbar />
      </div>
>>>>>>> 338e4b5f9302c5668137d931bc81bc988d7bf04f

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
