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
        "h-screen bg-gradient-to-b from-purple-900 to-indigo-900 text-white transition-all duration-300 flex flex-col border-r border-purple-700/50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-purple-700/50">
        {!collapsed && (
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Super Admin
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-purple-200 hover:text-white hover:bg-purple-800/50"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                "hover:bg-purple-800/50",
                isActive && "bg-purple-800/70 shadow-lg"
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-purple-300 truncate">{item.description}</p>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-purple-700/50">
        {!collapsed && (
          <div className="text-xs text-purple-300 space-y-1">
            <p className="font-medium text-purple-200">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
