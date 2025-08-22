// app/login/page.tsx
"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, User, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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

      // Check user role after successful login
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();

      if (loginType === 'admin' && userData.role !== 'admin') {
        setError('You do not have admin privileges.');
        await signIn('signout', { redirect: false }); // keeping your existing behavior
        return;
      }

      // Redirect based on login type
      router.replace(loginType === 'admin' ? '/admin' : '/');
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: loginType === 'admin' ? '/admin' : '/' });
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('An error occurred during Google sign-in.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{
        // same “singularity” glow used on register
        background:
          'radial-gradient(circle at center, #ffffff 0%, rgba(96,165,250,0.25) 25%, rgba(59,130,246,0.45) 50%, rgba(37,99,235,0.75) 75%, #1e3a8a 100%)'
      }}
    >
      {/* center divider (desktop only) */}
      <div className="pointer-events-none hidden md:block absolute left-1/2 top-[8%] bottom-[8%] w-[2px] bg-white/80 shadow-[0_0_20px_rgba(255,255,255,0.7)] rounded-full" />

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT: login form card (keeps your logic/UX) */}
          <div className="flex md:justify-start justify-center">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                <p className="text-gray-600 mt-1">Sign in to continue to Uniway</p>
              </div>

              {/* Login Type Selector */}
              <div className="flex gap-2 mb-6">
                <motion.button
                  type="button"
                  onClick={() => setLoginType('user')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    loginType === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User size={20} />
                  User Login
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setLoginType('admin')}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    loginType === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Shield size={20} />
                  Admin Login
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    disabled={isLoading}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={20} />
                      Sign In as {loginType === 'admin' ? 'Admin' : 'User'}
                    </>
                  )}
                </motion.button>

                {error && (
                  <motion.div
                    className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {error}
                  </motion.div>
                )}

                {loginType === 'user' && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                      className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </motion.button>
                  </>
                )}

                {/* Mobile-only "Sign up" link (CTA lives on the right on desktop) */}
                <p className="md:hidden text-center mt-6 text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </form>
            </motion.div>
          </div>

          {/* RIGHT: brand + tagline + CTA card */}
          <div className="hidden md:flex flex-col items-center md:items-start text-center md:text-left px-2">
            <img
              src="/uniway.svg"
              alt="Uniway"
              className="h-24 md:h-28 lg:h-32 mb-6 drop-shadow-[0_6px_24px_rgba(255,255,255,0.35)]"
            />
            <h2 className="text-3xl md:text-4xl font-black tracking-wide text-slate-900 drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]">
              Your One Stop Solution to Every Corner of the <span className="text-orange-500">Campus</span>
            </h2>

            <div className="mt-10 w-full max-w-md bg-amber-100/90 border border-amber-200 rounded-2xl shadow-xl px-8 py-6">
              <p className="text-slate-800 font-semibold tracking-wide">NOT A MEMBER YET?</p>
              <Link
                href="/register"
                className="mt-3 inline-block font-bold text-blue-700 hover:text-blue-800 underline underline-offset-4"
              >
                SIGNUP
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* subtle vignette edges */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
    </div>
  );
}