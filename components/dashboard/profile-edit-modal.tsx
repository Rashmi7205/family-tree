"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/auth-context";
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

const profileSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  dateOfBirth: z.date({ required_error: "Date of birth is required" }),
  bloodGroup: z.string().min(1, { message: "Blood group is required" }),
  education: z.string().min(1, { message: "Education is required" }),
  otherEducation: z.string().optional(),
  occupation: z.string().min(1, { message: "Occupation is required" }),
  otherOccupation: z.string().optional(),
  maritalStatus: z.string().min(1, { message: "Marital status is required" }),
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

export default function ProfileEditModal({
  isOpen,
  onClose,
  user,
  userProfile,
}: ProfileEditModalProps) {
  const { refreshUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showOtherEducation, setShowOtherEducation] = useState(false);
  const [showOtherOccupation, setShowOtherOccupation] = useState(false);

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
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      await refreshUserProfile();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Profile update failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const titleOptions = [
    { value: "mr", label: "Mr." },
    { value: "mrs", label: "Mrs." },
    { value: "ms", label: "Ms." },
    { value: "other", label: "Other" },
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "a+", label: "A+" },
    { value: "a-", label: "A-" },
    { value: "b+", label: "B+" },
    { value: "b-", label: "B-" },
    { value: "ab+", label: "AB+" },
    { value: "ab-", label: "AB-" },
    { value: "o+", label: "O+" },
    { value: "o-", label: "O-" },
  ];

  const maritalStatusOptions = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information and preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Select
                onValueChange={(value) => setValue("title", value)}
                value={watch("title")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
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
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
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
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) => setValue("gender", value)}
                value={watch("gender")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
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
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
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
