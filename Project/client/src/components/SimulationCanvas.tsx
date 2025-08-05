import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Camera, Maximize2 } from 'lucide-react';

interface SimulationCanvasProps {
  onReset: () => void;
  isRunning: boolean;
}

export function SimulationCanvas({ onReset, isRunning }: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'simulation-screenshot.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleFullscreen = () => {
    if (canvasRef.current) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Canvas Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">Live Simulation</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-ai-green animate-pulse' : 'bg-slate-400'}`}></div>
              <span className="text-sm text-slate-600">
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleScreenshot}>
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative">
        <canvas 
          ref={canvasRef}
          className="w-full h-96 md:h-[500px] lg:h-[600px] bg-slate-100"
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl text-slate-300 mb-4">🚗</div>
              <p className="text-slate-500">Canvas not supported</p>
            </div>
          </div>
        </canvas>

        {/* Simulation Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Legend</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-ai-blue rounded-full"></div>
              <span>AI Vehicle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
              <span>Other Vehicles</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-ai-green rounded-full"></div>
              <span>Pedestrians</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-ai-purple rounded-full opacity-50"></div>
              <span>Sensor Range</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


