'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login attempt:', { email, password, rememberMe });
      setIsLoading(false);
      // Here you would typically handle authentication
      // e.g., redirect to dashboard or show error
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-pure-white rounded-2xl shadow-card p-8 space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-deep-forest mb-2">
            Welcome Back
          </h1>
          <p className="text-charcoal">
            Sign in to your account to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-charcoal">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-primary hover:text-deep-forest transition-colors duration-200">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-charcoal/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-charcoal/30 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-charcoal">
              Remember me
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-pure-white bg-primary hover:bg-deep-forest focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-pure-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-pure-white text-charcoal">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-charcoal/30 rounded-lg bg-pure-white text-sm font-medium text-charcoal hover:bg-cream transition-colors duration-200"
          >
            <span className="sr-only">Sign in with Google</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center py-2 px-4 border border-charcoal/30 rounded-lg bg-pure-white text-sm font-medium text-charcoal hover:bg-cream transition-colors duration-200"
          >
            <span className="sr-only">Sign in with Apple</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.733 12.23c.013-.137.225-1.538-.687-2.288-.94-.773-2.08-.334-2.687-.11-.61.225-3.877 1.47-3.91 3.638-.033 2.135 3.03 2.94 3.188 2.989.158.05 4.41-1.538 4.096-4.229zm-5.728-1.24c.25-.737.388-1.662-.362-2.412C10.778 7.713 9.578 7.613 8.713 8.238c-1.95.987-2.6 3.837-1.05 5.45.925.962 2.288.937 3.025.525.738-.413 2.225-1.625 2.325-2.963z"/>
              <path d="M0 12C0 5.373 5.373 0 12 0s12 5.373 12 12-5.373 12-12 12S0 18.627 0 12z" fill="none"/>
            </svg>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-charcoal text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-deep-forest transition-colors duration-200">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}