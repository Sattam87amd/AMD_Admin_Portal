"use client"
import AdminSidebar from '@/components/Layout/Sidebar'
import SessionManagement from '@/components/SessionManagement/SessionManagement'
import React from 'react'

const page = () => {
  return (
    <div>
      <AdminSidebar />
    <div className='w-5/6 md:block' >
        <SessionManagement />
    </div>
    
    </div>
  )
}

export default page
