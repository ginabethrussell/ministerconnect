import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Register = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [event, setEvent] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setEvent(null);

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Step 1: Validate invite code
      const validateRes = await fetch('/api/validate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const validateData = await validateRes.json();

      if (!validateRes.ok) {
        setError(validateData.message || 'Invalid invite code');
        return;
      }

      // Step 2: Register candidate
      const registerRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email, password }),
      });

      const registerData = await registerRes.json();

      if (registerRes.ok) {
        router.push('/auth/login?registered=true');
      } else {
        setError(registerData.message || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="card max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-efcaText mb-4">Candidate Registration</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Invite Code"
            required
          />
          <input
            className="input-field"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className="input-field"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            className="input-field"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter Password"
            required
          />
          <button className="btn-primary w-full" type="submit">
            Register
          </button>
        </form>
        {success && (
          <p className="text-green-600 mt-2">
            Registration successful! {event && `Event: ${event}.`} Redirecting to login...
          </p>
        )}
        <p className="mt-4 text-sm text-efcaMuted">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:ginabeth.russell@gmail.com?subject=Ministry%20Match%20Access%20Request"
            className="text-efcaAccent underline hover:text-efcaAccent-dark"
          >
            contact the admin
          </a>{' '}
          to request access.
        </p>
        <p className="mt-4 text-sm text-efcaMuted">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-efcaAccent underline hover:text-blue-700 focus:underline focus:text-efcaAccent focus:outline-none"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
