import Footer from '@/components/Layout/Footer'
import Navbar from '@/components/Layout/Navbar'
import AdminSidebar from '@/components/Layout/Sidebar'
import PaymentFinance from '@/components/Payment-Finance/PaymentFinance'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <div className='flex '> 
        <div className='w-[400px]'>
      <AdminSidebar/>
        </div>
      <PaymentFinance/>
      </div>
      <Footer/>
    </div>
  )
}

export default page
