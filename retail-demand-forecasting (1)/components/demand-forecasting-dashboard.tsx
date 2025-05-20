"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import DemandForecastChart from "@/components/demand-forecast-chart"
import ModelAccuracyMetrics from "@/components/model-accuracy-metrics"
import ModelTrainingInfo from "@/components/model-training-info"
import TestForecastForm from "@/components/test-forecast-form"
import { generateSyntheticData, evaluateModel } from "@/lib/forecast-service"

export default function DemandForecastingDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [modelTrained, setModelTrained] = useState(true) // Set to true for demo purposes
  const [forecastData, setForecastData] = useState<any>(null)
  const [testResults, setTestResults] = useState<any>(null)

  // In a real app, this would come from the backend
  const initialData = {
    historical: generateHistoricalData(),
    forecast: generateForecastData(),
    accuracy: {
      mape: 8.2,
      rmse: 42.6,
      mae: 35.1,
    },
    modelInfo: {
      algorithm: "DeepAR",
      trainingTime: "45 minutes",
      lastTrained: "2023-05-15",
      dataPoints: 1250,
    },
  }

  const [dashboardData, setDashboardData] = useState(initialData)

  const handleTrainModel = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would call the backend to trigger SageMaker Autopilot training
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate model training completion
      setModelTrained(true)
      toast({
        title: "Model Training Complete",
        description: "Your demand forecasting model has been successfully trained with SageMaker Autopilot.",
      })
    } catch (error) {
      toast({
        title: "Training Failed",
        description: "There was an error training your model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestForecast = async (testParams: any) => {
    try {
      setIsLoading(true)
      // In a real app, this would generate synthetic data and test the model
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const syntheticData = generateSyntheticData(testParams)
      const results = evaluateModel(syntheticData)

      setTestResults(results)
      toast({
        title: "Test Complete",
        description: "Demand forecast test completed successfully.",
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "There was an error testing your forecast. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="model">Model Training</TabsTrigger>
          <TabsTrigger value="test">Test Forecasting</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Demand Forecast</CardTitle>
                <CardDescription>Historical and predicted product demand</CardDescription>
              </CardHeader>
              <CardContent>
                <DemandForecastChart historicalData={dashboardData.historical} forecastData={dashboardData.forecast} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Performance</CardTitle>
                <CardDescription>Accuracy metrics for the current model</CardDescription>
              </CardHeader>
              <CardContent>
                <ModelAccuracyMetrics metrics={dashboardData.accuracy} />
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">Last updated: {dashboardData.modelInfo.lastTrained}</p>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Categories Performance</CardTitle>
              <CardDescription>Forecast accuracy by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <CategoryPerformanceChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Amazon SageMaker Autopilot</CardTitle>
              <CardDescription>Train your demand forecasting model using machine learning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ModelTrainingInfo modelInfo={dashboardData.modelInfo} />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select defaultValue="sales_data">
                    <SelectTrigger id="data-source">
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales_data">Sales Data (2020-2023)</SelectItem>
                      <SelectItem value="inventory">Inventory Data</SelectItem>
                      <SelectItem value="combined">Combined Dataset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forecast-horizon">Forecast Horizon (Days)</Label>
                  <Select defaultValue="90">
                    <SelectTrigger id="forecast-horizon">
                      <SelectValue placeholder="Select horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidence-interval">Confidence Interval</Label>
                  <span className="text-sm text-muted-foreground">80%</span>
                </div>
                <Slider defaultValue={[80]} min={50} max={95} step={5} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="include-features" defaultChecked />
                <Label htmlFor="include-features">Include external features (holidays, promotions)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleTrainModel} disabled={isLoading}>
                {isLoading ? "Training..." : "Train Model with SageMaker Autopilot"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How SageMaker Autopilot Works</CardTitle>
              <CardDescription>Behind the scenes of your demand forecasting model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">1. Data Preprocessing</h3>
                  <p className="text-sm text-muted-foreground">
                    SageMaker Autopilot automatically cleans your historical sales data, handles missing values, and
                    creates features relevant for time series forecasting.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">2. Algorithm Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Autopilot evaluates multiple time series algorithms (ARIMA, ETS, DeepAR, Prophet) to find the best
                    fit for your retail data patterns.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">3. Hyperparameter Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    The service automatically tunes model parameters to maximize accuracy for your specific demand
                    patterns.
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">4. Model Deployment</h3>
                  <p className="text-sm text-muted-foreground">
                    The best performing model is deployed as an endpoint that your business applications can query for
                    real-time forecasts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Demand Forecasting</CardTitle>
              <CardDescription>Generate synthetic future data to test model accuracy</CardDescription>
            </CardHeader>
            <CardContent>
              <TestForecastForm onSubmit={handleTestForecast} isLoading={isLoading} />
            </CardContent>
          </Card>

          {testResults && (
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Comparison of forecasted vs. synthetic "actual" demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <TestResultsChart data={testResults} />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Forecast Accuracy</p>
                    <p className="text-2xl font-bold">{testResults.accuracy.toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">MAPE</p>
                    <p className="text-2xl font-bold">{testResults.mape.toFixed(2)}%</p>
                  </div>
                  <div className="rounded-lg border p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">RMSE</p>
                    <p className="text-2xl font-bold">{testResults.rmse.toFixed(1)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  )
}

// Helper functions to generate mock data
function generateHistoricalData() {
  const startDate = new Date(2023, 0, 1)
  const data = []

  for (let i = 0; i < 180; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Create seasonal pattern with some randomness
    const baseValue = 500 + Math.sin((i / 30) * Math.PI) * 200
    const dayOfWeek = date.getDay()
    const weekendEffect = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1
    const randomness = 0.9 + Math.random() * 0.2

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue * weekendEffect * randomness),
    })
  }

  return data
}

function generateForecastData() {
  const startDate = new Date(2023, 6, 1)
  const data = []

  for (let i = 0; i < 90; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Create seasonal pattern with some randomness
    const baseValue = 550 + Math.sin(((i + 180) / 30) * Math.PI) * 220
    const dayOfWeek = date.getDay()
    const weekendEffect = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1
    const randomness = 0.95 + Math.random() * 0.1

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(baseValue * weekendEffect * randomness),
      lower: Math.round(baseValue * weekendEffect * randomness * 0.85),
      upper: Math.round(baseValue * weekendEffect * randomness * 1.15),
    })
  }

  return data
}

function CategoryPerformanceChart() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Category performance chart would be displayed here</p>
    </div>
  )
}

function TestResultsChart({ data }: { data: any }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">Test results chart would be displayed here</p>
    </div>
  )
}
