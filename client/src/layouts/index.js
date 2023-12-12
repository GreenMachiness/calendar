// ** React
import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'


// ** Custom Components
import Navbar from './Navbar'
import Footer from './Footer'
import Weather from './weather'

const Layout = (props) => {
  return (
    <Fragment>
      <Navbar/>
      <Weather/>
      <Outlet/> {/* Outlet is not a “real” Component, it is imported from react-router-dom. it will be replaced by the element rendered by the route */}
      <Footer/>
    </Fragment>
  )
}
export default Layout