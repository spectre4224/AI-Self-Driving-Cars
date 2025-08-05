import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, Settings } from 'lucide-react';

interface Vehicle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

export function SimpleSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // Initialize vehicles
    setVehicles([
      { x: 50, y: 200, vx: 2, vy: 0, color: '#2563EB' },
      { x: 300, y: 150, vx: -1, vy: 0, color: '#64748B' },
      { x: 150, y: 250, vx: 1.5, vy: 0, color: '#10B981' }
    ]);
  }, []);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw road
    ctx.fillStyle = '#64748B';
    ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);

    // Draw road markings
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update and draw vehicles
    setVehicles(prevVehicles => {
      const updatedVehicles = prevVehicles.map(vehicle => {
        const newX = vehicle.x + vehicle.vx;
        
        // Wrap around screen
        const wrappedX = newX > canvas.width ? -40 : newX < -40 ? canvas.width : newX;
        
        return { ...vehicle, x: wrappedX };
      });

      // Draw all vehicles
      updatedVehicles.forEach(vehicle => {
        ctx.fillStyle = vehicle.color;
        ctx.fillRect(vehicle.x, vehicle.y, 40, 20);
        
        // Add direction indicator
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(vehicle.x + 35, vehicle.y + 8, 3, 4);
      });

      return updatedVehicles;
    });

    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set explicit dimensions
      canvas.width = 800;
      canvas.height = 400;
      canvas.style.width = '100%';
      canvas.style.height = '400px';
      
      // Initial render
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw road
        ctx.fillStyle = '#64748B';
        ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.2);
        
        // Draw initial vehicles
        vehicles.forEach(vehicle => {
          ctx.fillStyle = vehicle.color;
          ctx.fillRect(vehicle.x, vehicle.y, 40, 20);
        });
      }
    }
  }, [vehicles]);

  useEffect(() => {
    if (isRunning) {
      animate();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Self-Driving Car Simulation</span>
            <Button 
              onClick={() => setIsRunning(!isRunning)}
              className={isRunning ? 'bg-ai-amber hover:bg-amber-600' : 'bg-ai-blue hover:bg-blue-600'}
            >
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <canvas 
              ref={canvasRef}
              className="w-full border"
              style={{ maxWidth: '100%', height: '400px' }}
            />
            
            {/* Legend */}
            <div className="p-4 bg-slate-50 border-t">
              <h4 className="text-sm font-medium text-slate-900 mb-2">Legend</h4>
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-ai-blue rounded-full"></div>
                  <span>AI Vehicle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  <span>Regular Vehicle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-ai-green rounded-full"></div>
                  <span>Smart Vehicle</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-ai-blue">3</div>
            <div className="text-sm text-slate-600">Active Vehicles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-ai-green">{isRunning ? 'Running' : 'Paused'}</div>
            <div className="text-sm text-slate-600">Status</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-ai-amber">A+</div>
            <div className="text-sm text-slate-600">Safety Score</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}