import React from 'react'

import './layout.scss'

export const Layout = ({ children }) => {
  return (
    <div className='layout'>
      <nav className='nav'>
        <h2 className='nav__header'>Marketplace</h2>
      </nav>
      {children}
    </div>
  )
}
