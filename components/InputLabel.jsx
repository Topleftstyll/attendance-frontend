import React from 'react'

const InputLabel = ({ label, marginTop }) => {
  return (
    <label className={`block text-gray-700 text-sm font-bold mb-2 ${marginTop && marginTop}`}>
      {label}
    </label>
  )
}

export default InputLabel