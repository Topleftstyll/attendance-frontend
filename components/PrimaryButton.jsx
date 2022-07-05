import React from 'react'
import { Button } from 'antd';

const PrimaryButton = ({
  type = 'primary',
  label = null,
  onClick,
  size,
  icon = null
}) => {
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
    >
      {icon && icon}
      {label && label}
    </Button>
  )
}

export default PrimaryButton