import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Package, Activity, Clock, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export default function Analytics() {
  const metrics = [
    {
      title: "Monthly Active Users",
      value: "42,351",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Lesson Plans",
      value: "8,942",
      change: "+18.2%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Active Schools",
      value: "156",
      change: "+7.7%",
      trend: "up",
      icon: School,
    },
    {
      title: "License Utilization",
      value: "87.3%",
      change: "+4.1%",
      trend: "up",
      icon: Package,
    },
  ];

  // User growth data over 12 months
  const userGrowthData = [
    { month: "Jan", students: 32400, teachers: 2100, total: 34500 },
    { month: "Feb", students: 33200, teachers: 2150, total: 35350 },
    { month: "Mar", students: 34100, teachers: 2200, total: 36300 },
    { month: "Apr", students: 35300, teachers: 2280, total: 37580 },
    { month: "May", students: 36800, teachers: 2350, total: 39150 },
    { month: "Jun", students: 37500, teachers: 2400, total: 39900 },
    { month: "Jul", students: 38200, teachers: 2450, total: 40650 },
    { month: "Aug", students: 39100, teachers: 2520, total: 41620 },
    { month: "Sep", students: 39800, teachers: 2580, total: 42380 },
    { month: "Oct", students: 40200, teachers: 2610, total: 42810 },
    { month: "Nov", students: 40800, teachers: 2650, total: 43450 },
    { month: "Dec", students: 41500, teachers: 2700, total: 44200 },
  ];

  // Tool adoption rate by schools
  const toolAdoptionData = [
    { tool: "Lesson Plan", schools: 142, rate: 91 },
    { tool: "Assessment", schools: 128, rate: 82 },
    { tool: "Slide Gen", schools: 119, rate: 76 },
    { tool: "Exam Prep", schools: 105, rate: 67 },
    { tool: "Video Editor", schools: 98, rate: 63 },
    { tool: "Resource Vault", schools: 89, rate: 57 },
    { tool: "Quiz Creator", schools: 82, rate: 53 },
  ];

  // User distribution by type
  const userDistributionData = [
    { name: "Students", value: 41500, color: "#3b82f6" },
    { name: "Teachers", value: 2700, color: "#8b5cf6" },
    { name: "Admins", value: 151, color: "#10b981" },
  ];

  // School engagement by organization type
  const schoolEngagementData = [
    { type: "Public", engagement: 85, schools: 89 },
    { type: "Private", engagement: 92, schools: 45 },
    { type: "Charter", engagement: 78, schools: 22 },
  ];

  // Monthly content generation
  const contentGenerationData = [
    { month: "Jan", lessonPlans: 620, assessments: 340, slides: 280 },
    { month: "Feb", lessonPlans: 680, assessments: 380, slides: 310 },
    { month: "Mar", lessonPlans: 740, assessments: 420, slides: 350 },
    { month: "Apr", lessonPlans: 810, assessments: 460, slides: 390 },
    { month: "May", lessonPlans: 890, assessments: 510, slides: 430 },
    { month: "Jun", lessonPlans: 920, assessments: 540, slides: 460 },
    { month: "Jul", lessonPlans: 850, assessments: 490, slides: 420 },
    { month: "Aug", lessonPlans: 980, assessments: 580, slides: 510 },
    { month: "Sep", lessonPlans: 1050, assessments: 620, slides: 550 },
    { month: "Oct", lessonPlans: 1120, assessments: 660, slides: 590 },
    { month: "Nov", lessonPlans: 1180, assessments: 710, slides: 630 },
    { month: "Dec", lessonPlans: 1240, assessments: 750, slides: 670 },
  ];

  // Feature usage comparison
  const featureUsageData = [
    { feature: "AI Generation", value: 95 },
    { feature: "Collaboration", value: 78 },
    { feature: "Analytics", value: 82 },
    { feature: "Assessment", value: 88 },
    { feature: "Content Library", value: 72 },
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

  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor system usage, performance, and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-normal text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <metric.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <TrendIcon className={`w-3 h-3 ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                  <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* User Growth Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Student and teacher growth over the past 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorStudents)" 
                  name="Students"
                />
                <Area 
                  type="monotone" 
                  dataKey="teachers" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorTeachers)" 
                  name="Teachers"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tool Adoption Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Tool Adoption by Schools</CardTitle>
            <CardDescription>Number of schools using each tool</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toolAdoptionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="tool" type="category" className="text-xs" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="schools" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Schools" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by role across all schools</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Generation Trends */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Content Generation Trends</CardTitle>
            <CardDescription>Monthly content created by users across all tools</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={contentGenerationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="lessonPlans" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Lesson Plans"
                />
                <Line 
                  type="monotone" 
                  dataKey="assessments" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Assessments"
                />
                <Line 
                  type="monotone" 
                  dataKey="slides" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Slides"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Feature Usage Radar */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Analysis</CardTitle>
            <CardDescription>Platform feature adoption rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={featureUsageData}>
                <PolarGrid className="stroke-muted" />
                <PolarAngleAxis dataKey="feature" className="text-xs" />
                <PolarRadiusAxis className="text-xs" angle={90} domain={[0, 100]} />
                <Radar 
                  name="Usage %" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6} 
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* School Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>School Engagement by Type</CardTitle>
            <CardDescription>Average engagement rates by organization type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schoolEngagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="type" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="engagement" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Schools */}
        <Card>
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
        <Card>
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
        <Card>
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
        <Card>
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
                          ? "bg-green-500"
                          : item.status === "good"
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
  );
}
