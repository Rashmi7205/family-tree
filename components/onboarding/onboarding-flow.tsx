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
import { useTranslation } from "react-i18next";

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
  const { t, ready } = useTranslation("common");
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(
    userProfile && userProfile.phoneNumberVerified ? "profile" : "phone"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Show loading state while translations are being loaded
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 animate-spin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              fill="currentColor"
              stroke="none"
            >
              <defs>
                <rect
                  id="spinner"
                  x="46.5"
                  y="45"
                  width="6"
                  height="14"
                  rx="2"
                  ry="2"
                  transform="translate(0 -30)"
                />
              </defs>
              {Array.from({ length: 9 }).map((_, i) => (
                <use
                  key={i}
                  xlinkHref="#spinner"
                  transform={`rotate(${i * 40} 50 50)`}
                >
                  <animate
                    attributeName="opacity"
                    values="0;1;0"
                    dur="1s"
                    begin={`${(i * (1 / 9)).toFixed(10)}s`}
                    repeatCount="indefinite"
                  />
                </use>
              ))}
            </svg>
          </div>
          <p className="text-lg font-medium text-muted-foreground">
            Loading ...
          </p>
        </div>
      </div>
    );
  }

  const handlePhoneVerified = async (verifiedPhone: string) => {
    await refreshUserProfile();
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
            {t("onboarding.title")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            {t("onboarding.subtitle")}
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
