import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function ErrorPage({ code = 404, message }) {
  const errorMessages = {
    404: "The page you're looking for doesn't exist or has been moved.",
    403: "You don't have permission to access this page.",
    500: 'Something went wrong on our end. Please try again later.',
  };

  const displayMessage = message || errorMessages[code] || errorMessages[500];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold text-indigo-600/20">{code}</h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {code === 404 ? 'Page Not Found' : code === 403 ? 'Access Denied' : 'Server Error'}
        </h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">{displayMessage}</p>
        <Link
          to="/"
          className="btn-primary mt-8 inline-flex items-center gap-2"
        >
          <HiHome className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
