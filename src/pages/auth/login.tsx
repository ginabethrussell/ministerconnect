import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('isAuthenticated', 'true');
        window.dispatchEvent(new Event('roleChanged'));
        router.push(`/${data.role}`);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-efcaBlue">Login</h2>
        <p className="mb-4 text-gray-600">All users (candidates, churches, admins) log in here.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="border p-2 w-full mb-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="border p-2 w-full mb-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            className="bg-efcaAccent text-white px-4 py-2 rounded w-full font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            type="submit"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">Login successful! Redirecting...</p>}
        <p className="mt-4 text-sm text-gray-600">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:ginabeth.russell@gmail.com?subject=Ministry%20Match%20Access%20Request"
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
