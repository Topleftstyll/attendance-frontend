import { Button, Modal as AntdModal } from 'antd';
import React, { useState } from 'react';

const Modal = ({
  isOpen = false,
  onOk,
  onCancel,
  title,
  okText = 'Submit',
  cancelText = 'Cancel',
  children
}) => {
  return (
      <AntdModal
        title={<p className="text-center">{title}</p>}
        visible={isOpen}
        centered
        okText={okText}
        cancelText={cancelText}
        onOk={onOk}
        onCancel={onCancel}
      >
        {children}
      </AntdModal>
  )
}

export default Modal;