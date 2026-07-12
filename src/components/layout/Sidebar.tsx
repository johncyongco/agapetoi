import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Shield,
  Heart,
  BookOpen,
  Eye,
  User,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/stores/ui-store";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/weaknesses", icon: Shield, label: "Weaknesses" },
  { to: "/virtues", icon: Heart, label: "Virtues" },
  { to: "/journal", icon: BookOpen, label: "Journal" },
  { to: "/insights", icon: Eye, label: "Insights" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-56 bg-paper border-r border-border flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 pt-8 pb-6">
          <h1 className="font-heading text-xl text-text tracking-tight leading-none">
            Agapetoi
          </h1>
          <p className="text-editorial-xs text-text-secondary mt-0.5 tracking-wider">
            Beloved
          </p>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-6 right-4 p-1 text-text-secondary hover:text-text lg:hidden"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <hr className="editorial-rule mx-6" />

        <nav className="flex-1 px-3 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-200 mb-0.5 ${
                  isActive
                    ? "text-text font-medium"
                    : "text-text-secondary hover:text-text"
                }`}
              >
                <Icon size={16} strokeWidth={2.2} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 pb-6">
          <hr className="editorial-rule mb-4" />
          <p className="text-editorial-xs text-text-secondary opacity-50">
            v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
