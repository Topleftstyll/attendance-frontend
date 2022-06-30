import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { checkIfUserIsAuthenticated } from './helpers'
import { Sidebar, Footer } from '../../components'

export function withAuthServerSideProps(getServerSidePropsFunc) {
  return async (context) => {
    const { authToken } = context.req.cookies
    if (!authToken) {
      return { props: { isLoggedIn: false, data: {} } }
    }

    const isLoggedIn = await checkIfUserIsAuthenticated({ authToken })
    if(isLoggedIn && getServerSidePropsFunc) {
      const data = await getServerSidePropsFunc(context, authToken)
      return {
        props: { isLoggedIn, data },
      }
    }

    return { props: { isLoggedIn, data: {} } }
  }
}

export const withAuth = (
  Component,
  options = {}
) => {
  return (props) => {
    const isLoggedIn = props.isLoggedIn
    const router = useRouter()
    const { isLoggedOutPage } = options
    
    useEffect(() => {
      if(!isLoggedIn) {
        router.push('/login')
      }

      if(isLoggedIn && isLoggedOutPage) {
        router.push('/')
      }
    }, [])

    if(isLoggedIn && isLoggedOutPage) {
      return null
    }

    if(!isLoggedIn && !isLoggedOutPage) {
      return null
    }
    
    return (
      <div className="flex">
        {!isLoggedOutPage && <Sidebar />}
        <div className="w-full">
          <div className="main-page-wrapper">
            <Component fetchResults={props.data} />
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}
