
// In app/login/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials. Please try again.');
        return;
      }

      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-50">
      <div className="shadow-2xl p-12 bg-white rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-700">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-black placeholder: text-gray-700"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold cursor-pointer px-6 py-3 rounded-lg text-lg transition-colors">
            Login
          </button>

          {error && (
            <div className="bg-red-100 text-red-700 border border-red-400 w-full text-sm py-2 px-3 rounded-md mt-2 text-center">
              {error}
            </div>
          )}

          <Link className="text-sm mt-3 text-center text-gray-500 hover:text-black transition-colors" href={'/register'}>
            Don't have an account? <span className="underline font-semibold">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}