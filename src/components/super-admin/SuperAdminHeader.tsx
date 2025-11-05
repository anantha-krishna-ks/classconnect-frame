import { Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function SuperAdminHeader() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("superAdminAuth");
    localStorage.removeItem("superAdminRemember");
    toast({
      title: "Logged out",
      description: "You have been securely logged out",
    });
    navigate("/super-admin-login");
  };

  return (
    <header 
      className="h-14 border-b flex items-center justify-between px-6"
      style={{ 
        backgroundColor: 'hsl(var(--super-admin-card))',
        borderColor: 'hsl(var(--super-admin-border))',
        boxShadow: '0 2px 4px hsl(var(--super-admin-shadow))'
      }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">
          SarasSchool AI
        </h1>
        <span 
          className="text-xs px-2 py-0.5 rounded font-medium"
          style={{ 
            backgroundColor: 'hsl(var(--super-admin-accent))',
            color: 'hsl(var(--super-admin-primary))'
          }}
        >
          Super Admin
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="w-7 h-7">
                <AvatarFallback 
                  className="text-xs"
                  style={{ 
                    backgroundColor: 'hsl(var(--super-admin-primary))',
                    color: 'hsl(var(--super-admin-primary-foreground))'
                  }}
                >
                  SA
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm">Super Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
