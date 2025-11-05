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
    <aside 
      className="w-48 h-screen flex flex-col border-r"
      style={{ 
        backgroundColor: 'hsl(var(--super-admin-sidebar))',
        borderColor: 'hsl(var(--super-admin-border))',
        boxShadow: '2px 0 8px hsl(var(--super-admin-shadow))'
      }}
    >
      {/* Header */}
      <div 
        className="p-4 border-b"
        style={{ borderColor: 'hsl(var(--super-admin-border))' }}
      >
        <h2 
          className="text-sm font-semibold"
          style={{ color: 'hsl(var(--super-admin-primary))' }}
        >
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
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group relative",
                isActive 
                  ? "font-medium shadow-sm border-l-2" 
                  : "text-muted-foreground"
              )
            }
            style={({ isActive }) => 
              isActive
                ? {
                    backgroundColor: 'hsl(var(--super-admin-accent-hover))',
                    color: 'hsl(var(--super-admin-primary))',
                    borderColor: 'hsl(var(--super-admin-primary))',
                    boxShadow: '0 1px 3px hsl(var(--super-admin-shadow))'
                  }
                : {}
            }
            onMouseEnter={(e) => {
              if (!e.currentTarget.classList.contains('font-medium')) {
                e.currentTarget.style.backgroundColor = 'hsl(var(--super-admin-accent))';
                e.currentTarget.style.color = 'hsl(var(--super-admin-primary))';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.classList.contains('font-medium')) {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.color = '';
              }
            }}
          >
            <item.icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
            <div className="flex-1 min-w-0">
              <p className="truncate">{item.title}</p>
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div 
        className="p-3 border-t"
        style={{ borderColor: 'hsl(var(--super-admin-border))' }}
      >
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
