import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import PageHeader from '../../components/PageHeader'
import { Table, Input } from 'antd'
import { useRouter } from 'next/router'
import PrimaryButton from '../../components/PrimaryButton'

const Groups = ({ fetchResults }) => {
  const router = useRouter()
  const [guardians, setGuardians] = useState(fetchResults)
  const [filterText, setFilterText] = useState("")

  const filteredResults = useMemo(() => guardians.filter((result) => (
    result.full_name.toLowerCase().includes(filterText) ||
    result.children?.[0]?.full_name.toLowerCase().includes(filterText)
  )), [filterText])

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Child',
      dataIndex: 'children',
      key: 'children',
      sorter: (a, b) => a.children?.[0].full_name.localeCompare(b.children?.[0].full_name),
      sortDirections: ['descend', 'ascend'],
      render: (record) => record?.[0]?.full_name || 'No Child' 
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <PrimaryButton
          onClick={() => router.push(`/guardians/${record.id}`)}
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
    <div>
      <PageHeader title={"Guardians"} description={"View, Edit and Delete guardians."} />
      <div className="mb-4 w-80">
        <Input
          placeholder="Filter guardians or children"
          onChange={handleFilterChange}
        />
      </div>
      <Table
        dataSource={filteredResults}
        columns={columns}
      />
    </div>
  )
}

const fetchGuardians = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/guardians`, { 
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
export const getServerSideProps = withAuthServerSideProps(fetchGuardians)