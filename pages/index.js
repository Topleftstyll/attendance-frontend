import { useAuthContext } from "../context/AuthContext"
import axios from 'axios'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from "../hocs/withAuth"
import { baseUrl } from "../constants/axiosBaseUrl"

const Home = () => {
  const router = useRouter()
  const {
    isLoggedIn,
    authToken,
  } = useAuthContext()

  const fetchChildren = () => {
    axios.get(`${baseUrl}/children`, { 
			headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
		}).then(response => {
			console.log(response)
		}).catch(error => {
			console.error(error)
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

export default withAuth(Home)
export const getServerSideProps = withAuthServerSideProps()