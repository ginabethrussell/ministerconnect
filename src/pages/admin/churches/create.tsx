'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PasswordInput from '@/components/PasswordInput';
import PasswordRequirements from '@/components/PasswordRequirements';
import { ChurchUserInput, ChurchInput } from '@/types';
import { createChurch } from '@/utils/api';

export default function CreateChurch() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [churchData, setChurchData] = useState<ChurchInput>({
    name: '',
    email: '',
    phone: '',
    website: '',
    street_address: '',
    city: '',
    state: '',
    zipcode: '',
    status: 'active',
  });
  const [users, setUsers] = useState<ChurchUserInput[]>([
    {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      requires_password_change: true,
      status: 'active',
    },
  ]);
  const [error, setError] = useState('');

  const handleChurchDataChange = (field: string, value: string) => {
    setError('');
    setChurchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserChange = (index: number, field: string, value: string | boolean) => {
    setError('');
    setUsers((prev) => prev.map((user, i) => (i === index ? { ...user, [field]: value } : user)));
  };

  const addUser = () => {
    setUsers((prev) => [
      ...prev,
      {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        requires_password_change: true,
        status: 'active',
      },
    ]);
  };

  const removeUser = (index: number) => {
    if (users.length > 1) {
      setUsers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    // Validate church data
    if (
      !churchData.name ||
      !churchData.email ||
      !churchData.phone ||
      !churchData.street_address ||
      !churchData.city ||
      !churchData.state ||
      !churchData.zipcode
    ) {
      return false;
    }

    // Validate users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (!user.email || !user.password) {
        return false;
      }
      if (user.password.length < 8) {
        return false;
      }
    }

    // Check for duplicate emails
    const emails = users.map((u) => u.email);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const newChurchWithUsers = {
      ...churchData,
      users,
    };

    try {
      await createChurch(newChurchWithUsers);
      router.push('/admin/churches');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An error occurred while creating the church.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-efcaDark text-3xl font-bold">Create New Church</h1>
          <Link
            href="/admin/churches"
            className="rounded bg-gray-600 px-4 py-2 text-center text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Churches
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-8 shadow-lg">
          {/* Church Information */}
          <div>
            <h2 className="text-efcaDark mb-4 text-xl font-semibold">Church Information</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                  Church Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.name}
                  onChange={(e) => handleChurchDataChange('name', e.target.value)}
                  placeholder="e.g., Grace Fellowship Church"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.email}
                  onChange={(e) => handleChurchDataChange('email', e.target.value)}
                  placeholder="contact@church.org"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.phone}
                  onChange={(e) => handleChurchDataChange('phone', e.target.value)}
                  placeholder="Enter 10 numbers with no punctuation"
                  required
                />
              </div>

              <div>
                <label htmlFor="website" className="mb-2 block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.website}
                  onChange={(e) => handleChurchDataChange('website', e.target.value)}
                  placeholder="https://church.org"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="street_address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="street_address"
                  name="street_address"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.street_address}
                  onChange={(e) => handleChurchDataChange('street_address', e.target.value)}
                  placeholder="123 Church St"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.city}
                  onChange={(e) => handleChurchDataChange('city', e.target.value)}
                  placeholder="Springfield"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="mb-2 block text-sm font-medium text-gray-700">
                  State Abbreviation<span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.state}
                  onChange={(e) => handleChurchDataChange('state', e.target.value)}
                  placeholder="2 Letter Abbreviation - OH"
                  required
                />
              </div>

              <div>
                <label htmlFor="zipcode" className="mb-2 block text-sm font-medium text-gray-700">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                  value={churchData.zipcode}
                  onChange={(e) => handleChurchDataChange('zipcode', e.target.value)}
                  placeholder="62704"
                  required
                />
              </div>
            </div>
          </div>

          {/* Church Users */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-efcaDark text-xl font-semibold">Church Users</h2>
              <button
                type="button"
                onClick={addUser}
                className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                + Add User
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">User {index + 1}</h3>
                    {users.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUser(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="user_email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="user_email"
                        name="email"
                        type="email"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                        value={user.email}
                        onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                        placeholder="user@church.org"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="first_name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                        value={user.first_name}
                        onChange={(e) => handleUserChange(index, 'first_name', e.target.value)}
                        placeholder="First Name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="last_name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-efcaAccent focus:outline-none focus:ring-2 focus:ring-efcaAccent"
                        value={user.last_name}
                        onChange={(e) => handleUserChange(index, 'last_name', e.target.value)}
                        placeholder="Last Name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <PasswordInput
                        id="password"
                        name="password"
                        value={user.password}
                        onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                        placeholder="Create a temporary password"
                        required
                      />
                    </div>
                    <PasswordRequirements />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="requires_password_change" className="flex items-center">
                      <input
                        id="requires_password_change"
                        name="requires_password_change"
                        type="checkbox"
                        className="rounded border-gray-300 text-efcaAccent focus:ring-efcaAccent"
                        checked={user.requires_password_change}
                        onChange={(e) =>
                          handleUserChange(index, 'requires_password_change', e.target.checked)
                        }
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        User will be required to reset password on first login.
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <Link
              href="/admin/churches"
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-efcaAccent px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Church'}
            </button>
            {error && <p className="mt-1 text-left text-sm text-[#FF5722]">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
