import { Home, User } from "lucide-react";
import { NavBar } from "./TubeLightNav";

export function HomeNavBar() {
  const navItems = [
    { name: "Home", url: "#", icon: Home, isAuth: false },
    { name: "About", url: "#about", icon: User, isAuth: false },
    { name: "Contact", url: "#cta", icon: User, isAuth: false },
  ];

  return (
    <div className="relative">
      <NavBar items={navItems} showThemeToggle />
    </div>
  );
}
