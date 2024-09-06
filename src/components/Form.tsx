import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock } from 'react-icons/fi';

type ApiResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

export default function Form() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  function toggleFormType() {
    setIsLogin(!isLogin);
    setError('');
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const url = isLogin
      ? 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login'
      : 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setError('');
        if (isLogin) {
          sessionStorage.setItem('token', data.token || '');
          sessionStorage.setItem('username', username);

          navigate('/QuizEditor');
        } else {
          alert('Account created successfully!');
          setIsLogin(true);
          setUsername('');
          setPassword('');
        }
      } else {
        setError(
          data.message ||
            (isLogin ? 'Failed to log in' : 'Failed to create account')
        );
      }
    } catch (error) {
      console.error('Login/Create Account error', error);
      setError('An error occurred');
    }
  };

  return (
    <section className='w-[364px] flex flex-col justify-center items-center self-center'>
      <header className='flex flex-col gap-2'>
        <h1 className='flex font-extrabold text-[30px] text-black-text leading-none justify-center cursor-default'>
          {isLogin ? 'LOGIN' : 'CREATE ACCOUNT'}
        </h1>
        <p className='cursor-default text-[16px] text-grey-text'>
          {isLogin
            ? 'Login To Have Fun Making New Quizzes'
            : 'Create Account To Make Your Own Quiz'}
        </p>
      </header>
      <form
        className='flex w-[364px] flex-col mt-6 gap-3'
        onSubmit={handleSubmit}
      >
        <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
          <FiUser className='ml-[8px] text-black w-[24px] h-[24px]' />
          <input
            type='text'
            placeholder='Username'
            className='flex bg-transparent w-full text-[14px] text-black font-medium rounded-[16px] h-full outline-none placeholder:text-black'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
          <FiLock className='ml-[8px] text-black w-[24px] h-[24px]' />
          <input
            type='password'
            placeholder='Password'
            className='flex bg-transparent w-full text-[14px] text-black font-medium  rounded-[16px] h-full outline-none placeholder:text-black'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <div className='flex items-center self-center text-red-500 text-xs mt-2'>
            {error}
          </div>
        )}
        <button
          type='submit'
          className='flex justify-center items-center self-center h-[52px] px-6 w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs font-bold mt-4 hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9]'
        >
          {isLogin ? 'Login Now' : 'Create Account'}
        </button>
      </form>
      <div className='w-full flex gap-6 mt-6 items-center'>
        <span className='bg-slate-200 h-[1px] rounded-full w-full'></span>
        <button
          className='text-blue-super shrink-0 self-center hover:underline font-bold text-xs h-fit w-fit'
          onClick={toggleFormType}
        >
          {isLogin ? 'Create Account' : 'Sign in Account'}
        </button>
        <span className='bg-slate-200 h-[1px] rounded-full w-full'></span>
      </div>
    </section>
  );
}
