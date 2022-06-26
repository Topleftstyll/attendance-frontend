import React from 'react'
import Head from 'next/head'
import { Footer, Sidebar } from './'
import { useAuthContext } from '../context/AuthContext'

const Layout = ({ children }) => {
  const { isLoggedIn } = useAuthContext()
  return (
    <div>
      <Head>
        <title>Ecommerce Learning</title>
      </Head>
      <main className="container">
        <div className="flex">
          {isLoggedIn && <Sidebar />}
          <div>
            {children}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Layout