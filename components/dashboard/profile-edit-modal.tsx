"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useTranslation } from "react-i18next";
import type { User } from "firebase/auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { IUser } from "../../models/User";
import { educationOptions, occupationOptions } from "../../constants";

export default function ProfileEditModal({
  isOpen,
  onClose,
  user,
  userProfile,
}: ProfileEditModalProps) {
  const { refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherEducation, setShowOtherEducation] = useState(false);
  const [showOtherOccupation, setShowOtherOccupation] = useState(false);

  const profileSchema = z.object({
    title: z
      .string()
      .min(1, { message: t("userProfile.editModal.validation.titleRequired") }),
    fullName: z.string().min(2, {
      message: t("userProfile.editModal.validation.fullNameRequired"),
    }),
    gender: z.string().min(1, {
      message: t("userProfile.editModal.validation.genderRequired"),
    }),
    dateOfBirth: z.date({
      required_error: t("userProfile.editModal.validation.dateOfBirthRequired"),
    }),
    bloodGroup: z.string().min(1, {
      message: t("userProfile.editModal.validation.bloodGroupRequired"),
    }),
    education: z.string().min(1, {
      message: t("userProfile.editModal.validation.educationRequired"),
    }),
    otherEducation: z.string().optional(),
    occupation: z.string().min(1, {
      message: t("userProfile.editModal.validation.occupationRequired"),
    }),
    otherOccupation: z.string().optional(),
    maritalStatus: z.string().min(1, {
      message: t("userProfile.editModal.validation.maritalStatusRequired"),
    }),
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

  interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    userProfile: IUser;
  }

  interface AdminOption {
    _id: string;
    type: string;
    value: string;
    isActive: boolean;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const watchedDate = watch("dateOfBirth");

  useEffect(() => {
    if (isOpen && userProfile.profile) {
      setValue("title", userProfile.profile.title || "");
      setValue("fullName", userProfile.profile.fullName || "");
      setValue("gender", userProfile.profile.gender || "");
      setValue(
        "dateOfBirth",
        userProfile.profile.dateOfBirth
          ? new Date(userProfile.profile.dateOfBirth)
          : new Date()
      );
      setValue("bloodGroup", userProfile.profile.bloodGroup || "");
      setValue("education", userProfile.profile.education || "");
      setValue("occupation", userProfile.profile.occupation || "");
      setValue("maritalStatus", userProfile.profile.maritalStatus || "");
      // Prepopulate otherEducation/otherOccupation if needed
      if (
        userProfile.profile.education &&
        !educationOptions.includes(userProfile.profile.education)
      ) {
        setValue("education", "other");
        setValue("otherEducation", userProfile.profile.education);
      }
      if (
        userProfile.profile.occupation &&
        !occupationOptions.includes(userProfile.profile.occupation)
      ) {
        setValue("occupation", "other");
        setValue("otherOccupation", userProfile.profile.occupation);
      }
    }
  }, [isOpen, userProfile, setValue]);

  // Watch education and occupation for 'other'
  const watchedEducation = watch("education");
  const watchedOccupation = watch("occupation");

  useEffect(() => {
    setShowOtherEducation(watchedEducation === "other");
    if (watchedEducation !== "other") setValue("otherEducation", "");
  }, [watchedEducation, setValue]);
  useEffect(() => {
    setShowOtherOccupation(watchedOccupation === "other");
    if (watchedOccupation !== "other") setValue("otherOccupation", "");
  }, [watchedOccupation, setValue]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;

    // Use manual input if 'other' is selected
    const profileData = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? format(data.dateOfBirth, "yyyy-MM-dd")
        : "",
      education:
        data.education === "other" ? data.otherEducation : data.education,
      occupation:
        data.occupation === "other" ? data.otherOccupation : data.occupation,
    };

    setIsLoading(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile: profileData,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update profile");
      }

      toast({
        title: t("userProfile.editModal.messages.profileUpdated"),
        description: t(
          "userProfile.editModal.messages.profileUpdatedDescription"
        ),
      });

      await refreshUserProfile();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("userProfile.editModal.messages.profileUpdateFailed"),
        description:
          error instanceof Error
            ? error.message
            : t(
                "userProfile.editModal.messages.profileUpdateFailedDescription"
              ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const titleOptions = [
    { value: "mr", label: t("userProfile.editModal.options.titles.mr") },
    { value: "mrs", label: t("userProfile.editModal.options.titles.mrs") },
    { value: "ms", label: t("userProfile.editModal.options.titles.ms") },
    { value: "other", label: t("userProfile.editModal.options.titles.other") },
  ];

  const genderOptions = [
    { value: "male", label: t("userProfile.editModal.options.genders.male") },
    {
      value: "female",
      label: t("userProfile.editModal.options.genders.female"),
    },
    { value: "other", label: t("userProfile.editModal.options.genders.other") },
  ];

  const bloodGroupOptions = [
    {
      value: "a+",
      label: t("userProfile.editModal.options.bloodGroups.aPlus"),
    },
    {
      value: "a-",
      label: t("userProfile.editModal.options.bloodGroups.aMinus"),
    },
    {
      value: "b+",
      label: t("userProfile.editModal.options.bloodGroups.bPlus"),
    },
    {
      value: "b-",
      label: t("userProfile.editModal.options.bloodGroups.bMinus"),
    },
    {
      value: "ab+",
      label: t("userProfile.editModal.options.bloodGroups.abPlus"),
    },
    {
      value: "ab-",
      label: t("userProfile.editModal.options.bloodGroups.abMinus"),
    },
    {
      value: "o+",
      label: t("userProfile.editModal.options.bloodGroups.oPlus"),
    },
    {
      value: "o-",
      label: t("userProfile.editModal.options.bloodGroups.oMinus"),
    },
  ];

  const maritalStatusOptions = [
    {
      value: "single",
      label: t("userProfile.editModal.options.maritalStatus.single"),
    },
    {
      value: "married",
      label: t("userProfile.editModal.options.maritalStatus.married"),
    },
    {
      value: "divorced",
      label: t("userProfile.editModal.options.maritalStatus.divorced"),
    },
    {
      value: "widowed",
      label: t("userProfile.editModal.options.maritalStatus.widowed"),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("userProfile.editModal.title")}</DialogTitle>
          <DialogDescription>
            {t("userProfile.editModal.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                {t("userProfile.editModal.form.title")}
              </Label>
              <Select
                onValueChange={(value) => setValue("title", value)}
                value={watch("title")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("userProfile.editModal.form.selectTitle")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {titleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {t("userProfile.editModal.form.fullName")}
              </Label>
              <Input
                id="fullName"
                placeholder={t("userProfile.editModal.form.enterFullName")}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">
                {t("userProfile.editModal.form.gender")}
              </Label>
              <Select
                onValueChange={(value) => setValue("gender", value)}
                value={watch("gender")}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("userProfile.editModal.form.selectGender")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">{t("userProfile.editModal.form.dateOfBirth")}</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={watchedDate ? format(watchedDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setValue("dateOfBirth", val ? new Date(val) : new Date());
                }}
                max={format(new Date(), "yyyy-MM-dd")}
                min="1900-01-01"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select
                onValueChange={(value) => setValue("bloodGroup", value)}
                value={watch("bloodGroup")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroupOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bloodGroup && (
                <p className="text-sm text-red-500">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Select
                onValueChange={(value) => setValue("education", value)}
                value={watch("education")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  {educationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {showOtherEducation && (
                <Input
                  id="otherEducation"
                  placeholder="Enter your education"
                  {...register("otherEducation", { required: true })}
                />
              )}
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
              {showOtherEducation && errors.otherEducation && (
                <p className="text-sm text-red-500">Education is required</p>
              )}
            </div>

            {/* Occupation */}
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Select
                onValueChange={(value) => setValue("occupation", value)}
                value={watch("occupation")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  {occupationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {showOtherOccupation && (
                <Input
                  id="otherOccupation"
                  placeholder="Enter your occupation"
                  {...register("otherOccupation", { required: true })}
                />
              )}
              {errors.occupation && (
                <p className="text-sm text-red-500">
                  {errors.occupation.message}
                </p>
              )}
              {showOtherOccupation && errors.otherOccupation && (
                <p className="text-sm text-red-500">Occupation is required</p>
              )}
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                onValueChange={(value) => setValue("maritalStatus", value)}
                value={watch("maritalStatus")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.maritalStatus && (
                <p className="text-sm text-red-500">
                  {errors.maritalStatus.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
