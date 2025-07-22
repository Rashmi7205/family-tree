"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";
import PhoneVerificationStep from "@/components/onboarding/phone-verification-step";
import ProfileCompletionStep from "@/components/onboarding/profile-completion-step";
import OnboardingProgress from "@/components/onboarding/onboarding-progress";
import OnboardingSuccess from "@/components/onboarding/onboarding-success";
import { useAuth } from "@/lib/auth/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { IUser } from "../../models/User";

interface OnboardingFlowProps {
  user: User;
  userProfile: IUser | null;
}

type OnboardingStep = "phone" | "profile" | "success";

export default function OnboardingFlow({
  user,
  userProfile,
}: OnboardingFlowProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    userProfile && userProfile.phoneNumberVerified ? "profile" : "phone"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePhoneVerified = async (verifiedPhone: string) => {
    await refreshUserProfile();
    // After refreshing, check if phoneNumberVerified is true in the updated userProfile
    // If not, stay on phone step, else move to profile
    // We'll need to fetch the latest userProfile here
    // For now, optimistically move to profile step
    setCurrentStep("profile");
  };

  const handleProfileCompleted = async () => {
    setCurrentStep("success");
    setTimeout(() => {
      router.push("/user-profile");
    }, 3000);
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -40 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-2">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2 w-full"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Just a few more steps to get you started
          </p>
          <div className="w-16 h-1 mx-auto mt-3 mb-1 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60" />
        </motion.div>

        {/* Progress Indicator */}
        {currentStep !== "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 flex justify-center w-full"
          >
            <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto">
              <OnboardingProgress currentStep={currentStep} />
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <div className="w-full flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep === "phone" && (
              <motion.div
                key="phone"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 w-full">
                  <PhoneVerificationStep onVerified={handlePhoneVerified} />
                </div>
              </motion.div>
            )}

            {currentStep === "profile" && (
              <motion.div
                key="profile"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 w-full">
                  <ProfileCompletionStep onCompleted={handleProfileCompleted} />
                </div>
              </motion.div>
            )}

            {currentStep === "success" && (
              <motion.div
                key="success"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.35 }}
                className="w-full"
              >
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col gap-6 w-full">
                  <OnboardingSuccess />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
