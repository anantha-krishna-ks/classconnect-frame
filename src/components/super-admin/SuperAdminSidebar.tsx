import { Building2, School, Users, Package, BookOpen, BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Organizations",
    icon: Building2,
    path: "/super-admin/organizations",
    description: "Manage customer organizations",
  },
  {
    title: "Schools",
    icon: School,
    path: "/super-admin/schools",
    description: "School management",
  },
  {
    title: "Users",
    icon: Users,
    path: "/super-admin/users",
    description: "Student & teacher management",
  },
  {
    title: "Products",
    icon: Package,
    path: "/super-admin/products",
    description: "License & tool assignment",
  },
  {
    title: "Chapters",
    icon: BookOpen,
    path: "/super-admin/chapters",
    description: "AI training & content",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/super-admin/analytics",
    description: "Usage & performance",
  },
];

export function SuperAdminSidebar() {
  return (
    <aside className="w-48 h-screen bg-sidebar-background text-sidebar-foreground flex flex-col border-r border-sidebar-border/50 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar-primary/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border/50 relative z-10">
        <h2 className="text-sm font-bold bg-gradient-to-r from-sidebar-primary to-sidebar-accent-foreground bg-clip-text text-transparent">
          Super Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto relative z-10">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group relative overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-sidebar-accent to-sidebar-accent/70 text-sidebar-accent-foreground font-semibold shadow-lg border-l-2 border-sidebar-primary" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/10 to-transparent animate-pulse" />
                )}
                <item.icon className={cn(
                  "w-4 h-4 flex-shrink-0 transition-all relative z-10",
                  isActive ? "text-sidebar-primary scale-110" : "group-hover:scale-110"
                )} />
                <div className="flex-1 min-w-0 relative z-10">
                  <p className="truncate">{item.title}</p>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border/50 relative z-10">
        <div className="bg-sidebar-accent/30 rounded-lg p-2 backdrop-blur-sm">
          <p className="text-xs font-semibold text-sidebar-foreground mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-xs text-sidebar-foreground/80">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
