import { useAuthContext } from "../context/AuthContext"
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect } from "react"
import { Sidebar } from "../components"

export default function Home() {
  const router = useRouter()
  const {
    isLoggedIn,
    authToken,
  } = useAuthContext()
  
  useEffect(() => {
    if(!isLoggedIn) {
      router.push('/login')
    }
  }, [])

  const fetchChildren = () => {
    axios.get('http://localhost:3035/api/v1/children', { 
			headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
		}).then(response => {
			console.log(response)
		}).catch(error => {
			console.log(error)
		})
  }

  return (
    <div>
      <h3>YOU ARE LOGGED IN</h3>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={fetchChildren}
      >
        Fetch Children
      </button>
    </div>
  )
}
