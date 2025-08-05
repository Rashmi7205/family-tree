"use client";

import SignUpForm from "../../../components/auth/signup-form";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PageLoader } from "@/components/ui/loader";

export default function SignUpPage() {
  const { t, ready } = useTranslation("common");

  // Show loading state while translations are being loaded
  if (!ready) {
    return <PageLoader text="Loading ..." />;
  }

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
            <h1 className="text-3xl font-bold">{t("signup.title")}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-left">
              {t("signup.subtitle")}
            </p>
          </div>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
