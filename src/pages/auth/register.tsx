'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import PasswordInput from '@/components/PasswordInput';
import PasswordRequirements from '@/components/PasswordRequirements';
import { registerCandidate } from '@/utils/api';
import {
  handleRegistrationErrorResponse,
  RegistrationError,
  sanitizeRegistrationFormValues,
} from '@/utils/helpers';

const initialRegistrationFormValues = {
  code: '',
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const [formValues, setFormValues] = useState(initialRegistrationFormValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('invite') || '';

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  useEffect(() => {
    if (code) {
      setFormValues((prev) => ({ ...prev, code }));
    }
  }, [code]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const code = formData.get('code') as string;
    const email = formData.get('email') as string;
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const sanitizedFormValues = sanitizeRegistrationFormValues({
        code,
        email,
        firstname,
        lastname,
        password,
        confirmPassword,
      });
      await registerCandidate(sanitizedFormValues);
      setSuccess(true);
      setFormValues(initialRegistrationFormValues);
    } catch (error) {
      setError(handleRegistrationErrorResponse(error as RegistrationError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-efcaGray font-sans">
      <div className="card mx-auto max-w-md">
        <h2 className="text-efcaText mb-4 text-2xl font-bold">Candidate Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="code"
            type="text"
            className="input-field"
            value={formValues.code}
            onChange={handleChange}
            placeholder="Invite Code"
            required
            autoFocus
          />
          <input
            name="email"
            type="email"
            className="input-field"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            name="firstname"
            type="text"
            className="input-field"
            value={formValues.firstname}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            name="lastname"
            type="text"
            className="input-field"
            value={formValues.lastname}
            onChange={handleChange}
            placeholder="Last Name"
            required
          />
          <PasswordInput
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <PasswordInput
            name="confirmPassword"
            value={formValues.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter Password"
            required
          />
          <PasswordRequirements />
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && (
          <p className="mt-2 text-red-500" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="mt-2 text-green-600" aria-live="polite">
            Registration successful! Redirecting to login...
          </p>
        )}
        <p className="text-efcaMuted mt-4 text-sm">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
            className="hover:text-efcaAccent-dark text-efcaAccent underline"
          >
            contact the admin
          </a>{' '}
          to request access.
        </p>
        <p className="text-efcaMuted mt-4 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-efcaAccent underline hover:text-blue-700 focus:text-efcaAccent focus:underline focus:outline-none"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
