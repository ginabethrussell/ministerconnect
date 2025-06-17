import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-efcaGray font-sans">
      <div className="max-w-xl p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-4 text-efcaBlue">Welcome to Ministry Match</h1>
        <p className="mb-6 text-gray-700">
          Ministry Match connects job candidates with churches and provides a secure, admin-approved
          process for reviewing applications.
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
              href="mailto:ginabeth.russell@gmail.com?subject=Ministry%20Match%20Access%20Request"
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
