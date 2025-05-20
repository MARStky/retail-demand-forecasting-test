"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

interface TestForecastFormProps {
  onSubmit: (params: any) => void
  isLoading: boolean
}

export default function TestForecastForm({ onSubmit, isLoading }: TestForecastFormProps) {
  const [params, setParams] = useState({
    daysToForecast: 30,
    seasonality: "normal",
    trendDirection: "up",
    trendStrength: 5,
    volatility: 10,
    includeHolidays: true,
    includePromotion: false,
  })

  const handleChange = (name: string, value: any) => {
    setParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(params)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="days">Days to Forecast</Label>
          <Select
            value={params.daysToForecast.toString()}
            onValueChange={(value) => handleChange("daysToForecast", Number.parseInt(value))}
          >
            <SelectTrigger id="days">
              <SelectValue placeholder="Select days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">14 Days</SelectItem>
              <SelectItem value="30">30 Days</SelectItem>
              <SelectItem value="60">60 Days</SelectItem>
              <SelectItem value="90">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seasonality">Seasonality Pattern</Label>
          <Select value={params.seasonality} onValueChange={(value) => handleChange("seasonality", value)}>
            <SelectTrigger id="seasonality">
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">Flat (No Seasonality)</SelectItem>
              <SelectItem value="weak">Weak Seasonality</SelectItem>
              <SelectItem value="normal">Normal Seasonality</SelectItem>
              <SelectItem value="strong">Strong Seasonality</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="trend">Trend Direction</Label>
        <Select value={params.trendDirection} onValueChange={(value) => handleChange("trendDirection", value)}>
          <SelectTrigger id="trend">
            <SelectValue placeholder="Select trend" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="up">Upward Trend</SelectItem>
            <SelectItem value="flat">Flat (No Trend)</SelectItem>
            <SelectItem value="down">Downward Trend</SelectItem>
            <SelectItem value="cyclic">Cyclic Trend</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="trend-strength">Trend Strength</Label>
          <span className="text-sm text-muted-foreground">{params.trendStrength}/10</span>
        </div>
        <Slider
          id="trend-strength"
          min={1}
          max={10}
          step={1}
          value={[params.trendStrength]}
          onValueChange={(value) => handleChange("trendStrength", value[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="volatility">Volatility</Label>
          <span className="text-sm text-muted-foreground">{params.volatility}%</span>
        </div>
        <Slider
          id="volatility"
          min={0}
          max={50}
          step={5}
          value={[params.volatility]}
          onValueChange={(value) => handleChange("volatility", value[0])}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="holidays"
            checked={params.includeHolidays}
            onCheckedChange={(checked) => handleChange("includeHolidays", checked)}
          />
          <Label htmlFor="holidays">Include holiday effects</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="promotions"
            checked={params.includePromotion}
            onCheckedChange={(checked) => handleChange("includePromotion", checked)}
          />
          <Label htmlFor="promotions">Include promotional event</Label>
        </div>

        {params.includePromotion && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="promo-start">Promotion Start Date</Label>
                  <Input id="promo-start" type="date" defaultValue="2023-07-15" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promo-impact">Expected Impact (%)</Label>
                  <Input id="promo-impact" type="number" defaultValue="25" min="5" max="100" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Generating Test Data..." : "Generate Synthetic Test Data"}
      </Button>
    </form>
  )
}
