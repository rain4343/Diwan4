import React from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Users, Building2, ShieldCheck, Menu, LogOut,
  FileText, UserCircle, ChevronLeft, MessageCircle, BarChart3, AlarmClock,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { hasModuleAccess } from "@/lib/usePermission";

const ku: React.CSSProperties = { fontFamily: "'Noto Kufi Arabic', sans-serif" };

const navItems = [
  { icon: LayoutDashboard, label: "داشبۆرد",      href: "/",            accent: "text-blue-400",    activeBg: "bg-blue-600"   },
  { icon: FileText,        label: "نوسراوەکان",    href: "/documents",   accent: "text-amber-400",   activeBg: "bg-amber-600",   module: "documents"   },
  { icon: Users,           label: "فەرمانبەران",   href: "/staff",       accent: "text-blue-400",    activeBg: "bg-blue-600",    module: "users"       },
  { icon: Building2,       label: "هۆبەکان",       href: "/departments", accent: "text-emerald-400", activeBg: "bg-emerald-600", module: "departments" },
  { icon: BarChart3,       label: "ڕاپۆرتەکان",    href: "/reports",     accent: "text-indigo-400",  activeBg: "bg-indigo-600",  module: "reports"     },
  { icon: AlarmClock,      label: "مۆڵەتەکان",     href: "/leaves",      accent: "text-emerald-400", activeBg: "bg-emerald-600", module: "cases"       },
  { icon: MessageCircle,   label: "چات",            href: "/chat",        accent: "text-sky-400",     activeBg: "bg-sky-600"    },
  { icon: UserCircle,      label: "پڕۆفایلی من",   href: "/profile",     accent: "text-slate-300",   activeBg: "bg-slate-600"  },
];

const adminNavItems = [
  { icon: ShieldCheck, label: "بەڕێوەبەری سیستەم", href: "/admin", accent: "text-violet-400", activeBg: "bg-violet-600" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  function initials(name: string) {
    return name.trim().split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  }

  // Show a nav item if it has no module requirement OR the user has access to that module
  const visibleNavItems = navItems.filter(item =>
    !item.module || hasModuleAccess(user, item.module)
  );
  const allNavItems = user?.is_system_admin
    ? [...visibleNavItems, ...adminNavItems]
    : visibleNavItems;

  const SidebarContent = () => (
    <div className="flex h-full flex-col" dir="rtl" style={{ background: "linear-gradient(180deg, #0f172a 0%, #1a2744 100%)" }}>
      {/* Brand */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md p-0.5">
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="لۆگۆ" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-base font-extrabold" style={{ ...ku, color: '#22c55e' }}>ب.پ.شارباژێڕ</h2>
            <p className="text-sm font-extrabold mt-0.5" style={{ ...ku, color: '#38bdf8' }}>E-Diwan</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {allNavItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? `${item.activeBg} text-white shadow-sm`
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
              style={ku}
            >
              <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : item.accent}`} />
              {item.label}
              {isActive && <ChevronLeft className="h-3 w-3 mr-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-3 border-t border-white/5">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1 rounded-lg bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials(user.full_name || user.username)}
            </div>
            <div className="flex-1 min-w-0" dir="rtl">
              <p className="text-sm font-medium text-white truncate" style={ku}>{user.full_name || user.username}</p>
              <p className="text-xs text-slate-400 truncate" style={ku}>
                {user.is_system_admin ? "بەڕێوەبەری سەرەکی" : user.roles[0] ?? "فەرمانبەر"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          style={ku}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          چوونەدەرەوە
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background flex-row-reverse">
      {/* Desktop sidebar — right side for RTL */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar — opens from the right */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-3 left-3 z-50 bg-slate-900 text-white hover:bg-slate-800">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0 border-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto" dir="rtl">
          {children}
        </div>
      </main>
    </div>
  );
}
