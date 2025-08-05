import { FC, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
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
import { FamilyMember } from "./types";
import { Badge } from "@/components/ui/badge";
import { ButtonLoader } from "@/components/ui/loader";
import { Textarea } from "../ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AddEditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
  memberData: Omit<FamilyMember, "id" | "familyTreeId"> | FamilyMember | null;
  setMemberData: (data: any) => void;
  allMembers: FamilyMember[];
  validation: {
    isValidParent: (id: string) => boolean;
    isValidChild: (id: string) => boolean;
    isValidSpouse: (id: string) => boolean;
  };
  isEditMode: boolean;
  loading?: boolean;
}

export const AddEditMemberModal: FC<AddEditMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  memberData,
  setMemberData,
  allMembers,
  validation,
  isEditMode,
  loading = false,
}) => {
  const { t, ready } = useTranslation("common");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && memberData?.profileImageUrl) {
        setProfileImagePreview(memberData.profileImageUrl);
      } else {
        setProfileImagePreview(null);
      }
      setProfileImageFile(null);
    }
  }, [isOpen, isEditMode, (memberData as FamilyMember)?.id]);

  if (!memberData) return null;

  // Show loading state while translations are not ready
  if (!ready) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="max-w-lg w-full sm:max-w-xl p-0 flex flex-col h-full"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading translations...</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert(t("addEditMember.validation.imageSize"));
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert(t("addEditMember.validation.imageType"));
        return;
      }
      setProfileImagePreview(URL.createObjectURL(file));
      setProfileImageFile(file);
      if (!isEditMode) {
        // CREATE: Upload to /api/upload
        const formData = new FormData();
        formData.append("file", file);
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) throw new Error("Upload failed");
          const data = await res.json();
          setMemberData((prev: any) => ({
            ...prev,
            profileImageUrl: data.path,
          }));
        } catch (err) {
          alert(t("addEditMember.validation.uploadFailed"));
          setProfileImagePreview(null);
          setProfileImageFile(null);
        }
      } else {
        // EDIT: Do not upload immediately, just set the file for later PUT
        setMemberData((prev: any) => ({
          ...prev,
          profileImageUrl: undefined, // Will be set after PUT
        }));
      }
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(
        isEditMode ? memberData?.profileImageUrl ?? null : null
      );
    }
  };

  const handleSelectChange = (field: "parents" | "children", value: string) => {
    if (value && !memberData[field]?.includes(value)) {
      setMemberData((prev: any) => ({
        ...prev,
        [field]: [...(prev[field] || []), value],
      }));
    }
  };

  const handleBadgeRemove = (field: "parents" | "children", value: string) => {
    setMemberData((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((id: string) => id !== value),
    }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    if (memberData) {
      Object.entries(memberData).forEach(([key, value]) => {
        if (key === "profileImageUrl" && !value) return; // Only send if present
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
    }
    if (isEditMode && profileImageFile) {
      // On edit, send the file as 'profileImage' to the member update endpoint
      formData.append("profileImage", profileImageFile);
      // Call the update endpoint directly
      try {
        // You need to provide treeId and memberId in the parent component's onSubmit
        // Here, we assume onSubmit(formData) will handle the actual PUT request
        await onSubmit(formData);
      } catch (err) {
        alert(t("addEditMember.validation.updateFailed"));
      }
    } else {
      // On create, or edit without new image, just call onSubmit
      onSubmit(formData);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="max-w-lg w-full sm:max-w-xl p-0 flex flex-col h-full"
      >
        <SheetHeader className="p-4 sm:p-6 pb-0">
          <SheetTitle>
            {isEditMode ? "Edit Family Member" : "Add Family Member"}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500 text-sm">
                  {t("addEditMember.form.noImage")}
                </span>
              )}
            </div>
            <div>
              <Label htmlFor="profileImage" className="sr-only">
                {t("addEditMember.form.profileImage")}
              </Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">
                {t("addEditMember.form.firstName")}
              </Label>
              <Input
                id="firstName"
                value={memberData.firstName}
                onChange={(e) =>
                  setMemberData((prev: any) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                placeholder={t("addEditMember.form.firstNamePlaceholder")}
                disabled={loading}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="lastName">
                {t("addEditMember.form.lastName")}
              </Label>
              <Input
                id="lastName"
                value={memberData.lastName}
                onChange={(e) =>
                  setMemberData((prev: any) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                placeholder={t("addEditMember.form.lastNamePlaceholder")}
                disabled={loading}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">{t("addEditMember.form.gender")}</Label>
              <Select
                value={memberData.gender}
                onValueChange={(value) =>
                  setMemberData((prev: any) => ({ ...prev, gender: value }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">
                    {t("addEditMember.form.male")}
                  </SelectItem>
                  <SelectItem value="female">
                    {t("addEditMember.form.female")}
                  </SelectItem>
                  <SelectItem value="other">
                    {t("addEditMember.form.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="birthDate">
                {t("addEditMember.form.birthDate")}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !memberData.birthDate && "text-muted-foreground"
                    )}
                    type="button"
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {memberData.birthDate ? (
                      format(new Date(memberData.birthDate), "PPP")
                    ) : (
                      <span>{t("addEditMember.form.pickDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={
                      memberData.birthDate
                        ? new Date(memberData.birthDate)
                        : undefined
                    }
                    onSelect={(date) =>
                      setMemberData((prev: any) => ({
                        ...prev,
                        birthDate: date || undefined,
                      }))
                    }
                    isShowYear={true}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label htmlFor="bio">{t("addEditMember.form.bio")}</Label>
            <Textarea
              id="bio"
              value={memberData.bio || ""}
              onChange={(e) =>
                setMemberData((prev: any) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
              placeholder={t("addEditMember.form.bioPlaceholder")}
              disabled={loading}
              className="w-full min-h-[80px]"
            />
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="parents">{t("addEditMember.form.parents")}</Label>
              <Select
                onValueChange={(val) => handleSelectChange("parents", val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("addEditMember.form.selectParent")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {allMembers
                    .filter(
                      (m) =>
                        validation.isValidParent(m.id) &&
                        !memberData.parents.includes(m.id)
                    )
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1 mt-2">
                {memberData.parents.map((pId) => {
                  const parent = allMembers.find((m) => m.id === pId);
                  return parent ? (
                    <Badge
                      key={pId}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        !loading && handleBadgeRemove("parents", pId)
                      }
                    >
                      {parent.firstName} {parent.lastName} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="children">
                {t("addEditMember.form.children")}
              </Label>
              <Select
                onValueChange={(val) => handleSelectChange("children", val)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("addEditMember.form.selectChild")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {allMembers
                    .filter(
                      (m) =>
                        validation.isValidChild(m.id) &&
                        !memberData.children.includes(m.id)
                    )
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-1 mt-2">
                {memberData.children.map((cId) => {
                  const child = allMembers.find((m) => m.id === cId);
                  return child ? (
                    <Badge
                      key={cId}
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        !loading && handleBadgeRemove("children", cId)
                      }
                    >
                      {child.firstName} {child.lastName} ×
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>

            <div>
              <Label htmlFor="spouse">
                {memberData.gender === "female"
                  ? t("addEditMember.form.husband")
                  : t("addEditMember.form.spouse")}
              </Label>
              <Select
                value={memberData.spouseId || "none"}
                onValueChange={(val) =>
                  setMemberData((prev: any) => ({
                    ...prev,
                    spouseId: val === "none" ? null : val,
                  }))
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue>
                    {memberData.spouseId && memberData.spouseId !== "none"
                      ? (() => {
                          const spouse = allMembers.find(
                            (m) => m.id === memberData.spouseId
                          );
                          return spouse
                            ? `${spouse.firstName} ${spouse.lastName}`
                            : t("addEditMember.form.selectSpouse");
                        })()
                      : t("addEditMember.form.selectSpouse")}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("addEditMember.form.noSpouse")}
                  </SelectItem>
                  {allMembers
                    .filter((m) => {
                      if (
                        isEditMode &&
                        (memberData as FamilyMember)?.id === m.id
                      ) {
                        return false;
                      }

                      const isAvailable =
                        !m.spouseId ||
                        m.spouseId === (memberData as FamilyMember)?.id;

                      return isAvailable && validation.isValidSpouse(m.id);
                    })
                    .map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.firstName} {m.lastName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="p-4 border-t bg-white sticky bottom-0 left-0 w-full flex flex-col gap-2 z-10">
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? (
              <ButtonLoader size="sm" />
            ) : isEditMode ? (
              t("addEditMember.buttons.saveChanges")
            ) : (
              t("addEditMember.buttons.addMember")
            )}
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              {t("addEditMember.buttons.close")}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
};
