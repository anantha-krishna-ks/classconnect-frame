import { Building2, School, Users, Package, BookOpen, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuperAdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

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

export function SuperAdminSidebar({ collapsed, onToggle }: SuperAdminSidebarProps) {
  return (
    <aside
      className={cn(
        "h-screen bg-sidebar-background text-sidebar-foreground transition-all duration-300 flex flex-col border-r border-sidebar-border",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <h2 className="text-sm font-semibold text-sidebar-primary">
            Super Admin
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent font-medium"
              )
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate">{item.title}</p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>Operational</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
