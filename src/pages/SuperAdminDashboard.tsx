import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SuperAdminSidebar } from "@/components/super-admin/SuperAdminSidebar";
import { SuperAdminHeader } from "@/components/super-admin/SuperAdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, School, Users, Package, TrendingUp, Activity } from "lucide-react";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("superAdminAuth");
    if (!isAuthenticated) {
      navigate("/super-admin-login");
    }
  }, [navigate]);

  // Check if we're on the root dashboard path
  const isRootPath = location.pathname === "/super-admin" || location.pathname === "/super-admin/";

  const stats = [
    {
      title: "Total Organizations",
      value: "24",
      change: "+3 this month",
      icon: Building2,
      path: "/super-admin/organizations",
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+12 this month",
      icon: School,
      path: "/super-admin/schools",
    },
    {
      title: "Total Users",
      value: "45,231",
      change: "+2,341 this month",
      icon: Users,
      path: "/super-admin/users",
    },
    {
      title: "Active Licenses",
      value: "892",
      change: "+45 this month",
      icon: Package,
      path: "/super-admin/products",
    },
  ];

  return (
    <div className="super-admin-theme flex h-screen w-full overflow-hidden bg-super-admin-accent">
      <SuperAdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {isRootPath ? (
            <div className="space-y-6">
              {/* Welcome section */}
              <div>
                <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Overview of system performance and key metrics
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card 
                    key={stat.title}
                    className="transition-all hover:shadow-md bg-super-admin-card border-super-admin-border shadow-[0_1px_3px_hsl(var(--super-admin-shadow))] cursor-pointer hover:scale-105"
                    onClick={() => navigate(stat.path)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-normal text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-super-admin-accent">
                        <stat.icon className="w-4 h-4 text-super-admin-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="transition-all hover:shadow-md bg-super-admin-card border-super-admin-border shadow-[0_1px_3px_hsl(var(--super-admin-shadow))]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-super-admin-accent">
                        <TrendingUp className="w-4 h-4 text-super-admin-primary" />
                      </div>
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm">Latest system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { text: "New school 'Greenwood Academy' added", time: "2 hours ago" },
                        { text: "Bulk import completed: 245 students", time: "5 hours ago" },
                        { text: "License activated for 'Springfield High'", time: "1 day ago" },
                        { text: "Chapter PDFs uploaded for Grade 10", time: "2 days ago" },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          <div className="w-1.5 h-1.5 bg-super-admin-primary rounded-full mt-1.5" />
                          <div className="flex-1">
                            <p className="text-sm">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md bg-super-admin-card border-super-admin-border shadow-[0_1px_3px_hsl(var(--super-admin-shadow))]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center bg-super-admin-accent">
                        <Activity className="w-4 h-4 text-super-admin-primary" />
                      </div>
                      System Health
                    </CardTitle>
                    <CardDescription className="text-sm">System performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "API Response Time", value: "145ms", status: "good" },
                        { label: "Database Performance", value: "Optimal", status: "good" },
                        { label: "Storage Usage", value: "67%", status: "warning" },
                        { label: "Active Sessions", value: "1,234", status: "good" },
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{metric.value}</span>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                metric.status === "good"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
