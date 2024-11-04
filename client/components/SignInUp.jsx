import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../hooks';
const SignInUp = ({ mode = 'sign in' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const trimmedMode = mode.replaceAll(' ', '');
  const { doRequest, errors } = useRequest({
    url: `/api/users/${trimmedMode}`,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  return (
    <form onSubmit={onSubmit}>
      <h1 className='text-capitalize'>{mode}</h1>
      <div className='form-group'>
        <label htmlFor='email'>Email Address</label>
        <input
          type='email'
          className='form-control'
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors
          .filter((err) => err.field === 'email')
          .map((err) => (
            <div className='alert alert-danger p-2' key={err.message}>
              {err.message}
            </div>
          ))}
        <label htmlFor='password'>Password</label>
        <input
          type='password'
          id='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors
          .filter((err) => err.field === 'password')
          .map((err) => (
            <div className='alert alert-danger p-2' key={err.message}>
              {err.message}
            </div>
          ))}
      </div>
      <button type='submit' className='btn btn-primary'>
        {mode}
      </button>
    </form>
  );
};
export default SignInUp;
