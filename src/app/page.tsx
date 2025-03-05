'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect to login page after 3 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/auth/login');
    }, 3000);

    // Clean up timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, [router]);

  const handleLoginClick = () => {
    setIsLoading(true);
    // Small delay to show the animation before redirecting
    setTimeout(() => {
      router.push('/auth/login');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">Wallet Admin</h1>
        <p className="text-xl text-gray-600 mb-6">Secure Transaction Management System</p>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-8"></div>
        <p className="text-gray-500 mb-4">Redirecting to login page...</p>
        <button
          onClick={handleLoginClick}
          disabled={isLoading}
          className={`mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 ${isLoading ? 'opacity-75' : ''}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Redirecting...
            </span>
          ) : (
            "Login Now"
          )}
        </button>
      </div>
    </div>
  );
}
