import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useUser } from '../../context/UserContext';
import PasswordInput from '../../components/PasswordInput';
import { login, getMe } from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const data = await login({ email, password });

      // Store JWT tokens
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', email);

      // Fetch current user info after login
      let userInfo;
      try {
        userInfo = await getMe();
        setUser(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } catch (err) {
        setError('Login succeeded, but failed to fetch user info.');
        return;
      }

      setSuccess(true);

      switch (userInfo.groups[0]) {
        case 'Super Admin':
          router.push('/superadmin');
          break;
        case 'Admin':
          router.push('/admin');
          break;
        case 'Church User':
          router.push('/church');
          break;
        case 'Candidate':
          router.push('/candidate');
          break;
        default:
          // add a page to contact the admin - don't know what to do with this user
          router.push('/');
      } // or wherever you want to redirect after login
    } catch {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-efcaBlue">Login</h2>
        <p className="mb-4 text-gray-600">All users (candidates, churches, admins) log in here.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
          />
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-efcaAccent hover:text-blue-700 underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">Login successful! Redirecting...</p>}
        <p className="mt-4 text-sm text-gray-600">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
            className="text-efcaAccent underline hover:text-efcaAccent-dark"
          >
            contact the admin
          </a>{' '}
          to request access.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/register"
            className="text-efcaAccent underline hover:text-blue-700 focus:underline focus:text-efcaAccent focus:outline-none"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
