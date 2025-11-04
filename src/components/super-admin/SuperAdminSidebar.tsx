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
    <aside className="w-48 h-screen bg-sidebar-background text-sidebar-foreground flex flex-col border-r border-sidebar-border shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-accent/30">
        <h2 className="text-sm font-semibold text-primary">
          Super Admin
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm group relative",
                "hover:bg-accent/50 hover:translate-x-0.5 hover:shadow-sm",
                isActive 
                  ? "bg-primary text-primary-foreground font-medium shadow-md" 
                  : "text-muted-foreground hover:text-foreground"
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
      <div className="p-3 border-t border-sidebar-border bg-accent/30">
        <div className="text-xs text-muted-foreground space-y-1 p-2 rounded-lg bg-success/5">
          <p className="font-medium">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse shadow-sm shadow-success" />
            <span className="text-success">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
