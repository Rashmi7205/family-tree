"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OnboardingFlow from "@/components/onboarding/onboarding-flow";
import { PageLoader } from "@/components/ui/loader";

export default function OnboardingPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      if (!user.emailVerified) {
        router.push("/auth/verify-email");
        return;
      }

      if (userProfile?.onboardingComplete) {
        router.push("/user-profile");
        return;
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user) {
    return <PageLoader text="Loading onboarding..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white dark:bg-slate-950 rounded-lg shadow-lg mx-auto my-[20px]">
        <OnboardingFlow user={user} userProfile={userProfile} />
      </div>
    </div>
  );
}
