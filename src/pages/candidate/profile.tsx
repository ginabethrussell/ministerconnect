'use client';
import React, { useState } from 'react';
import { Profile, useProfile } from '@/context/ProfileContext';
import { useUser } from '@/context/UserContext';
import { patchProfileWithFile, resetProfileData } from '@/utils/api';
import { formatPhone } from '@/utils/helpers';
import UserIcon from '@/components/UserIcon';

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
const MAX_IMAGE_FILE_SIZE = 3 * 1024 * 1024; // 1MB

const CandidateProfilePage = () => {
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const renderView = () => {
    return (
      <div className="min-h-screen bg-efcaGray md:flex md:items-center md:justify-center md:py-8 md:px-8">
        <div className="w-full md:max-w-3xl bg-white rounded-lg shadow-lg p-6 md:p-8 border border-gray-200">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4 mb-8">
            {profile && profile?.profile_image ? (
              <img
                src={profile.profile_image}
                alt="Profile"
                className="w-60 h-60 rounded-full border-4 border-gray-300 shadow-xlg object-cover"
              />
            ) : (
              <div className="w-60 h-60 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 border-2 border-gray-300">
                <UserIcon />
              </div>
            )}
            <h2 className="text-3xl font-bold text-efcaDark">{user?.name}</h2>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Contact Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <div>
                <p className="text-sm font-semibold text-efcaDark">Email</p>
                <p>{user?.email}</p>
              </div>
              {profile?.phone && (
                <div>
                  <p className="text-sm font-semibold text-efcaDark">Phone</p>
                  <p>{formatPhone(profile.phone)}</p>
                </div>
              )}
              {profile?.street_address && (
                <div>
                  <p className="text-sm font-semibold text-efcaDark">Address</p>
                  <p>{profile.street_address}</p>
                  <p>
                    {profile.city}, {profile.state} {profile.zipcode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          <div className="border-t pt-6 mt-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Documents & Media
            </h3>
            <div className="space-y-4 text-gray-600">
              <div>
                <p className="text-sm font-semibold text-efcaDark">Resume</p>
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
                <p className="text-sm font-semibold text-efcaDark">Preaching / Teaching Video</p>
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
          <div className="border-t pt-6 mt-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Placement Preferences
            </h3>
            {profile?.placement_preferences && profile?.placement_preferences?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.placement_preferences.map((pref) => (
                  <span
                    key={pref}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
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
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
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
      <h3 className="mb-2 text-base font-semibold text-efcaDark">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            className="mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
            name="first_name"
            value={user?.first_name}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            className="mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
            name="last_name"
            value={user?.last_name}
            disabled
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          className="mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
          name="email"
          type="email"
          value={user?.email}
          disabled
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
            formErrors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Street Address</label>
        <input
          className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
            formErrors.street_address ? 'border-red-500' : 'border-gray-300'
          }`}
          name="street_address"
          value={form.street_address}
          onChange={handleChange}
          required
        />
        {formErrors.street_address && (
          <p className="mt-1 text-sm text-red-600">{formErrors.street_address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />
          {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          />
          {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.zipcode ? 'border-red-500' : 'border-gray-300'
            }`}
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            required
          />
          {formErrors.zipcode && <p className="mt-1 text-sm text-red-600">{formErrors.zipcode}</p>}
        </div>
      </div>

      <hr className="my-6 border-gray-200" />
      <h3 className="mb-2 text-base font-semibold text-efcaDark">Documents & Media</h3>
      <div className="mb-4">
        <div>
          <label htmlFor="resumeFile" className="block mb-2 text-sm text-gray-700">
            Resume PDF Required (max 5MB)
          </label>
          <div className="flex gap-2 mt-1">
            <input
              type="file"
              id="resumeFile"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf"
              required={!(typeof form.resume === 'string' && form.resume)}
              className="flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
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
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Uploaded
              </span>
              <a
                href={form.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-efcaAccent text-sm hover:underline"
              >
                View Current Resume
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="profileImage" className="block mb-2 text-sm text-gray-700">
          Profile Photo (Optional, JPG/PNG, max 1MB)
        </label>
        <input
          type="file"
          id="profileImage"
          name="profile_image"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
        />
        {typeof form.profile_image === 'string' && form.profile_image && (
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              Uploaded
            </span>
            <a
              href={form.profile_image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-efcaAccent text-sm hover:underline"
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
        <label className="block mb-2 text-sm text-gray-700">
          Teaching/Preaching Video URL (Optional)
        </label>
        <div className="flex gap-2 mt-1">
          <input
            className="flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
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
      <h3 className="mb-2 text-base font-semibold text-efcaDark">Placement Preferences</h3>
      <p className="text-sm text-gray-700 mb-4">
        Choose up to 5 positions for which you are most qualified and interested.
      </p>
      <div className="block mb-2 font-semibold text-sm text-gray-700">
        Senior/Solo Pastor Positions
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
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
      <div className="block mb-2 font-semibold text-sm text-gray-700">Associate Staff Roles</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
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

      <div className="flex flex-col justify-evenly md:flex-row gap-2 pt-4">
        <button
          className="bg-efcaAccent text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          type="submit"
        >
          Submit Profile
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          type="button"
          onClick={(e) => {
            handleProfileUpdate(e, 'draft');
          }}
        >
          Save as Draft
        </button>
        {mode === 'edit' && (
          <button
            className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            type="button"
            onClick={() => setMode('view')}
          >
            Cancel
          </button>
        )}
        {mode === 'edit' && (
          <button
            className="bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
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
    <div className="min-h-screen bg-efcaGray font-sans py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-efcaBlue">Candidate Profile</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}
          {mode === 'view' && profile ? renderView() : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;
