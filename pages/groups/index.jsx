import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'

const groups = () => {
	const {
		isLoggedIn,
		authToken,
	} = useAuthContext()
	
	useEffect(() => {
		if(!isLoggedIn) {
			router.push('/login')
		}
	}, [])

  return (
    <div>groups</div>
  )
}

export default groups