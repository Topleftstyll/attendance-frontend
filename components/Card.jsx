import React from 'react'

const Card = ({ title, description, tags, onClick}) => {
  return (
    <div
      className="w-32p md:w-49p sm:w-full p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:cursor-pointer hover:scale-102"
      onClick={onClick}
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{title}</h5>
      <p className="mb-3 font-normal text-gray-700 line-clamp-3">{description}</p>
      {tags?.map((tag, idx) => (
        <div
          key={`card-tag-${idx}`}
          className="text-xs inline-flex items-center font-bold leading-sm px-3 py-1 bg-blue-200 text-blue-700 rounded-sm"
        >
          {tag}
        </div>
      ))}
    </div>
  )
}

export default Card