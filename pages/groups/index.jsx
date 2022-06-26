import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import Card from '../../components/Card'
import PageHeader from '../../components/PageHeader'

const Groups = ({ fetchResults }) => {
  const { authToken } = useAuthContext()
  return (
    <div>
      <PageHeader title={"Groups"} description={"Select a group to view students."} />
      <div className="flex justify-start flex-wrap gap-3 max-w-94p m-auto">
        {fetchResults?.map((group, idx) => (
          <Card
            key={`card-group-${idx}`}
            title={group.name}
            description={group.note}
            tags={[`Children ${group.children_count}`]}
            onClick={() => console.log(1)}
          />
        ))}
      </div>
    </div>
  )
}

const fetchGroups = async (authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/groups`, { 
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

export default withAuth(Groups)
export const getServerSideProps = withAuthServerSideProps(fetchGroups)