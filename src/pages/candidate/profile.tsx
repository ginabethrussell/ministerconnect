import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Profile } from '@/types';

type Mode = 'view' | 'edit' | 'create';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  url: string | null;
  type: 'pdf' | 'video';
}

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  resumeFile: File | null;
  videoFile: File | null;
  resume_url: string | null;
  video_url: string | null;
  photoFile: File | null;
  placement_preferences: string[];
}

interface FormErrors {
  [key: string]: string | undefined;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  resumeFile?: string;
  video_url?: string;
  photoFile?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit for localStorage

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, file, url, type }) => {
  if (!isOpen) return null;

  const previewUrl = file ? URL.createObjectURL(file) : url || undefined;

  const isYouTubeUrl = (url: string) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  };

  const getYouTubeVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {type === 'pdf' ? 'Resume Preview' : 'Video Preview'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          {type === 'pdf' ? (
            <iframe src={previewUrl} className="w-full h-[70vh]" title="PDF Preview" />
          ) : url && isYouTubeUrl(url) ? (
            <iframe
              src={getYouTubeEmbedUrl(url)}
              className="w-full h-[70vh]"
              title="YouTube Video Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={previewUrl} controls className="w-full max-h-[70vh]" />
          )}
        </div>
      </div>
    </div>
  );
};

const CandidateProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [form, setForm] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    zipcode: '',
    resumeFile: null,
    videoFile: null,
    resume_url: null,
    video_url: null,
    photoFile: null,
    placement_preferences: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    file: File | null;
    url: string | null;
    type: 'pdf' | 'video';
  }>({
    isOpen: false,
    file: null,
    url: null,
    type: 'pdf',
  });
  const firstNameRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      zipcode: '',
      resumeFile: null,
      videoFile: null,
      resume_url: null,
      video_url: null,
      photoFile: null,
      placement_preferences: [],
    });
    setFormErrors({});
  };

  useEffect(() => {
    fetchProfile();
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!form.first_name.trim()) errors.first_name = 'First name is required';
    if (!form.last_name.trim()) errors.last_name = 'Last name is required';
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Invalid email format';
    }
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(form.phone)) {
      errors.phone = 'Invalid phone number format';
    }
    if (!form.street_address.trim()) errors.street_address = 'Street address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.state.trim()) errors.state = 'State is required';
    if (!form.zipcode.trim()) errors.zipcode = 'ZIP code is required';
    if (!form.resume_url && !form.resumeFile) {
      errors.resumeFile = 'Either resume URL or file upload is required';
    }
    if (form.video_url && !/^https?:\/\/.+\..+/.test(form.video_url)) {
      errors.video_url = 'Please enter a valid video URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setForm({
          first_name: data.profile.first_name || '',
          last_name: data.profile.last_name || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
          street_address: data.profile.street_address || '',
          city: data.profile.city || '',
          state: data.profile.state || '',
          zipcode: data.profile.zipcode || '',
          resumeFile: null,
          videoFile: null,
          resume_url: data.profile.resume || '',
          video_url: data.profile.video_url || '',
          photoFile: null,
          placement_preferences: data.profile.placement_preferences || [],
        });
        setMode('view');
      } else {
        setProfile(null);
        setMode('create');
        const userRes = await fetch('/api/user');
        if (userRes.ok) {
          const userData = await userRes.json();
          setForm((prev) => ({ ...prev, email: userData.email || '' }));
        }
      }
    } catch {
      setError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];

      if (file.size > MAX_FILE_SIZE) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: 'File size must be less than 5MB for local storage',
        }));
        return;
      }

      const fieldName = `${name}File`;
      setForm((prev) => ({ ...prev, [fieldName]: file }));

      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handlePreview = (type: 'pdf' | 'video') => {
    if (type === 'pdf') {
      const url = form.resumeFile ? URL.createObjectURL(form.resumeFile) : form.resume_url;
      if (url) {
        setPreviewModal({ isOpen: true, file: form.resumeFile, url, type });
      }
    } else {
      const url = form.videoFile ? URL.createObjectURL(form.videoFile) : form.video_url;
      if (url) {
        setPreviewModal({ isOpen: true, file: form.videoFile, url, type });
      }
    }
  };

  const handleCreate = async (e: React.SyntheticEvent, status: 'draft' | 'pending' = 'pending') => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'placement_preferences') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string | Blob);
          }
        }
      });
      formData.append('status', status);

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess(status === 'draft' ? 'Draft saved!' : 'Profile submitted!');
        fetchProfile();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create profile.');
      }
    } catch {
      setError('Failed to create profile.');
    }
  };

  const handleEdit = async (e: React.SyntheticEvent, status: 'draft' | 'pending' = 'pending') => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'placement_preferences') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value as string | Blob);
          }
        }
      });
      formData.append('status', status);

      const res = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        setSuccess(status === 'draft' ? 'Draft saved!' : 'Profile submitted!');
        fetchProfile();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update profile.');
      }
    } catch {
      setError('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
      });

      if (res.ok) {
        setProfile(null);
        resetForm();
        setMode('create');
        setSuccess('Profile deleted successfully.');
      } else {
        setError('Failed to delete profile.');
      }
    } catch {
      setError('Failed to delete profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.'))
      return;
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/account', { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Account deleted.');
        // Optionally, log out or redirect
      } else {
        setError('Failed to delete account.');
      }
    } catch {
      setError('Failed to delete account.');
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
    if (!profile) {
      return (
        <div className="text-center p-8">
          <p className="mb-4">You have not created a profile yet.</p>
          <button onClick={() => setMode('create')} className="btn-primary">
            Create Profile
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={`${profile.first_name} ${profile.last_name}`}
              height={200}
              width={200}
              className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-32 h-32 rounded-lg bg-gray-200 border-4 border-white shadow-md flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-efcaDark">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-gray-600 mt-1">{profile.email}</p>
            {profile.phone && <p className="text-gray-600 mt-1">{profile.phone}</p>}
            <p className="text-gray-600 mt-1">
              {profile.city}, {profile.state}
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-efcaDark">Resume</h3>
            {profile.resume ? (
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-efcaAccent hover:underline"
                >
                  View Resume
                </a>
                <button
                  onClick={() => handlePreview('pdf')}
                  className="text-sm text-gray-600 hover:text-efcaAccent"
                >
                  Preview
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No resume uploaded.</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-efcaDark">Preaching / Teaching Video</h3>
            {profile.video_url ? (
              <div className="flex items-center gap-4 mt-2">
                <a
                  href={profile.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-efcaAccent hover:underline"
                >
                  Watch Video
                </a>
                <button
                  onClick={() => handlePreview('video')}
                  className="text-sm text-gray-600 hover:text-efcaAccent"
                >
                  Preview
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No video provided.</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-efcaDark">Placement Preferences</h3>
            {profile.placement_preferences && profile.placement_preferences.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
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
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <button className="btn-primary" onClick={() => setMode('edit')}>
            Edit Profile
          </button>
          <button className="btn-danger" onClick={handleDelete}>
            Delete Profile
          </button>
          <button className="btn-secondary" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    );
  };

  const renderForm = () => (
    <form
      onSubmit={(e) => {
        if (mode === 'create') {
          handleCreate(e, 'draft');
        } else {
          handleEdit(e, 'draft');
        }
      }}
      className="space-y-4"
    >
      <h3 className="mb-2 text-base font-semibold text-efcaDark">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            ref={firstNameRef}
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.first_name ? 'border-red-500' : 'border-gray-300'
            }`}
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          {formErrors.first_name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.last_name ? 'border-red-500' : 'border-gray-300'
            }`}
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          {formErrors.last_name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
            formErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
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
        <label htmlFor="photoFile" className="block mb-2 text-sm text-gray-700">
          Individual or Family Picture (Optional)
        </label>
        <input
          type="file"
          id="photoFile"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
        />
        {form.photoFile && (
          <div className="mt-2">
            <Image
              src={URL.createObjectURL(form.photoFile)}
              alt="Profile Preview"
              height={200}
              width={200}
              className="h-32 w-32 object-cover rounded-lg border"
            />
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Upload a photo of yourself or your family (JPG, PNG, etc.)
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="resumeFile" className="block mb-2 text-sm text-gray-700">
          Resume (PDF) Required
        </label>
        <div className="flex gap-2">
          <input
            type="file"
            id="resumeFile"
            name="resume"
            onChange={handleFileChange}
            accept=".pdf"
            required
            className={`flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.resumeFile ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {form.resumeFile && (
            <button
              type="button"
              onClick={() => handlePreview('pdf')}
              className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Preview
            </button>
          )}
        </div>
        {formErrors.resumeFile && (
          <p className="mt-1 text-sm text-red-600">{formErrors.resumeFile}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">Upload a PDF file (max 5MB)</p>
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
          {form.video_url && (
            <button
              type="button"
              onClick={() => handlePreview('video')}
              className="px-4 py-2 bg-efcaAccent text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
            >
              Preview
            </button>
          )}
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

      <div className="flex gap-2 pt-4">
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
            if (mode === 'create') {
              handleCreate(e, 'draft');
            } else {
              handleEdit(e, 'draft');
            }
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
            onClick={handleDelete}
          >
            Delete
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
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal((prev) => ({ ...prev, isOpen: false }))}
        file={previewModal.file}
        url={previewModal.url}
        type={previewModal.type}
      />
    </div>
  );
};

export default CandidateProfilePage;
