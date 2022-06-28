import React, { useEffect, useState } from 'react'
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
  const [initialChild, setInitialChild] = useState(fetchResults || null)
  const [child, setChild] = useState(fetchResults || null)
  const [searchFilterText, setSearchFilterText] = useState('')
  const { authToken } = useAuthContext()

  const filteredGroups = initialChild?.groups.filter((group) => (
    group.name.toLowerCase().includes(searchFilterText)
  ))

  const handleInputChange = (val, property) => {
    let full_name = child.full_name
    let newVal = val
    if(property === 'first_name') {
      full_name = `${val} ${child.last_name}`
    }
    if(property === 'last_name') {
      full_name = `${child.first_name} ${val}`
    }
    if(property === 'group') {
      newVal = initialChild.groups.find(group => group.id === val)
    }

    setChild(child => (
      {
        ...child,
        [property]: newVal,
        full_name
      }
    ))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`${baseUrl}/children/${child.id}`, {
        api_v1_child: {
          first_name: child.first_name,
          last_name: child.last_name,
          group_id: child.group.id,
        }
      },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
      })
      if(res.status === 200) {
        setInitialChild(res.data)
        message.success('Successfully updated child')
      } else {
        message.error('Error updating child')
      }
    } catch (err) {
      message.error('Error updating child')
    }
  }

  const handleOnSearch = (val) => {
    setSearchFilterText(val.toLowerCase())
  }

  return (
    <div>
      <PageHeader title={initialChild?.full_name} description={initialChild?.group?.name} />
      <div className="mb-4 w-80">
        <InputLabel label="First Name" />
        <Input
          placeholder="First Name"
          onChange={(e) => handleInputChange(e.target.value, 'first_name')}
          value={child.first_name}
        />
        <InputLabel label="Last Name" marginTop='mt-3' />
        <Input
          placeholder="Last Name"
          onChange={(e) => handleInputChange(e.target.value, 'last_name')}
          value={child.last_name}
        />
        <InputLabel label="Select Group" marginTop='mt-3' />
        <Select
          defaultValue={child.group.name}
          style={{ width: '100%' }}
          onChange={(val) => handleInputChange(val, 'group')}
          showSearch
          onSearch={handleOnSearch}
          filterOption={false}
        >
          {filteredGroups.map((group, idx) => (
            <Option key={`child-group-dropdown-${idx}`} value={group.id}>
              {group.name}
            </Option>
          ))}
        </Select>

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

const fetchChild = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/children/${context.params.pid}`, { 
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
export const getServerSideProps = withAuthServerSideProps(fetchChild)