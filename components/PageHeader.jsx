import React from 'react'

const PageHeader = ({ title, description }) => {
  return (
    <div className="my-10 ml-20">
      <h1 className="lg:text-4xl font-bold leading-7 text-gray-900 sm:text-4xl">{title}</h1>
      <h2 className="mt-1 lg:text-2xl font-bold leading-7 text-gray-600 sm:text-2xl">{description}</h2>
    </div>
  )
}

export default PageHeader