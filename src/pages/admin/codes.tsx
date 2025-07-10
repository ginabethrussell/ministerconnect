import React, { useEffect, useState } from 'react';
import {
  getAdminInviteCodes,
  createInviteCode,
  updateInviteCode,
  deleteInviteCode,
} from '../../utils/api';
import { InviteCode } from '../../types';

const AdminCodes = () => {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newEvent, setNewEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ code: string; event: string }>({
    code: '',
    event: '',
  });

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const data = await getAdminInviteCodes();
      setCodes(data);
    } catch (error) {
      console.error('Failed to load invite codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newEvent.trim()) return;
    try {
      const created = await createInviteCode({
        code: newCode.trim(),
        event: newEvent.trim(),
      });
      setCodes((prev) => [...prev, created]);
      setNewCode('');
      setNewEvent('');
    } catch (error) {
      console.error('Failed to create invite code:', error);
      alert('Error creating invite code.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this invite code?')) return;
    try {
      await deleteInviteCode(id);
      setCodes(codes.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to delete invite code:', error);
      alert('Error deleting invite code.');
    }
  };

  const startEdit = (code: InviteCode) => {
    setEditingId(code.id);
    setEditValues({ code: code.code, event: code.event });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ code: '', event: '' });
  };

  const saveEdit = async (id: number) => {
    try {
      const updated = await updateInviteCode(id, editValues);
      setCodes(codes.map((c) => (c.id === id ? updated : c)));
      cancelEdit();
    } catch (error) {
      console.error('Failed to update invite code:', error);
      alert('Error updating invite code.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Invite Codes</h1>
        </header>

        <section className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Code</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <input
              className="input-field"
              placeholder="New Code (e.g., CONF2025)"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              required
            />
            <input
              className="input-field"
              placeholder="Event Name"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              required
            />
            <button className="btn-primary" type="submit">
              + Add Code
            </button>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-md">
          {loading ? (
            <div className="text-center py-20">
              <p>Loading codes...</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No invite codes found.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 font-semibold text-gray-600">Code</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Event</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Used</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Expires</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {codes.map((code) => {
                      const isEditing = editingId === code.id;
                      return (
                        <tr key={code.id}>
                          <td className="py-4 px-6">
                            {isEditing ? (
                              <input
                                className="input-field"
                                value={editValues.code}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, code: e.target.value }))
                                }
                              />
                            ) : (
                              <span className="font-medium text-gray-800">{code.code}</span>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            {isEditing ? (
                              <input
                                className="input-field"
                                value={editValues.event}
                                onChange={(e) =>
                                  setEditValues((v) => ({ ...v, event: e.target.value }))
                                }
                              />
                            ) : (
                              <span className="text-gray-600">{code.event}</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-600">{code.used_count}</td>
                          <td className="py-4 px-6">
                            <span
                              className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                                code.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {code.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600">{formatDate(code.expires_at)}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex justify-center gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => saveEdit(code.id)}
                                    className="btn-primary-sm"
                                  >
                                    Save
                                  </button>
                                  <button onClick={cancelEdit} className="btn-secondary-sm">
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => startEdit(code)}
                                    className="btn-secondary-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(code.id)}
                                    className="btn-danger-sm"
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden p-4 space-y-4">
                {codes.map((code) => {
                  const isEditing = editingId === code.id;
                  return (
                    <div key={code.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 text-lg">{code.code}</h3>
                          <p className="text-sm text-gray-600 mt-1">{code.event}</p>
                        </div>
                        <span
                          className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${
                            code.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {code.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Used:</span>
                          <p className="text-gray-800">{code.used_count}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Expires:</span>
                          <p className="text-gray-800">{formatDate(code.expires_at)}</p>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="space-y-3 pt-3 border-t border-gray-100">
                          <input
                            className="input-field"
                            placeholder="Code"
                            value={editValues.code}
                            onChange={(e) => setEditValues((v) => ({ ...v, code: e.target.value }))}
                          />
                          <input
                            className="input-field"
                            placeholder="Event"
                            value={editValues.event}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, event: e.target.value }))
                            }
                          />
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => saveEdit(code.id)}
                              className="flex-1 btn-primary-sm text-center"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 btn-secondary-sm text-center"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(code)}
                              className="flex-1 btn-secondary-sm text-center"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(code.id)}
                              className="flex-1 btn-danger-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminCodes;
