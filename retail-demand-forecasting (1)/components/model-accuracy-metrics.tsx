"use client"

import { Progress } from "@/components/ui/progress"

interface MetricsProps {
  metrics: {
    mape: number
    rmse: number
    mae: number
  }
}

export default function ModelAccuracyMetrics({ metrics }: MetricsProps) {
  // Calculate a score from 0-100 based on MAPE (lower is better)
  // MAPE of 0% would be 100 score, MAPE of 20% or higher would be 0 score
  const accuracyScore = Math.max(0, Math.min(100, 100 - metrics.mape * 5))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Accuracy</span>
          <span className="text-sm font-medium">{accuracyScore.toFixed(1)}%</span>
        </div>
        <Progress value={accuracyScore} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">MAPE</p>
          <p className="text-2xl font-bold">{metrics.mape}%</p>
          <p className="text-xs text-muted-foreground">Mean Absolute Percentage Error</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">RMSE</p>
          <p className="text-2xl font-bold">{metrics.rmse}</p>
          <p className="text-xs text-muted-foreground">Root Mean Square Error</p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">MAE</p>
          <p className="text-2xl font-bold">{metrics.mae}</p>
          <p className="text-xs text-muted-foreground">Mean Absolute Error</p>
        </div>
      </div>
    </div>
  )
}
