import Link from 'next/link';
import { useUser } from '../context/UserContext';

const HomePage = () => {
  const { user } = useUser();

  // A logged in user arrives here if the user has not been
  // assigned a backend group. This user needs to contact the
  // site admin to have the proper group assigned to control
  // site access and functionality.

  if (user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-efcaGray font-sans">
        <div className="max-w-xl p-8 bg-white rounded shadow text-center">
          <h1 className="text-3xl font-bold mb-4 text-efcaBlue">
            Welcome to EFCA Great Lakes District Minister Connect
          </h1>
          <p className="mb-6 text-gray-700">
            Hi, {user.name}! You have successfully logged into Minister Connect but we are unable to
            determine your role as a candidate, church user, or admin.
          </p>
          <p>
            Please{' '}
            <a
              // TODO: update this to the correct email address
              href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
              className="text-efcaAccent underline hover:text-efcaAccent-dark"
            >
              contact the site admin
            </a>{' '}
            to be granted the correct access.
          </p>
        </div>
      </div>
    );
  // Landing Page for an Anonymous User
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-xl p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4 text-efcaBlue">
          Welcome to EFCA Great Lakes District Minister Connect
        </h1>
        <p className="mb-6 text-gray-700">
          Minister Connect provides job candidates and churches a secure, admin-approved platform
          for expressing mutual interest.
        </p>
        <div className="space-y-4">
          <Link
            href="/auth/login"
            className="block bg-efcaAccent text-white px-4 py-2 rounded font-bold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-efcaAccent transition-colors"
          >
            Login (All Users)
          </Link>
          <Link
            href="/auth/register"
            className="block bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 transition-colors"
          >
            Candidate Registration
          </Link>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Churches: Please{' '}
            <a
              // TODO: update this to the correct email address
              href="mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Access%20Request"
              className="text-efcaAccent underline hover:text-efcaAccent-dark"
            >
              contact the admin
            </a>{' '}
            for access.
          </p>
          <p>Admins: Use your pre-assigned credentials to log in.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
