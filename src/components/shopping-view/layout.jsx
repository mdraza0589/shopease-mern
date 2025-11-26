import React from 'react'
import ShoppingHeader from './header'
import { Outlet } from 'react-router-dom'
import ShopingFooter from './footer'

const ShoppingLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      <ShoppingHeader />
      <div>
        <main className='flex flex-col w-full'>
          <Outlet />
        </main>
      </div>
      <div>
        <ShopingFooter />
      </div>
    </div>
  )
}

export default ShoppingLayout

