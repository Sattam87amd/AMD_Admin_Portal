import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AdminSidebar from '@/components/Layout/Sidebar'
import PendingExpertsRequest from '@/components/PendingExpertsRequest/PendingExpertsRequest'
import React from 'react'


const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex '> 
        <div className='w-[400px]'>
      <AdminSidebar/>
        </div>
      <PendingExpertsRequest/>
      </div>
      
      <Footer/>
      
    </div>
  )
}

export default page