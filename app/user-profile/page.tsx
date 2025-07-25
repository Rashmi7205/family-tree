"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardContent from "@/components/dashboard/dashboard-content";
import { PageLoader } from "@/components/ui/loader";

export default function DashboardPage() {
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

      if (!userProfile?.onboardingComplete) {
        router.push("/onboarding");
        return;
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || !userProfile) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <DashboardHeader user={user} userProfile={userProfile} />
      <main className="container mx-auto p-4 pt-24">
        <DashboardContent user={user} userProfile={userProfile} />
      </main>
    </div>
  );
}
