"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { ButtonLoader } from "@/components/ui/loader";
import { FirebaseError } from "firebase/app";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const { signIn, signInWithGoogle, userProfile, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormValues) {
    setIsLoading(true);

    try {
      await signIn(data.email, data.password);
      router.push("/");
    } catch (error) {
      let errorMessage = "Invalid email or password. Please try again.";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password. Please try again.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;
          default:
            errorMessage = "Sign in failed. Please try again.";
        }
      }

      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google sign in failed",
        description: "Please try again later.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && userProfile) {
      router.push("/user-profile");
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-10" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex items-center">
          <Separator className="flex-1" />
          <span className="mx-2 text-xs text-slate-500 dark:text-slate-400">
            OR
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="text-center">
          <Skeleton className="mx-auto h-5 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t("signin.form.email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("signin.form.emailPlaceholder")}
            autoComplete="email"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("signin.form.password")}</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
            >
              {t("signin.form.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t("signin.form.passwordPlaceholder")}
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Icons.eyeOff className="w-5 h-5" />
              ) : (
                <Icons.eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? <ButtonLoader size="sm" /> : t("signin.form.submitButton")}
        </Button>
      </form>

      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="mx-2 text-xs text-slate-500 dark:text-slate-400">
          OR
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <ButtonLoader size="sm" />
          ) : (
            <>
              <Icons.google className="mr-2 h-4 w-4" />
              Sign in with Google
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm">
        {t("signin.form.dontHaveAccount")}{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-primary hover:underline"
        >
          {t("signin.form.signUpLink")}
        </Link>
      </div>
    </div>
  );
}
