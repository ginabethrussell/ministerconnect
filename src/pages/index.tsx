import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-xl p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4 text-efcaBlue">Welcome to EFCA Great Lakes District Minister Connect</h1>
        <p className="mb-6 text-gray-700">
          Minister Connect provides job candidates and churches a secure, admin-approved
          platform for expressing mutual interest.
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
