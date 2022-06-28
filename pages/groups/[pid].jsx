import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'
import axios from 'axios'
import { baseUrl } from '../../constants/axiosBaseUrl'
import PageHeader from '../../components/PageHeader'
import { Table, Input } from 'antd'
import PrimaryButton from '../../components/PrimaryButton'

const ShowGroup = ({ fetchResults }) => {
  const router = useRouter()
  const [filterText, setFilterText] = useState("")

  const filteredResults = useMemo(() => fetchResults?.children?.filter((result) => (
    result.full_name.toLowerCase().includes(filterText)
  )), [fetchResults?.children, filterText])

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
      sorter: (a, b) => {
        a.full_name.localeCompare(b.full_name)
      },
      sortDirections: ['descend', 'ascend'],
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
    <div>
      <PageHeader title={fetchResults?.group?.name} description={fetchResults?.group?.description} />
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