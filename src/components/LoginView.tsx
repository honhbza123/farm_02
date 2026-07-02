/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sprout, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate database network lag for premium visual feedback
    setTimeout(() => {
      if (username.trim() === 'admin' && password === 'admin') {
        localStorage.setItem('agri_cms_authenticated', 'true');
        onLoginSuccess();
      } else {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Incorrect username or password)');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background relative overflow-hidden font-sans select-none">
      
      {/* Dynamic Background botanical visual blobs */}
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-on-primary shadow-lg shadow-primary/20 mb-4 animate-bounce">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            AGRI RESEARCH CMS
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 italic font-serif">
            ระบบจัดการและควบคุมฟาร์มวิจัยเชิงทดลอง
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-surface border-2 border-outline-variant shadow-xl rounded-3xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-primary mb-6 text-center uppercase tracking-wider">
            Personnel Sign-In
          </h2>

          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">
                Username / ชื่อผู้ใช้
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full h-12 bg-surface-container-low border-2 border-outline-variant focus:border-primary rounded-2xl pl-11 pr-4 font-sans text-sm font-semibold text-primary focus:ring-2 focus:ring-primary transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block ml-1">
                Password / รหัสผ่าน
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 bg-surface-container-low border-2 border-outline-variant focus:border-primary rounded-2xl pl-11 pr-12 font-sans text-sm font-semibold text-primary focus:ring-2 focus:ring-primary transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-surface-container-low rounded-xl p-3 text-[11px] text-on-surface-variant font-mono border border-outline-variant text-center">
              Sign in with username <strong className="text-primary">admin</strong> and password <strong className="text-primary">admin</strong>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/15 hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'SIGN IN TO SYSTEM'
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-on-surface-variant uppercase tracking-widest">
          SYSTEM VERSION V3.24 • SECURE TERMINAL
        </div>
      </div>
    </div>
  );
}
