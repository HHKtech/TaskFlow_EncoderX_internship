"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed. Please try again.");
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

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FFF0EC] px-4 py-10">
      {/* Soft decorative shapes */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F8D7DF] opacity-70 blur-3xl" />
      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-[#FFD0C5] opacity-80 blur-3xl" />
      <div className="absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FCE0D8] opacity-60 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo / Heading */}
        <div className="mb-7 text-center">
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
            TaskFlow
          </h1>

          <p className="mt-2 text-sm text-[#805F66]">
            Stay organized. Keep moving forward.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-[#F0C5C0] bg-[#FFE4DD] p-7 shadow-xl shadow-[#C97F72]/15 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#F4A261] px-4 py-3 text-sm font-semibold text-[#FFF0EC] shadow-md shadow-[#C97F72]/20 transition-all hover:bg-[#E98F4F] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#F4A261]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 border-t border-[#F0C5C0] pt-6 text-center">
            <p className="text-sm text-[#805F66]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#C96F87] transition-colors hover:text-[#A95570]"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium text-[#A9848A]">
          Simple tasks. Clear progress. Better productivity.
        </p>
      </div>
    </main>
  );
}