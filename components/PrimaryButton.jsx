import React from 'react'
import { Button } from 'antd';

const PrimaryButton = ({ label = null, onClick, size, icon = null }) => {
  return (
    <Button
      type="primary"
      size={size}
      onClick={onClick}
    >
      {icon && icon}
      {label && label}
    </Button>
  )
}

export default PrimaryButton