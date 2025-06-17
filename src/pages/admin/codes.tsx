import React, { useEffect, useState } from 'react';

interface InviteCode {
  id: string;
  code: string;
  uses: number;
  maxUses: number;
  event: string;
}

const AdminCodes = () => {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newMaxUses, setNewMaxUses] = useState(1);
  const [newEvent, setNewEvent] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<InviteCode>>({});

  useEffect(() => {
    fetch('/api/codes')
      .then((res) => res.json())
      .then((data) => setCodes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!newCode.trim() || !newEvent.trim()) return;
    const res = await fetch('/api/codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: newCode.trim(), maxUses: newMaxUses, event: newEvent.trim() }),
    });
    const created = await res.json();
    setCodes((prev) => [...prev, created]);
    setNewCode('');
    setNewMaxUses(1);
    setNewEvent('');
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/codes/${id}`, { method: 'DELETE' });
    setCodes(codes.filter((c) => c.id !== id));
  };

  const handleEdit = async (id: string, field: keyof InviteCode, value: string | number) => {
    const codeToUpdate = codes.find((c) => c.id === id);
    if (!codeToUpdate) return;
    const updated = { ...codeToUpdate, [field]: value };
    await fetch(`/api/codes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: updated.code, maxUses: updated.maxUses, event: updated.event }),
    });
    setCodes(codes.map((c) => (c.id === id ? updated : c)));
  };

  const startEdit = (code: InviteCode) => {
    setEditingId(code.id);
    setEditValues({ code: code.code, event: code.event, maxUses: code.maxUses });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async (id: string) => {
    await handleEdit(id, 'code', editValues.code ?? '');
    await handleEdit(id, 'event', editValues.event ?? '');
    await handleEdit(id, 'maxUses', editValues.maxUses ?? 1);
    setEditingId(null);
    setEditValues({});
  };

  return (
    <div className="card max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-efcaText mb-6">Manage Invite Codes</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-efcaText mb-2">Add New Invite Code</h2>
        <form
          className="bg-efcaLight p-4 rounded-lg shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            handleAdd();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label htmlFor="new-code" className="block text-efcaMuted text-sm font-semibold mb-1">
                Code
              </label>
              <input
                id="new-code"
                className="input-field w-full"
                placeholder="New Code"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-event"
                className="block text-efcaMuted text-sm font-semibold mb-1"
              >
                Event Name
              </label>
              <input
                id="new-event"
                className="input-field w-full"
                placeholder="Event Name"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="new-max-uses"
                className="block text-efcaMuted text-sm font-semibold mb-1"
              >
                Max Uses
              </label>
              <input
                id="new-max-uses"
                className="input-field w-full"
                type="number"
                min={1}
                placeholder="Max Uses"
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(Number(e.target.value))}
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
        <h2 className="text-xl font-semibold text-efcaText mb-2">Existing Invite Codes</h2>
        {loading ? (
          <div className="text-efcaMuted">Loading...</div>
        ) : codes.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-sm bg-efcaLight">
            <table className="w-full text-left border-t border-efcaGray">
              <thead>
                <tr className="bg-efcaBlue/90 text-white">
                  <th className="py-3 px-4 font-semibold">Code</th>
                  <th className="py-3 px-4 font-semibold">Event</th>
                  <th className="py-3 px-4 font-semibold text-right">Uses</th>
                  <th className="py-3 px-4 font-semibold text-right">Max Uses</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code, idx) => {
                  const isEditing = editingId === code.id;
                  return (
                    <tr key={code.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                      <td className="py-3 px-4 align-middle">
                        {isEditing ? (
                          <input
                            className="input-field"
                            value={editValues.code as string}
                            onChange={(e) => setEditValues((v) => ({ ...v, code: e.target.value }))}
                          />
                        ) : (
                          <span className="text-efcaText text-base font-medium">{code.code}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle">
                        {isEditing ? (
                          <input
                            className="input-field"
                            value={editValues.event as string}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, event: e.target.value }))
                            }
                          />
                        ) : (
                          <span className="text-efcaText text-base">{code.event}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle text-right">{code.uses}</td>
                      <td className="py-3 px-4 align-middle text-right">
                        {isEditing ? (
                          <input
                            className="input-field w-20 text-right"
                            type="number"
                            min={1}
                            value={editValues.maxUses as number}
                            onChange={(e) =>
                              setEditValues((v) => ({ ...v, maxUses: Number(e.target.value) }))
                            }
                          />
                        ) : (
                          <span className="text-efcaText text-base">{code.maxUses}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 align-middle text-center">
                        <div className="flex justify-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                className="rounded-full p-2 hover:bg-green-100 transition"
                                title="Save"
                                aria-label="Save"
                                onClick={() => saveEdit(code.id)}
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
                                onClick={() => startEdit(code)}
                              >
                                ✏️
                              </button>
                              <button
                                className="rounded-full p-2 hover:bg-red-100 transition"
                                title="Delete"
                                aria-label="Delete"
                                onClick={() => handleDelete(code.id)}
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
          </div>
        ) : (
          <div className="text-efcaMuted">No invite codes found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminCodes;
