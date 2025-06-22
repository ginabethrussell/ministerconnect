import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  getAdminChurchById,
  updateChurch,
  deleteChurch,
} from '../../../utils/api';
import { Church, User } from '../../../types';
import PasswordInput from '../../../components/PasswordInput';

type ChurchWithUsers = Church & { users: User[] };

export default function EditChurch() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [churchData, setChurchData] = useState<ChurchWithUsers | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      loadChurch(id);
    }
  }, [id]);

  const loadChurch = async (churchId: string) => {
    try {
      const data = await getAdminChurchById(churchId);
      setChurchData(data);
    } catch (error) {
      console.error('Error loading church:', error);
      alert('Error loading church data');
      router.push('/admin/churches');
    } finally {
      setLoading(false);
    }
  };

  const handleChurchDataChange = (field: string, value: string) => {
    setChurchData(prev =>
      prev ? { ...prev, [field]: value } : null
    );
  };

  const handleUserChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    setChurchData(prev => {
      if (!prev) return null;
      const newUsers = [...prev.users];
      newUsers[index] = { ...newUsers[index], [field]: value };
      return { ...prev, users: newUsers };
    });
  };

  const addUser = () => {
    setChurchData(prev => {
      if (!prev) return null;
      const newUser: User = {
        id: Date.now(), // Temporary ID for new user
        email: '',
        name: '',
        role: 'church',
        church_id: prev.id,
        status: 'active',
        requires_password_change: true,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return { ...prev, users: [...prev.users, newUser] };
    });
  };

  const removeUser = (index: number) => {
    setChurchData(prev => {
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

    setSaving(true);
    try {
      await updateChurch(churchData.id, churchData);
      alert('Church updated successfully!');
      router.push('/admin/churches');
    } catch (error) {
      console.error('Error updating church:', error);
      alert('Error updating church. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChurch = async () => {
    if (!churchData) return;

    if (
      !confirm(
        'Are you sure you want to delete this church? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await deleteChurch(churchData.id);
      alert('Church deleted successfully!');
      router.push('/admin/churches');
    } catch (error) {
      console.error('Error deleting church:', error);
      alert('Error deleting church. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Loading church data...</p>
      </div>
    );
  }

  if (!churchData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Church not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit: {churchData.name}
          </h1>
          <div className="flex gap-4">
            <Link
              href="/admin/churches"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-center w-full"
            >
              Back to Churches
            </Link>
          </div>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 space-y-8"
        >
          {/* Church Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              Church Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={churchData.name}
                onChange={e => handleChurchDataChange('name', e.target.value)}
                className="input-field"
                placeholder="Church Name"
                required
              />
              <input
                type="email"
                value={churchData.email}
                onChange={e => handleChurchDataChange('email', e.target.value)}
                className="input-field"
                placeholder="Church Email"
                required
              />
              <input
                type="tel"
                value={churchData.phone}
                onChange={e => handleChurchDataChange('phone', e.target.value)}
                className="input-field"
                placeholder="Phone Number"
                required
              />
              <input
                type="text"
                value={churchData.website}
                onChange={e =>
                  handleChurchDataChange('website', e.target.value)
                }
                className="input-field"
                placeholder="Website"
              />
              <input
                type="text"
                value={churchData.street_address}
                onChange={e =>
                  handleChurchDataChange('street_address', e.target.value)
                }
                className="input-field"
                placeholder="Street Address"
                required
              />
              <input
                type="text"
                value={churchData.city}
                onChange={e => handleChurchDataChange('city', e.target.value)}
                className="input-field"
                placeholder="City"
                required
              />
              <input
                type="text"
                value={churchData.state}
                onChange={e => handleChurchDataChange('state', e.target.value)}
                className="input-field"
                placeholder="State"
                required
              />
              <input
                type="text"
                value={churchData.zipcode}
                onChange={e =>
                  handleChurchDataChange('zipcode', e.target.value)
                }
                className="input-field"
                placeholder="Zip Code"
                required
              />
              <select
                value={churchData.status}
                onChange={e => handleChurchDataChange('status', e.target.value)}
                className="input-field"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </section>

          {/* User Credentials */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">
              User Credentials
            </h2>
            <div className="space-y-6">
              {churchData.users.map((user, index) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-md bg-gray-50 relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      value={user.email}
                      onChange={e =>
                        handleUserChange(index, 'email', e.target.value)
                      }
                      className="input-field"
                      placeholder="User Email"
                      required
                    />
                    <PasswordInput
                      value={user.password || ''}
                      onChange={e =>
                        handleUserChange(index, 'password', e.target.value)
                      }
                      placeholder={user.id ? 'New Password (optional)' : 'Password'}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`force-change-${user.id}`}
                        checked={user.requires_password_change}
                        onChange={e =>
                          handleUserChange(
                            index,
                            'requires_password_change',
                            e.target.checked
                          )
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
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addUser}
              className="mt-4 btn-secondary-sm"
            >
              + Add Another User
            </button>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/churches')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-efcaAccent text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 