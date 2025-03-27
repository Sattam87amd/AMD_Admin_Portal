
import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AdminSidebar from '@/components/Layout/Sidebar'

import Review from '@/components/Review/Review'
import React from 'react'

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar (Left) */}
        <div className="hidden lg:block w-64">
          <AdminSidebar />
        </div>

        {/* Red Divider (optional) */}
        <div className="absolute left-[220px] top-0 w-1 bg-red-600 h-[171.4rem] z-10 ml-10"></div>

        {/* Main Content (Right) */}
        <div className="flex-1  overflow-auto">
       <Review/>
          
          <Footer />
        </div>
        
      </div>

      {/* Footer at Bottom */}
      
    </div>
  )
}

export default Page
