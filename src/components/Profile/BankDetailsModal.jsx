import React from 'react';
import { Modal } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchemaBankDetails = yup.object({
  iban: yup.string().required('IBAN is required'),
  bankName: yup.string().required('Bank Name is required'),
  accountHolderName: yup.string().required('Account Holder Name is required')
});

const validationSchemaPassword = yup.object({
  oldPassword: yup.string().required('Old Password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('New Password is required')
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/,
      'Password must contain at least one number, one uppercase letter, and one symbol'
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm New Password is required')
});

const BankDetailsModal = ({ isOpen, onClose, onBankDetailsSubmit, onChangePasswordSubmit }) => {
  const formikBankDetails = useFormik({
    initialValues: {
      iban: '',
      bankName: '',
      accountHolderName: ''
    },
    validationSchema: validationSchemaBankDetails,
    onSubmit: (values, { resetForm }) => {
      onBankDetailsSubmit(values);
      onClose();
      resetForm();
    }
  });

  const formikPassword = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: validationSchemaPassword,
    onSubmit: (values, { resetForm }) => {
      onChangePasswordSubmit({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword
      });
      onClose();
      resetForm();
    }
  });

  const resetForm = () => {
    formikBankDetails.resetForm();
    formikPassword.resetForm();
  };

  return (
    <Modal
      title="Settings"
      open={isOpen}
      onCancel={() => {
        onClose();
        resetForm();
      }}
      footer={[
        <button
          key="cancel"
          className="mt-3 inline-flex justify-center rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={() => {
            onClose();
            resetForm();
          }}>
          Cancel
        </button>,
        <button
          key="save-bank-details"
          className="inline-flex justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={formikBankDetails.handleSubmit}>
          Save Bank Details
        </button>,
        <button
          key="save-password"
          className="inline-flex justify-center rounded-full bg-mainColor px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-hoverColor sm:ml-3 sm:w-auto"
          onClick={formikPassword.handleSubmit}>
          Change Password
        </button>
      ]}
      width={800} // Increased width of the modal
    >
      <div className="flex">
        {/* Bank Details Form */}
        <form onSubmit={formikBankDetails.handleSubmit} className="w-1/2 space-y-8 pr-4">
          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">IBAN</label>
            <input
              type="text"
              name="iban"
              value={formikBankDetails.values.iban}
              onChange={formikBankDetails.handleChange}
              onBlur={formikBankDetails.handleBlur}
              className={`w-full rounded-full border ${
                formikBankDetails.touched.iban && formikBankDetails.errors.iban
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikBankDetails.touched.iban && formikBankDetails.errors.iban ? (
              <div className="text-red-500">{formikBankDetails.errors.iban}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={formikBankDetails.values.bankName}
              onChange={formikBankDetails.handleChange}
              onBlur={formikBankDetails.handleBlur}
              className={`w-full rounded-full border ${
                formikBankDetails.touched.bankName && formikBankDetails.errors.bankName
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikBankDetails.touched.bankName && formikBankDetails.errors.bankName ? (
              <div className="text-red-500">{formikBankDetails.errors.bankName}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">
              Account Holder Name
            </label>
            <input
              type="text"
              name="accountHolderName"
              value={formikBankDetails.values.accountHolderName}
              onChange={formikBankDetails.handleChange}
              onBlur={formikBankDetails.handleBlur}
              className={`w-full rounded-full border ${
                formikBankDetails.touched.accountHolderName &&
                formikBankDetails.errors.accountHolderName
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikBankDetails.touched.accountHolderName &&
            formikBankDetails.errors.accountHolderName ? (
              <div className="text-red-500">{formikBankDetails.errors.accountHolderName}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>
        </form>
        {/* Divider */}
        <div className="mx-4 border-l border-gray-300"></div> {/* Thinner divider */}
        {/* Password Change Form */}
        <form onSubmit={formikPassword.handleSubmit} className="w-1/2 space-y-8 pl-4">
          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">Old Password</label>
            <input
              type="password"
              name="oldPassword"
              value={formikPassword.values.oldPassword}
              onChange={formikPassword.handleChange}
              onBlur={formikPassword.handleBlur}
              className={`w-full rounded-full border ${
                formikPassword.touched.oldPassword && formikPassword.errors.oldPassword
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikPassword.touched.oldPassword && formikPassword.errors.oldPassword ? (
              <div className="text-red-500">{formikPassword.errors.oldPassword}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formikPassword.values.newPassword}
              onChange={formikPassword.handleChange}
              onBlur={formikPassword.handleBlur}
              className={`w-full rounded-full border ${
                formikPassword.touched.newPassword && formikPassword.errors.newPassword
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikPassword.touched.newPassword && formikPassword.errors.newPassword ? (
              <div className="text-red-500">{formikPassword.errors.newPassword}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block pl-4 text-sm font-medium text-mainColor">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formikPassword.values.confirmNewPassword}
              onChange={formikPassword.handleChange}
              onBlur={formikPassword.handleBlur}
              className={`w-full rounded-full border ${
                formikPassword.touched.confirmNewPassword &&
                formikPassword.errors.confirmNewPassword
                  ? 'border-red-500'
                  : 'border-black'
              } p-2 px-4`}
              required
            />
            {formikPassword.touched.confirmNewPassword &&
            formikPassword.errors.confirmNewPassword ? (
              <div className="text-red-500">{formikPassword.errors.confirmNewPassword}</div>
            ) : (
              <div className="min-h-[1.5rem]"></div>
            )}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BankDetailsModal;
