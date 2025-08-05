import { Home } from "lucide-react";
import { Icons } from "@/components/icons";
import { NavBar } from "./TubeLightNav";

export function HomeNavBar() {
  const navItems = [
    { name: "Home", url: "#", icon: Home, isAuth: false },
    { name: "About", url: "#about", icon: Icons.badgeInfo, isAuth: false },
    { name: "Contact", url: "#cta", icon: Icons.mail, isAuth: false },
  ];

  return (
    <div className="relative">
      <NavBar items={navItems} showThemeToggle showLanguageSwitcher />
    </div>
  );
}
