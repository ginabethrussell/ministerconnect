import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Church, User } from '../../types';

interface ChurchWithUser extends Church {
  users: Array<{
    id: number;
    email: string;
    role: 'church';
    church_id: number;
    requires_password_change: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

const AdminChurches = () => {
  const [churches, setChurches] = useState<ChurchWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all churches
  useEffect(() => {
    fetch('/api/churches')
      .then((res) => res.json())
      .then((data) => setChurches(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this church? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/churches/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        setChurches(churches.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete church. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting church:', error);
      alert('Failed to delete church. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-efcaGray p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-efcaDark">Manage Churches</h1>
          <Link
            href="/admin/churches/create"
            className="px-4 py-2 bg-efcaAccent text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            + Create New Church
          </Link>
        </header>

        {/* Churches List */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-efcaDark mb-6">Existing Churches</h2>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-efcaAccent mx-auto mb-4"></div>
                <p className="text-gray-600">Loading churches...</p>
              </div>
            ) : churches.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <p className="text-lg mb-2">No churches found</p>
                <p>Create your first church to get started.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 font-semibold text-gray-700">Church Name</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Users</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {churches.map((church, idx) => (
                    <tr key={church.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="py-3 px-4 align-middle">
                        <span className="text-efcaDark text-base font-medium">{church.name}</span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <span className="text-gray-700 text-base">{church.email}</span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <span className="text-gray-600 text-sm">
                          {church.city}, {church.state}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <div className="space-y-1">
                          <span className="text-gray-700 text-sm font-medium">{church.users[0]?.email}</span>
                          {church.users.length > 1 && (
                            <div className="text-xs text-gray-500">
                              +{church.users.length - 1} additional user{church.users.length > 2 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 align-middle">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          church.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {church.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 align-middle text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/churches/edit?id=${church.id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(church.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminChurches; 