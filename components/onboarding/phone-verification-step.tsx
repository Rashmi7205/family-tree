"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/lib/auth/auth-context";
import { PhoneInput } from "@/components/ui/phone-input";
import { ManualOTPInput } from "@/components/ui/manual-otp-input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, {
    message:
      "Enter a valid phone number in international format (e.g., +1234567890)",
  }),
});
const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

interface PhoneVerificationStepProps {
  onVerified: (phoneNumber: string) => void;
}

export default function PhoneVerificationStep({
  onVerified,
}: PhoneVerificationStepProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  // Phone input handler
  function handlePhoneChange(val: string) {
    setPhoneNumber(val);
    setServerError(null);
    setSuccessMsg(null);
  }

  // Send OTP handler
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);
    const validation = phoneSchema.safeParse({ phoneNumber });
    if (!validation.success) {
      setServerError(validation.error.errors[0].message);
      return;
    }
    if (!user) return;
    setIsLoading(true);
    const loadingToast = toast({
      title: "Sending OTP...",
      description:
        "Please wait while we send a verification code to your phone.",
      variant: "default",
    });
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/onboarding/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Failed to send OTP",
          description: result.error || "Failed to send OTP",
          variant: "destructive",
        });
        return;
      }
      setOtp("");
      setStep("otp");
      startCooldown();
      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your phone.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description:
          error instanceof Error
            ? error.message
            : "Failed to send OTP. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }

  // OTP submit handler
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);
    const validation = otpSchema.safeParse({ otp });
    if (!validation.success) {
      setServerError(validation.error.errors[0].message);
      return;
    }
    if (!user) return;
    setIsLoading(true);
    const loadingToast = toast({
      title: "Verifying OTP...",
      description: "Please wait while we verify your code.",
      variant: "default",
    });
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/onboarding/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Invalid OTP",
          description: result.error || "Invalid OTP",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully.",
        variant: "success",
      });
      setTimeout(() => onVerified(phoneNumber), 1000);
    } catch (error) {
      toast({
        title: "Verification failed",
        description:
          error instanceof Error
            ? error.message
            : "Verification failed. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }

  // Resend OTP handler
  async function handleResendOtp() {
    setIsResending(true);
    setServerError(null);
    setSuccessMsg(null);
    const loadingToast = toast({
      title: "Resending OTP...",
      description: "Please wait while we resend the verification code.",
      variant: "default",
    });
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const response = await fetch("/api/onboarding/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber }),
      });
      const result = await response.json();
      if (!response.ok) {
        toast({
          title: "Failed to resend OTP",
          description: result.error || "Failed to resend OTP",
          variant: "destructive",
        });
        return;
      }
      setOtp("");
      startCooldown();
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description:
          error instanceof Error
            ? error.message
            : "Failed to resend OTP. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
      toast.dismiss(loadingToast);
    }
  }

  // Cooldown timer for resend
  function startCooldown() {
    setCooldown(30);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  // Framer motion variants
  const stepVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="w-full max-w-md mx-auto  rounded-xl shadow-lg   flex flex-col gap-8 animate-fade-in">
      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.form
            key="phone"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            onSubmit={handleSendOtp}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber" className="text-base">
                Phone Number
              </Label>
              <PhoneInput
                id="phoneNumber"
                placeholder="+1234567890"
                disabled={isLoading}
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter your phone number in international format (e.g.,
                +1234567890)
              </p>
            </div>
            {serverError && (
              <div className="text-sm text-red-500 font-medium text-center">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="text-sm text-green-600 font-medium text-center">
                {successMsg}
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
              size="lg"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Send Verification Code
            </Button>
          </motion.form>
        )}
        {step === "otp" && (
          <motion.form
            key="otp"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={stepVariants}
            transition={{ duration: 0.3 }}
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="otp" className="text-base">
                Verification Code
              </Label>
              <ManualOTPInput
                value={otp}
                onChange={setOtp}
                length={6}
                disabled={isLoading}
                className="justify-center"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the 6-digit code sent to{" "}
                <span className="font-medium">{phoneNumber}</span>
              </p>
            </div>
            {serverError && (
              <div className="text-sm text-red-500 font-medium text-center">
                {serverError}
              </div>
            )}
            {successMsg && (
              <div className="text-sm text-green-600 font-medium text-center">
                {successMsg}
              </div>
            )}
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading}
              size="lg"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Verify
            </Button>
            <div className="flex flex-col items-center gap-2 mt-2">
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={handleResendOtp}
                disabled={isResending || cooldown > 0}
                className="text-blue-600 dark:text-blue-400"
              >
                {isResending && (
                  <Icons.spinner className="mr-2 h-3 w-3 animate-spin" />
                )}
                {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setServerError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-muted-foreground"
              >
                Change phone number
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
