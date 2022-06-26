import React from 'react'
import Head from 'next/head'

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Attendance Tracker</title>
      </Head>
      {children}
    </div>
  )
}

export default Layout