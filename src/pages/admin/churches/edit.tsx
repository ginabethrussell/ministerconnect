import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface ChurchUser {
  id?: number;
  email: string;
  password?: string;
  requires_password_change: boolean;
}

interface ChurchData {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function EditChurch() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [churchData, setChurchData] = useState<ChurchData | null>(null);
  const [users, setUsers] = useState<ChurchUser[]>([]);

  useEffect(() => {
    if (id) {
      loadChurch();
    }
  }, [id]);

  const loadChurch = async () => {
    try {
      const response = await fetch(`/api/churches/${id}`);
      if (response.ok) {
        const data = await response.json();
        setChurchData(data);
        setUsers(data.users || []);
      } else {
        alert('Church not found');
        router.push('/admin/churches');
      }
    } catch (error) {
      console.error('Error loading church:', error);
      alert('Error loading church data');
      router.push('/admin/churches');
    } finally {
      setLoading(false);
    }
  };

  const handleChurchDataChange = (field: string, value: string) => {
    if (churchData) {
      setChurchData(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleUserChange = (index: number, field: string, value: string | boolean) => {
    setUsers(prev => prev.map((user, i) => 
      i === index ? { ...user, [field]: value } : user
    ));
  };

  const addUser = () => {
    setUsers(prev => [...prev, {
      email: '',
      password: '',
      requires_password_change: true,
    }]);
  };

  const removeUser = (index: number) => {
    if (users.length > 1) {
      setUsers(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!churchData) return false;

    // Validate church data
    if (!churchData.name || !churchData.email || !churchData.phone || 
        !churchData.street_address || !churchData.city || !churchData.state || !churchData.zipcode) {
      alert('Please fill in all required church fields.');
      return false;
    }

    // Validate users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      if (!user.email) {
        alert(`Please fill in email for user ${i + 1}.`);
        return false;
      }
      // Only validate password for new users (no id)
      if (!user.id && !user.password) {
        alert(`Please fill in password for new user ${i + 1}.`);
        return false;
      }
      if (user.password && user.password.length < 8) {
        alert(`Password for user ${i + 1} must be at least 8 characters long.`);
        return false;
      }
    }

    // Check for duplicate emails
    const emails = users.map(u => u.email);
    const uniqueEmails = new Set(emails);
    if (emails.length !== uniqueEmails.size) {
      alert('All user emails must be unique.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !churchData) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/churches/${churchData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...churchData,
          users,
        }),
      });

      if (response.ok) {
        alert('Church updated successfully!');
        router.push('/admin/churches');
      } else {
        const errorData = await response.json();
        alert(`Error updating church: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating church:', error);
      alert('Error updating church. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChurch = async () => {
    if (!churchData) return;

    if (!confirm('Are you sure you want to delete this church? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/churches/${churchData.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Church deleted successfully!');
        router.push('/admin/churches');
      } else {
        const errorData = await response.json();
        alert(`Error deleting church: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting church:', error);
      alert('Error deleting church. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-efcaGray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading church data...</p>
        </div>
      </div>
    );
  }

  if (!churchData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Edit Church: {churchData.name}</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/churches"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Back to Churches
            </Link>
            <button
              onClick={handleDeleteChurch}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleting ? 'Deleting...' : 'Delete Church'}
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Church Information */}
          <div>
            <h2 className="text-xl font-semibold text-efcaDark mb-4">Church Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Church Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={churchData.name}
                  onChange={(e) => handleChurchDataChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="e.g., Grace Fellowship Church"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={churchData.email}
                  onChange={(e) => handleChurchDataChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="contact@church.org"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={churchData.phone}
                  onChange={(e) => handleChurchDataChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="555-123-4567"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={churchData.website}
                  onChange={(e) => handleChurchDataChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="https://church.org"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={churchData.street_address}
                  onChange={(e) => handleChurchDataChange('street_address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="123 Church St"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={churchData.city}
                  onChange={(e) => handleChurchDataChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="Springfield"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={churchData.state}
                  onChange={(e) => handleChurchDataChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                  placeholder="IL"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
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
                    <h3 className="font-medium text-gray-800">
                      {user.id ? `User ${user.id}` : `New User ${index + 1}`}
                    </h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => handleUserChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                        placeholder="user@church.org"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {user.id ? 'Password (leave blank to keep current)' : 'Password *'}
                      </label>
                      <input
                        type="password"
                        value={user.password || ''}
                        onChange={(e) => handleUserChange(index, 'password', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-efcaAccent focus:border-efcaAccent"
                        placeholder={user.id ? 'Keep current password' : 'Minimum 8 characters'}
                        required={!user.id}
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.requires_password_change}
                        onChange={(e) => handleUserChange(index, 'requires_password_change', e.target.checked)}
                        className="rounded border-gray-300 text-efcaAccent focus:ring-efcaAccent"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        User must change password on next login
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