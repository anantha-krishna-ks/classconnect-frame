import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, School, Package, Activity, Clock, TrendingUp, TrendingDown, Calendar } from "lucide-react";
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
  ComposedChart,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Analytics() {
  const [timeFrame, setTimeFrame] = useState("12months");

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

  // Monthly content generation (all tools)
  const contentGenerationData = [
    { month: "Jan", lessonPlans: 620, assessments: 340, slides: 280, quizzes: 210, videos: 180, resources: 150 },
    { month: "Feb", lessonPlans: 680, assessments: 380, slides: 310, quizzes: 230, videos: 195, resources: 165 },
    { month: "Mar", lessonPlans: 740, assessments: 420, slides: 350, quizzes: 260, videos: 215, resources: 180 },
    { month: "Apr", lessonPlans: 810, assessments: 460, slides: 390, quizzes: 290, videos: 240, resources: 200 },
    { month: "May", lessonPlans: 890, assessments: 510, slides: 430, quizzes: 320, videos: 265, resources: 220 },
    { month: "Jun", lessonPlans: 920, assessments: 540, slides: 460, quizzes: 340, videos: 280, resources: 235 },
    { month: "Jul", lessonPlans: 850, assessments: 490, slides: 420, quizzes: 310, videos: 255, resources: 215 },
    { month: "Aug", lessonPlans: 980, assessments: 580, slides: 510, quizzes: 370, videos: 305, resources: 260 },
    { month: "Sep", lessonPlans: 1050, assessments: 620, slides: 550, quizzes: 400, videos: 330, resources: 280 },
    { month: "Oct", lessonPlans: 1120, assessments: 660, slides: 590, quizzes: 430, videos: 355, resources: 300 },
    { month: "Nov", lessonPlans: 1180, assessments: 710, slides: 630, quizzes: 460, videos: 380, resources: 320 },
    { month: "Dec", lessonPlans: 1240, assessments: 750, slides: 670, quizzes: 490, videos: 405, resources: 340 },
  ];

  // Peak usage hours (showing when users are most active)
  const peakUsageData = [
    { hour: "12 AM", students: 120, teachers: 15 },
    { hour: "3 AM", students: 80, teachers: 10 },
    { hour: "6 AM", students: 450, teachers: 85 },
    { hour: "9 AM", students: 3200, teachers: 520 },
    { hour: "12 PM", students: 2800, teachers: 380 },
    { hour: "3 PM", students: 4100, teachers: 450 },
    { hour: "6 PM", students: 3500, teachers: 280 },
    { hour: "9 PM", students: 1800, teachers: 180 },
  ];

  // Revenue & License data
  const revenueData = [
    { month: "Jan", revenue: 125000, newLicenses: 12, renewals: 8 },
    { month: "Feb", revenue: 132000, newLicenses: 14, renewals: 10 },
    { month: "Mar", revenue: 148000, newLicenses: 18, renewals: 9 },
    { month: "Apr", revenue: 155000, newLicenses: 15, renewals: 12 },
    { month: "May", revenue: 168000, newLicenses: 20, renewals: 11 },
    { month: "Jun", revenue: 172000, newLicenses: 19, renewals: 13 },
    { month: "Jul", revenue: 145000, newLicenses: 11, renewals: 14 },
    { month: "Aug", revenue: 185000, newLicenses: 22, renewals: 15 },
    { month: "Sep", revenue: 195000, newLicenses: 24, renewals: 16 },
    { month: "Oct", revenue: 202000, newLicenses: 21, renewals: 18 },
    { month: "Nov", revenue: 215000, newLicenses: 25, renewals: 17 },
    { month: "Dec", revenue: 228000, newLicenses: 28, renewals: 19 },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor system usage, performance, and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <CardDescription>Monthly content created across all tools (stacked view)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={contentGenerationData}>
                <defs>
                  <linearGradient id="colorLessonPlans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorSlides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="lessonPlans" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="url(#colorLessonPlans)" 
                  name="Lesson Plans"
                />
                <Area 
                  type="monotone" 
                  dataKey="assessments" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="url(#colorAssessments)" 
                  name="Assessments"
                />
                <Area 
                  type="monotone" 
                  dataKey="slides" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="url(#colorSlides)" 
                  name="Slides"
                />
                <Area 
                  type="monotone" 
                  dataKey="quizzes" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="url(#colorQuizzes)" 
                  name="Quizzes"
                />
                <Area 
                  type="monotone" 
                  dataKey="videos" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="url(#colorVideos)" 
                  name="Videos"
                />
                <Area 
                  type="monotone" 
                  dataKey="resources" 
                  stackId="1"
                  stroke="#ec4899" 
                  fill="url(#colorResources)" 
                  name="Resources"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Peak Usage Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Usage Hours</CardTitle>
            <CardDescription>User activity distribution throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={peakUsageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="students" fill="#3b82f6" name="Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="teachers" fill="#8b5cf6" name="Teachers" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue & License Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & License Growth</CardTitle>
            <CardDescription>Monthly revenue and license acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis yAxisId="left" className="text-xs" />
                <YAxis yAxisId="right" orientation="right" className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="right"
                  dataKey="newLicenses" 
                  fill="#10b981" 
                  name="New Licenses" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  yAxisId="right"
                  dataKey="renewals" 
                  fill="#3b82f6" 
                  name="Renewals" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ r: 4 }}
                />
              </ComposedChart>
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
