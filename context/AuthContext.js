import axios from 'axios'
import React, { createContext, useContext, useState, useEffect } from 'react'

const Context = createContext()

export const AuthContext = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
	const [authToken, setAuthToken] = useState(null)

	const login = async (email, password) => {
		axios.post('http://localhost:3035/users/sign_in', { 
			user: {
				email,
				password
			}
		}).then(response => {
			console.log(response.headers)
			if(response?.headers?.authorization) {
				setIsLoggedIn(true)

				// save auth token to cookies instead of using state
				setAuthToken(response.headers.authorization)
			}
		}).catch(error => {
			console.log(error)
		})
	}

	const logout = async (email, password) => {
		axios.delete('http://localhost:3035/users/sign_out', { 
			headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
		}).then(response => {
			console.log(response)
			setIsLoggedIn(false)
			setAuthToken(null)
		}).catch(error => {
			console.log(error)
		})
	}

  return (
    <Context.Provider
      value={{
        isLoggedIn,
				setIsLoggedIn,
				logout,
				login,
				authToken
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuthContext = () => useContext(Context)