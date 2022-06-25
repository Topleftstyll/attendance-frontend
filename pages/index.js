import { useAuthContext } from "../context/AuthContext"
import axios from 'axios'

export default function Home() {
  const {
    isLoggedIn,
    login,
    logout,
    authToken
  } = useAuthContext()

  const handleLogin = () => {
    if(isLoggedIn) return logout()
    return login("test@test.com", "Password123")
  }

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
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <h3>{isLoggedIn ? "YOU ARE LOGGED IN" : "PLEASE LOG IN"}</h3>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleLogin}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </button>

      {isLoggedIn &&
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={fetchChildren}
        >
          Fetch Children
        </button>
      }
    </div>
  )
}
