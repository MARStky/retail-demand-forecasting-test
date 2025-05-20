"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface DataPoint {
  date: string
  value: number
  lower?: number
  upper?: number
}

interface DemandForecastChartProps {
  historicalData: DataPoint[]
  forecastData: DataPoint[]
}

export default function DemandForecastChart({ historicalData, forecastData }: DemandForecastChartProps) {
  const [combinedData, setCombinedData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("all")

  useEffect(() => {
    // Combine historical and forecast data
    const combined = [
      ...historicalData.map((item) => ({
        ...item,
        historical: item.value,
        forecast: null,
        lower: null,
        upper: null,
      })),
      ...forecastData.map((item) => ({
        ...item,
        historical: null,
        forecast: item.value,
      })),
    ]

    setCombinedData(combined)
  }, [historicalData, forecastData])

  const filteredData = () => {
    if (timeRange === "all") return combinedData

    const now = new Date()
    let daysToShow = 30

    if (timeRange === "90days") daysToShow = 90
    if (timeRange === "180days") daysToShow = 180

    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - daysToShow)

    return combinedData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={timeRange} onValueChange={setTimeRange}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="30days">30 Days</TabsTrigger>
          <TabsTrigger value="90days">90 Days</TabsTrigger>
          <TabsTrigger value="all">All Data</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-[300px]">
        <ChartContainer>
          <ChartLegend>
            <ChartLegendItem name="Historical" color="#0ea5e9" />
            <ChartLegendItem name="Forecast" color="#8b5cf6" />
            <ChartLegendItem name="Confidence Interval" color="#c7d2fe" />
          </ChartLegend>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c7d2fe" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#c7d2fe" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12 }}
                tickMargin={10}
                minTickGap={30}
              />
              <YAxis tick={{ fontSize: 12 }} tickMargin={10} domain={["auto", "auto"]} />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <ChartTooltip>
                        <ChartTooltipContent>
                          <div className="font-medium">{formatDate(data.date)}</div>
                          {data.historical !== null && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">Historical:</span>
                              <span>{data.historical}</span>
                            </div>
                          )}
                          {data.forecast !== null && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">Forecast:</span>
                              <span>{data.forecast}</span>
                            </div>
                          )}
                          {data.lower !== null && (
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm text-muted-foreground">Range:</span>
                              <span>
                                {data.lower} - {data.upper}
                              </span>
                            </div>
                          )}
                        </ChartTooltipContent>
                      </ChartTooltip>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="historical"
                stroke="#0ea5e9"
                strokeWidth={2}
                fill="transparent"
                dot={{ r: 1 }}
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5 5"
                dot={{ r: 1 }}
                activeDot={{ r: 4 }}
              />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill="transparent" />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="url(#colorConfidence)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
