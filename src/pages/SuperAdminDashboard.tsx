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
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+12 this month",
      icon: School,
    },
    {
      title: "Total Users",
      value: "45,231",
      change: "+2,341 this month",
      icon: Users,
    },
    {
      title: "Active Licenses",
      value: "892",
      change: "+45 this month",
      icon: Package,
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SuperAdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />

        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-background via-accent/10 to-background">
          {isRootPath ? (
            <div className="space-y-6">
              {/* Welcome section */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Overview of system performance and key metrics
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <Card 
                    key={stat.title}
                    className="relative overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm">Latest system events</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[
                        { text: "New school 'Greenwood Academy' added", time: "2 hours ago", color: "from-green-500 to-emerald-500" },
                        { text: "Bulk import completed: 245 students", time: "5 hours ago", color: "from-blue-500 to-cyan-500" },
                        { text: "License activated for 'Springfield High'", time: "1 day ago", color: "from-purple-500 to-pink-500" },
                        { text: "Chapter PDFs uploaded for Grade 10", time: "2 days ago", color: "from-orange-500 to-amber-500" },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm p-3 rounded-lg hover:bg-accent/50 transition-colors group">
                          <div className={`w-2 h-2 bg-gradient-to-r ${activity.color} rounded-full mt-2 animate-pulse`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10 hover:border-primary/20 transition-colors">
                  <CardHeader className="bg-gradient-to-br from-green-500/10 to-transparent pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-white" />
                      </div>
                      System Health
                    </CardTitle>
                    <CardDescription className="text-sm">System performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[
                        { label: "API Response Time", value: "145ms", status: "good", progress: 85 },
                        { label: "Database Performance", value: "Optimal", status: "good", progress: 95 },
                        { label: "Storage Usage", value: "67%", status: "warning", progress: 67 },
                        { label: "Active Sessions", value: "1,234", status: "good", progress: 78 },
                      ].map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">{metric.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{metric.value}</span>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  metric.status === "good"
                                    ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                    : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                                } animate-pulse`}
                              />
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-1.5 rounded-full transition-all duration-1000 ${
                                metric.status === "good"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : "bg-gradient-to-r from-yellow-500 to-amber-500"
                              }`}
                              style={{ width: `${metric.progress}%` }}
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
