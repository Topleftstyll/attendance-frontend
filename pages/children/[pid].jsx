import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import PageHeader from '../../components/PageHeader'
import InputLabel from '../../components/InputLabel'
import { Input, message, Select, Popconfirm } from 'antd'
import PrimaryButton from '../../components/PrimaryButton'
import { useAuthContext } from '../../context/AuthContext'
import Modal from '../../components/Modal'
import GuardianForm from '../../components/GuardianForm'
import children from '.'

const { Option } = Select;

const ShowGroup = ({ fetchResults }) => {
  const [child, setChild] = useState(fetchResults || null)
  const [showGuardianModal, setShowGuardianModal] = useState(false)
  const [addedGuardians, setAddedGuardians] = useState(fetchResults.current_guardians)
  const [searchGroupFilterText, setSearchGroupFilterText] = useState('')
  const [searchGuardianFilterText, setSearchGuardianFilterText] = useState('')
  const { authToken } = useAuthContext()
  const router = useRouter()

  const filteredGroups = useMemo(() => child?.groups.filter((group) => (
    group.name.toLowerCase().includes(searchGroupFilterText)
  )), [child?.groups, searchGroupFilterText])

  const allGuardians = useMemo(() => child?.all_guardians.map((guardian) => (
    {
      label: guardian.full_name,
      value: guardian.id
    }
  )), [child?.all_guardians])

  const filteredGuardians = useMemo(() => allGuardians.filter((guardian) => (
    guardian.label.toLowerCase().includes(searchGuardianFilterText)
  )), [allGuardians, searchGuardianFilterText])

  const formattedAddedGuardians = useMemo(() => (
    addedGuardians.map(guardian => (
      {
        label: guardian.full_name,
        value: guardian.id
      }
    ))
  ), [addedGuardians])

  const handleDeleteChild = async () => {
    await axios.delete(`${baseUrl}/children/${child.id}`, { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      }
    }).then(async (response) => {
      router.push('/children')
      message.success(`successfully deleted ${child.full_name}.`)
    }).catch(error => {
      console.error(error)
      message.error(`Could not delete child ${child.full_name}.`)
    })
  }

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
      newVal = child.groups.find(group => group.id === val)
    }
    if(property === 'guardian') {
      const newGuardian = child.all_guardians.find(guardian => guardian.id === val)
      newVal = [...child.current_guardians, newGuardian]
    }

    setChild(child => (
      {
        ...child,
        [property]: newVal,
        full_name
      }
    ))
  }

  const handleAddGuardian = async () => {}

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
        message.success('Successfully updated child')
      } else {
        message.error('Error updating child')
      }
    } catch (err) {
      message.error('Error updating child')
    }
  }

  const handleOnGroupSearch = (val) => {
    setSearchGroupFilterText(val.toLowerCase())
  }

  const handleOnGuardianSearch = (val) => {
    setSearchGuardianFilterText(val.toLowerCase())
  }

  return (
    <div>
      <PageHeader title={child?.full_name} description={child?.group?.name} />
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
          placeholder="Select a group..."
          defaultValue={child.group.name}
          style={{ width: '100%' }}
          onChange={(val) => handleInputChange(val, 'group')}
          showSearch
          onSearch={handleOnGroupSearch}
          filterOption={false}
        >
          {filteredGroups.map((group, idx) => (
            <Option key={`child-group-dropdown-${idx}`} value={group.id}>
              {group.name}
            </Option>
          ))}
        </Select>
        <InputLabel label="Select Guardians" marginTop='mt-3' />
        <Select
          mode="multiple"
          allowClear
          placeholder="Select guardians..."
          getPopupContainer={(triggerNode) => triggerNode}
          defaultValue={formattedAddedGuardians}
          style={{ width: '100%' }}
          onChange={(val) => handleInputChange(val, 'guardian')}
          showSearch
          onSearch={handleOnGuardianSearch}
          filterOption={false}
          options={filteredGuardians}
        />

        <div className='mt-5 flex gap-1'>
          <PrimaryButton
            size='medium'
            label="Submit"
            onClick={handleSubmit}
          />
          <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={handleDeleteChild}>
            <PrimaryButton
              type='danger'
              size='medium'
              label="Delete"
            />
          </Popconfirm>
        </div>
      </div>
      <Modal
        onOk={handleAddGuardian}
        onCancel={() => setShowGuardianModal(false)}
        isOpen={showGuardianModal}
        title={`Add Guardian for ${child?.full_name}`}

      >
        <GuardianForm selectedChild={child} setSelectedChild={setChild} />
      </Modal>
    </div>
  )
}

const fetchChild = async (context, authToken) => {
  let res = null
  await axios.get(`${baseUrl}/children/${context.params.pid}`, { 
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken
    },
  }).then(async (response) => { 
    res = await response.data
  }).catch(error => {
    console.log(error)
  })

  if(!res) {
    console.log('redirect', res)
    return {
      redirect: {
        permanent: false,
        destination: '/children'
      }
    }
  }

  return res
}

export default withAuth(ShowGroup)
export const getServerSideProps = withAuthServerSideProps(fetchChild)