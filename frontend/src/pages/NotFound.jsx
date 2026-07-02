import { Link } from 'react-router-dom';
import { HiHome } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-9xl font-extrabold text-indigo-600/20">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>
        <p className="mt-3 text-gray-500 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
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
