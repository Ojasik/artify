import React, { useContext } from 'react';
import { Logo } from '../logo';
import { UserIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../../contexts/UserContext';
import { message } from 'antd';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required')
});
export const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:8000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values),
          credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
          document.cookie = `token=${data.token}; path=/; max-age=3600; SameSite=Lax`;
          handleLogin();
          navigate('/');
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  });
  return (
    <div className="flex h-screen w-full flex-col items-center gap-4 bg-gray-300 pt-32">
      <Link to="/">
        <Logo className="" />
      </Link>
      <div className="flex w-[360px] flex-col items-center gap-8 rounded-xl bg-white py-8 pb-12 sm:w-[400px]">
        <h1 className="text-4xl">Sign in</h1>
        <form className="flex flex-col items-center gap-4" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="relative">
              <UserIcon
                className={`absolute right-4 top-1/4 h-5 ${
                  formik.touched.email && formik.errors.email ? 'top-2.5' : 'top-1/4'
                }`}
              />
              <input
                type="text"
                className={`w-80 rounded-full border p-2 px-4 ${
                  formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-black'
                }`}
                placeholder="Email"
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
              <LockClosedIcon
                className={`absolute right-4 top-1/4 h-5 ${
                  formik.touched.password && formik.errors.password ? 'top-2.5' : 'top-1/4'
                }`}
              />
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
            value="Login"
          />
          <div>
            Don&apos;t have an account?{' '}
            <Link to="/register">
              <button className="cursor-pointer font-bold text-mainColor">Register</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
