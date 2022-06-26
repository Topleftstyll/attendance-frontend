import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { withAuth, withAuthServerSideProps } from '../../hocs/withAuth'

const ShowGroup = () => {
  const router = useRouter()
  const { pid } = router.query

  return (
    <div>
      {pid}
    </div>
  )
}

export default withAuth(ShowGroup)
export const getServerSideProps = withAuthServerSideProps()