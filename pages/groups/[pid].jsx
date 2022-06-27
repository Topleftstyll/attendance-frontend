import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'

const ShowGroup = ({ fetchResults }) => {
  const router = useRouter()
  const { pid } = router.query

  console.log(fetchResults)

  return (
    <div>
      <h1>{fetchResults?.group?.name}</h1>
      <h3>{fetchResults?.group?.description}</h3>
      {fetchResults?.children?.map(child => (
        <p>{`${child.first_name} ${child.last_name}`}</p>
      ))}
    </div>
  )
}

const fetchGroup = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/groups/${context.params.pid}`, { 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken
    },
  }).then(async (response) => { 
    res = await response.data
  }).catch(error => {
    console.error(error)
  })
  return res
}

export default withAuth(ShowGroup)
export const getServerSideProps = withAuthServerSideProps(fetchGroup)