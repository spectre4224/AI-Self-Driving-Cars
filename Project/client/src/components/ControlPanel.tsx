import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Sliders, Map } from 'lucide-react';

interface ControlPanelProps {
  isRunning: boolean;
  speed: number;
  trafficDensity: number;
  weather: string;
  scenario: string;
  showSensorRadius: boolean;
  showDecisionPoints: boolean;
  showPathPrediction: boolean;
  onToggleSimulation: () => void;
  onSpeedChange: (speed: number) => void;
  onTrafficDensityChange: (density: number) => void;
  onWeatherChange: (weather: 'clear' | 'rain' | 'fog' | 'snow') => void;
  onToggleSensorRadius: () => void;
  onToggleDecisionPoints: () => void;
  onTogglePathPrediction: () => void;
  onLoadScenario: (scenario: string) => void;
}

export function ControlPanel({
  isRunning,
  speed,
  trafficDensity,
  weather,
  scenario,
  showSensorRadius,
  showDecisionPoints,
  showPathPrediction,
  onToggleSimulation,
  onSpeedChange,
  onTrafficDensityChange,
  onWeatherChange,
  onToggleSensorRadius,
  onToggleDecisionPoints,
  onTogglePathPrediction,
  onLoadScenario
}: ControlPanelProps) {
  const getTrafficDensityLabel = (value: number) => {
    if (value <= 3) return 'Low';
    if (value <= 7) return 'Medium';
    return 'High';
  };

  const scenarios = [
    { id: 'city-intersection', name: 'City Intersection', description: 'Complex 4-way intersection with traffic lights' },
    { id: 'highway-merge', name: 'Highway Merge', description: 'High-speed merging and lane changes' },
    { id: 'school-zone', name: 'School Zone', description: 'Pedestrians and reduced speed limits' },
    { id: 'construction-zone', name: 'Construction Zone', description: 'Dynamic obstacles and lane closures' }
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Sliders className="w-5 h-5 text-ai-blue mr-2" />
            Simulation Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Play/Pause Button */}
          <Button 
            onClick={onToggleSimulation}
            className={`w-full font-medium py-3 ${
              isRunning 
                ? 'bg-ai-amber hover:bg-amber-600' 
                : 'bg-ai-blue hover:bg-blue-600'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </Button>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Simulation Speed
              <span className="text-ai-blue font-semibold ml-2">{speed.toFixed(1)}x</span>
            </label>
            <Slider
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              min={0.1}
              max={3.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Traffic Density */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              Traffic Density
              <span className="text-ai-amber font-semibold ml-2">{getTrafficDensityLabel(trafficDensity)}</span>
            </label>
            <Slider
              value={[trafficDensity]}
              onValueChange={(values) => onTrafficDensityChange(values[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
          </div>

          {/* Weather Conditions */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Weather Conditions</label>
            <Select value={weather} onValueChange={onWeatherChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clear">Clear</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
                <SelectItem value="fog">Fog</SelectItem>
                <SelectItem value="snow">Snow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Visualization Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-700">AI Visualization</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sensor-radius"
                  checked={showSensorRadius}
                  onCheckedChange={onToggleSensorRadius}
                />
                <label htmlFor="sensor-radius" className="text-sm text-slate-600">
                  Show Sensor Radius
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="decision-points"
                  checked={showDecisionPoints}
                  onCheckedChange={onToggleDecisionPoints}
                />
                <label htmlFor="decision-points" className="text-sm text-slate-600">
                  Show Decision Points
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="path-prediction"
                  checked={showPathPrediction}
                  onCheckedChange={onTogglePathPrediction}
                />
                <label htmlFor="path-prediction" className="text-sm text-slate-600">
                  Show Path Prediction
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Map className="w-5 h-5 text-ai-green mr-2" />
            Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scenarios.map((s) => (
              <button
                key={s.id}
                onClick={() => onLoadScenario(s.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                  scenario === s.id
                    ? 'border-ai-blue bg-ai-blue/10'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="font-medium text-slate-900">{s.name}</div>
                <div className="text-sm text-slate-600">{s.description}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
