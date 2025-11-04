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

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {isRootPath ? (
            <div className="space-y-6">
              {/* Welcome section */}
              <div className="border-l-4 border-primary pl-4">
                <h1 className="text-2xl font-semibold mb-1 text-primary">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Overview of system performance and key metrics
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <Card key={stat.title} className="group shadow-sm hover:shadow-lg transition-all duration-300 border-l-2 border-l-primary/20 hover:border-l-primary cursor-pointer hover:-translate-y-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
                        {stat.title}
                      </CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <stat.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                      <p className="text-xs text-success mt-1">{stat.change}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-base text-primary">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-primary" />
                      </div>
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-sm">Latest system events</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[
                        { text: "New school 'Greenwood Academy' added", time: "2 hours ago" },
                        { text: "Bulk import completed: 245 students", time: "5 hours ago" },
                        { text: "License activated for 'Springfield High'", time: "1 day ago" },
                        { text: "Chapter PDFs uploaded for Grade 10", time: "2 days ago" },
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-primary/5 hover:border-l-2 hover:border-primary cursor-pointer transition-all duration-200">
                          <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shadow-sm" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.text}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-base text-primary">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      System Health
                    </CardTitle>
                    <CardDescription className="text-sm">System performance</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {[
                        { label: "API Response Time", value: "145ms", status: "good" },
                        { label: "Database Performance", value: "Optimal", status: "good" },
                        { label: "Storage Usage", value: "67%", status: "warning" },
                        { label: "Active Sessions", value: "1,234", status: "good" },
                      ].map((metric, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-primary/5 hover:border-l-2 hover:border-primary cursor-pointer transition-all duration-200">
                          <span className="text-muted-foreground font-medium hover:text-foreground transition-colors">{metric.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{metric.value}</span>
                            <div
                              className={`w-2 h-2 rounded-full shadow-sm ${
                                metric.status === "good"
                                  ? "bg-success"
                                  : "bg-warning"
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
