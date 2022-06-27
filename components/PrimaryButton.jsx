import React from 'react'
import { Button } from 'antd';

const PrimaryButton = ({ label, onClick, size }) => {
  return (
    <Button
      type="primary"
      size={size}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export default PrimaryButton