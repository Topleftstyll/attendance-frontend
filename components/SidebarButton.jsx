import React from 'react'

const SidebarButton = ({ onClick, title, icon }) => {
  return (
    <button onClick={onClick} className="flex w-full items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
			{icon}
			<span className="ml-3 whitespace-nowrap">{title}</span>
    </button>
  )
}

export default SidebarButton