import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import PageHeader from '../../components/PageHeader'
import { Table, Input, message, Tooltip } from 'antd'
import { useRouter } from 'next/router'
import PrimaryButton from '../../components/PrimaryButton'
import { IoMdAdd } from 'react-icons/io'
import Modal from '../../components/Modal'
import GuardianForm from '../../components/GuardianForm'
import { useAuthContext } from '../../context/AuthContext'

const renderTooltipTitle = (guardians) => {
  return (
    guardians.map(guardian => <p>{guardian.full_name}</p>)
  )
}

const Groups = ({ fetchResults }) => {
  const router = useRouter()
  const [filterText, setFilterText] = useState("")
  const [showGuardianModal, setShowGuardianModal] = useState(false)
  const [selectedChild, setSelectedChild] = useState(null)
  const { authToken } = useAuthContext()

  const filteredResults = useMemo(() => fetchResults.filter((result) => (
    result.full_name.toLowerCase().includes(filterText)
  )), [fetchResults, filterText])

  const handleShowGuardianModal = (child) => {
    setSelectedChild(child)
    setShowGuardianModal(true)
  }

  const handleAddGuardian = async () => {
    await axios.post(`${baseUrl}/guardians`, {
      api_v1_guardian: {
        first_name: selectedChild.guardian.first_name,
        last_name: selectedChild.guardian.last_name,
        child_id: selectedChild.id,
        email: selectedChild.guardian.email,
        phone_number: selectedChild.guardian.email
      }
    },{ 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      }
    }).then(async (response) => { 
      setShowGuardianModal(false)
      message.success(`successfully saved guardian: ${selectedChild.guardian.full_name}`)
    }).catch(error => {
      console.error(error)
      message.error('Could not save new guardian.')
    })
  }

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => {
        return a.full_name.localeCompare(b.full_name)
      },
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Group',
      dataIndex: 'group',
      key: 'group_name',
      sorter: (a, b) => {
        return a.group.name.localeCompare(b.group.name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (group) => group.name
    },
    {
      title: 'Guadian',
      key: 'guardians',
      sorter: (a, b) => {
        a.guardians?.[0].full_name.localeCompare(b.guardians?.[0].full_name)
      },
      sortDirections: ['descend', 'ascend'],
      render: (record) => (record.guardians?.[0].full_name ? (
        <Tooltip
          title={record.guardians.length >= 2 ? renderTooltipTitle(record.guardians) : null}
          placement="bottom"
        >
          {record.guardians[0].full_name}
        </Tooltip>
      ) : (
        <PrimaryButton
          key="guardians"
          onClick={() => handleShowGuardianModal(record)}
          icon={<IoMdAdd color="white" />}
        />
      )
      )
    },
    // {
    //   title: 'Teacher',
    //   dataIndex: 'teacher_full_name',
    //   key: 'teacher_full_name',
    //   sorter: (a, b) => {
    //     a.guadian.full_name.localeCompare(b.guadian.full_name)
    //   },
    //   sortDirections: ['descend', 'ascend'],
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <PrimaryButton
          onClick={() => router.push(`/children/${record.id}`)}
          label="View"
          size="medium"
        />
      )
    },
  ]

  const handleFilterChange = (e) => {
    setFilterText(e.target.value.toLowerCase())
  }

  return (
    <>
      <div>
        <PageHeader title={"Children"} description={"View, Edit and Delete children."} />
        <div className="mb-4 w-80">
          <Input
            placeholder="Filter children"
            onChange={handleFilterChange}
          />
        </div>
        <Table dataSource={filteredResults} columns={columns} />
      </div>
      <Modal
        onOk={handleAddGuardian}
        onCancel={() => setShowGuardianModal(false)}
        isOpen={showGuardianModal}
        title={`Add Guardian for ${selectedChild?.full_name}`}

      >
        <GuardianForm selectedChild={selectedChild} setSelectedChild={setSelectedChild} />
      </Modal>
    </>
  )
}

const fetchChildren = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/children`, { 
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
export const getServerSideProps = withAuthServerSideProps(fetchChildren)