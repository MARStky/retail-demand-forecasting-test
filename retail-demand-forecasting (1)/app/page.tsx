import DemandForecastingDashboard from "@/components/demand-forecasting-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Retail Demand Forecasting</h1>
        <p className="text-gray-600 mb-8">Powered by Amazon SageMaker Autopilot</p>
        <DemandForecastingDashboard />
      </div>
    </main>
  )
}
