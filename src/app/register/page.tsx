"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return null;

    if (password.length < 6) {
      return {
        label: "Too short",
        color: "text-[#C95F6B]",
        bar: "bg-[#C95F6B]",
        width: "w-1/4",
      };
    }

    if (password.length < 8) {
      return {
        label: "Fair",
        color: "text-[#B87848]",
        bar: "bg-[#E9A05D]",
        width: "w-2/4",
      };
    }

    return {
      label: "Strong",
      color: "text-[#5D927A]",
      bar: "bg-[#72A98D]",
      width: "w-full",
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF0EC] px-4 py-8">
      {/* Decorative peach/pink shapes */}
      <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#F8D7DF] opacity-70 blur-3xl" />
      <div className="absolute -bottom-32 -right-28 h-96 w-96 rounded-full bg-[#FFD0C5] opacity-80 blur-3xl" />
      <div className="absolute right-1/3 top-1/4 h-36 w-36 rounded-full bg-[#FCE0D8] opacity-60 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Heading */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
  <Image
    src="/logo.png"
    alt="Task Flow"
    width={64}
    height={64}
    className="object-contain"
  />
</div>

          <h1 className="text-3xl font-bold tracking-tight text-[#4A3035]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-[#805F66]">
            Start organizing your work with TaskFlow
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-3xl border border-[#F0C5C0] bg-[#FFE4DD] p-7 shadow-xl shadow-[#C97F72]/15 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4.5" noValidate>
            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-[#E9A9B2] bg-[#F8D7DF] px-4 py-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#C95F6B]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <p className="text-sm font-medium text-[#A84E5B]">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 text-sm text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 text-sm text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 pr-12 text-sm text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#A9848A] transition-colors hover:bg-[#F8D7DF] hover:text-[#C96F87]"
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268 2.943-9.542 7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-[#8C6B71]">
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-semibold ${passwordStrength.color}`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F0C5C0]">
                    <div
                      className={`h-full rounded-full transition-all ${passwordStrength.bar} ${passwordStrength.width}`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-semibold text-[#5A3D43]"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full rounded-xl border border-[#EABEB8] bg-[#FDE9E4] px-4 py-3 pr-12 text-sm text-[#4A3035] outline-none transition-all placeholder:text-[#A9848A] focus:border-[#E9A0B3] focus:ring-4 focus:ring-[#E9A0B3]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={
                    showConfirm ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[#A9848A] transition-colors hover:bg-[#F8D7DF] hover:text-[#C96F87]"
                >
                  {showConfirm ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {confirmPassword && (
                <p
                  className={`mt-1.5 text-xs font-medium ${
                    password === confirmPassword
                      ? "text-[#5D927A]"
                      : "text-[#C95F6B]"
                  }`}
                >
                  {password === confirmPassword
                    ? "Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-1 flex w-full items-center justify-center gap-3 rounded-xl bg-[#F4A261] px-4 py-3 text-sm font-semibold text-[#FFF0EC] shadow-md shadow-[#C97F72]/20 transition-all hover:bg-[#E98F4F] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#F4A261]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 border-t border-[#F0C5C0] pt-6 text-center">
            <p className="text-sm text-[#805F66]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#C96F87] transition-colors hover:text-[#A95570]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-xs font-medium text-[#A9848A]">
          Create your account and start getting things done.
        </p>
      </div>
    </main>
  );
}