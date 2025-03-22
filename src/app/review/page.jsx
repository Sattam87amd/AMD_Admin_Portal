import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AdminSidebar from '@/components/Layout/Sidebar'
import Review from '@/components/Review/Review'
import React from 'react'

const page = () => {
  return (
    <div >
       <Navbar/>
       <div className='flex '>
       <div className='w-[27rem] lg:mt-5'>
       <AdminSidebar/>
       </div>
       <div className='bg-red-600 w-1 max-h-screen ml-4'></div>
      <Review/>
       </div>
       <Footer/>
    </div>
   
  )
}

export default page
