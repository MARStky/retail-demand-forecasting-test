"use client"

import { Clock, Code, Database, Zap } from "lucide-react"

interface ModelInfoProps {
  modelInfo: {
    algorithm: string
    trainingTime: string
    lastTrained: string
    dataPoints: number
  }
}

export default function ModelTrainingInfo({ modelInfo }: ModelInfoProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-start space-x-4 rounded-lg border p-4">
        <Zap className="h-5 w-5 text-blue-500" />
        <div>
          <h3 className="font-medium">Algorithm</h3>
          <p className="text-sm text-muted-foreground">{modelInfo.algorithm}</p>
          <p className="mt-1 text-xs text-muted-foreground">Selected automatically by SageMaker Autopilot</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 rounded-lg border p-4">
        <Clock className="h-5 w-5 text-blue-500" />
        <div>
          <h3 className="font-medium">Training Time</h3>
          <p className="text-sm text-muted-foreground">{modelInfo.trainingTime}</p>
          <p className="mt-1 text-xs text-muted-foreground">Last trained on {modelInfo.lastTrained}</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 rounded-lg border p-4">
        <Database className="h-5 w-5 text-blue-500" />
        <div>
          <h3 className="font-medium">Training Data</h3>
          <p className="text-sm text-muted-foreground">{modelInfo.dataPoints.toLocaleString()} data points</p>
          <p className="mt-1 text-xs text-muted-foreground">Historical sales data from multiple stores</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 rounded-lg border p-4">
        <Code className="h-5 w-5 text-blue-500" />
        <div>
          <h3 className="font-medium">Features Used</h3>
          <p className="text-sm text-muted-foreground">Date, Day of Week, Month, Holidays, Promotions</p>
          <p className="mt-1 text-xs text-muted-foreground">Automatically engineered by SageMaker</p>
        </div>
      </div>
    </div>
  )
}
