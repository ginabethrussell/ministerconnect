import React, { useEffect, useState } from 'react';

interface ChurchUser {
  id: string;
  email: string;
  churchName: string;
  createdAt: string;
}

const AdminChurches = () => {
  const [churches, setChurches] = useState<ChurchUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newChurchName, setNewChurchName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ChurchUser>>({});
  const [loading, setLoading] = useState(true);

  // Fetch all churches
  useEffect(() => {
    fetch('/api/churches')
      .then((res) => res.json())
      .then((data) => setChurches(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newEmail.trim() || !newPassword.trim() || !newChurchName.trim()) return;
    const res = await fetch('/api/churches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail.trim(), churchName: newChurchName.trim() }),
    });
    const created = await res.json();
    setChurches((prev) => [...prev, created]);
    setNewEmail('');
    setNewPassword('');
    setNewChurchName('');
  };

  const startEdit = (church: ChurchUser) => {
    setEditingId(church.id);
    setEditValues({ email: church.email, churchName: church.churchName });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id: string) => {
    const res = await fetch(`/api/churches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: editValues.email, churchName: editValues.churchName }),
    });
    const updated = await res.json();
    setChurches(churches.map((c) => (c.id === id ? updated : c)));
    setEditingId(null);
    setEditValues({});
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/churches/${id}`, { method: 'DELETE' });
    setChurches(churches.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-efcaText mb-6">Manage Church Users</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-efcaText mb-2">Add New Church User</h2>
        <form
          className="bg-efcaLight p-4 rounded-lg shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label
                htmlFor="new-church-email"
                className="block text-efcaMuted text-sm font-semibold mb-1"
              >
                Email
              </label>
              <input
                id="new-church-email"
                className="input-field w-full"
                placeholder="Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-church-password"
                className="block text-efcaMuted text-sm font-semibold mb-1"
              >
                Password
              </label>
              <input
                id="new-church-password"
                className="input-field w-full"
                placeholder="Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-church-name"
                className="block text-efcaMuted text-sm font-semibold mb-1"
              >
                Church Name
              </label>
              <input
                id="new-church-name"
                className="input-field w-full"
                placeholder="Church Name"
                value={newChurchName}
                onChange={(e) => setNewChurchName(e.target.value)}
              />
            </div>
            <div className="flex md:block justify-end">
              <button className="btn-primary w-full md:w-auto" type="submit">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold text-efcaText mb-2">Churches with Access</h2>
        <div className="overflow-x-auto rounded-lg shadow-sm bg-efcaLight">
          {loading ? (
            <div className="text-efcaMuted p-4">Loading...</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-efcaBlue/90 text-white">
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Church Name</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {churches.map((church, idx) => {
                  const isEditing = editingId === church.id;
                  return (
                    <tr key={church.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="py-3 px-4 align-middle">
                        {isEditing ? (
                          <input
                            className="input-field"
                            value={editValues.email as string}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, email: e.target.value }))
                            }
                          />
                        ) : (
                          <span className="text-efcaText text-base">{church.email}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle">
                        {isEditing ? (
                          <input
                            className="input-field"
                            value={editValues.churchName as string}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, churchName: e.target.value }))
                            }
                          />
                        ) : (
                          <span className="text-efcaText text-base">{church.churchName}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle">{church.createdAt}</td>
                      <td className="py-3 px-4 align-middle text-center">
                        <div className="flex justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                className="rounded-full p-2 hover:bg-green-100 transition"
                                title="Save"
                                aria-label="Save"
                                onClick={() => saveEdit(church.id)}
                              >
                                ✔️
                              </button>
                              <button
                                className="rounded-full p-2 hover:bg-red-100 transition"
                                title="Cancel"
                                aria-label="Cancel"
                                onClick={cancelEdit}
                              >
                                ✖️
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="rounded-full p-2 hover:bg-efcaAccent/10 transition"
                                title="Edit"
                                aria-label="Edit"
                                onClick={() => startEdit(church)}
                              >
                                ✏️
                              </button>
                              <button
                                className="rounded-full p-2 hover:bg-red-100 transition"
                                title="Delete"
                                aria-label="Delete"
                                onClick={() => handleDelete(church.id)}
                              >
                                🗑️
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChurches;
