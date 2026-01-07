import React from 'react'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      Layouut
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
