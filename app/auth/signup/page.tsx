import type { Metadata } from "next";
import SignUpForm from "../../../components/auth/signup-form";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-slate-950 p-8 rounded-lg shadow-lg">
        <div className="flex flex-row items-center justify-center gap-4 text-center mb-4">
          <Link href="/">
            <Image
              src="/assets/logo.jpg"
              alt="Logo"
              width={64}
              height={64}
              className="rounded-lg shadow"
            />
          </Link>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-slate-600 dark:text-slate-400 text-left">
              Enter your details to create a new account
            </p>
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
