import React, { useEffect, useState } from 'react';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  resumeUrl: string;
  resumeFile: File | null;
  videoUrl: string;
  videoFile: File | null;
  [key: string]: any;
}

type Mode = 'view' | 'edit' | 'create';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: File | null;
  url: string | null;
  type: 'pdf' | 'video';
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  resume: File | null;
  video: File | null;
  resumeUrl: string;
  videoUrl: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  resume?: string;
  video?: string;
  resumeUrl?: string;
  videoUrl?: string;
  [key: string]: string | undefined;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, file, url, type }) => {
  if (!isOpen) return null;

  const previewUrl = file ? URL.createObjectURL(file) : url || undefined;

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
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    resume: null,
    video: null,
    resumeUrl: '',
    videoUrl: '',
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

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      resume: null,
      video: null,
      resumeUrl: '',
      videoUrl: '',
    });
    setFormErrors({});
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required';
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
    if (!form.streetAddress.trim()) errors.streetAddress = 'Street address is required';
    if (!form.city.trim()) errors.city = 'City is required';
    if (!form.state.trim()) errors.state = 'State is required';
    if (!form.zipCode.trim()) errors.zipCode = 'ZIP code is required';
    if (!form.resumeUrl && !form.resume) {
      errors.resume = 'Either resume URL or file upload is required';
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
        setProfile(data);
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          streetAddress: data.streetAddress || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          resume: data.resumeFile || null,
          video: data.videoFile || null,
          resumeUrl: data.resumeUrl || '',
          videoUrl: data.videoUrl || '',
        });
        setMode('view');
      } else {
        setProfile(null);
        setMode('create');
        // Fetch user data to pre-populate email
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
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      // Clear error when file is selected
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handlePreview = (type: 'pdf' | 'video') => {
    if (type === 'pdf') {
      const url = form.resume ? URL.createObjectURL(form.resume) : form.resumeUrl;
      if (url) {
        setPreviewModal({
          isOpen: true,
          file: form.resume,
          url: form.resume ? null : url,
          type: 'pdf',
        });
      }
    } else {
      const url = form.video ? URL.createObjectURL(form.video) : form.videoUrl;
      if (url) {
        setPreviewModal({
          isOpen: true,
          file: form.video,
          url: form.video ? null : url,
          type: 'video',
        });
      }
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const res = await fetch('/api/profile', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess('Profile created!');
        fetchProfile();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to create profile.');
      }
    } catch {
      setError('Failed to create profile.');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value);
        }
      });

      const res = await fetch('/api/profile', {
        method: 'PUT',
        body: formData,
      });
      if (res.ok) {
        setSuccess('Profile updated!');
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const renderForm = () => (
    <form onSubmit={mode === 'create' ? handleCreate : handleEdit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          {formErrors.firstName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            className={`mt-1 block w-full rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
              formErrors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
          {formErrors.lastName && (
            <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
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
            formErrors.streetAddress ? 'border-red-500' : 'border-gray-300'
          }`}
          name="streetAddress"
          value={form.streetAddress}
          onChange={handleChange}
          required
        />
        {formErrors.streetAddress && (
          <p className="mt-1 text-sm text-red-600">{formErrors.streetAddress}</p>
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
              formErrors.zipCode ? 'border-red-500' : 'border-gray-300'
            }`}
            name="zipCode"
            value={form.zipCode}
            onChange={handleChange}
            required
          />
          {formErrors.zipCode && <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Resume</label>
        <div className="mt-1 space-y-2">
          <div className="flex gap-2">
            <input
              className={`flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent ${
                formErrors.resumeUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              name="resumeUrl"
              value={form.resumeUrl}
              onChange={handleChange}
              placeholder="Resume URL (optional if uploading file)"
            />
            {(form.resumeUrl || form.resume) && (
              <button
                type="button"
                onClick={() => handlePreview('pdf')}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Preview
              </button>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-efcaAccent file:text-white hover:file:bg-efcaAccent-dark"
            />
          </div>
          {formErrors.resume && <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Video Introduction (Optional)
        </label>
        <div className="mt-1 space-y-2">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-lg border p-2.5 text-sm focus:border-efcaAccent focus:ring-efcaAccent border-gray-300"
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="Video URL (optional if uploading file)"
            />
            {(form.videoUrl || form.video) && (
              <button
                type="button"
                onClick={() => handlePreview('video')}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Preview
              </button>
            )}
          </div>
          <div className="flex items-center">
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              accept="video/*"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-efcaAccent file:text-white hover:file:bg-efcaAccent-dark"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          className="bg-efcaAccent text-white px-4 py-2.5 rounded-lg font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          type="submit"
        >
          {mode === 'create' ? 'Create Profile' : 'Save Changes'}
        </button>
        {mode === 'edit' && (
          <button
            className="bg-gray-400 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            type="button"
            onClick={() => setMode('view')}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  const renderView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="font-semibold text-gray-700">First Name:</div>
          <div>{profile?.firstName}</div>
        </div>
        <div>
          <div className="font-semibold text-gray-700">Last Name:</div>
          <div>{profile?.lastName}</div>
        </div>
      </div>

      <div>
        <div className="font-semibold text-gray-700">Email:</div>
        <div>{profile?.email}</div>
      </div>

      <div>
        <div className="font-semibold text-gray-700">Phone:</div>
        <div>{profile?.phone}</div>
      </div>

      <div>
        <div className="font-semibold text-gray-700">Address:</div>
        <div>
          {profile?.streetAddress && <div>{profile.streetAddress}</div>}
          {(profile?.city || profile?.state || profile?.zipCode) && (
            <div>
              {profile?.city && `${profile.city}, `}
              {profile?.state} {profile?.zipCode}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="font-semibold text-gray-700">Resume:</div>
        {profile?.resumeUrl ? (
          <div className="flex items-center gap-2">
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-efcaAccent hover:underline"
            >
              View Resume
            </a>
            <button
              onClick={() =>
                setPreviewModal({
                  isOpen: true,
                  file: null,
                  url: profile.resumeUrl,
                  type: 'pdf',
                })
              }
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Preview
            </button>
          </div>
        ) : (
          <div>No resume uploaded</div>
        )}
      </div>
      {profile?.videoUrl && (
        <div>
          <div className="font-semibold text-gray-700">Video Introduction:</div>
          <div className="flex items-center gap-2">
            <a
              href={profile.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-efcaAccent hover:underline"
            >
              View Video
            </a>
            <button
              onClick={() =>
                setPreviewModal({
                  isOpen: true,
                  file: null,
                  url: profile.videoUrl,
                  type: 'video',
                })
              }
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Preview
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-2 pt-4">
        <button
          className="bg-efcaAccent text-white px-4 py-2 rounded font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          onClick={() => setMode('edit')}
        >
          Edit
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
          onClick={handleDelete}
        >
          Delete Profile
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded font-bold hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
    </div>
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
