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
  const [teacher, setTeacher] = useState(fetchResults || null)
  const [searchFilterText, setSearchFilterText] = useState('')
  const { authToken } = useAuthContext()

  const filteredGroups = useMemo(() => teacher?.groups.filter((group) => (
    group.name.toLowerCase().includes(searchFilterText)
  )), [teacher?.groups, searchFilterText])

  const handleInputChange = (val, property) => {
    let full_name = teacher.full_name
    let newVal = val
    if(property === 'first_name') {
      full_name = `${val} ${teacher.last_name}`
    }
    if(property === 'last_name') {
      full_name = `${teacher.first_name} ${val}`
    }
    if(property === 'group') {
      newVal = teacher.groups.find(group => group.id === val)
    }

    setTeacher(teacher => (
      {
        ...teacher,
        [property]: newVal,
        full_name
      }
    ))
  }

  const handleSubmit = async () => {
    try {
      const res = await axios.patch(`${baseUrl}/teachers/${teacher.id}`, {
        api_v1_teacher: {
          first_name: teacher.first_name,
          last_name: teacher.last_name,
          group_id: teacher.group.id,
        }
      },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authToken
        },
      })
      if(res.status === 200) {
        message.success('Successfully updated teacher')
      } else {
        message.error('Error updating teacher')
      }
    } catch (err) {
      message.error('Error updating teacher')
    }
  }

  const handleOnSearch = (val) => {
    setSearchFilterText(val.toLowerCase())
  }

  return (
    <div>
      <PageHeader title={teacher?.full_name} description={teacher?.group?.name} />
      <div className="mb-4 w-80">
        <InputLabel label="First Name" />
        <Input
          placeholder="First Name"
          onChange={(e) => handleInputChange(e.target.value, 'first_name')}
          value={teacher.first_name}
        />
        <InputLabel label="Last Name" marginTop='mt-3' />
        <Input
          placeholder="Last Name"
          onChange={(e) => handleInputChange(e.target.value, 'last_name')}
          value={teacher.last_name}
        />
        <InputLabel label="Select Group" marginTop='mt-3' />
        <Select
          defaultValue={teacher.group.name}
          style={{ width: '100%' }}
          onChange={(val) => handleInputChange(val, 'group')}
          showSearch
          onSearch={handleOnSearch}
          filterOption={false}
        >
          {filteredGroups.map((group, idx) => (
            <Option key={`teacher-group-dropdown-${idx}`} value={group.id}>
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

const fetchteacher = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/teachers/${context.params.pid}`, { 
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
export const getServerSideProps = withAuthServerSideProps(fetchteacher)