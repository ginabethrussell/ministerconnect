'use client';

import React, { useState } from 'react';
import { Profile, useProfile } from '@/context/ProfileContext';
import { useUser } from '@/context/UserContext';
import UserIcon from '@/components/UserIcon';
import { patchProfileWithFile, resetProfileData } from '@/utils/api';
import { formatPhone } from '@/utils/helpers';

type Mode = 'view' | 'edit';

interface FormData {
  phone: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  resume: File | string | null;
  profile_image: File | string | null;
  video_url: string | null;
  placement_preferences: string[];
}

interface FormErrors {
  [key: string]: string | undefined;
  phone?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  resume?: string;
  profile_image?: string;
  video_url?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for localStorage
const MAX_IMAGE_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export default function CandidateProfilePage() {
  const { profile, setProfile } = useProfile();
  const { user } = useUser();
  const [mode, setMode] = useState<Mode>('view');
  const [form, setForm] = useState<FormData>({
    phone: profile?.phone || '',
    street_address: profile?.street_address || '',
    city: profile?.city || '',
    state: profile?.state || '',
    zipcode: profile?.zipcode || '',
    resume: profile?.resume || null,
    profile_image: profile?.profile_image || null,
    video_url: profile?.video_url || '',
    placement_preferences: profile?.placement_preferences || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const resetForm = (profile: Profile) => {
    setForm({
      phone: profile?.phone || '',
      street_address: profile?.street_address || '',
      city: profile?.city || '',
      state: profile?.state || '',
      zipcode: profile?.zipcode || '',
      resume: profile?.resume || null,
      profile_image: profile?.profile_image || null,
      video_url: profile?.video_url || '',
      placement_preferences: profile?.placement_preferences || [],
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    if (!form.street_address.trim()) errors.street_address = 'Street address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.state.trim()) errors.state = 'State is required';
    if (!form.zipcode.trim()) errors.zipcode = 'ZIP code is required';
    if (!form.resume || (typeof form.resume === 'string' && !form.resume.trim())) {
      errors.resume = 'Resume file upload is required';
    }
    if (form.video_url && !/^https?:\/\/.+\..+/.test(form.video_url)) {
      errors.video_url = 'Please enter a valid video URL';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files, name } = e.target;
    const file = files?.[0] ?? null;

    if (!file) {
      setForm((prev) => ({ ...prev, [name]: null }));
      return;
    }

    // Choose the correct size limit and error message
    const isResume = name === 'resume';
    const maxSize = isResume ? MAX_FILE_SIZE : MAX_IMAGE_FILE_SIZE;
    const fieldName = name as keyof FormData;

    if (file.size > maxSize) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: isResume
          ? 'Resume file size must be less than 5MB'
          : 'Profile image file size must be less than 3MB',
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [fieldName]: file }));
    if (formErrors[fieldName]) {
      setFormErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  const normalizePhone = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handleProfileUpdate = async (
    e: React.SyntheticEvent,
    status: 'draft' | 'pending' = 'pending'
  ) => {
    e.preventDefault();
    if (status !== 'draft' && !validateForm()) return;

    setError('');
    setSuccess('');
    const normalizedPhone = normalizePhone(form.phone);

    try {
      const updateData = new FormData();
      updateData.append('phone', normalizedPhone);
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (key === 'phone') return; // already added separately
          if (key === 'placement_preferences') {
            updateData.append(key, JSON.stringify(value));
          } else if (key === 'resume') {
            if (value instanceof File) {
              updateData.append('resume', value);
            }
          } else if (key === 'profile_image') {
            if (value instanceof File) {
              updateData.append('profile_image', value);
            }
          } else {
            updateData.append(key, value as string | Blob);
          }
        }
      });
      updateData.append('status', status);
      const response = await patchProfileWithFile(updateData);
      setProfile(response);
      setForm(response);
      setMode('view');
    } catch {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await resetProfileData();
      setProfile(response.profile);
      resetForm(response.profile);
      setMode('view');
    } catch {
      setError('Failed to reset profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlacementPreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((prev) => {
      const current = prev.placement_preferences || [];
      if (current.includes(value)) {
        return { ...prev, placement_preferences: current.filter((v) => v !== value) };
      } else if (current.length < 5) {
        return { ...prev, placement_preferences: [...current, value] };
      }
      return prev;
    });
  };

  if (loading) return <div className="mt-10 text-center">Loading...</div>;

  const renderView = () => {
    return (
      <div className="min-h-screen bg-efcaGray md:flex md:items-center md:justify-center md:px-8 md:py-8">
        <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-lg md:max-w-3xl md:p-8">
          {/* Profile Header */}
          <div className="mb-8 flex flex-col items-center space-y-4">
            {profile && profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="shadow-xlg h-60 w-60 rounded-full border-4 border-gray-300 object-cover"
              />
            ) : (
              <div className="flex h-60 w-60 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-100 text-gray-400">
                <UserIcon />
              </div>
            )}
            <h2 className="text-efcaDark text-3xl font-bold">{user?.name}</h2>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Contact Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <div>
                <p className="text-efcaDark text-sm font-semibold">Email</p>
                <p>{user?.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-efcaDark text-sm font-semibold">Phone</p>
                  <p>{formatPhone(profile.phone)}</p>
                </div>
              )}
              {profile?.street_address && (
                <div>
                  <p className="text-efcaDark text-sm font-semibold">Address</p>
                  <p>{profile.street_address}</p>
                  <p>
                    {profile.city}, {profile.state} {profile.zipcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Documents & Media
            </h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="text-efcaDark text-sm font-semibold">Resume</p>
                {typeof form.resume === 'string' && form.resume ? (
                  <a
                    href={form.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-efcaAccent hover:underline"
                  >
                    View Current Resume
                  </a>
                ) : (
                  <p className="text-gray-500">No resume uploaded.</p>
                )}
              </div>
              <div>
                <p className="text-efcaDark text-sm font-semibold">Preaching / Teaching Video</p>
                {profile?.video_url ? (
                  <a
                    href={profile.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-efcaAccent hover:underline"
                  >
                    View Video
                  </a>
                ) : (
                  <p className="text-gray-500">No video provided.</p>
                )}
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="mt-8 border-t pt-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Placement Preferences
            </h3>
            {profile?.placement_preferences && profile?.placement_preferences?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.placement_preferences.map((pref) => (
                  <span
                    key={pref}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No preferences set.</p>
            )}
          </div>

          {/* Edit Button / Status */}
          <div className="mt-10">
            {profile?.status !== 'pending' ? (
              <div className="flex justify-center">
                <button className="btn-primary" onClick={() => setMode('edit')}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Profile is in{' '}
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  Pending
                </span>{' '}
                status and awaiting Admin review.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form
      onSubmit={(e) => {
        handleProfileUpdate(e, 'pending');
      }}
      className="space-y-4"
    >
      <h3 className="text-efcaDark mb-2 text-base font-semibold">Contact Information</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            id="first_name"
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
            name="first_name"
            value={user?.first_name}
            disabled
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="last_name"
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
            name="last_name"
            value={user?.last_name}
            disabled
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
          name="email"
          type="email"
          value={user?.email}
          disabled
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone <span className="text-red-500">*</span>
        </label>
        <input
          className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
            formErrors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="8592143456"
          required
        />
        {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
      </div>

      <div>
        <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          id="street_address"
          className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
            formErrors.street_address ? 'border-red-500' : 'border-gray-300'
          }`}
          name="street_address"
          value={form.street_address}
          onChange={handleChange}
          placeholder="105 Orchard Dr"
          required
        />
        {formErrors.street_address && (
          <p className="mt-1 text-sm text-red-600">{formErrors.street_address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <input
            id="city "
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Cincinnati"
            required
          />
          {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State Abbreviation <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="OH"
            required
          />
          {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
        </div>

        <div>
          <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            id="zipcode"
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.zipcode ? 'border-red-500' : 'border-gray-300'
            }`}
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            placeholder="45069"
            required
          />
          {formErrors.zipcode && <p className="mt-1 text-sm text-red-600">{formErrors.zipcode}</p>}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />
      <h3 className="text-efcaDark mb-2 text-base font-semibold">Documents & Media</h3>
      <div className="mb-4">
        <div>
          <label htmlFor="resume" className="mb-2 block text-sm text-gray-700">
            Resume PDF Required (max 5MB) <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf"
              required={!(typeof form.resume === 'string' && form.resume)}
              className="flex-1 rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
            />
          </div>
          {formErrors.resume && <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>}
          {typeof form.resume === 'string' && form.resume && (
            <p className="mt-1 text-sm text-gray-500">
              A resume is already on file. Upload a new file above to replace it.
            </p>
          )}
          {typeof form.resume === 'string' && form.resume && (
            <div className="mb-2 mt-2 flex items-center gap-2">
              <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                Uploaded
              </span>
              <a
                href={form.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-efcaAccent hover:underline"
              >
                View Current Resume
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="profileImage" className="mb-2 block text-sm text-gray-700">
          Profile Photo (Optional, JPG/PNG, max 1MB)
        </label>
        <input
          type="file"
          id="profileImage"
          name="profile_image"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1 rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
        />
        {typeof form.profile_image === 'string' && form.profile_image && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800">
              Uploaded
            </span>
            <a
              href={form.profile_image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-efcaAccent hover:underline"
            >
              View Current Photo
            </a>
          </div>
        )}
        {formErrors.profile_image && (
          <p className="mt-1 text-sm text-red-600">{formErrors.profile_image}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">
          Teaching/Preaching Video URL (Optional)
        </label>
        <div className="mt-1 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-gray-300 p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent"
            name="video_url"
            value={form.video_url ?? ''}
            onChange={handleChange}
            placeholder="Video URL (YouTube, Vimeo, etc.)"
          />
        </div>
        {formErrors.video_url && (
          <p className="mt-1 text-sm text-red-600">{formErrors.video_url}</p>
        )}
      </div>

      <hr className="my-6 border-gray-200" />
      <h3 className="text-efcaDark mb-2 text-base font-semibold">Placement Preferences</h3>
      <p className="mb-4 text-sm text-gray-700">
        Choose up to 5 positions for which you are most qualified and interested.
      </p>
      <div className="mb-2 block text-sm font-semibold text-gray-700">
        Senior/Solo Pastor Positions
      </div>
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {[
          'Solo pastor',
          'Church-planting pastor',
          'Senior pastor (plus one or two full-time staff)',
          'Senior pastor (plus three or more full-time staff)',
        ].map((role) => (
          <label key={role} className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="placement_preferences"
              value={role}
              checked={form.placement_preferences?.includes(role)}
              onChange={handlePlacementPreferenceChange}
              disabled={
                !form.placement_preferences?.includes(role) &&
                form.placement_preferences?.length >= 5
              }
              className="mr-2"
            />
            {role}
          </label>
        ))}
      </div>
      <div className="mb-2 block text-sm font-semibold text-gray-700">Associate Staff Roles</div>
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {[
          'Administration/operations/business',
          'Adult education/small groups/discipleship',
          'Associate pastor',
          "Children's ministry",
          'Christian education (all ages)',
          'College ministries',
          'Communications/technology',
          'Executive pastor',
          'Family/community life',
          "Men's ministry",
          'Multicultural ministry',
          'Music and worship',
          'Outreach/evangelism',
          'Pastoral care/counseling',
          'Residency',
          'Internship',
          'Seniors ministry',
          'Singles ministry',
          'Student/youth ministry',
          "Women's ministry",
        ].map((role) => (
          <label key={role} className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="placement_preferences"
              value={role}
              checked={form.placement_preferences?.includes(role)}
              onChange={handlePlacementPreferenceChange}
              disabled={
                !form.placement_preferences?.includes(role) &&
                form.placement_preferences?.length >= 5
              }
              className="mr-2"
            />
            {role}
          </label>
        ))}
      </div>

      <div className="flex flex-col justify-evenly gap-2 pt-4 md:flex-row">
        <button
          className="rounded-lg bg-efcaAccent px-4 py-2.5 font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent"
          type="submit"
        >
          Submit Profile
        </button>
        <button
          className="rounded-lg bg-gray-400 px-4 py-2.5 font-bold text-white transition-colors hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          type="button"
          onClick={(e) => {
            handleProfileUpdate(e, 'draft');
          }}
        >
          Save as Draft
        </button>
        {mode === 'edit' && (
          <button
            className="rounded-lg bg-gray-200 px-4 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
            type="button"
            onClick={() => setMode('view')}
          >
            Cancel
          </button>
        )}
        {mode === 'edit' && (
          <button
            className="rounded-lg bg-red-600 px-4 py-2.5 font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
            type="button"
            onClick={handleResetProfile}
          >
            Reset Profile
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-efcaGray py-8 font-sans">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-efcaBlue">Candidate Profile</h2>
          {error && <p className="mb-4 text-red-500">{error}</p>}
          {success && <p className="mb-4 text-green-600">{success}</p>}
          {mode === 'view' && profile ? renderView() : renderForm()}
        </div>
      </div>
    </div>
  );
}
