"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Visit, PageView } from "@/types";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

interface AnalyticsChartProps {
  pageViews: PageView[];
  visits: Visit[];
  timePeriod: string;
}

const chartConfig = {
  visits: {
    label: "Visitors",
    color: "#3b82f6",
  },
  pageViews: {
    label: "Page Views",
    color: "#2979ff",
  },
} satisfies ChartConfig;

const formatDate = (dateString: string, isXAxis: boolean = false) => {
  if (dateString.includes('AM') || dateString.includes('PM')) {
    return dateString;
  }

  // Try parsing the date first
  let date;
  try {
    // If it's already a formatted date string (e.g. "January 15")
    if (dateString.match(/[A-Za-z]+ \d+/)) {
      const currentYear = new Date().getFullYear();
      date = new Date(`${dateString}, ${currentYear}`);
    } else {
      date = new Date(dateString);
    }
  } catch {
    console.error('Error parsing date:', dateString);
    return dateString;
  }

  // For X-axis, show only month (abbreviated) and date
  if (isXAxis) {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });
  }

  // For tooltip, show full date with year
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).replace(/(\d+)(?=(st|nd|rd|th))/, (match) => {
    const num = parseInt(match);
    const suffix = ['th', 'st', 'nd', 'rd'][(num % 10 > 3 ? 0 : num % 10)];
    return `${num}${suffix}`;
  });
};

const getHourLabel = (date: Date) => {
  const hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12} ${ampm}`;
};

const groupByTimeUnit = (data: { date: string; pageViews: number; visits: number }[], timePeriod: string) => {
  return data.reduce((acc, item) => {
    const date = new Date(item.date);
    let key: string;

    if (timePeriod === "last 1 hour" || timePeriod === "last 1 day") {
      // Group by hour
      key = getHourLabel(date);
    } else if (timePeriod === "0" || timePeriod === "last 90 days" || timePeriod === "last 365 days") {
      // Always include year
      key = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } else {
      // Always include year for all other periods too
      key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    if (!acc[key]) {
      acc[key] = { date: key, pageViews: 0, visits: 0 };
    }
    
    acc[key].pageViews += item.pageViews;
    acc[key].visits += item.visits;
    
    return acc;
  }, {} as Record<string, { date: string; pageViews: number; visits: number }>);
};

export default function AnalyticsChart({
  pageViews,
  visits,
  timePeriod,
}: AnalyticsChartProps) {
  const [activeTab, setActiveTab] = useState("pageViews");

  const filterDataByTimePeriod = (date: Date) => {
    if (timePeriod === "0") return true;
    
    const now = new Date();
    const timeAgo = new Date(date);
    const diffInHours = (now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60);

    switch (timePeriod) {
      case "last 1 hour":
        return diffInHours <= 1;
      case "last 1 day":
        return diffInHours <= 24;
      case "last 7 days":
        return diffInHours <= 24 * 7;
      case "last 30 days":
        return diffInHours <= 24 * 30;
      case "last 90 days":
        return diffInHours <= 24 * 90;
      case "last 365 days":
        return diffInHours <= 24 * 365;
      default:
        return true;
    }
  };

  const processData = () => {
    const data: Record<string, { date: string; pageViews: number; visits: number }> = {};

    // Process visits
    visits
      .filter(visit => filterDataByTimePeriod(new Date(visit.created_at)))
      .forEach(visit => {
        const timestamp = visit.created_at;
        if (!data[timestamp]) {
          data[timestamp] = { date: timestamp, pageViews: 0, visits: 1 };
        } else {
          data[timestamp].visits++;
        }
      });

    // Process pageViews
    pageViews
      .filter(view => filterDataByTimePeriod(new Date(view.created_at)))
      .forEach(view => {
        const timestamp = view.created_at;
        if (!data[timestamp]) {
          data[timestamp] = { date: timestamp, pageViews: 1, visits: 0 };
        } else {
          data[timestamp].pageViews++;
        }
      });

    // Sort by timestamp
    const sortedData = Object.values(data).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group the data based on time period
    const groupedData = groupByTimeUnit(sortedData, timePeriod);

    // Sort the final data
    return Object.values(groupedData).sort((a, b) => {
      if (a.date.includes('AM') || a.date.includes('PM')) {
        // Sort hours
        const hourA = parseInt(a.date.split(' ')[0]);
        const ampmA = a.date.split(' ')[1];
        const hourB = parseInt(b.date.split(' ')[0]);
        const ampmB = b.date.split(' ')[1];
        
        if (ampmA === ampmB) return hourA - hourB;
        return ampmA === 'AM' ? -1 : 1;
      } else {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  };

  const chartData = processData();

  const CustomTooltip = ({ 
    active, 
    payload,
    label 
  }: {
    active?: boolean;
    payload?: Array<{
      fill: string;
      name: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg shadow-lg">
          <p className="text-neutral-300 mb-2">
            {(label?.includes('AM') || label?.includes('PM')) 
              ? label 
              : formatDate(label!, false)}
          </p>
          {payload.map((pld, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: pld.fill }}
              />
              <span className="text-neutral-300">
                {pld.name}: {pld.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-neutral-800 bg-[#0a0a0a] backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neutral-300 text-base md:text-lg lg:text-xl flex flex-row justify-between">
          Analytics Graph
          <Eye className="w-7 h-7" />
        </CardTitle> 
      </CardHeader>
      <CardContent className="flex -ml-12 -mr-2 pb-0">
        <ChartContainer config={chartConfig} className="min-h-[200px] max-h-[500px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            style={{
              backgroundColor: "transparent",
            }}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="#374151" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#9CA3AF" }}
              tickFormatter={(value) => formatDate(value, true)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#9CA3AF" }}
            />
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={false}
            />
            {activeTab === "visitors" && (
              <Area
                dataKey="visits"
                name={chartConfig.visits.label}
                stroke={chartConfig.visits.color}
                fill={chartConfig.visits.color}
                fillOpacity={0.4}
                type="linear"
              />
            )}
            {activeTab === "pageViews" && (
              <Area
                dataKey="pageViews"
                name={chartConfig.pageViews.label}
                stroke={chartConfig.pageViews.color}
                fill={chartConfig.pageViews.color}
                fillOpacity={0.4}
                type="linear"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full px-6 pt-4 pb-6"
        >
          <TabsList className="grid w-full grid-cols-2 bg-neutral-900/30 border border-neutral-900 p-1 backdrop-blur-sm">
            <TabsTrigger
              value="pageViews"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Page Views
            </TabsTrigger>
            <TabsTrigger
              value="visitors"
              className="data-[state=active]:bg-neutral-800 data-[state=active]:text-white"
            >
              Visitors
            </TabsTrigger>
          </TabsList>
        </Tabs>
    </Card>
  );
}
