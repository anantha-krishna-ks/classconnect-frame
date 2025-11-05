import { Building2, School, Users, Package, BookOpen, BarChart3, LayoutDashboard } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/super-admin",
    description: "Overview & insights",
  },
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
    <aside className="w-48 h-screen flex flex-col border-r bg-super-admin-sidebar border-super-admin-border shadow-[2px_0_8px_hsl(var(--super-admin-shadow))]">
      {/* Header */}
      <div className="p-4 border-b border-super-admin-border">
        <h2 className="text-sm font-semibold text-super-admin-primary">
          Super Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group relative",
                isActive 
                  ? "font-medium shadow-sm border-l-2 bg-super-admin-accent-hover text-super-admin-primary border-super-admin-primary shadow-[0_1px_3px_hsl(var(--super-admin-shadow))]" 
                  : "text-muted-foreground hover:bg-super-admin-accent hover:text-super-admin-primary"
              )
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
            <div className="flex-1 min-w-0">
              <p className="truncate">{item.title}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-super-admin-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span>Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
