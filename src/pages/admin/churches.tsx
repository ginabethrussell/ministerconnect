import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAdminChurches, deleteChurch } from '../../utils/api';
import { Church, User } from '../../types';

type ChurchWithUsers = Church & { users: User[] };

const AdminChurches = () => {
  const [churches, setChurches] = useState<ChurchWithUsers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChurches();
  }, []);

  const fetchChurches = async () => {
    setLoading(true);
    try {
      const data = await getAdminChurches();
      setChurches(data);
    } catch (error) {
      console.error('Failed to fetch churches', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this church and all associated users? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await deleteChurch(id);
      setChurches((prevChurches) => prevChurches.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete church', error);
      alert('Error deleting church. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Churches</h1>
          <Link href="/admin/churches/create" className="btn-primary text-center w-full md:w-auto">
            + New Church
          </Link>
        </header>

        <section className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Loading churches...</p>
            </div>
          ) : churches.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg mb-2 text-gray-600">No churches found</p>
              <p className="text-sm text-gray-500 mb-4">Create your first church to get started.</p>
              <Link href="/admin/churches/create" className="btn-primary">
                + New Church
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 font-semibold text-gray-600">Church Name</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Contact</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Location</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Lead User</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {churches.map((church) => (
                      <tr key={church.id}>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-800">{church.name}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{church.email}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {church.city}, {church.state}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {church.users[0]?.name || 'N/A'}
                          {church.users.length > 1 && (
                            <span className="text-xs text-gray-500 ml-2">
                              (+{church.users.length - 1} more)
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block capitalize px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              church.status
                            )}`}
                          >
                            {church.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center gap-2">
                            <Link
                              href={`/admin/churches/edit?id=${church.id}`}
                              className="btn-secondary-sm"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(church.id)}
                              className="btn-danger-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
                {churches.map((church) => (
                  <div key={church.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-lg">{church.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{church.email}</p>
                      </div>
                      <span
                        className={`inline-block capitalize px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          church.status
                        )}`}
                      >
                        {church.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Location:</span>
                        <p className="text-gray-800">
                          {church.city}, {church.state}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Lead User:</span>
                        <p className="text-gray-800">
                          {church.users[0]?.name || 'N/A'}
                          {church.users.length > 1 && (
                            <span className="text-xs text-gray-500 ml-1">
                              (+{church.users.length - 1} more)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <Link
                        href={`/admin/churches/edit?id=${church.id}`}
                        className="flex-1 btn-secondary-sm text-center"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(church.id)}
                        className="flex-1 btn-danger-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminChurches;
