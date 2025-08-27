"use client";

import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { BriefcaseIcon, TrendingUp, TrendingDown, Brain } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  // Memoized chart data
  const salaryData = useMemo(
    () =>
      insights.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min / 1000,
        max: range.max / 1000,
        median: range.median / 1000,
      })),
    [insights.salaryRanges]
  );

  const forecastData = useMemo(
    () =>
      insights.forecast.map((item) => ({
        year: item.year,
        growth: item.growth,
      })),
    [insights.forecast]
  );

  // Demand level color
  const getDemandLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Market outlook info
  const getMarketOutlookInfo = (outlook) => {
    switch (outlook?.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const { icon: OutlookIcon, color: outlookColor } =
    getMarketOutlookInfo(insights.marketOutlook);

  // Dates
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6 px-2 sm:px-4">
      <h1 className="text-3xl sm:text-5xl font-bold gradient-title text-center sm:text-left">
        Industry Insights
      </h1>
      <div className="flex justify-center sm:justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Market Outlook */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Market Outlook</CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {insights.marketOutlook}
            </div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        {/* Industry Growth */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Industry Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        {/* Demand Level */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {insights.demandLevel}
            </div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 skill-container">
              {insights.topSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs skill-tag"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Job Openings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Job Openings</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {insights.jobOpenings.toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-muted-foreground">
              Compared to last month: {insights.jobOpeningsChange > 0 ? "+" : ""}
              {insights.jobOpeningsChange}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ className: "my-x-axis-labels" }}
                />                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Trends & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Industry Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>Current trends shaping the industry</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends.map((trend, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span className="text-sm">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommended Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 skill-container">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs skill-tag">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regions & Career Path */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Hiring Regions */}
        <Card>
          <CardHeader>
            <CardTitle>Top Hiring Regions</CardTitle>
            <CardDescription>Where demand is strongest</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {insights.topRegions.map((region, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span>{region.name}</span>
                  <Badge variant="secondary" className="text-xs skill-tag">
                    {region.jobs} jobs
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Career Path */}
        <Card>
          <CardHeader>
            <CardTitle>Career Path</CardTitle>
            <CardDescription>Common role progression</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative border-l border-muted pl-4 space-y-4">
              {insights.careerPath.map((role, idx) => (
                <li key={idx} className="ml-2">
                  <div className="absolute w-2 h-2 bg-primary rounded-full -left-1.5 mt-1.5"></div>
                  <p className="font-medium text-sm">{role.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Avg Salary: ${role.salary}K
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Certifications</CardTitle>
          <CardDescription>Boost your employability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 skill-container">
            {insights.certifications.map((cert) => (
              <Badge key={cert} variant="outline" className="text-xs skill-tag">
                {cert}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Growth Forecast</CardTitle>
          <CardDescription>Projected growth over the next 5 years</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Years', position: 'insideBottom', offset: -4 }}
                />
                <YAxis
                  domain={['dataMin', 'dataMax']}
                  ticks={[...new Set(forecastData.map(d => d.growth))].sort((a, b) => a - b)}
                  label={{ value: 'Growth (%)', position: 'insideLeft', angle: -90 }}
                />
                <Tooltip
                  content={({ active, payload, label }) =>
                    active && payload ? (
                      <div className="bg-background border rounded-lg p-2 shadow-md">
                        <p className="font-medium">{label}</p>
                        {payload.map((item) => (
                          <p key={item.dataKey} className="text-sm">
                            {item.name}: {item.value}%
                          </p>
                        ))}
                      </div>
                    ) : null
                  }
                />
                <Line type="monotone" dataKey="growth" stroke="#64748b" strokeWidth={2} dot={{ r: 5, fill: "#64748b" }} name="Growth (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>



    </div>
  );
};

export default DashboardView;
