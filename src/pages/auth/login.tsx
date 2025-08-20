'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '@/context/UserContext';
import PasswordInput from '@/components/PasswordInput';
import { login, getMe } from '@/utils/api';
import { getUserDashboardRoute } from '@/utils/helpers';

export default function Login() {
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
    const sanitizedEmail = email.trim().toLowerCase();
    try {
      const data = await login({ email: sanitizedEmail, password });

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
      } catch {
        setError('Login succeeded, but failed to fetch user info.');
        return;
      }
      setSuccess(true);
      if (userInfo.requires_password_change) {
        router.push('/auth/reset-password');
        return;
      }
      router.push(getUserDashboardRoute(userInfo));
    } catch {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-efcaGray font-sans">
      <div className="mx-auto max-w-md rounded bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold text-efcaBlue">Login</h2>
        <p className="mb-4 text-gray-600">All users (candidates, churches, admins) log in here.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
          />
          <PasswordInput
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {/* MVP - Contact Admin to Reset Password */}
          <div className="text-left">
            <p className="mt-4 text-sm text-gray-600">
              Forgot Password? Please{' '}
              <a
                href="mailto:mburks@gld-efca.org?subject=Minister%20Connect%20Password%20Reset%20Request"
                className="hover:text-efcaAccent-dark text-efcaAccent underline"
              >
                contact the site admin
              </a>{' '}
              to reset.
            </p>
          </div>
          <button className="btn-primary w-full" type="submit">
            Login
          </button>
        </form>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        {success && <p className="mt-2 text-green-600">Login successful! Redirecting...</p>}
        <p className="mt-4 text-sm text-gray-600">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:mburks@gld-efca.org?subject=Minister%20Connect%20Access%20Request"
            className="hover:text-efcaAccent-dark text-efcaAccent underline"
          >
            contact the site admin
          </a>{' '}
          to request access.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          Are you a candidate without an account?{' '}
          <Link
            href="/auth/register"
            className="text-efcaAccent underline hover:text-blue-700 focus:text-efcaAccent focus:underline focus:outline-none"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
