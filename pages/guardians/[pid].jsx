import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import PageHeader from '../../components/PageHeader'
import InputLabel from '../../components/InputLabel'
import { Input, message, Select } from 'antd'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuthContext } from '../../context/AuthContext'

const { Option } = Select;

const ShowGroup = ({ fetchResults }) => {
  const [guardian, setGuardian] = useState(fetchResults || null)
  const { authToken } = useAuthContext()

  console.log(fetchResults)

  const handleInputChange = (val, property) => {
    let full_name = guardian.full_name
    let newVal = val
    if(property === 'first_name') {
      full_name = `${val} ${guardian.last_name}`
    }
    if(property === 'last_name') {
      full_name = `${guardian.first_name} ${val}`
    }
    if(property === 'group') {
      newVal = guardian.groups.find(group => group.id === val)
    }

    setGuardian(guardian => (
      {
        ...guardian,
        [property]: newVal,
        full_name
      }
    ))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`${baseUrl}/guardian/${guardian.id}`, {
        api_v1_guardian: {
          first_name: guardian.first_name,
          last_name: guardian.last_name,
        }
      },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
      })
      if(res.status === 200) {
        message.success('Successfully updated guardian')
      } else {
        message.error('Error updating guardian')
      }
    } catch (err) {
      message.error('Error updating guardian')
    }
  }

  return (
    <div>
      <PageHeader title={guardian?.full_name} description={guardian?.group?.name} />
      <div className="mb-4 w-80">
        <InputLabel label="First Name" />
        <Input
          placeholder="First Name"
          onChange={(e) => handleInputChange(e.target.value, 'first_name')}
          value={guardian.first_name}
        />
        <InputLabel label="Last Name" marginTop='mt-3' />
        <Input
          placeholder="Last Name"
          onChange={(e) => handleInputChange(e.target.value, 'last_name')}
          value={guardian.last_name}
        />

        <div className='mt-5'>
          <PrimaryButton
            size='medium'
            label="Submit"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

const fetchGuardian = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/guardians/${context.params.pid}`, { 
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
export const getServerSideProps = withAuthServerSideProps(fetchGuardian)