import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { registerCandidate } from '../../utils/api';
import {
  handleRegistrationErrorResponse,
  RegistrationError,
  sanitizeRegistrationFormValues,
} from '@/utils/helpers';
import PasswordInput from '../../components/PasswordInput';

const initialRegistrationFormValues = {
  code: '',
  email: '',
  firstname: '',
  lastname: '',
  password: '',
  confirmPassword: '',
};
const Register = () => {
  const [formValues, setFormValues] = useState(initialRegistrationFormValues);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  // TODO: Add additional client side validation
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
    <div className="min-h-screen flex items-center justify-center bg-efcaGray font-sans">
      <div className="card max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-efcaText mb-4">Candidate Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="input-field"
            name="code"
            value={formValues.code}
            onChange={handleChange}
            placeholder="Invite Code"
            required
            autoFocus
          />
          <input
            className="input-field"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="input-field"
            name="firstname"
            value={formValues.firstname}
            onChange={handleChange}
            placeholder="First Name"
            required
          />
          <input
            className="input-field"
            name="lastname"
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
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        {error && (
          <p className="text-red-500 mt-2" aria-live="polite">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mt-2" aria-live="polite">
            Registration successful! Redirecting to login...
          </p>
        )}
        <p className="mt-4 text-sm text-efcaMuted">
          Are you a church or organization? Please{' '}
          <a
            href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
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
