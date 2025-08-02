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
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Create New Church</h1>
          <Link
            href="/admin/churches"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-center"
          >
            Back to Churches
          </Link>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Church Information */}
          <div>
            <h2 className="text-xl font-semibold text-efcaDark mb-4">Church Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Church Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={churchData.name}
                  onChange={(e) => handleChurchDataChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="e.g., Grace Fellowship Church"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="name"
                  type="email"
                  value={churchData.email}
                  onChange={(e) => handleChurchDataChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="contact@church.org"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={churchData.phone}
                  onChange={(e) => handleChurchDataChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="Enter 10 numbers with no punctuation"
                  required
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={churchData.website}
                  onChange={(e) => handleChurchDataChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="https://church.org"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="street_address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="street_address"
                  name="street_address"
                  type="text"
                  value={churchData.street_address}
                  onChange={(e) => handleChurchDataChange('street_address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="123 Church St"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={churchData.city}
                  onChange={(e) => handleChurchDataChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="Springfield"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State Abbreviation<span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={churchData.state}
                  onChange={(e) => handleChurchDataChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="2 Letter Abbreviation - OH"
                  required
                />
              </div>

              <div>
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="zipcode"
                  name="zipcode"
                  type="text"
                  value={churchData.zipcode}
                  onChange={(e) => handleChurchDataChange('zipcode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="62704"
                  required
                />
              </div>
            </div>
          </div>

          {/* Church Users */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-efcaDark">Church Users</h2>
              <button
                type="button"
                onClick={addUser}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors text-sm"
              >
                + Add User
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-800">User {index + 1}</h3>
                    {users.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeUser(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="user_email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="user_email"
                        name="user_email"
                        type="email"
                        value={user.email}
                        onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                        placeholder="user@church.org"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="first_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={user.first_name}
                        onChange={(e) => handleUserChange(index, 'first_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                        placeholder="First Name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="last_name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={user.last_name}
                        onChange={(e) => handleUserChange(index, 'last_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                        placeholder="Last Name"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <PasswordInput
                        value={user.password}
                        onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                        placeholder="Create a temporary password"
                        required
                      />
                    </div>
                    <PasswordRequirements />
                  </div>

                  <div className="mt-3">
                    <label htmlFor="require_password_change" className="flex items-center">
                      <input
                        id="require_password_change"
                        name="require_password_change"
                        type="checkbox"
                        checked={user.requires_password_change}
                        onChange={(e) =>
                          handleUserChange(index, 'requires_password_change', e.target.checked)
                        }
                        className="rounded border-gray-300 text-efcaAccent focus:ring-efcaAccent"
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
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Link
              href="/admin/churches"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-efcaAccent text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Church'}
            </button>
            {error && <p className="mt-1 text-sm text-left text-[#FF5722]">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
