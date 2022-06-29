import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import PageHeader from '../../components/PageHeader'
import { Table, Input } from 'antd'
import { useRouter } from 'next/router'
import PrimaryButton from '../../components/PrimaryButton'

const Teachers = ({ fetchResults }) => {
  const router = useRouter()
  const [filterText, setFilterText] = useState("")

  const filteredResults = useMemo(() => fetchResults.filter((result) => (
    result.full_name.toLowerCase().includes(filterText)
  )), [fetchResults, filterText])

  const columns = [
    {
      title: 'name',
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
    // {
    //   title: 'Guadian',
    //   dataIndex: 'guardian_full_name',
    //   key: 'guardian_full_name',
    //   sorter: (a, b) => {
    //     a.guadian.full_name.localeCompare(b.guadian.full_name)
    //   },
    //   sortDirections: ['descend', 'ascend'],
    // },
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
          onClick={() => router.push(`/teachers/${record.id}`)}
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
      <PageHeader title={"Teachers"} description={"View, Edit and Delete teachers."} />
      <div className="mb-4 w-80">
        <Input
          placeholder="Filter teachers"
          onChange={handleFilterChange}
        />
      </div>
      <Table dataSource={filteredResults} columns={columns} />
    </div>
  )
}

const fetchTeachers = async (context, authToken) => {
  let res = {}
  await axios.get(`${baseUrl}/teachers`, { 
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

export default withAuth(Teachers)
export const getServerSideProps = withAuthServerSideProps(fetchTeachers)