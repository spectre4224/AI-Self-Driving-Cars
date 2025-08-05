import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause } from 'lucide-react';

export function WorkingSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const animationRef = useRef<number>();
  
  // Vehicle positions
  const vehiclesRef = useRef([
    { x: 50, y: 180, speed: 2, color: '#2563EB' },
    { x: 200, y: 140, speed: -1.5, color: '#64748B' },
    { x: 350, y: 220, speed: 1.8, color: '#10B981' }
  ]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#F1F5F9';
    ctx.fillRect(0, 0, 800, 400);

    // Draw road
    ctx.fillStyle = '#64748B';
    ctx.fillRect(0, 160, 800, 80);

    // Draw road lines
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([15, 15]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(800, 200);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update and draw vehicles
    vehiclesRef.current.forEach(vehicle => {
      // Update position
      vehicle.x += vehicle.speed;
      
      // Wrap around
      if (vehicle.x > 800) vehicle.x = -50;
      if (vehicle.x < -50) vehicle.x = 800;
      
      // Draw vehicle
      ctx.fillStyle = vehicle.color;
      ctx.fillRect(vehicle.x, vehicle.y, 40, 20);
      
      // Draw headlights
      ctx.fillStyle = '#FFFFFF';
      if (vehicle.speed > 0) {
        ctx.fillRect(vehicle.x + 35, vehicle.y + 3, 3, 4);
        ctx.fillRect(vehicle.x + 35, vehicle.y + 13, 3, 4);
      } else {
        ctx.fillRect(vehicle.x + 2, vehicle.y + 3, 3, 4);
        ctx.fillRect(vehicle.x + 2, vehicle.y + 13, 3, 4);
      }
    });
  };

  const animate = () => {
    draw();
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 400;
      draw(); // Initial draw
    }
  }, []);

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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>AI Self-Driving Car Simulation</span>
          <Button 
            onClick={() => setIsRunning(!isRunning)}
            className={isRunning ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <canvas 
            ref={canvasRef}
            className="w-full"
            style={{ display: 'block', maxWidth: '100%' }}
          />
        </div>
        
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Vehicle Legend</h4>
          <div className="flex gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>AI Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span>Regular Vehicle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Smart Vehicle</span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-sm text-gray-600">Active Vehicles</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{isRunning ? 'ON' : 'OFF'}</div>
            <div className="text-sm text-gray-600">Simulation</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">A+</div>
            <div className="text-sm text-gray-600">Safety Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}