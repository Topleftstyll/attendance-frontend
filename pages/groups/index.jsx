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
  const [filterText, setFilterText] = useState("")

  const filteredResults = useMemo(() => fetchResults.filter((result) => (
    result.name.toLowerCase().includes(filterText)
  )), [fetchResults, filterText])

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Children',
      dataIndex: 'children_count',
      key: 'children',
      sorter: (a, b) => a.children_count - b.children_count,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => (
        <p className="line-clamp-3">
          {description}
        </p>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <PrimaryButton
          onClick={() => router.push(`/groups/${record.id}`)}
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
      <PageHeader title={"Groups"} description={"Select a group to view students."} />
      <div className="mb-4 w-80">
        <Input
          placeholder="Filter groups"
          onChange={handleFilterChange}
        />
      </div>
      <Table dataSource={filteredResults} columns={columns} />
    </div>
  )
}

const fetchGroups = async (context, authToken) => {
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