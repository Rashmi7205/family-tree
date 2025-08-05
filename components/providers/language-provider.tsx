"use client";

import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import { useEffect, useState } from "react";

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeI18n = async () => {
      const i18nInstance = createInstance();

      const currentLanguage =
        typeof window !== "undefined"
          ? localStorage.getItem("preferred-language") || "en"
          : "en";

      await i18nInstance.use(initReactI18next).init({
        lng: currentLanguage,
        fallbackLng: "en",
        debug: process.env.NODE_ENV === "development",
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
        resources: {
          en: {
            common: {
              homepage: {
                hero: {
                  title: "Explore Your Ancestry",
                  subtitle: {
                    regular: "Begin your journey through the ",
                    gradient: "Durgadham family tree.",
                  },
                  description:
                    "Discover connections, trace roots, and learn more about your heritage. With our intuitive family tree viewer, you can explore, save, and share heritage data quickly and easily. Revisit stories and memories across generations, bringing the family closer than ever before.",
                  ctaText: "Create my Family tree",
                },
                features: {
                  title: "Everything You Need to Build Your Legacy",
                  subtitle:
                    "Our platform provides powerful, intuitive tools to help you discover, preserve, and share your family's history.",
                  cards: {
                    treeBuilding: {
                      title: "Interactive Tree Building",
                      description:
                        "Easily create and visualize your family tree with our intuitive drag-and-drop interface and dynamic zoom capabilities.",
                    },
                    memories: {
                      title: "Preserve Rich Memories",
                      description:
                        "Enrich your family history by adding photos, stories, and important memories for each member, creating a vivid archive.",
                    },
                    collaborate: {
                      title: "Collaborate with Family",
                      description:
                        "Invite family members to view and contribute to your shared tree, making it a collaborative and living project.",
                    },
                    export: {
                      title: "Export Tree",
                      description:
                        "Export your family tree in multiple formats including PDF and PNG for easy sharing and printing.",
                    },
                    responsive: {
                      title: "Responsive Layout",
                      description:
                        "Access and edit your family tree from any device with our fully responsive and mobile-friendly design.",
                    },
                  },
                },
                about: {
                  title: "Discover the Story of Your Family",
                  description: {
                    paragraph1:
                      "At Durgadham Family Tree Explorer, we believe every family has a story worth preserving. Our goal is to make it simple, beautiful, and meaningful for families to trace their heritage across generations.",
                    paragraph2:
                      "From uncovering long-lost connections to preserving cherished memories, we help you piece together the threads that weave your family's unique heritage — making it easy for future generations to understand where they came from.",
                    paragraph3:
                      "Whether you're starting your family tree for the first time or you're an experienced genealogist, our platform is built for you. We combine heritage, technology, and design so you can explore, save, and share your family's legacy.",
                  },
                  stats: {
                    families: {
                      number: "50K+",
                      label: "Families Connected",
                    },
                    stories: {
                      number: "1M+",
                      label: "Stories Preserved",
                    },
                    satisfaction: {
                      number: "99%",
                      label: "User Satisfaction",
                    },
                  },
                },
                cta: {
                  title: "Start Building Your Family Tree Today",
                  button: "Get Started",
                },
                footer: {
                  contact: {
                    title: "Get in Touch",
                    description:
                      "Have questions about your family tree? Need help with genealogy research? We're here to help you discover and preserve your family's legacy.",
                    form: {
                      title: "Send us a Message",
                      firstName: "First Name",
                      lastName: "Last Name",
                      email: "Email",
                      subject: "Subject",
                      message: "Message",
                      firstNamePlaceholder: "Enter your first name",
                      lastNamePlaceholder: "Enter your last name",
                      emailPlaceholder: "Enter your email address",
                      subjectPlaceholder: "Subject of your message",
                      messagePlaceholder: "Type your message here...",
                      sendButton: "Send Message",
                      sending: "Sending...",
                      validation: {
                        firstNameRequired: "First name is required",
                        lastNameRequired: "Last name is required",
                        emailRequired: "Email is required",
                        subjectRequired: "Subject is required",
                        messageRequired: "Message is required",
                        invalidEmail: "Please enter a valid email address",
                      },
                      success: "Message Sent Successfully!",
                      error: "Failed to send message. Please try again.",
                      networkError:
                        "Network error. Please check your connection and try again.",
                    },
                    info: {
                      email: "Email",
                      phone: "Phone",
                      address: "Address",
                    },
                  },
                  links: {
                    features: "Features",
                    about: "About",
                    login: "Login",
                    register: "Register",
                    privacy: "Privacy Policy",
                    terms: "Terms of Service",
                    contact: "Contact",
                  },
                  copyright:
                    "Durga Dham Family Tree Explorer. All rights reserved.",
                },
              },
              languageSwitcher: {
                title: "Language",
                english: "English",
                hindi: "हिंदी",
                gujarati: "ગુજરાતી",
              },
              userProfile: {
                dashboard: {
                  title: "Dashboard",
                  newTree: "New Tree",
                  signOut: "Sign out",
                  loading: "Loading profile..."
                },
                welcome: {
                  title: "Welcome back, {{name}}! 👋",
                  description: "Here's an overview of your account and profile information."
                },
                stats: {
                  accountStatus: {
                    title: "Account Status",
                    value: "Active",
                    description: "Your account is fully verified"
                  },
                  profileCompletion: {
                    title: "Profile Completion",
                    value: "100%",
                    description: "All profile fields completed"
                  },
                  securityLevel: {
                    title: "Security Level",
                    value: "High",
                    description: "Email and phone verified"
                  },
                  memberSince: {
                    title: "Member Since",
                    description: "Years of membership"
                  }
                },
                profileCard: {
                  editProfile: "Edit Profile",
                  email: "Email",
                  phone: "Phone",
                  gender: "Gender",
                  dateOfBirth: "Date of Birth",
                  bloodGroup: "Blood Group",
                  maritalStatus: "Marital Status",
                  education: "Education",
                  address: "Address",
                  accountType: "Account Type",
                  verified: "Verified",
                  unverified: "Unverified",
                  notProvided: "Not provided",
                  notSpecified: "Not specified"
                },
                editModal: {
                  title: "Edit Profile",
                  description: "Update your personal information and preferences.",
                  form: {
                    title: "Title",
                    fullName: "Full Name",
                    gender: "Gender",
                    dateOfBirth: "Date of Birth",
                    bloodGroup: "Blood Group",
                    education: "Education",
                    occupation: "Occupation",
                    maritalStatus: "Marital Status",
                    other: "Other",
                    selectTitle: "Select title",
                    selectGender: "Select gender",
                    selectBloodGroup: "Select blood group",
                    selectEducation: "Select education",
                    selectOccupation: "Select occupation",
                    selectMaritalStatus: "Select marital status",
                    enterFullName: "Enter your full name",
                    enterEducation: "Enter your education",
                    enterOccupation: "Enter your occupation"
                  },
                  options: {
                    titles: {
                      mr: "Mr.",
                      mrs: "Mrs.",
                      ms: "Ms.",
                      other: "Other"
                    },
                    genders: {
                      male: "Male",
                      female: "Female",
                      other: "Other"
                    },
                    bloodGroups: {
                      aPlus: "A+",
                      aMinus: "A-",
                      bPlus: "B+",
                      bMinus: "B-",
                      abPlus: "AB+",
                      abMinus: "AB-",
                      oPlus: "O+",
                      oMinus: "O-"
                    },
                    maritalStatus: {
                      single: "Single",
                      married: "Married",
                      divorced: "Divorced",
                      widowed: "Widowed"
                    }
                  },
                  validation: {
                    titleRequired: "Title is required",
                    fullNameRequired: "Full name must be at least 2 characters",
                    genderRequired: "Gender is required",
                    dateOfBirthRequired: "Date of birth is required",
                    bloodGroupRequired: "Blood group is required",
                    educationRequired: "Education is required",
                    occupationRequired: "Occupation is required",
                    maritalStatusRequired: "Marital status is required",
                    educationRequiredOther: "Education is required",
                    occupationRequiredOther: "Occupation is required"
                  },
                  actions: {
                    cancel: "Cancel",
                    saveChanges: "Save Changes"
                  },
                  messages: {
                    profileUpdated: "Profile updated",
                    profileUpdatedDescription: "Your profile has been updated successfully.",
                    profileUpdateFailed: "Profile update failed",
                    profileUpdateFailedDescription: "Please try again later."
                  }
                }
              },
              signup: {
                title: "Create Account",
                subtitle: "Enter your details to create a new account",
                form: {
                  firstName: "First Name",
                  lastName: "Last Name",
                  email: "Email",
                  password: "Password",
                  confirmPassword: "Confirm Password",
                  firstNamePlaceholder: "Enter your first name",
                  lastNamePlaceholder: "Enter your last name",
                  emailPlaceholder: "Enter your email address",
                  passwordPlaceholder: "Enter your password",
                  confirmPasswordPlaceholder: "Confirm your password",
                  submitButton: "Create Account",
                  loading: "Creating account...",
                  alreadyHaveAccount: "Already have an account?",
                  signInLink: "Sign In",
                  validation: {
                    firstNameRequired: "First name is required",
                    lastNameRequired: "Last name is required",
                    emailRequired: "Email is required",
                    passwordRequired: "Password is required",
                    confirmPasswordRequired: "Please confirm your password",
                    invalidEmail: "Please enter a valid email address",
                    passwordMismatch: "Passwords do not match",
                    passwordTooShort: "Password must be at least 6 characters",
                  },
                },
              },
              signin: {
                title: "Sign In",
                subtitle: "Enter your credentials to access your account",
                form: {
                  email: "Email",
                  password: "Password",
                  emailPlaceholder: "Enter your email address",
                  passwordPlaceholder: "Enter your password",
                  submitButton: "Sign In",
                  loading: "Signing in...",
                  forgotPassword: "Forgot password?",
                  dontHaveAccount: "Don't have an account?",
                  signUpLink: "Sign Up",
                  validation: {
                    emailRequired: "Email is required",
                    passwordRequired: "Password is required",
                    invalidEmail: "Please enter a valid email address",
                  },
                },
              },
              onboarding: {
                title: "Complete Your Profile",
                subtitle: "Just a few more steps to get you started",
                steps: {
                  phone: "Phone Verification",
                  profile: "Profile Completion",
                  success: "Success",
                },
                phone: {
                  title: "Verify Your Phone Number",
                  subtitle: "We'll send you a verification code",
                  form: {
                    phone: "Phone Number",
                    phonePlaceholder: "Enter your phone number",
                    submitButton: "Send Code",
                    loading: "Sending code...",
                    resendButton: "Resend Code",
                    resendLoading: "Resending...",
                    verificationCode: "Verification Code",
                    codePlaceholder: "Enter 6-digit code",
                    verifyButton: "Verify Code",
                    verifyLoading: "Verifying...",
                    validation: {
                      phoneRequired: "Phone number is required",
                      invalidPhone: "Please enter a valid phone number",
                      codeRequired: "Verification code is required",
                      invalidCode: "Please enter a valid 6-digit code",
                    },
                  },
                },
                profile: {
                  title: "Complete Your Profile",
                  subtitle: "Tell us a bit about yourself",
                  form: {
                    firstName: "First Name",
                    lastName: "Last Name",
                    email: "Email",
                    firstNamePlaceholder: "Enter your first name",
                    lastNamePlaceholder: "Enter your last name",
                    emailPlaceholder: "Enter your email address",
                    submitButton: "Complete Profile",
                    loading: "Saving...",
                    validation: {
                      firstNameRequired: "First name is required",
                      lastNameRequired: "Last name is required",
                      emailRequired: "Email is required",
                      invalidEmail: "Please enter a valid email address",
                    },
                    fields: {
                      title: "Title",
                      fullName: "Full Name",
                      gender: "Gender",
                      dateOfBirth: "Date of Birth",
                      bloodGroup: "Blood Group",
                      education: "Education",
                      occupation: "Occupation",
                      maritalStatus: "Marital Status",
                      address: "Your Address",
                      addressDescription:
                        "You can select your address using Google Maps or enter it manually",
                      selectTitle: "Select title",
                      selectGender: "Select gender",
                      selectBloodGroup: "Select blood group",
                      selectEducation: "Select education",
                      selectOccupation: "Select occupation",
                      selectMaritalStatus: "Select marital status",
                      enterFullName: "Enter your full name",
                      enterEducation: "Enter your education",
                      enterOccupation: "Enter your occupation",
                      pickDate: "Pick a date",
                      current: "Current",
                      pleaseSelectAddress: "Please select your address",
                      other: "Other",
                      male: "Male",
                      female: "Female",
                      single: "Single",
                      married: "Married",
                      divorced: "Divorced",
                      widowed: "Widowed",
                      mr: "Mr.",
                      mrs: "Mrs.",
                      ms: "Ms.",
                      dr: "Dr.",
                      prof: "Prof.",
                    },
                  },
                },
                success: {
                  title: "Profile Completed!",
                  subtitle: "Welcome to the family tree explorer",
                  message:
                    "Your profile has been successfully completed. You'll be redirected to your profile page shortly.",
                },
              },
              trees: {
                title: "My Family Trees",
                newTree: "New Tree",
                stats: {
                  title: "Your Tree Stats",
                  totalTrees: "Total Trees",
                  familyMembers: "Family Members",
                  publicTrees: "Public Trees",
                  privateTrees: "Private Trees",
                },
                filters: {
                  title: "Filter & Search",
                  searchPlaceholder: "Search family trees...",
                  filterBy: "Filter by",
                  sortBy: "Sort by",
                  allTrees: "All Trees",
                  publicOnly: "Public Only",
                  privateOnly: "Private Only",
                  lastUpdated: "Last Updated",
                  dateCreated: "Date Created",
                  nameAZ: "Name A-Z",
                  mostMembers: "Most Members",
                  activeFilters: "Active filters:",
                  clearAll: "Clear all",
                },
                results: {
                  showing: "Showing",
                  of: "of",
                  familyTrees: "family trees",
                  totalMembers: "total members",
                  noTreesYet: "No family trees yet",
                  noTreesDescription:
                    "Get started by creating your first family tree to begin documenting your family history.",
                  createFirstTree: "Create Your First Tree",
                  noTreesFound: "No trees found",
                  noTreesFoundDescription:
                    "No family trees match your current search and filter criteria.",
                  clearFilters: "Clear Filters",
                },
                share: {
                  title: "Share this Tree",
                  copyLink: "Copy Link",
                  copied: "Copied!",
                  shareVia: "Share via",
                  anyoneWithLink: "Anyone with this link can view this tree.",
                },
                edit: {
                  title: "Edit Family Tree",
                  name: "Name",
                  description: "Description",
                  public: "Public",
                  saveChanges: "Save Changes",
                },
                delete: {
                  title: "Delete Family Tree",
                  description:
                    "Are you sure you want to delete this family tree? This will also delete all members and their files. This action cannot be undone.",
                  cancel: "Cancel",
                  delete: "Delete",
                },
                toasts: {
                  treeDeleted: "Tree deleted",
                  treeDeletedDescription: "Family tree deleted successfully.",
                  deleteFailed: "Delete failed",
                  deleteFailedDescription: "Failed to delete tree.",
                  treeUpdated: "Tree updated",
                  treeUpdatedDescription: "Family tree updated successfully.",
                  updateFailed: "Update failed",
                  updateFailedDescription: "Failed to update tree.",
                },
              },
              createTree: {
                title: "Create New Family Tree",
                description:
                  "Start building your family history by creating a new family tree.",
                form: {
                  name: "Family Tree Name *",
                  namePlaceholder: "e.g., The Smith Family",
                  nameHelp: "Choose a name for your family tree",
                  description: "Description (Optional)",
                  descriptionPlaceholder: "Describe your family tree...",
                  privacy: {
                    title: "Privacy Settings",
                    publicTree: "Public Tree",
                    privateTree: "Private Tree",
                    publicDescription:
                      "Anyone with the link can view this tree",
                    privateDescription: "Only you can view this tree",
                  },
                  buttons: {
                    cancel: "Cancel",
                    create: "Create Family Tree",
                    creating: "Creating...",
                  },
                },
                errors: {
                  failedToCreate: "Failed to create family tree",
                },
              },
              familyTreeViewer: {
                loading: "Loading family tree...",
                error: {
                  title: "Error Loading Family Tree",
                  tryAgain: "Try Again",
                },
                memberDetail: {
                  bio: "Bio:",
                  noBio: "No biography available.",
                  parents: "Parents:",
                  children: "Children:",
                  spouse: "Spouse:",
                  none: "None",
                  editMember: "Edit Member",
                  deleteMember: "Delete Member",
                  close: "Close",
                  deleteDialog: {
                    title: "Delete Family Member",
                    description:
                      "Are you sure you want to delete {firstName} {lastName}? This action cannot be undone and will also remove all relationships associated with this member.",
                    cancel: "Cancel",
                    confirm: "Delete Member",
                  },
                },
                share: {
                  title: "Share this Tree",
                  copyLink: "Copy Link",
                  copied: "Copied!",
                  shareVia: "Share via",
                  anyoneWithLink: "Anyone with this link can view this tree.",
                },
                export: {
                  title: "Export as Poster",
                  processing: "Processing...",
                  failed: "Failed to export poster",
                },
                actions: {
                  share: "Share",
                  export: "Export as Poster",
                },
              },
              addEditMember: {
                title: {
                  add: "Add Family Member",
                  edit: "Edit Family Member",
                },
                form: {
                  profileImage: "Profile Image",
                  noImage: "No Image",
                  firstName: "First Name",
                  firstNamePlaceholder: "Enter first name",
                  lastName: "Last Name",
                  lastNamePlaceholder: "Enter last name",
                  gender: "Gender",
                  male: "Male",
                  female: "Female",
                  other: "Other",
                  birthDate: "Birth Date",
                  pickDate: "Pick a date",
                  bio: "Biography",
                  bioPlaceholder: "A short biography of the family member.",
                  parents: "Parents",
                  selectParent: "Select parent...",
                  children: "Children",
                  selectChild: "Select child...",
                  spouse: "Spouse",
                  husband: "Husband",
                  selectSpouse: "Select spouse...",
                  noSpouse: "No spouse",
                },
                validation: {
                  imageSize: "Image size should be less than 8MB",
                  imageType: "Please upload an image file",
                  uploadFailed: "Failed to upload image",
                  updateFailed: "Failed to update member with image",
                },
                buttons: {
                  saveChanges: "Save Changes",
                  addMember: "Add Member",
                  close: "Close",
                },
              },
            },
          },
          hi: {
            common: {
              homepage: {
                hero: {
                  title: "अपनी वंशावली का अन्वेषण करें",
                  subtitle: {
                    regular:
                      "दुर्गाधाम परिवार के पेड़ के माध्यम से अपनी यात्रा शुरू करें ",
                    gradient: "दुर्गाधाम परिवार का पेड़।",
                  },
                  description:
                    "संबंधों की खोज करें, जड़ों का पता लगाएं, और अपनी विरासत के बारे में और जानें। हमारे सहज परिवार के पेड़ व्यूअर के साथ, आप विरासत डेटा को तेजी से और आसानी से एक्सप्लोर, सेव और शेयर कर सकते हैं। पीढ़ियों में कहानियों और यादों को फिर से देखें, परिवार को पहले से कहीं ज्यादा करीब लाएं।",
                  ctaText: "मेरा परिवार का पेड़ बनाएं",
                },
                features: {
                  title: "अपनी विरासत बनाने के लिए आपको जो कुछ चाहिए",
                  subtitle:
                    "हमारा प्लेटफॉर्म शक्तिशाली, सहज उपकरण प्रदान करता है जो आपको अपने परिवार के इतिहास की खोज, संरक्षण और साझा करने में मदद करता है।",
                  cards: {
                    treeBuilding: {
                      title: "इंटरैक्टिव पेड़ निर्माण",
                      description:
                        "हमारे सहज ड्रैग-एंड-ड्रॉप इंटरफेस और डायनामिक ज़ूम क्षमताओं के साथ आसानी से अपना परिवार का पेड़ बनाएं और देखें।",
                    },
                    memories: {
                      title: "समृद्ध यादों को संरक्षित करें",
                      description:
                        "प्रत्येक सदस्य के लिए तस्वीरें, कहानियां और महत्वपूर्ण यादें जोड़कर अपने परिवार के इतिहास को समृद्ध करें, एक जीवंत संग्रह बनाएं।",
                    },
                    collaborate: {
                      title: "परिवार के साथ सहयोग करें",
                      description:
                        "परिवार के सदस्यों को आमंत्रित करें कि वे आपके साझा पेड़ को देखें और उसमें योगदान करें, इसे एक सहयोगी और जीवंत परियोजना बनाएं।",
                    },
                    export: {
                      title: "पेड़ निर्यात करें",
                      description:
                        "आसान साझा करने और प्रिंटिंग के लिए PDF और PNG सहित कई प्रारूपों में अपना परिवार का पेड़ निर्यात करें।",
                    },
                    responsive: {
                      title: "रेस्पॉन्सिव लेआउट",
                      description:
                        "हमारे पूरी तरह से रेस्पॉન्सिव और मोबाइल-फ्रेंडली डिज़ाइन के साथ किसी भी डिवाइस से अपने परिवार के पेड़ तक पहुंचें और संपादित करें।",
                    },
                  },
                },
                about: {
                  title: "अपने परिवार की कहानी की खोज करें",
                  description: {
                    paragraph1:
                      "दुर्गाधाम परिवार पेड़ एक्सप्लोरर में, हम मानते हैं कि हर परिवार की एक कहानी है जो संरक्षण के योग्य है। हमारा लक्ष्य परिवारों के लिए पीढ़ियों में अपनी विरासत का पता लगाना सरल, सुंदर और सार्थक बनाना है।",
                    paragraph2:
                      "लंबे समय से खोए हुए संबंधों को खोजने से लेकर प्यारी यादों को संरक्षित करने तक, हम आपकी मदद करते हैं कि आप अपने परिवार की अनूठी विरासत को बुनने वाले धागों को एक साथ जोड़ें — भविष्य की पीढ़ियों के लिए यह समझना आसान बनाएं कि वे कहां से आए हैं।",
                    paragraph3:
                      "चाहे आप पहली बार अपना परिवार का पेड़ शुरू कर रहे हों या आप एक अनुभवी वंशावली विशेषज्ञ हों, हमारा प्लेटफॉर्म आपके लिए बनाया गया है। हम विरासत, प्रौद्योगिकी और डिज़ाइन को जोड़ते हैं ताकि आप अपने परिवार की विरासत का अन्वेषण, संरक्षण और साझा कर सकें।",
                  },
                  stats: {
                    families: {
                      number: "50K+",
                      label: "जुड़े परिवार",
                    },
                    stories: {
                      number: "1M+",
                      label: "संरक्षित कहानियां",
                    },
                    satisfaction: {
                      number: "99%",
                      label: "उपयोगकर्ता संतुष्टि",
                    },
                  },
                },
                cta: {
                  title: "आज ही अपना परिवार का पेड़ बनाना शुरू करें",
                  button: "शुरू करें",
                },
                footer: {
                  contact: {
                    title: "संपर्क करें",
                    description:
                      "अपने परिवार के पेड़ के बारे में प्रश्न हैं? वंशावली अनुसंधान में मदद चाहिए? हम आपकी परिवार की विरासत की खोज और संरक्षण में मदद करने के लिए यहां हैं।",
                    form: {
                      title: "हमें संदेश भेजें",
                      firstName: "पहला नाम",
                      lastName: "अंतिम नाम",
                      email: "ईमेल",
                      subject: "विषय",
                      message: "संदेश",
                      firstNamePlaceholder: "अपना पहला नाम दर्ज करें",
                      lastNamePlaceholder: "अपना अंतिम नाम दर्ज करें",
                      emailPlaceholder: "अपना ईमेल पता दर्ज करें",
                      subjectPlaceholder: "आपके संदेश का विषय",
                      messagePlaceholder: "यहां अपना संदेश लिखें...",
                      sendButton: "संदेश भेजें",
                      sending: "भेज रहे हैं...",
                      validation: {
                        firstNameRequired: "पहला नाम आवश्यक है",
                        lastNameRequired: "अंतिम नाम आवश्यक है",
                        emailRequired: "ईमेल आवश्यक है",
                        subjectRequired: "विषय आवश्यक है",
                        messageRequired: "संदेश आवश्यक है",
                        invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
                      },
                      success: "संदेश सफलतापूर्वक भेजा गया!",
                      error: "संदेश भेजने में विफल। कृपया पुनः प्रयास करें।",
                      networkError:
                        "नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
                    },
                    info: {
                      email: "ईमेल",
                      phone: "फोन",
                      address: "पता",
                    },
                  },
                  links: {
                    features: "विशेषताएं",
                    about: "हमारे बारे में",
                    login: "लॉगिन",
                    register: "पंजीकरण",
                    privacy: "गोपनीयता नीति",
                    terms: "सेवा की शर्तें",
                    contact: "संपर्क",
                  },
                  copyright:
                    "दुर्गाधाम परिवार पेड़ एक्सप्लोरर। सर्वाधिकार सुरक्षित।",
                },
              },
              languageSwitcher: {
                title: "भाषा",
                english: "English",
                hindi: "हिंदी",
                gujarati: "ગુજરાતી",
              },
              signup: {
                title: "खाता बनाएं",
                subtitle: "नया खाता बनाने के लिए अपना विवरण दर्ज करें",
                form: {
                  firstName: "पहला नाम",
                  lastName: "अंतिम नाम",
                  email: "ईमेल",
                  password: "पासवर्ड",
                  confirmPassword: "पासवर्ड की पुष्टि करें",
                  firstNamePlaceholder: "अपना पहला नाम दर्ज करें",
                  lastNamePlaceholder: "अपना अंतिम नाम दर्ज करें",
                  emailPlaceholder: "अपना ईमेल पता दर्ज करें",
                  passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
                  confirmPasswordPlaceholder: "अपने पासवर्ड की पुष्टि करें",
                  submitButton: "खाता बनाएं",
                  loading: "खाता बना रहे हैं...",
                  alreadyHaveAccount: "पहले से ही खाता है?",
                  signInLink: "साइन इन करें",
                  validation: {
                    firstNameRequired: "पहला नाम आवश्यक है",
                    lastNameRequired: "अंतिम नाम आवश्यक है",
                    emailRequired: "ईमेल आवश्यक है",
                    passwordRequired: "पासवर्ड आवश्यक है",
                    confirmPasswordRequired:
                      "कृपया अपने पासवर्ड की पुष्टि करें",
                    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
                    passwordMismatch: "पासवर्ड मेल नहीं खाते",
                    passwordTooShort: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
                  },
                },
              },
              signin: {
                title: "साइन इन करें",
                subtitle: "अपने खाते तक पहुंचने के लिए अपनी जानकारी दर्ज करें",
                form: {
                  email: "ईमेल",
                  password: "पासवर्ड",
                  emailPlaceholder: "अपना ईमेल पता दर्ज करें",
                  passwordPlaceholder: "अपना पासवर्ड दर्ज करें",
                  submitButton: "साइन इन करें",
                  loading: "साइन इन कर रहे हैं...",
                  forgotPassword: "पासवर्ड भूल गए?",
                  dontHaveAccount: "खाता नहीं है?",
                  signUpLink: "साइन अप करें",
                  validation: {
                    emailRequired: "ईमेल आवश्यक है",
                    passwordRequired: "पासवर्ड आवश्यक है",
                    invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
                  },
                },
              },
              onboarding: {
                title: "अपनी प्रोफाइल पूरी करें",
                subtitle: "बस कुछ और कदम आपको शुरू करने के लिए",
                steps: {
                  phone: "फोन सत्यापन",
                  profile: "प्रोफाइल पूर्णता",
                  success: "सफलता",
                },
                phone: {
                  title: "अपना फोन नंबर सत्यापित करें",
                  subtitle: "हम आपको एक सत्यापन कोड भेजेंगे",
                  form: {
                    phone: "फोन नंबर",
                    phonePlaceholder: "अपना फोन नंबर दर्ज करें",
                    submitButton: "कोड भेजें",
                    loading: "कोड भेज रहे हैं...",
                    resendButton: "कोड पुनः भेजें",
                    resendLoading: "पुनः भेज रहे हैं...",
                    verificationCode: "सत्यापन कोड",
                    codePlaceholder: "6-अंकीय कोड दर्ज करें",
                    verifyButton: "कोड सत्यापित करें",
                    verifyLoading: "सत्यापित कर रहे हैं...",
                    validation: {
                      phoneRequired: "फोन नंबर आवश्यक है",
                      invalidPhone: "कृपया एक वैध फोन नंबर दर्ज करें",
                      codeRequired: "सत्यापन कोड आवश्यक है",
                      invalidCode: "कृपया एक वैध 6-अंकीय कोड दर्ज करें",
                    },
                  },
                },
                profile: {
                  title: "अपनी प्रोफाइल पूरी करें",
                  subtitle: "हमें अपने बारे में कुछ बताएं",
                  form: {
                    firstName: "पहला नाम",
                    lastName: "अंतिम नाम",
                    email: "ईमेल",
                    firstNamePlaceholder: "अपना पहला नाम दर्ज करें",
                    lastNamePlaceholder: "अपना अंतिम नाम दर्ज करें",
                    emailPlaceholder: "अपना ईमेल पता दर्ज करें",
                    submitButton: "प्रोफाइल पूरी करें",
                    loading: "सहेज रहे हैं...",
                    validation: {
                      firstNameRequired: "पहला नाम आवश्यक है",
                      lastNameRequired: "अंतिम नाम आवश्यक है",
                      emailRequired: "ईमेल आवश्यक है",
                      invalidEmail: "कृपया एक वैध ईमेल पता दर्ज करें",
                    },
                    fields: {
                      title: "शीर्षक",
                      fullName: "पूरा नाम",
                      gender: "लिंग",
                      dateOfBirth: "जन्म तिथि",
                      bloodGroup: "रक्त समूह",
                      education: "शिक्षा",
                      occupation: "व्यवसाय",
                      maritalStatus: "वैवाहिक स्थिति",
                      address: "आपका पता",
                      addressDescription:
                        "आप Google Maps का उपयोग करके अपना पता चुन सकते हैं या इसे मैन्युअल रूप से दर्ज कर सकते हैं",
                      selectTitle: "शीर्षक चुनें",
                      selectGender: "लिंग चुनें",
                      selectBloodGroup: "रक्त समूह चुनें",
                      selectEducation: "शिक्षा चुनें",
                      selectOccupation: "व्यवसाय चुनें",
                      selectMaritalStatus: "वैवाहिक स्थिति चुनें",
                      enterFullName: "अपना पूरा नाम दर्ज करें",
                      enterEducation: "अपनी शिक्षा दर्ज करें",
                      enterOccupation: "अपना व्यवसाय दर्ज करें",
                      pickDate: "तिथि चुनें",
                      current: "वर्तमान",
                      pleaseSelectAddress: "कृपया अपना पता चुनें",
                      other: "अन्य",
                      male: "पुरुष",
                      female: "महिला",
                      single: "अविवाहित",
                      married: "विवाहित",
                      divorced: "तलाकशुदा",
                      widowed: "विधवा",
                      mr: "श्री",
                      mrs: "श्रीमती",
                      ms: "सुश्री",
                      dr: "डॉ.",
                      prof: "प्रो.",
                    },
                  },
                },
                success: {
                  title: "प्रोफाइल पूरी हो गई!",
                  subtitle: "परिवार के पेड़ एक्सप्लोरर में आपका स्वागत है",
                  message:
                    "आपकी प्रोफाइल सफलतापूर्वक पूरी हो गई है। आपको जल्द ही आपके प्रोफाइल पेज पर पुनर्निर्देशित किया जाएगा।",
                },
              },
              trees: {
                title: "मेरे परिवार के पेड़",
                newTree: "नया पेड़",
                stats: {
                  title: "आपके पेड़ के आंकड़े",
                  totalTrees: "कुल पेड़",
                  familyMembers: "परिवार के सदस्य",
                  publicTrees: "सार्वजनिक पेड़",
                  privateTrees: "निजी पेड़",
                },
                filters: {
                  title: "फ़िल्टर और खोज",
                  searchPlaceholder: "परिवार के पेड़ खोजें...",
                  filterBy: "फ़िल्टर करें",
                  sortBy: "क्रमबद्ध करें",
                  allTrees: "सभी पेड़",
                  publicOnly: "केवल सार्वजनिक",
                  privateOnly: "केवल निजी",
                  lastUpdated: "अंतिम अपडेट",
                  dateCreated: "बनाने की तिथि",
                  nameAZ: "नाम ए-ज़ेड",
                  mostMembers: "सबसे अधिक सदस्य",
                  activeFilters: "सक्रिय फ़िल्टर:",
                  clearAll: "सभी साफ़ करें",
                },
                results: {
                  showing: "दिखा रहा है",
                  of: "में से",
                  familyTrees: "परिवार के पेड़",
                  totalMembers: "कुल सदस्य",
                  noTreesYet: "अभी तक कोई परिवार का पेड़ नहीं",
                  noTreesDescription:
                    "अपने परिवार के इतिहास का दस्तावेज़ीकरण शुरू करने के लिए अपना पहला परिवार का पेड़ बनाकर शुरू करें।",
                  createFirstTree: "अपना पहला पेड़ बनाएं",
                  noTreesFound: "कोई पेड़ नहीं मिला",
                  noTreesFoundDescription:
                    "कोई परिवार का पेड़ आपके वर्तमान खोज और फ़िल्टर मानदंड से मेल नहीं खाता।",
                  clearFilters: "फ़िल्टर साफ़ करें",
                },
                share: {
                  title: "इस पेड़ को साझा करें",
                  copyLink: "लिंक कॉपी करें",
                  copied: "कॉपी किया गया!",
                  shareVia: "के माध्यम से साझा करें",
                  anyoneWithLink: "इस लिंक वाला कोई भी इस पेड़ को देख सकता है।",
                },
                edit: {
                  title: "परिवार का पेड़ संपादित करें",
                  name: "नाम",
                  description: "विवरण",
                  public: "सार्वजनिक",
                  saveChanges: "परिवर्तन सहेजें",
                },
                delete: {
                  title: "परिवार का पेड़ हटाएं",
                  description:
                    "क्या आप वाकई इस परिवार के पेड़ को हटाना चाहते हैं? इससे सभी सदस्य और उनकी फ़ाइलें भी हट जाएंगी। यह कार्य पूर्ववत नहीं किया जा सकता।",
                  cancel: "रद्द करें",
                  delete: "हटाएं",
                },
                toasts: {
                  treeDeleted: "पेड़ हटा दिया गया",
                  treeDeletedDescription:
                    "परिवार का पेड़ सफलतापूर्वक हटा दिया गया।",
                  deleteFailed: "हटाना विफल",
                  deleteFailedDescription: "पेड़ हटाने में विफल।",
                  treeUpdated: "पेड़ अपडेट किया गया",
                  treeUpdatedDescription:
                    "परिवार का पेड़ सफलतापूर्वक अपडेट किया गया।",
                  updateFailed: "अपडेट विफल",
                  updateFailedDescription: "पेड़ अपडेट करने में विफल।",
                },
              },
              createTree: {
                title: "नया परिवार का पेड़ बनाएं",
                description:
                  "नया परिवार का पेड़ बनाकर अपने परिवार के इतिहास का निर्माण शुरू करें।",
                form: {
                  name: "परिवार के पेड़ का नाम *",
                  namePlaceholder: "जैसे, स्मिथ परिवार",
                  nameHelp: "अपने परिवार के पेड़ के लिए एक नाम चुनें",
                  description: "विवरण (वैकल्पिक)",
                  descriptionPlaceholder:
                    "अपने परिवार के पेड़ का वर्णन करें...",
                  privacy: {
                    title: "गोपनीयता सेटिंग्स",
                    publicTree: "सार्वजनिक पेड़",
                    privateTree: "निजी पेड़",
                    publicDescription:
                      "लिंक वाला कोई भी इस पेड़ को देख सकता है",
                    privateDescription: "केवल आप ही इस पेड़ को देख सकते हैं",
                  },
                  buttons: {
                    cancel: "रद्द करें",
                    create: "परिवार का पेड़ बनाएं",
                    creating: "बना रहे हैं...",
                  },
                },
                errors: {
                  failedToCreate: "परिवार का पेड़ बनाने में विफल",
                },
              },
              familyTreeViewer: {
                loading: "परिवार का पेड़ लोड हो रहा है...",
                error: {
                  title: "परिवार का पेड़ लोड करने में त्रुटि",
                  tryAgain: "फिर से कोशिश करें",
                },
                memberDetail: {
                  bio: "जीवनी:",
                  noBio: "कोई जीवनी उपलब्ध नहीं है।",
                  parents: "माता-पिता:",
                  children: "बच्चे:",
                  spouse: "पति/पत्नी:",
                  none: "कोई नहीं",
                  editMember: "सदस्य संपादित करें",
                  deleteMember: "सदस्य हटाएं",
                  close: "बंद करें",
                  deleteDialog: {
                    title: "परिवार के सदस्य को हटाएं",
                    description:
                      "क्या आप वाकई {firstName} {lastName} को हटाना चाहते हैं? यह कार्य पूर्ववत नहीं किया जा सकता और इस सदस्य से जुड़े सभी संबंधों को भी हटा देगा।",
                    cancel: "रद्द करें",
                    confirm: "सदस्य हटाएं",
                  },
                },
                share: {
                  title: "इस पेड़ को साझा करें",
                  copyLink: "लिंक कॉपी करें",
                  copied: "कॉपी हो गया!",
                  shareVia: "इसके माध्यम से साझा करें",
                  anyoneWithLink: "इस लिंक वाला कोई भी इस पेड़ को देख सकता है।",
                },
                export: {
                  title: "पोस्टर के रूप में निर्यात करें",
                  processing: "प्रक्रिया कर रहे हैं...",
                  failed: "पोस्टर निर्यात करने में विफल",
                },
                actions: {
                  share: "साझा करें",
                  export: "पोस्टर के रूप में निर्यात करें",
                },
              },
              addEditMember: {
                title: {
                  add: "परिवार का सदस्य जोड़ें",
                  edit: "परिवार का सदस्य संपादित करें",
                },
                form: {
                  profileImage: "प्रोफाइल छवि",
                  noImage: "कोई छवि नहीं",
                  firstName: "पहला नाम",
                  firstNamePlaceholder: "पहला नाम दर्ज करें",
                  lastName: "अंतिम नाम",
                  lastNamePlaceholder: "अंतिम नाम दर्ज करें",
                  gender: "लिंग",
                  male: "पुरुष",
                  female: "महिला",
                  other: "अन्य",
                  birthDate: "जन्म तिथि",
                  pickDate: "तिथि चुनें",
                  bio: "जीवनी",
                  bioPlaceholder: "परिवार के सदस्य की संक्षिप्त जीवनी।",
                  parents: "माता-पिता",
                  selectParent: "माता-पिता चुनें...",
                  children: "बच्चे",
                  selectChild: "बच्चा चुनें...",
                  spouse: "पति/पत्नी",
                  husband: "पति",
                  selectSpouse: "पति/पत्नी चुनें...",
                  noSpouse: "कोई पति/पत्नी नहीं",
                },
                validation: {
                  imageSize: "छवि का आकार 8MB से कम होना चाहिए",
                  imageType: "कृपया एक छवि फ़ाइल अपलोड करें",
                  uploadFailed: "छवि अपलोड करने में विफल",
                  updateFailed: "छवि के साथ सदस्य अपडेट करने में विफल",
                },
                buttons: {
                  saveChanges: "परिवर्तन सहेजें",
                  addMember: "सदस्य जोड़ें",
                  close: "बंद करें",
                },
              },
            },
          },
          gu: {
            common: {
              homepage: {
                hero: {
                  title: "તમારા વંશવેલાની શોધ કરો",
                  subtitle: {
                    regular:
                      "દુર્ગાધામ પરિવારના વૃક્ષ દ્વારા તમારી યાત્રા શરૂ કરો ",
                    gradient: "દુર્ગાધામ પરિવારનું વૃક્ષ.",
                  },
                  description:
                    "સંબંધો શોધો, મૂળોનો પત્તો લગાવો, અને તમારી વિરાસત વિશે વધુ જાણો. અમારા સહજ પરિવારના વૃક્ષ વ્યૂઅર સાથે, તમે વિરાસત ડેટાને ઝડપથી અને સરળતાથી એક્સપ્લોર, સેવ અને શેર કરી શકો છો. પેઢીઓમાં વાર્તાઓ અને યાદોને ફરીથી જુઓ, પરિવારને પહેલા કરતાં વધુ નજીક લાવો.",
                  ctaText: "મારું પરિવારનું વૃક્ષ બનાવો",
                },
                features: {
                  title: "તમારી વિરાસત બનાવવા માટે તમને જે કંઈ જોઈએ છે",
                  subtitle:
                    "અમારું પ્લેટફોર્મ શક્તિશાળી, સહજ સાધનો પ્રદાન કરે છે જે તમને તમારા પરિવારના ઇતિહાસની શોધ, સંરક્ષણ અને શેર કરવામાં મદદ કરે છે.",
                  cards: {
                    treeBuilding: {
                      title: "ઇન્ટરેક્ટિવ વૃક્ષ બિલ્ડિંગ",
                      description:
                        "અમારા સહજ ડ્રેગ-અને-ડ્રોપ ઇન્ટરફેસ અને ડાયનેમિક ઝૂમ ક્ષમતાઓ સાથે સરળતાથી તમારું પરિવારનું વૃક્ષ બનાવો અને જુઓ.",
                    },
                    memories: {
                      title: "સમૃદ્ધ યાદો સંરક્ષિત કરો",
                      description:
                        "દરેક સભ્ય માટે ફોટા, વાર્તાઓ અને મહત્વપૂર્ણ યાદો ઉમેરીને તમારા પરિવારના ઇતિહાસને સમૃદ્ધ બનાવો, એક જીવંત આર્કાઇવ બનાવો.",
                    },
                    collaborate: {
                      title: "પરિવાર સાથે સહયોગ કરો",
                      description:
                        "પરિવારના સભ્યોને આમંત્રણ આપો કે તેઓ તમારા શેર કરેલા વૃક્ષને જુએ અને તેમાં યોગદાન આપે, તેને એક સહયોગી અને જીવંત પ્રોજેક્ટ બનાવો.",
                    },
                    export: {
                      title: "વૃક્ષ નિર્યાત કરો",
                      description:
                        "સરળ શેર કરવા અને પ્રિન્ટિંગ માટે PDF અને PNG સહિત ઘણા ફોર્મેટ્સમાં તમારું પરિવારનું વૃક્ષ નિર્યાત કરો.",
                    },
                    responsive: {
                      title: "રેસ્પોન્સિવ લેઆઉટ",
                      description:
                        "અમારા સંપૂર્ણ રેસ્પોન્સિવ અને મોબાઇલ-ફ્રેન્ડલી ડિઝાઇન સાથે કોઈપણ ડિવાઇસથી તમારા પરિવારના વૃક્ષ સુધી પહોંચો અને સંપાદિત કરો.",
                    },
                  },
                },
                about: {
                  title: "તમારા પરિવારની વાર્તાની શોધ કરો",
                  description: {
                    paragraph1:
                      "દુર્ગાધામ પરિવાર વૃક્ષ એક્સપ્લોરરમાં, અમે માનીએ છીએ કે દરેક પરિવારની એક વાર્તા છે જે સંરક્ષણના યોગ્ય છે. અમારો લક્ષ્ય પરિવારો માટે પેઢીઓમાં તેમની વિરાસતનો પત્તો લગાવવાને સરળ, સુંદર અને અર્થપૂર્ણ બનાવવાનો છે.",
                    paragraph2:
                      "લાંબા સમયથી ખોવાયેલા જોડાણોને શોધવાથી લઈને પ્રિય યાદોને સંરક્ષિત કરવા સુધી, અમે તમને મદદ કરીએ છીએ કે તમે તમારા પરિવારની અનન્ય વિરાસતને વણવા વાળા ધાગાઓને એક સાથે જોડો — ભવિષ્યની પેઢીઓ માટે તે સમજવાનું સરળ બનાવો કે તેઓ ક્યાંથી આવ્યા છે.",
                    paragraph3:
                      "ભલે તમે પહેલી વાર તમારું પરિવારનું વૃક્ષ શરૂ કરી રહ્યા હો અથવા તમે એક અનુભવી વંશાવળી વિશેષજ્ઞ હો, અમારું પ્લેટફોર્મ તમારા માટે બનાવવામાં આવ્યું છે. અમે વિરાસત, ટેક્નોલોજી અને ડિઝાઇનને જોડીએ છીએ જેથી તમે તમારા પરિવારની વિરાસતનું અન્વેષણ, સંરક્ષણ અને શેર કરી શકો.",
                  },
                  stats: {
                    families: {
                      number: "50K+",
                      label: "જોડાયેલા પરિવારો",
                    },
                    stories: {
                      number: "1M+",
                      label: "સંરક્ષિત વાર્તાઓ",
                    },
                    satisfaction: {
                      number: "99%",
                      label: "વપરાશકર્તા સંતુષ્ટિ",
                    },
                  },
                },
                cta: {
                  title: "આજે જ તમારું પરિવારનું વૃક્ષ બનાવવાનું શરૂ કરો",
                  button: "શરૂ કરો",
                },
                footer: {
                  contact: {
                    title: "સંપર્ક કરો",
                    description:
                      "તમારા પરિવારના વૃક્ષ વિશે પ્રશ્નો છે? વંશાવળી સંશોધનમાં મદદ જોઈએ છે? અમે તમારા પરિવારની વિરાસતની શોધ અને સંરક્ષણમાં મદદ કરવા માટે અહીં છીએ.",
                    form: {
                      title: "અમને સંદેશ મોકલો",
                      firstName: "પહેલું નામ",
                      lastName: "છેલ્લું નામ",
                      email: "ઈમેલ",
                      subject: "વિષય",
                      message: "સંદેશ",
                      firstNamePlaceholder: "તમારું પહેલું નામ દાખલ કરો",
                      lastNamePlaceholder: "તમારું છેલ્લું નામ દાખલ કરો",
                      emailPlaceholder: "તમારું ઈમેલ સરનામું દાખલ કરો",
                      subjectPlaceholder: "તમારા સંદેશનો વિષય",
                      messagePlaceholder: "અહીં તમારો સંદેશ લખો...",
                      sendButton: "સંદેશ મોકલો",
                      sending: "મોકલી રહ્યા છીએ...",
                      validation: {
                        firstNameRequired: "પહેલું નામ જરૂરી છે",
                        lastNameRequired: "છેલ્લું નામ જરૂરી છે",
                        emailRequired: "ઈમેલ જરૂરી છે",
                        subjectRequired: "વિષય જરૂરી છે",
                        messageRequired: "સંદેશ જરૂરી છે",
                        invalidEmail: "કૃપા કરીને માન્ય ઈમેલ સરનામું દાખલ કરો",
                      },
                      success: "સંદેશ સફળતાપૂર્વક મોકલવામાં આવ્યો!",
                      error:
                        "સંદેશ મોકલવામાં નિષ્ફળ. કૃપા કરીને ફરીથી પ્રયાસ કરો.",
                      networkError:
                        "નેટવર્ક ભૂલ. કૃપા કરીને તમારું કનેક્શન તપાસો અને ફરીથી પ્રયાસ કરો.",
                    },
                    info: {
                      email: "ઈમેલ",
                      phone: "ફોન",
                      address: "સરનામું",
                    },
                  },
                  links: {
                    features: "વિશેષતાઓ",
                    about: "અમારા વિશે",
                    login: "લૉગિન",
                    register: "પંજીકરણ",
                    privacy: "ગોપનીયતા નીતિ",
                    terms: "સેવાની શરતો",
                    contact: "સંપર્ક",
                  },
                  copyright:
                    " દુર્ગાધામ પરિવાર વૃક્ષ એક્સપ્લોરર. બધા અધિકાર સુરક્ષિત.",
                },
              },
              languageSwitcher: {
                title: "ભાષા",
                english: "English",
                hindi: "हिंदी",
                gujarati: "ગુજરાતી",
              },
              signup: {
                title: "ખાતું બનાવો",
                subtitle: "નવું ખાતું બનાવવા માટે તમારી વિગતો દાખલ કરો",
                form: {
                  firstName: "પહેલું નામ",
                  lastName: "છેલ્લું નામ",
                  email: "ઈમેલ",
                  password: "પાસવર્ડ",
                  confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
                  firstNamePlaceholder: "તમારું પહેલું નામ દાખલ કરો",
                  lastNamePlaceholder: "તમારું છેલ્લું નામ દાખલ કરો",
                  emailPlaceholder: "તમારું ઈમેલ સરનામું દાખલ કરો",
                  passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
                  confirmPasswordPlaceholder: "તમારા પાસવર્ડની પુષ્ટિ કરો",
                  submitButton: "ખાતું બનાવો",
                  loading: "ખાતું બનાવી રહ્યા છીએ...",
                  alreadyHaveAccount: "પહેલાથી જ ખાતું છે?",
                  signInLink: "સાઇન ઇન કરો",
                  validation: {
                    firstNameRequired: "પહેલું નામ જરૂરી છે",
                    lastNameRequired: "છેલ્લું નામ જરૂરી છે",
                    emailRequired: "ઈમેલ જરૂરી છે",
                    passwordRequired: "પાસવર્ડ જરૂરી છે",
                    confirmPasswordRequired:
                      "કૃપા કરીને તમારા પાસવર્ડની પુષ્ટિ કરો",
                    invalidEmail: "કૃપા કરીને માન્ય ઈમેલ સરનામું દાખલ કરો",
                    passwordMismatch: "પાસવર્ડ મેળ ખાતા નથી",
                    passwordTooShort: "પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરનો હોવો જોઈએ",
                  },
                },
              },
              signin: {
                title: "સાઇન ઇન કરો",
                subtitle: "તમારા ખાતા સુધી પહોંચવા માટે તમારી વિગતો દાખલ કરો",
                form: {
                  email: "ઈમેલ",
                  password: "પાસવર્ડ",
                  emailPlaceholder: "તમારું ઈમેલ સરનામું દાખલ કરો",
                  passwordPlaceholder: "તમારો પાસવર્ડ દાખલ કરો",
                  submitButton: "સાઇન ઇન કરો",
                  loading: "સાઇન ઇન કરી રહ્યા છીએ...",
                  forgotPassword: "પાસવર્ડ ભૂલી ગયા?",
                  dontHaveAccount: "ખાતું નથી?",
                  signUpLink: "સાઇન અપ કરો",
                  validation: {
                    emailRequired: "ઈમેલ જરૂરી છે",
                    passwordRequired: "પાસવર્ડ જરૂરી છે",
                    invalidEmail: "કૃપા કરીને માન્ય ઈમેલ સરનામું દાખલ કરો",
                  },
                },
              },
              onboarding: {
                title: "તમારી પ્રોફાઇલ પૂર્ણ કરો",
                subtitle: "તમને શરૂ કરવા માટે માત્ર કેટલાક વધુ પગલાં",
                steps: {
                  phone: "ફોન ચકાસણી",
                  profile: "પ્રોફાઇલ પૂર્ણતા",
                  success: "સફળતા",
                },
                phone: {
                  title: "તમારો ફોન નંબર ચકાસો",
                  subtitle: "અમે તમને એક ચકાસણી કોડ મોકલીશું",
                  form: {
                    phone: "ફોન નંબર",
                    phonePlaceholder: "તમારો ફોન નંબર દાખલ કરો",
                    submitButton: "કોડ મોકલો",
                    loading: "કોડ મોકલી રહ્યા છીએ...",
                    resendButton: "કોડ ફરીથી મોકલો",
                    resendLoading: "ફરીથી મોકલી રહ્યા છીએ...",
                    verificationCode: "ચકાસણી કોડ",
                    codePlaceholder: "6-અંકનો કોડ દાખલ કરો",
                    verifyButton: "કોડ ચકાસો",
                    verifyLoading: "ચકાસી રહ્યા છીએ...",
                    validation: {
                      phoneRequired: "ફોન નંબર જરૂરી છે",
                      invalidPhone: "કૃપા કરીને માન્ય ફોન નંબર દાખલ કરો",
                      codeRequired: "ચકાસણી કોડ જરૂરી છે",
                      invalidCode: "કૃપા કરીને માન્ય 6-અંકનો કોડ દાખલ કરો",
                    },
                  },
                },
                profile: {
                  title: "તમારી પ્રોફાઇલ પૂર્ણ કરો",
                  subtitle: "અમને તમારા વિશે થોડુંક જણાવો",
                  form: {
                    firstName: "પહેલું નામ",
                    lastName: "છેલ્લું નામ",
                    email: "ઈમેલ",
                    firstNamePlaceholder: "તમારું પહેલું નામ દાખલ કરો",
                    lastNamePlaceholder: "તમારું છેલ્લું નામ દાખલ કરો",
                    emailPlaceholder: "તમારું ઈમેલ સરનામું દાખલ કરો",
                    submitButton: "પ્રોફાઇલ પૂર્ણ કરો",
                    loading: "સાચવી રહ્યા છીએ...",
                    validation: {
                      firstNameRequired: "પહેલું નામ જરૂરી છે",
                      lastNameRequired: "છેલ્લું નામ જરૂરી છે",
                      emailRequired: "ઈમેલ જરૂરી છે",
                      invalidEmail: "કૃપા કરીને માન્ય ઈમેલ સરનામું દાખલ કરો",
                    },
                    fields: {
                      title: "શીર્ષક",
                      fullName: "પૂરું નામ",
                      gender: "લિંગ",
                      dateOfBirth: "જન્મ તારીખ",
                      bloodGroup: "રક્ત જૂથ",
                      education: "શિક્ષણ",
                      occupation: "વ્યવસાય",
                      maritalStatus: "વૈવાહિક સ્થિતિ",
                      address: "તમારું સરનામું",
                      addressDescription:
                        "તમે Google Maps નો ઉપયોગ કરીને તમારું સરનામું પસંદ કરી શકો છો અથવા તેને મેન્યુઅલ રીતે દાખલ કરી શકો છો",
                      selectTitle: "શીર્ષક પસંદ કરો",
                      selectGender: "લિંગ પસંદ કરો",
                      selectBloodGroup: "રક્ત જૂથ પસંદ કરો",
                      selectEducation: "શિક્ષણ પસંદ કરો",
                      selectOccupation: "વ્યવસાય પસંદ કરો",
                      selectMaritalStatus: "વૈવાહિક સ્થિતિ પસંદ કરો",
                      enterFullName: "તમારું પૂરું નામ દાખલ કરો",
                      enterEducation: "તમારું શિક્ષણ દાખલ કરો",
                      enterOccupation: "તમારો વ્યવસાય દાખલ કરો",
                      pickDate: "તારીખ પસંદ કરો",
                      current: "વર્તમાન",
                      pleaseSelectAddress: "કૃપા કરીને તમારું સરનામું પસંદ કરો",
                      other: "અન્ય",
                      male: "પુરુષ",
                      female: "સ્ત્રી",
                      single: "અવિવાહિત",
                      married: "વિવાહિત",
                      divorced: "છૂટાછેડા",
                      widowed: "વિધવા",
                      mr: "શ્રી",
                      mrs: "શ્રીમતી",
                      ms: "સુશ્રી",
                      dr: "ડૉ.",
                      prof: "પ્રો.",
                    },
                  },
                },
                success: {
                  title: "પ્રોફાઇલ પૂર્ણ થઈ!",
                  subtitle: "પરિવારના વૃક્ષ એક્સપ્લોરરમાં તમારું સ્વાગત છે",
                  message:
                    "તમારી પ્રોફાઇલ સફળતાપૂર્વક પૂર્ણ થઈ છે. તમને ટૂંક સમયમાં તમારા પ્રોફાઇલ પેજ પર પુનર્નિર્દેશિત કરવામાં આવશે.",
                },
              },
              trees: {
                title: "મારા પરિવારના વૃક્ષો",
                newTree: "નવું વૃક્ષ",
                stats: {
                  title: "તમારા વૃક્ષના આંકડા",
                  totalTrees: "કુલ વૃક્ષો",
                  familyMembers: "પરિવારના સભ્યો",
                  publicTrees: "જાહેર વૃક્ષો",
                  privateTrees: "ખાનગી વૃક્ષો",
                },
                filters: {
                  title: "ફિલ્ટર અને શોધ",
                  searchPlaceholder: "પરિવારના વૃક્ષો શોધો...",
                  filterBy: "ફિલ્ટર કરો",
                  sortBy: "ક્રમમાં ગોઠવો",
                  allTrees: "બધા વૃક્ષો",
                  publicOnly: "માત્ર જાહેર",
                  privateOnly: "માત્ર ખાનગી",
                  lastUpdated: "છેલ્લું અપડેટ",
                  dateCreated: "બનાવવાની તારીખ",
                  nameAZ: "નામ એ-ઝેડ",
                  mostMembers: "સૌથી વધુ સભ્યો",
                  activeFilters: "સક્રિય ફિલ્ટર:",
                  clearAll: "બધા સાફ કરો",
                },
                results: {
                  showing: "બતાવી રહ્યા છીએ",
                  of: "માંથી",
                  familyTrees: "પરિવારના વૃક્ષો",
                  totalMembers: "કુલ સભ્યો",
                  noTreesYet: "હજુ સુધી કોઈ પરિવારના વૃક્ષ નથી",
                  noTreesDescription:
                    "તમારા પરિવારના ઇતિહાસનું દસ્તાવેજીકરણ શરૂ કરવા માટે તમારો પહેલો પરિવારનો વૃક્ષ બનાવીને શરૂ કરો।",
                  createFirstTree: "તમારો પહેલો વૃક્ષ બનાવો",
                  noTreesFound: "કોઈ વૃક્ષ નથી મળ્યું",
                  noTreesFoundDescription:
                    "કોઈ પરિવારનો વૃક્ષ તમારા વર્તમાન શોધ અને ફિલ્ટર માપદંડો સાથે મેળ ખાતો નથી।",
                  clearFilters: "ફિલ્ટર સાફ કરો",
                },
                share: {
                  title: "આ વૃક્ષ શેર કરો",
                  copyLink: "લિંક કોપી કરો",
                  copied: "કોપી કર્યું!",
                  shareVia: "દ્વારા શેર કરો",
                  anyoneWithLink: "આ લિંક ધરાવતો કોઈપણ આ વૃક્ષ જોઈ શકે છે।",
                },
                edit: {
                  title: "પરિવારનો વૃક્ષ સંપાદિત કરો",
                  name: "નામ",
                  description: "વર્ણન",
                  public: "જાહેર",
                  saveChanges: "ફેરફારો સાચવો",
                },
                delete: {
                  title: "પરિવારનો વૃક્ષ કાઢી નાખો",
                  description:
                    "શું તમે ખરેખર આ પરિવારનો વૃક્ષ કાઢી નાખવા માંગો છો? આ બધા સભ્યો અને તેમની ફાઇલો પણ કાઢી નાખશે. આ ક્રિયા પાછી કરી શકાતી નથી.",
                  cancel: "રદ કરો",
                  delete: "કાઢી નાખો",
                },
                toasts: {
                  treeDeleted: "વૃક્ષ કાઢી નાખ્યું",
                  treeDeletedDescription:
                    "પરિવારનો વૃક્ષ સફળતાપૂર્વક કાઢી નાખ્યું.",
                  deleteFailed: "કાઢી નાખવામાં નિષ્ફળ",
                  deleteFailedDescription: "વૃક્ષ કાઢી નાખવામાં નિષ્ફળ.",
                  treeUpdated: "વૃક્ષ અપડેટ કર્યું",
                  treeUpdatedDescription:
                    "પરિવારનો વૃક્ષ સફળતાપૂર્વક અપડેટ કર્યું.",
                  updateFailed: "અપડેટ નિષ્ફળ",
                  updateFailedDescription: "વૃક્ષ અપડેટ કરવામાં નિષ્ફળ.",
                },
              },
              createTree: {
                title: "નવું પરિવારનું વૃક્ષ બનાવો",
                description:
                  "નવું પરિવારનું વૃક્ષ બનાવીને તમારા પરિવારના ઇતિહાસનું નિર્માણ શરૂ કરો.",
                form: {
                  name: "પરિવારના વૃક્ષનું નામ *",
                  namePlaceholder: "જેમ કે, સ્મિથ પરિવાર",
                  nameHelp: "તમારા પરિવારના વૃક્ષ માટે એક નામ પસંદ કરો",
                  description: "વર્ણન (વૈકલ્પિક)",
                  descriptionPlaceholder:
                    "તમારા પરિવારના વૃક્ષનું વર્ણન કરો...",
                  privacy: {
                    title: "ગોપનીયતા સેટિંગ્સ",
                    publicTree: "જાહેર વૃક્ષ",
                    privateTree: "ખાનગી વૃક્ષ",
                    publicDescription: "લિંક ધરાવતો કોઈપણ આ વૃક્ષ જોઈ શકે છે",
                    privateDescription: "માત્ર તમે જ આ વૃક્ષ જોઈ શકો છો",
                  },
                  buttons: {
                    cancel: "રદ કરો",
                    create: "પરિવારનું વૃક્ષ બનાવો",
                    creating: "બનાવી રહ્યા છીએ...",
                  },
                },
                errors: {
                  failedToCreate: "પરિવારનું વૃક્ષ બનાવવામાં નિષ્ફળ",
                },
              },
              familyTreeViewer: {
                loading: "પરિવારનું વૃક્ષ લોડ થઈ રહ્યું છે...",
                error: {
                  title: "પરિવારનું વૃક્ષ લોડ કરવામાં ભૂલ",
                  tryAgain: "ફરીથી પ્રયાસ કરો",
                },
                memberDetail: {
                  bio: "જીવનચરિત્ર:",
                  noBio: "કોઈ જીવનચરિત્ર ઉપલબ્ધ નથી.",
                  parents: "માતા-પિતા:",
                  children: "બાળકો:",
                  spouse: "પતિ/પત્ની:",
                  none: "કોઈ નથી",
                  editMember: "સભ્ય સંપાદિત કરો",
                  deleteMember: "સભ્ય કાઢી નાખો",
                  close: "બંધ કરો",
                  deleteDialog: {
                    title: "પરિવારના સભ્યને કાઢી નાખો",
                    description:
                      "શું તમે ખરેખર {firstName} {lastName} ને કાઢી નાખવા માંગો છો? આ ક્રિયા પૂર્વવત કરી શકાતી નથી અને આ સભ્ય સાથે જોડાયેલા બધા સંબંધોને પણ કાઢી નાખશે.",
                    cancel: "રદ કરો",
                    confirm: "સભ્ય કાઢી નાખો",
                  },
                },
                share: {
                  title: "આ વૃક્ષને શેર કરો",
                  copyLink: "લિંક કૉપી કરો",
                  copied: "કૉપી થઈ ગયું!",
                  shareVia: "આ દ્વારા શેર કરો",
                  anyoneWithLink: "આ લિંક ધરાવતો કોઈપણ આ વૃક્ષ જોઈ શકે છે.",
                },
                export: {
                  title: "પોસ્ટર તરીકે નિર્યાત કરો",
                  processing: "પ્રક્રિયા કરી રહ્યા છીએ...",
                  failed: "પોસ્ટર નિર્યાત કરવામાં નિષ્ફળ",
                },
                actions: {
                  share: "શેર કરો",
                  export: "પોસ્ટર તરીકે નિર્યાત કરો",
                },
              },
              addEditMember: {
                title: {
                  add: "પરિવારના સભ્યને ઉમેરો",
                  edit: "પરિવારના સભ્યને સંપાદિત કરો",
                },
                form: {
                  profileImage: "પ્રોફાઇલ છબી",
                  noImage: "કોઈ છબી નથી",
                  firstName: "પહેલું નામ",
                  firstNamePlaceholder: "પહેલું નામ દાખલ કરો",
                  lastName: "છેલ્લું નામ",
                  lastNamePlaceholder: "છેલ્લું નામ દાખલ કરો",
                  gender: "લિંગ",
                  male: "પુરુષ",
                  female: "સ્ત્રી",
                  other: "અન્ય",
                  birthDate: "જન્મ તારીખ",
                  pickDate: "તારીખ પસંદ કરો",
                  bio: "જીવનચરિત્ર",
                  bioPlaceholder: "પરિવારના સભ્યનું સંક્ષિપ્ત જીવનચરિત્ર.",
                  parents: "માતા-પિતા",
                  selectParent: "માતા-પિતા પસંદ કરો...",
                  children: "બાળકો",
                  selectChild: "બાળક પસંદ કરો...",
                  spouse: "પતિ/પત્ની",
                  husband: "પતિ",
                  selectSpouse: "પતિ/પત્ની પસંદ કરો...",
                  noSpouse: "કોઈ પતિ/પત્ની નથી",
                },
                validation: {
                  imageSize: "છબીનું કદ 8MB કરતાં ઓછું હોવું જોઈએ",
                  imageType: "કૃપા કરીને છબી ફાઇલ અપલોડ કરો",
                  uploadFailed: "છબી અપલોડ કરવામાં નિષ્ફળ",
                  updateFailed: "છબી સાથે સભ્ય અપડેટ કરવામાં નિષ્ફળ",
                },
                buttons: {
                  saveChanges: "ફેરફારો સાચવો",
                  addMember: "સભ્ય ઉમેરો",
                  close: "બંધ કરો",
                },
              },
            },
          },
        },
        ns: ["common"],
        defaultNS: "common",
        interpolation: {
          escapeValue: false,
        },
      });

      setIsInitialized(true);
    };

    initializeI18n();
  }, []);

  if (!isInitialized) {
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
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
