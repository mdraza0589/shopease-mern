import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import Register from './pages/auth/register'
import Login from './pages/auth/login'
import AdminLayout from './components/admin-view/layout'
import Dashboard from './pages/admin-view/dashboard'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AdminFeature from './pages/admin-view/features'
import ShoppingLayout from './components/shopping-view/layout'
import NotFoundPage from './pages/not-found'
import ShoppingHome from './pages/shopping-page/home'
import AccountPage from './pages/shopping-page/account'
import CheckOutPage from './pages/shopping-page/checkout'
import ListingPage from './pages/shopping-page/listingPage'
import UnauthPage from './pages/unauth-page'
import CheckAuth from './components/common/check-auth'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from '../server/auth'
import { useEffect } from 'react'
import Loading from './components/Loding/Loading'
import ProductDetailsDialog from './components/shopping-view/product-details'
import WelcomePage from './components/common/welcomePage'
import Search from './pages/shopping-page/search'

const App = () => {

  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">

      <Routes>
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='features' element={<AdminFeature />} />
        </Route>
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<ShoppingHome />} />
          <Route path='account' element={<AccountPage />} />
          <Route path='checkout' element={<CheckOutPage />} />
          <Route path='listing' element={<ListingPage />} />
          <Route path='details' element={<ProductDetailsDialog />} />
          <Route path='search' element={<Search />} />
        </Route>
        <Route path='/unauth-page' element={<UnauthPage />} />
        <Route path='/' element={<WelcomePage />} isAuthenticated={isAuthenticated} user={user} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App

