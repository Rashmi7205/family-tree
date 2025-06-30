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
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("phone");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePhoneVerified = async (verifiedPhone: string) => {
    await refreshUserProfile();
    setCurrentStep("profile");
  };

  const handleProfileCompleted = async () => {
    setCurrentStep("success");

    // Redirect to dashboard after success animation
    setTimeout(() => {
      router.push("/user-profile");
    }, 3000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto  flex flex-col gap-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-base">
              Just a few more steps to get you started
            </p>
          </motion.div>

          {/* Progress Indicator */}
          {currentStep !== "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 flex justify-center"
            >
              <div className="w-full max-w-xs sm:max-w-md md:max-w-lg">
                <OnboardingProgress currentStep={currentStep} />
              </div>
            </motion.div>
          )}

          {/* Step Content */}
          <div className="rounded-2xl shadow-xl w-full flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {currentStep === "phone" && (
                <motion.div
                  key="phone"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <PhoneVerificationStep onVerified={handlePhoneVerified} />
                </motion.div>
              )}

              {currentStep === "profile" && (
                <motion.div
                  key="profile"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <ProfileCompletionStep onCompleted={handleProfileCompleted} />
                </motion.div>
              )}

              {currentStep === "success" && (
                <motion.div
                  key="success"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-4"
                >
                  <OnboardingSuccess />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
