import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ClipboardCopy, Check } from 'lucide-react';
import UserIcon from '@/components/UserIcon';
import ExpressInterestButton from '../../components/ExpressInterestButton';
import { Profile } from '@/context/ProfileContext';
import { JobListing, PaginatedResponse } from '../../types'; // Assuming types for Profile and JobListing exist
import { apiClient, getApprovedCandidates } from '../../utils/api';
import { formatPhone } from '@/utils/helpers';

export default function ChurchSearch() {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [expressedInterest, setExpressedInterest] = useState<string[]>([]);
  const [jobListings, setJobListings] = useState<JobListing[]>([]); // To associate with interest
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [copyStatus, setCopyStatus] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profilesRes: PaginatedResponse<Profile> = await getApprovedCandidates();
        console.log(profilesRes);

        setProfiles(profilesRes.results);
        // setExpressedInterest(interestsRes.map((i) => String(i.profile_id)));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  const filteredProfiles = profiles.filter(
    (p) =>
      (p.user.first_name + ' ' + p.user.last_name).toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase())
  );

  const handleExpressInterest = async (candidateId: string) => {
    if (!selectedJobId) {
      alert('Please select a job to express interest for.');
      return;
    }
    try {
      await apiClient.post('/api/church/interest', {
        profileId: candidateId,
        jobId: selectedJobId,
      });

      if (expressedInterest.includes(candidateId)) {
        setExpressedInterest((prev) => prev.filter((id) => id !== candidateId));
      } else {
        setExpressedInterest((prev) => [...prev, candidateId]);
      }
    } catch (error) {
      console.error('Failed to express interest:', error);
      alert('There was an error expressing interest. Please try again.');
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCopyContact = (profile: Profile) => {
    const contactInfo = `Name: ${profile.user.first_name} ${profile.user.last_name}\nEmail: ${profile.user.email}\nPhone: ${formatPhone(profile.phone)}`;
    navigator.clipboard.writeText(contactInfo).then(
      () => {
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Copied!' }));
        setTimeout(() => {
          setCopyStatus((prev) => ({ ...prev, [profile.id]: '' }));
        }, 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
        setCopyStatus((prev) => ({ ...prev, [profile.id]: 'Failed' }));
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Search Candidates</h1>
          {jobListings.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="job-select" className="font-semibold text-gray-700">
                Expressing interest for:
              </label>
              <select
                id="job-select"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="block w-full md:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              >
                {jobListings.map((job) => (
                  <option key={job.id} value={String(job.id)}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </header>

        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            How Expressing Interest Works
          </h3>
          <div className="text-blue-700 space-y-2 text-sm">
            <p>• You may indicate interest in a candidate by clicking Express Interest.</p>
            <p>• You may withdraw interest in a candidate by clicking Express Interest.</p>
            <p>• When you express or withdraw interest, the candidate is NOT notified.</p>
            <p>
              • If a candidate also expresses interest in one of your job listings, it becomes a
              &quot;Mutual Interest.&quot;
            </p>
            <p>
              • You can view all Mutual Interests on the
              <Link href="/church/mutual-interests" className="cursor-pointer hover:underline">
                {' '}
                Interests{' '}
              </Link>
              page.
            </p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <input
            type="text"
            placeholder="Search by name, email, city, or state abbreviation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          {filteredProfiles.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No candidates found matching your criteria.
            </div>
          ) : (
            <ul className="space-y-6">
              {filteredProfiles.map((profile) => (
                <li
                  key={profile.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  {/* Top Section */}
                  <div className="flex flex-col md:flex-row gap-6 justify-between md:items-center">
                    {/* Candidate Info */}
                    <div className="flex flex-col items-center gap-6 flex-grow md:flex-row">
                      <div className="flex-shrink-0">
                        {profile && profile?.profile_image ? (
                          <img
                            src={profile.profile_image}
                            alt={`${profile.user.first_name} ${profile.user.last_name}`}
                            className="w-40 h-40 md:w-36 md:h-36 object-cover rounded-full border-2 border-gray-300 shadow-xlg"
                          />
                        ) : (
                          <div className="object-cover rounded-full">
                            <UserIcon width="36" height="36" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-2xl font-bold text-gray-800">{`${profile.user.first_name} ${profile.user.last_name}`}</h3>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full md:w-[250px] flex-shrink-0 flex flex-col gap-3">
                      <ExpressInterestButton
                        id={String(profile.id)}
                        hasExpressedInterest={expressedInterest.includes(String(profile.id))}
                        onExpressInterest={handleExpressInterest}
                        size="lg"
                      />
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
                      <p className="text-sm text-gray-600">Email: {profile.user.email}</p>
                      <p className="text-sm text-gray-600">Phone: {formatPhone(profile.phone)}</p>
                      <p className="text-sm text-gray-600">
                        Location:{' '}
                        {profile.street_address &&
                          `${profile.street_address}, ${profile.city}, ${profile.state} ${profile.zipcode}`}
                      </p>
                      <button
                        onClick={() => handleCopyContact(profile)}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        {copyStatus[profile.id] === 'Copied!' ? (
                          <div className="flex">
                            <Check size={16} className="text-green-600" />
                            <span className="ml-2 text-xs text-green-600">Copied</span>
                          </div>
                        ) : (
                          <div className="flex">
                            <ClipboardCopy size={16} />
                            <span className="ml-2 text-xs">Copy Contact Info</span>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Documents & Media */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Documents & Media</h4>
                      <div className="text-sm space-y-1">
                        {profile.resume && (
                          <div>
                            <a
                              href={profile.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Resume
                            </a>
                          </div>
                        )}
                        {profile.video_url && (
                          <div>
                            <a
                              href={profile.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Video
                            </a>
                          </div>
                        )}
                      </div>
                      {profile.placement_preferences &&
                        profile.placement_preferences.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-700 mb-1">Preferences</h5>
                            <div className="flex flex-wrap gap-1">
                              {profile.placement_preferences.map((pref) => (
                                <span
                                  key={pref}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                                >
                                  {pref}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Profile Details */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Profile Details</h4>
                      <p className="text-sm text-gray-600">
                        Status: {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Profile Created: {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                      {profile.submitted_at && (
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(profile.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Last Updated: {new Date(profile.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
