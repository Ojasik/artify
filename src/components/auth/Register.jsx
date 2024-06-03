import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Logo } from '../logo';
import { UserIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  firstname: Yup.string()
    .matches(/^[^\d]+$/, 'No numbers allowed')
    .required('First name is required'),
  lastname: Yup.string()
    .matches(/^[^\d]+$/, 'No numbers allowed')
    .required('Last name is required'),
  phone: Yup.string().required('Phone is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required')
    .test('email-validation', 'Invalid email address', (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ),
  password: Yup.string()
    .required('Password is required')
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{8,}$/,
      'Password must contain at least one number, one uppercase letter, and one symbol'
    )
});

export const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:8000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data.message); // Registration successful
          navigate('/profile');
        } else {
          console.error(data.message); // Registration failed (error)
        }
      } catch (error) {
        console.error('Error during registration:', error);
      }
    }
  });

  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 bg-gray-300 p-10">
      <Link to="/">
        <Logo />
      </Link>
      <div className="flex w-[360px] flex-col items-center gap-8 rounded-xl bg-white py-8 pb-12 sm:w-[400px]">
        <h1 className="text-4xl">Register</h1>
        <form className="flex flex-col items-center gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-6 pb-6">
            <div className="relative">
              <UserIcon className="absolute right-4 top-2.5 h-5" />
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.username && formik.errors.username
                    ? 'border-red-500'
                    : 'border-black'
                }`}
                placeholder="Username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500">{formik.errors.username}</div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.firstname && formik.errors.firstname
                    ? 'border-red-500'
                    : 'border-black'
                }`}
                placeholder="First name"
                name="firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstname && formik.errors.firstname && (
                <div className="text-red-500">{formik.errors.firstname}</div>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.lastname && formik.errors.lastname
                    ? 'border-red-500'
                    : 'border-black'
                }`}
                placeholder="Last name"
                name="lastname"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <div className="text-red-500">{formik.errors.lastname}</div>
              )}
            </div>

            <div className="relative">
              <EnvelopeIcon className="absolute right-4 top-2.5 h-5" />
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-black'
                }`}
                placeholder="E-mail"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>

            <div className="relative">
              <EnvelopeIcon className="absolute right-4 top-2.5 h-5" />
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.phone && formik.errors.phone ? 'border-red-500' : 'border-black'
                }`}
                placeholder="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500">{formik.errors.phone}</div>
              )}
            </div>

            <div className="relative">
              <LockClosedIcon className="absolute right-4 top-2.5 h-5" />
              <input
                type="password"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-500'
                    : 'border-black'
                }`}
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="w-80 text-red-500">{formik.errors.password}</div>
              )}
            </div>
          </div>
          <input
            className="w-80 cursor-pointer rounded-full bg-mainColor p-2 text-white"
            type="submit"
            value="Sign up"
          />
          <div>
            Already have an account?{' '}
            <Link to="/login">
              <button className="cursor-pointer font-bold text-mainColor">Sign in</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
