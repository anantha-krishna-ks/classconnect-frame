import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, School, Package, Activity, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Analytics() {
  const metrics = [
    {
      title: "Monthly Active Users",
      value: "42,351",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Lesson Plans",
      value: "8,942",
      change: "+18.2%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+7.7%",
      trend: "up",
      icon: School,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "License Utilization",
      value: "87.3%",
      change: "+4.1%",
      trend: "up",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
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
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">
          Monitor system usage, performance, and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Schools */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Schools</CardTitle>
            <CardDescription>Schools ranked by user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSchools.map((school, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {school.users} active users
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{school.engagement}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest events across all schools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Statistics</CardTitle>
            <CardDescription>Most used features this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health Monitoring</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: "API Response Time", value: "142ms", status: "excellent" },
                { metric: "Database Query Time", value: "38ms", status: "excellent" },
                { metric: "Server CPU Usage", value: "34%", status: "good" },
                { metric: "Memory Usage", value: "58%", status: "good" },
                { metric: "Storage Usage", value: "67%", status: "warning" },
                { metric: "Active Connections", value: "1,234", status: "good" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{item.value}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.status === "excellent"
                          ? "bg-green-500"
                          : item.status === "good"
                          ? "bg-blue-500"
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
  );
}
