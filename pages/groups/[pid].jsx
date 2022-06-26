import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

const ShowGroup = () => {
  const router = useRouter()
  const { pid } = router.query

  return (
    <div>
      {pid}
    </div>
  )
}

export default ShowGroup