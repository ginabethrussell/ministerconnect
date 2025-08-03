'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import { User } from '@/context/UserContext';
import PasswordInput from '@/components/PasswordInput';
import { Church } from '@/types';
import { getChurchById, updateChurchById, getUsersByChurchId } from '@/utils/api';
import { formatPhone, titleCase } from '@/utils/helpers';

type ChurchWithUsers = Church & { users: User[]; existingUsers: User[] };

export default function EditChurch() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [churchData, setChurchData] = useState<ChurchWithUsers | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadChurch = async (churchId: string) => {
      try {
        const data = await getChurchById(churchId);
        const usersRes = await getUsersByChurchId(churchId);
        setChurchData({
          ...data,
          existingUsers: usersRes.results,
          users: [],
        });
      } catch (error) {
        if (error instanceof Error) {
          setError('Unable to load church.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (typeof id === 'string') {
      loadChurch(id);
    }
  }, [id, router]);

  const handleChurchDataChange = (field: string, value: string) => {
    setError('');
    setChurchData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleUserChange = (index: number, field: string, value: string | boolean) => {
    setError('');
    setChurchData((prev) => {
      if (!prev) return null;
      const newUsers = [...prev.users];
      newUsers[index] = { ...newUsers[index], [field]: value };
      return { ...prev, users: newUsers };
    });
  };

  const addUser = () => {
    setChurchData((prev) => {
      if (!prev) return null;
      const newUser: User = {
        id: Date.now(), // Temporary ID for new user
        email: '',
        name: '',
        first_name: '',
        last_name: '',
        groups: ['Church User'],
        password: '',
        church_id: prev.id,
        status: 'active',
        requires_password_change: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { ...prev, users: [...prev.users, newUser] };
    });
  };

  const removeUser = (index: number) => {
    setChurchData((prev) => {
      if (!prev || prev.users.length <= 1) return prev;
      return {
        ...prev,
        users: prev.users.filter((_, i) => i !== index),
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchData) return;
    setError('');
    setSaving(true);
    try {
      await updateChurchById(churchData.id, churchData);
      router.push('/admin/churches');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to update church.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Loading church data...</p>
      </div>
    );
  }

  if (!churchData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p>Church not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold text-gray-800">Edit: {churchData.name}</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/churches"
              className="w-full rounded bg-gray-600 px-4 py-2 text-center text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back to Churches
            </Link>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-lg bg-white p-8 shadow-md">
          {/* Church Information */}
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-700">Church Information</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input
                name="name"
                type="text"
                value={churchData.name}
                onChange={(e) => handleChurchDataChange('name', e.target.value)}
                className="input-field"
                placeholder="Church Name"
                required
              />
              <input
                name="email"
                type="email"
                value={churchData.email}
                onChange={(e) => handleChurchDataChange('email', e.target.value)}
                className="input-field"
                placeholder="Church Email"
                required
              />
              <input
                name="phone"
                type="tel"
                value={formatPhone(churchData.phone)}
                onChange={(e) => handleChurchDataChange('phone', e.target.value)}
                className="input-field"
                placeholder="Enter 10 numbers with no punctuation"
                required
              />
              <input
                name="website"
                type="text"
                value={churchData.website}
                onChange={(e) => handleChurchDataChange('website', e.target.value)}
                className="input-field"
                placeholder="Website"
              />
              <input
                name="street_address"
                type="text"
                value={churchData.street_address}
                onChange={(e) => handleChurchDataChange('street_address', e.target.value)}
                className="input-field"
                placeholder="Street Address"
                required
              />
              <input
                name="city"
                type="text"
                value={churchData.city}
                onChange={(e) => handleChurchDataChange('city', e.target.value)}
                className="input-field"
                placeholder="City"
                required
              />
              <input
                name="state"
                type="text"
                value={churchData.state}
                onChange={(e) => handleChurchDataChange('state', e.target.value)}
                className="input-field"
                placeholder="State"
                required
              />
              <input
                name="zipcode"
                type="text"
                value={churchData.zipcode}
                onChange={(e) => handleChurchDataChange('zipcode', e.target.value)}
                className="input-field"
                placeholder="Zip Code"
                required
              />
              <select
                name="status"
                value={churchData.status}
                onChange={(e) => handleChurchDataChange('status', e.target.value)}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </section>

          {/* User Credentials */}
          <section>
            <h2 className="mb-6 text-xl font-semibold text-gray-700">User Credentials</h2>
            <div>
              {churchData.existingUsers.map((user: User, idx: number) => (
                <div key={`${user.id}-${idx}`} className="mb-4 rounded border bg-gray-50 p-4">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Status:</strong> {titleCase(user?.status || '')}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {churchData.users.map((user, index) => (
                <div key={user.id} className="relative rounded-md border bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      name="first_name"
                      type="text"
                      value={user.first_name}
                      onChange={(e) => handleUserChange(index, 'first_name', e.target.value)}
                      className="input-field"
                      placeholder="User First Name"
                      required
                    />
                    <input
                      name="last_name"
                      type="text"
                      value={user.last_name}
                      onChange={(e) => handleUserChange(index, 'last_name', e.target.value)}
                      className="input-field"
                      placeholder="User Last Name"
                      required
                    />
                    <input
                      name="email"
                      type="email"
                      value={user.email}
                      onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                      className="input-field"
                      placeholder="User Email"
                      required
                    />
                    <PasswordInput
                      value={user.password || ''}
                      onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                      placeholder="Temporary Password"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`force-change-${user.id}`}
                        checked={user.requires_password_change}
                        onChange={(e) =>
                          handleUserChange(index, 'requires_password_change', e.target.checked)
                        }
                      />
                      <label htmlFor={`force-change-${user.id}`} className="text-sm">
                        Force password change on next login
                      </label>
                    </div>
                  </div>
                  {churchData.users.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUser(index)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    >
                      <X />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addUser} className="btn-secondary-sm mt-4">
              + Add Another User
            </button>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4 border-t pt-4">
            <button
              type="button"
              onClick={() => router.push('/admin/churches')}
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-efcaAccent px-6 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {error && <p className="mt-1 text-left text-sm text-[#FF5722]">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}
