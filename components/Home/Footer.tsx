"use client";

import {
  TreePine,
  Github,
  Twitter,
  Facebook,
  Instagram,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { toast } = useToast();
  const { t } = useTranslation("common");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const socialLinks = [
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com/familytreeexplorer",
      label: "Twitter",
    },
    {
      icon: <Facebook className="h-5 w-5" />,
      href: "https://facebook.com/familytreeexplorer",
      label: "Facebook",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://instagram.com/familytreeexplorer",
      label: "Instagram",
    },
  ];

  const mainLinks = [
    { href: "#features", label: t("homepage.footer.links.features") },
    { href: "#about", label: t("homepage.footer.links.about") },
    { href: "/auth/signin", label: t("homepage.footer.links.login") },
    { href: "/auth/signup", label: t("homepage.footer.links.register") },
  ];

  const legalLinks = [
    { href: "/privacy", label: t("homepage.footer.links.privacy") },
    { href: "/terms", label: t("homepage.footer.links.terms") },
    { href: "/contact", label: t("homepage.footer.links.contact") },
  ];

  const contactInfo = [
    {
      icon: <Icons.mail className="h-5 w-5" />,
      label: "Email",
      value: "contact@familytreeexplorer.com",
      href: "mailto:contact@familytreeexplorer.com",
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Address",
      value: "123 Family Tree Lane, Heritage City, HC 12345",
      href: "#",
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName.trim())
      errors.push(
        t("homepage.footer.contact.form.validation.firstNameRequired")
      );
    if (!formData.lastName.trim())
      errors.push(
        t("homepage.footer.contact.form.validation.lastNameRequired")
      );
    if (!formData.email.trim())
      errors.push(t("homepage.footer.contact.form.validation.emailRequired"));
    if (!formData.subject.trim())
      errors.push(t("homepage.footer.contact.form.validation.subjectRequired"));
    if (!formData.message.trim())
      errors.push(t("homepage.footer.contact.form.validation.messageRequired"));

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push(t("homepage.footer.contact.form.validation.invalidEmail"));
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("homepage.footer.contact.form.success"),
          description: data.message,
        });

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || t("homepage.footer.contact.form.error"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast({
        title: "Error",
        description: t("homepage.footer.contact.form.networkError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="pb-6 pt-16 lg:pb-8 lg:pt-24 bg-gray-50 dark:bg-gray-900">
      <div className="px-4 lg:px-8">
        {/* Contact Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {t("homepage.footer.contact.title")}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md">
                {t("homepage.footer.contact.description")}
              </p>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-1 p-2 bg-primary/10 rounded-lg">
                      {info.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{info.label}</p>
                      <a
                        href={info.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-2xl font-bold mb-6">
                {t("homepage.footer.contact.form.title")}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("homepage.footer.contact.form.firstName")}
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder={t(
                        "homepage.footer.contact.form.firstNamePlaceholder"
                      )}
                      className="w-full"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("homepage.footer.contact.form.lastName")}
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder={t(
                        "homepage.footer.contact.form.lastNamePlaceholder"
                      )}
                      className="w-full"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("homepage.footer.contact.form.email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t(
                      "homepage.footer.contact.form.emailPlaceholder"
                    )}
                    className="w-full"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("homepage.footer.contact.form.subject")}
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder={t(
                      "homepage.footer.contact.form.subjectPlaceholder"
                    )}
                    className="w-full"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("homepage.footer.contact.form.message")}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t(
                      "homepage.footer.contact.form.messagePlaceholder"
                    )}
                    className="w-full min-h-[120px]"
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("homepage.footer.contact.form.sending")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t("homepage.footer.contact.form.sendButton")}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="md:flex md:items-start md:justify-between">
          <a
            href="/"
            className="flex items-center gap-x-2"
            aria-label="Durga Dham Family Tree Explorer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/logo.jpg"
                height={120}
                width={120}
                alt="Durga Dham Family tree"
              />
            </div>
            <span className="font-bold text-xl">
              Durga Dham Family Tree Explorer
            </span>
          </a>
          <ul className="flex list-none mt-6 md:mt-0 space-x-3">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  asChild
                >
                  <a href={link.href} target="_blank" aria-label={link.label}>
                    {link.icon}
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t mt-6 pt-6 md:mt-4 md:pt-8 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 text-sm leading-6 text-muted-foreground whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>
              © {new Date().getFullYear()} {t("homepage.footer.copyright")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
