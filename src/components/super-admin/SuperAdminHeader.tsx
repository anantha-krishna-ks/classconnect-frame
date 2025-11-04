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
    <header className="h-14 bg-gradient-to-r from-card via-card to-accent/20 border-b border-primary/10 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          SarasSchool AI
        </h1>
        <span className="text-xs font-semibold text-primary px-2.5 py-1 bg-primary/10 rounded-md border border-primary/20">
          Super Admin
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 hover:text-primary">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
          <Settings className="w-5 h-5" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 hover:bg-primary/10">
              <Avatar className="w-7 h-7 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary-glow text-white text-xs font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">Super Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-primary/10">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/10">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
