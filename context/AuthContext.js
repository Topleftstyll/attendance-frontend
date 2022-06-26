import axios from 'axios'
import React, { createContext, useContext, useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { createCookie } from '../helpers/cookieHelper'
import { useRouter } from 'next/router'
import { baseUrl } from '../constants/axiosBaseUrl'

const Context = createContext()

export const AuthContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [authToken, setAuthToken] = useState(Cookies.get('authToken'))
	const [checkLoginLoading, setCheckLoginLoading] = useState(true)
	const router = useRouter()

	const checkIfLoggedIn = async () => {
		await axios.get(`${baseUrl}/current-user`, { 
			headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
		}).then(response => {
			if(response.status === 200) {
				setIsLoggedIn(true)
			}
		}).catch(error => {
      console.error(error)
		})
		setCheckLoginLoading(false)
	}

	useEffect(() => {
		if(authToken && !isLoggedIn) {
			checkIfLoggedIn()
		}
	}, [])

	const login = async (email, password) => {
		return await axios.post('http://localhost:3035/users/sign_in', { 
			user: {
				email,
				password
			}
		}).then(response => {
			if(response?.headers?.authorization) {
				setIsLoggedIn(true)
				const authToken = response.headers.authorization
				createCookie('authToken', authToken, 3)
				setAuthToken(authToken)
			}
			return response
		}).catch(error => {
			return error.response
		})
	}

	const logout = async () => {
		axios.delete('http://localhost:3035/users/sign_out', { 
			headers: {
				'Content-Type': 'application/json',
				'Authorization': authToken
			},
		}).then(response => {
			Cookies.remove('authToken')
			setIsLoggedIn(false)
			setAuthToken(null)
      router.push('/login')
		}).catch(error => {
			console.error(error)
		})
	}

  return (
    <Context.Provider
      value={{
        isLoggedIn,
				setIsLoggedIn,
				logout,
				login,
				authToken,
				checkLoginLoading
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuthContext = () => useContext(Context)