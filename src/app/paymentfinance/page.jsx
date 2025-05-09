import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AdminSidebar from '@/components/Layout/Sidebar'
import PaymentFinance from '@/components/PaymentFinance/PaymentFinance'
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
        <div className="hidden lg:block w-1 bg-red-600 ml-8" />

        {/* Main Content (Right) */}
        <div className="flex-1 overflow-auto pb-16">
          <PaymentFinance />
        </div>
      </div>

      {/* Footer at the bottom - aligned with main content only */}
      <div className="flex mt-auto">
        {/* Empty space to align with sidebar and red divider */}
        <div className="hidden lg:block w-64"></div>
        {/* Space for red divider */}
        <div className="hidden lg:block w-1 bg-red-600 ml-8"></div>
        {/* Footer aligned with main content */}
        <div className="flex-1">
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Page;