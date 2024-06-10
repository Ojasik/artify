/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Modal, Button, Form, Input } from 'antd';

const BankDetailsModal = ({ isOpen, onClose, onBankDetailsSubmit }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    onBankDetailsSubmit(values);
    onClose();
  };

  return (
    <Modal
      title="Add Bank Details"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <button
          key="cancel"
          className="mt-3 inline-flex w-full justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={onClose}>
          Cancel
        </button>,
        <button
          key="save"
          className="inline-flex w-full justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={() => form.submit()}>
          Save
        </button>
      ]}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="iban"
          label="IBAN"
          rules={[{ required: true, message: 'Please input your IBAN!' }]}>
          <Input placeholder="IBAN" />
        </Form.Item>

        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[{ required: true, message: 'Please input your bank name!' }]}>
          <Input placeholder="Bank Name" />
        </Form.Item>
        <Form.Item
          name="accountHolderName"
          label="Account Holder Name"
          rules={[{ required: true, message: 'Please input the account holder name!' }]}>
          <Input placeholder="Account Holder Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BankDetailsModal;
