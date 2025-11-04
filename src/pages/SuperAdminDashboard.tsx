import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SuperAdminSidebar } from "@/components/super-admin/SuperAdminSidebar";
import { SuperAdminHeader } from "@/components/super-admin/SuperAdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, School, Users, Package, TrendingUp, Activity } from "lucide-react";

export default function SuperAdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+12 this month",
      icon: School,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Users",
      value: "45,231",
      change: "+2,341 this month",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Active Licenses",
      value: "892",
      change: "+45 this month",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SuperAdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {isRootPath ? (
            <div className="space-y-6">
              {/* Welcome section */}
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, Super Admin</h1>
                <p className="text-muted-foreground">
                  Here's an overview of your system performance and key metrics
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest system events and updates</CardDescription>
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
                          <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="font-medium">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      System Health
                    </CardTitle>
                    <CardDescription>Monitor system performance</CardDescription>
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
