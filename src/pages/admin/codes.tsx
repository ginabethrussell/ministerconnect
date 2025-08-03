'use client';

import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { add } from 'date-fns';
import { InviteCode } from '@/types';
import {
  getInviteCodes,
  createInviteCode,
  updateInviteCode,
  patchInviteCodeStatus,
} from '@/utils/api';

const initialFormValues = {
  code: '',
  event: '',
  expires_at: add(new Date(), { months: 6 }),
};

export default function AdminCodes() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    setLoading(true);
    try {
      const res = await getInviteCodes();
      setCodes(res.results);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load invite codes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setError('');
    setFormValues((prev) => ({ ...prev, expires_at: date ?? new Date() }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createInviteCode({
        ...formValues,
        expires_at: formValues.expires_at.toISOString(),
      });
      setFormValues(initialFormValues);
      await loadCodes();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred attempting to create the invite code.');
      }
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await patchInviteCodeStatus(id, { status: 'inactive' });
      await loadCodes();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred attempting to deactivate the invite code.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Manage Invite Codes</h1>

        <form
          onSubmit={handleCreate}
          className="mb-8 grid grid-cols-1 gap-4 rounded-lg bg-white p-6 shadow md:grid-cols-4"
        >
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Invite Code <span className="text-red-500">*</span>
            </label>
            <input
              name="code"
              value={formValues.code}
              onChange={handleChange}
              placeholder="Code"
              className="input-field"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Event <span className="text-red-500">*</span>
            </label>
            <input
              name="event"
              value={formValues.event}
              onChange={handleChange}
              placeholder="Event"
              className="input-field"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Expiration Date <span className="text-red-500">*</span>
            </label>
            <ReactDatePicker
              selected={formValues.expires_at}
              onChange={handleDateChange}
              className="input-field"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              placeholderText="Expiration Date"
            />
          </div>
          <button type="submit" className="btn-primary self-end">
            + Add Code
          </button>
          {error && <p className="mt-1 text-left text-sm text-[#FF5722]">{error}</p>}
        </form>

        <div className="rounded-lg bg-white p-6 shadow">
          {loading ? (
            <p>Loading...</p>
          ) : codes?.length > 0 ? (
            <div className="space-y-6">
              {codes.map((code) => (
                <InviteCodeRow
                  key={code.id}
                  code={code}
                  onSaveSuccess={loadCodes}
                  onDeactivate={handleDeactivate}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-500">No Invite Codes exist.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function InviteCodeRow({
  code,
  onDeactivate,
  onSaveSuccess,
}: {
  code: InviteCode;
  onDeactivate: (id: number) => void;
  onSaveSuccess: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValues, setLocalValues] = useState({
    code: code.code,
    event: code.event,
    expires_at: new Date(code.expires_at),
    status: code.status,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const { name, value } = e.target;
    setLocalValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null) => {
    setError('');
    setLocalValues((prev) => ({ ...prev, expires_at: date ?? prev.expires_at }));
  };

  const handleSave = async () => {
    setError('');
    try {
      await updateInviteCode(code.id, {
        ...localValues,
        expires_at: localValues.expires_at.toISOString(),
      });
      onSaveSuccess();
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the Invite Code.');
      }
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
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-800">{code.code}</h3>
        <span
          className={`rounded-full px-2 py-1 text-sm font-semibold capitalize ${
            code.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {code.status}
        </span>
      </div>
      {isEditing ? (
        <>
          <input
            name="code"
            value={localValues.code}
            onChange={handleChange}
            className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
          />
          <input
            name="event"
            value={localValues.event}
            onChange={handleChange}
            className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
          />
          <ReactDatePicker
            selected={localValues.expires_at}
            onChange={handleDateChange}
            className="input-field mb-4"
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
          />
          <div className="flex flex-col gap-2 md:flex-row">
            <button onClick={handleSave} className="btn-primary w-full md:w-auto">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary w-full md:w-auto">
              Cancel
            </button>
            {error && <p className="mt-1 text-left text-sm text-[#FF5722]">{error}</p>}
          </div>
        </>
      ) : (
        <div className="space-y-1 text-sm text-gray-700">
          <p className="mb-1 text-sm text-gray-600">
            <strong>Event:</strong> {code.event}
          </p>
          <p className="mb-1 text-sm text-gray-600">
            <strong>Used:</strong> {code.used_count}
          </p>
          <p className="mb-4 text-sm text-gray-600">
            <strong>Expires:</strong> {formatDate(code.expires_at)}
          </p>
          {code.status !== 'inactive' && (
            <div className="flex flex-col gap-2 pt-4 md:flex-row md:justify-end md:pt-0">
              <button onClick={() => setIsEditing(true)} className="btn-secondary w-full md:w-auto">
                Edit
              </button>
              <button onClick={() => onDeactivate(code.id)} className="btn-danger w-full md:w-auto">
                Deactivate
              </button>
              {error && <p className="mt-1 text-left text-sm text-[#FF5722]">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
