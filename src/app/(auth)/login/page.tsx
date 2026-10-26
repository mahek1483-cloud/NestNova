"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { login } from "../actions";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      document.getElementById("password")?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", trimmedEmail);
      formData.append("password", password);

      const res = await login(formData);
      if (!res.ok) {
        setErrorMessage(res.error || "Failed to sign in. Please verify your email and password.");
        setIsLoading(false);
      } else {
        if (res.role === "owner") {
          router.push("/owner");
        } else if (res.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/student");
        }
        router.refresh();
      }
    } catch {
      setErrorMessage("Network error connecting to authentication server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5C5C]/10 text-[#0F5C5C] text-xs font-semibold rounded-full mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gokak, Karnataka Exclusive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] tracking-tight">
          Welcome back to NestNova
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Log in to manage your student stays, enquiries, or property listings in Gokak.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-black/5 shadow-xl p-6 sm:p-8">
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !password) {
                    e.preventDefault();
                    document.getElementById("password")?.focus();
                  }
                }}
                placeholder="student@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-[#0F5C5C] hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-11 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
            Demo Test Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("student@demo.com");
                setPassword("demo123");
                setErrorMessage(null);
              }}
              className="px-3 py-1.5 bg-gray-50 hover:bg-[#0F5C5C]/5 border border-gray-200 hover:border-[#0F5C5C]/30 rounded-xl text-xs font-semibold text-[#0F5C5C] transition-all text-center cursor-pointer"
            >
              Fill Demo Student
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("owner@demo.com");
                setPassword("demo123");
                setErrorMessage(null);
              }}
              className="px-3 py-1.5 bg-gray-50 hover:bg-[#0F5C5C]/5 border border-gray-200 hover:border-[#0F5C5C]/30 rounded-xl text-xs font-semibold text-[#0F5C5C] transition-all text-center cursor-pointer"
            >
              Fill Demo Owner
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-[#0F5C5C] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
