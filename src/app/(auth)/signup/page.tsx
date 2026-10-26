"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "../actions";
import { Eye, EyeOff, Lock, Mail, User, Building, GraduationCap, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [role, setRole] = useState<"student" | "owner">("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      document.getElementById("password")?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", trimmedName);
      formData.append("email", trimmedEmail);
      formData.append("password", password);
      formData.append("role", role);

      const res = await signup(formData);
      if (!res.ok) {
        setErrorMessage(res.error || "Signup could not be completed. Please review your details.");
        setIsLoading(false);
      } else {
        setSuccessMessage(res.message || "Account registered successfully!");
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("Network error connecting to signup server. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F5C5C]/10 text-[#0F5C5C] text-xs font-semibold rounded-full mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Gokak, Karnataka Exclusive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B2A2F] tracking-tight">
            Create your NestNova account
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Join Gokak&apos;s trusted student accommodation and mess living network.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 shadow-xl p-6 sm:p-8">
          {successMessage ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-[#1B2A2F] mb-2">Registration Successful!</h2>
              <p className="text-sm text-gray-600 max-w-sm mx-auto mb-6">
                {successMessage}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl shadow-md hover:bg-[#0c4747] transition-all text-sm"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-sm">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Switcher */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    I want to register as
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("student")}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === "student"
                          ? "border-[#0F5C5C] bg-[#0F5C5C]/5 text-[#0F5C5C] ring-2 ring-[#0F5C5C]"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <GraduationCap className="w-6 h-6 mb-1.5" />
                      <span className="text-sm font-bold">Student / Renter</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">Find stays & mess in Gokak</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("owner")}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        role === "owner"
                          ? "border-[#0F5C5C] bg-[#0F5C5C]/5 text-[#0F5C5C] ring-2 ring-[#0F5C5C]"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                    >
                      <Building className="w-6 h-6 mb-1.5" />
                      <span className="text-sm font-bold">Property Owner</span>
                      <span className="text-[11px] text-gray-500 mt-0.5">List PG, hostel, or mess</span>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="fullName">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          document.getElementById("email")?.focus();
                        }
                      }}
                      placeholder={role === "student" ? "Suresh Patil" : "Anand Kulkarni"}
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

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
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0F5C5C] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5" htmlFor="password">
                    Password
                  </label>
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
                      placeholder="Minimum 6 characters"
                      required
                      minLength={6}
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
                  <p className="text-[11px] text-gray-500 mt-1">Must be at least 6 characters long.</p>
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
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign Up as {role === "student" ? "Student" : "Property Owner"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  Already registered?{" "}
                  <Link href="/login" className="text-[#0F5C5C] font-bold hover:underline">
                    Log in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
