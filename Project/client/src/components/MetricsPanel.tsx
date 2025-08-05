import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge, Brain, Shield, Construction } from 'lucide-react';
import type { Metrics } from '@/lib/simulation-engine';

interface MetricsPanelProps {
  metrics: Metrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Performance</CardTitle>
          <Gauge className="h-5 w-5 text-ai-blue" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">FPS</span>
              <span className="font-medium text-slate-900">{metrics.fps}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Processing Time</span>
              <span className="font-medium text-slate-900">{metrics.processingTime.toFixed(1)}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Memory Usage</span>
              <span className="font-medium text-slate-900">{metrics.memoryUsage}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Decision Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">AI Decisions</CardTitle>
          <Brain className="h-5 w-5 text-ai-green" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Decisions/sec</span>
              <span className="font-medium text-slate-900">{Math.round(metrics.decisionsPerSecond)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Success Rate</span>
              <span className="font-medium text-ai-green">{metrics.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Avg Response</span>
              <span className="font-medium text-slate-900">{Math.round(metrics.avgResponseTime)}ms</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Safety</CardTitle>
          <Shield className="h-5 w-5 text-ai-amber" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Near Misses</span>
              <span className="font-medium text-ai-amber">{metrics.nearMisses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Collisions</span>
              <span className="font-medium text-ai-red">{metrics.collisions}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Safety Score</span>
              <span className="font-medium text-ai-green">{metrics.safetyScore}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Flow */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Traffic Flow</CardTitle>
          <Construction className="h-5 w-5 text-ai-purple" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Avg Speed</span>
              <span className="font-medium text-slate-900">{metrics.avgSpeed} mph</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Flow Rate</span>
              <span className="font-medium text-slate-900">{metrics.flowRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Congestion</span>
              <span className={`font-medium ${
                metrics.congestionLevel === 'Low' ? 'text-ai-green' : 
                metrics.congestionLevel === 'Medium' ? 'text-ai-amber' : 'text-ai-red'
              }`}>
                {metrics.congestionLevel}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
