import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Package, Activity, Clock } from "lucide-react";

export default function Analytics() {
  const metrics = [
    {
      title: "Monthly Active Users",
      value: "42,351",
      change: "+12.5%",
      icon: Users,
    },
    {
      title: "Total Lesson Plans",
      value: "8,942",
      change: "+18.2%",
      icon: Activity,
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+7.7%",
      icon: School,
    },
    {
      title: "License Utilization",
      value: "87.3%",
      change: "+4.1%",
      icon: Package,
    },
  ];

  const topSchools = [
    { name: "Lincoln High School", users: 1245, engagement: 94 },
    { name: "Roosevelt Middle School", users: 856, engagement: 91 },
    { name: "Washington Academy", users: 742, engagement: 88 },
    { name: "Jefferson Elementary", users: 542, engagement: 85 },
    { name: "Madison High School", users: 489, engagement: 82 },
  ];

  const recentActivity = [
    { action: "New school onboarded", school: "Greenwood Academy", time: "2 hours ago" },
    { action: "License renewed", school: "Lincoln High School", time: "5 hours ago" },
    { action: "Bulk import completed", school: "Roosevelt Middle", time: "1 day ago" },
    { action: "Tool activated", school: "Jefferson Elementary", time: "2 days ago" },
    { action: "Chapter PDFs uploaded", school: "Washington Academy", time: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor system usage, performance, and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-none shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <metric.icon className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{metric.value}</div>
              <p className="text-xs text-success mt-1">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Schools */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Performing Schools</CardTitle>
            <CardDescription className="text-sm">Schools ranked by user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSchools.map((school, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{school.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {school.users} active users
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{school.engagement}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent System Activity</CardTitle>
            <CardDescription className="text-sm">Latest events across all schools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 border-b last:border-0">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.school} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tool Usage */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tool Usage Statistics</CardTitle>
            <CardDescription className="text-sm">Most used features this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { tool: "Lesson Plan Assistant", usage: 5420, percentage: 92 },
                { tool: "Assessment Creator", usage: 3840, percentage: 78 },
                { tool: "Exam Prep Room", usage: 2910, percentage: 65 },
                { tool: "Slide Generator", usage: 2340, percentage: 54 },
                { tool: "Resource Vault", usage: 1850, percentage: 42 },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.tool}</span>
                    <span className="text-muted-foreground">{item.usage} uses</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">System Health Monitoring</CardTitle>
            <CardDescription className="text-sm">Real-time system performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { metric: "API Response Time", value: "142ms", status: "excellent" },
                { metric: "Database Query Time", value: "38ms", status: "excellent" },
                { metric: "Server CPU Usage", value: "34%", status: "good" },
                { metric: "Memory Usage", value: "58%", status: "good" },
                { metric: "Storage Usage", value: "67%", status: "warning" },
                { metric: "Active Connections", value: "1,234", status: "good" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm text-muted-foreground">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.value}</span>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "excellent"
                          ? "bg-success"
                          : item.status === "good"
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
  );
}
