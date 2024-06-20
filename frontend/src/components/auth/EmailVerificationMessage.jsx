import React from 'react';

const EmailVerificationMessage = () => {
  return (
    <div
      className="relative flex w-full flex-col items-center justify-center border-y border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700"
      role="alert">
      <strong className="font-bold">Verify email to finish registration!</strong>
      <span className="block sm:inline"> Check your email for verification.</span>
    </div>
  );
};

export default EmailVerificationMessage;
