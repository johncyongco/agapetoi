import { NavLink, useLocation } from "react-router-dom";
import { Home, Shield, Heart, BookOpen, Eye, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/weaknesses", icon: Shield, label: "Weaknesses" },
  { to: "/virtues", icon: Heart, label: "Virtues" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/insights", icon: Eye, label: "Insights" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-paper/90 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around max-w-lg mx-auto h-[70px] px-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 py-1.5 min-w-[53px]"
            >
              <Icon
                size={22}
                strokeWidth={2.2}
                className={`transition-colors duration-200 ${
                  isActive ? "text-text" : "text-text-secondary"
                }`}
              />
              <span
                className={`text-[11px] tracking-tight transition-colors duration-200 ${
                  isActive ? "text-text" : "text-text-secondary"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-text"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
