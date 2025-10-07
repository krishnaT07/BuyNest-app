import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Star, Package, DollarSign, ShoppingCart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PerformanceMetricsProps {
  analytics: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const PerformanceMetrics = ({ analytics }: PerformanceMetricsProps) => {
  const salesData = analytics?.salesTrend || [
    { date: 'Mon', sales: 4000 },
    { date: 'Tue', sales: 3000 },
    { date: 'Wed', sales: 5000 },
    { date: 'Thu', sales: 2780 },
    { date: 'Fri', sales: 1890 },
    { date: 'Sat', sales: 2390 },
    { date: 'Sun', sales: 3490 },
  ];

  const categoryData = analytics?.categoryBreakdown || [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 300 },
    { name: 'Books', value: 200 },
  ];

  const metrics = [
    {
      title: "Average Rating",
      value: analytics?.averageRating?.toFixed(1) || "0.0",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      trend: "+0.3",
      trendUp: true
    },
    {
      title: "Total Revenue",
      value: `₹${analytics?.totalRevenue?.toLocaleString() || "0"}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Products Sold",
      value: analytics?.productsSold || "0",
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      trend: "+8",
      trendUp: true
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate?.toFixed(1) || "0"}%`,
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      trend: "-2%",
      trendUp: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="border-primary/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <div className="flex items-center gap-1 text-sm">
                      {metric.trendUp ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={metric.trendUp ? "text-green-600" : "text-red-600"}>
                        {metric.trend}
                      </span>
                      <span className="text-muted-foreground">vs last week</span>
                    </div>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Weekly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
