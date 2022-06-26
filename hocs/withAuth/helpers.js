import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'

export const checkIfUserIsAuthenticated = async ({ authToken }) => {
  let loggedIn = false
  await axios.get(`${baseUrl}/current-user`, { 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken
    },
  }).then(response => {
    if(response.status === 200) {
      loggedIn = true
    }
  }).catch(error => {
    console.error(error)
  })
  return loggedIn
}
