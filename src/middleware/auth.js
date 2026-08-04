// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSent(true);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 mb-4">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-900">DL</span>
            </div>
            <span className="text-xl font-bold text-white">Deeper Life</span>
            <span className="text-xs text-yellow-400 bg-yellow-400/20 px-2 py-0.5 rounded-full">Global</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-blue-200 mt-2">We'll send you a link to reset your password</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-blue-300 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white placeholder-blue-300/50"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-purple-900 font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                  </>
                )}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-blue-200 hover:text-white transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Check Your Email</h3>
              <p className="text-blue-200 mt-2">
                We've sent a password reset link to <span className="text-yellow-400">{email}</span>
              </p>
              <Link
                href="/login"
                className="block mt-6 text-yellow-400 hover:text-yellow-300 transition"
              >
                Return to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}