export interface Vehicle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  angle: number;
  type: 'ai' | 'regular';
  path: Point[];
  targetIndex: number;
  sensorRadius: number;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'building' | 'construction' | 'pedestrian';
}

export interface Metrics {
  fps: number;
  processingTime: number;
  memoryUsage: string;
  decisionsPerSecond: number;
  successRate: number;
  avgResponseTime: number;
  nearMisses: number;
  collisions: number;
  safetyScore: string;
  avgSpeed: number;
  flowRate: number;
  congestionLevel: string;
}

export interface SimulationState {
  vehicles: Vehicle[];
  obstacles: Obstacle[];
  pedestrians: Point[];
  metrics: Metrics;
  isRunning: boolean;
  speed: number;
  trafficDensity: number;
  weather: 'clear' | 'rain' | 'fog' | 'snow';
  scenario: string;
  showSensorRadius: boolean;
  showDecisionPoints: boolean;
  showPathPrediction: boolean;
}

export class SimulationEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: SimulationState;
  private animationId: number | null = null;
  private lastFrameTime = 0;
  private frameCount = 0;
  private lastFpsUpdate = 0;

  constructor(canvas: HTMLCanvasElement) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }
    
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to get 2D context from canvas');
    }
    this.ctx = ctx;
    
    this.state = this.getInitialState();
    
    // Wait for canvas to be in DOM before resizing
    setTimeout(() => {
      this.resizeCanvas();
      this.loadScenario('city-intersection');
    }, 0);
  }

  private getInitialState(): SimulationState {
    return {
      vehicles: [],
      obstacles: [],
      pedestrians: [],
      metrics: {
        fps: 60,
        processingTime: 2.3,
        memoryUsage: '45MB',
        decisionsPerSecond: 12,
        successRate: 98.7,
        avgResponseTime: 120,
        nearMisses: 0,
        collisions: 0,
        safetyScore: 'A+',
        avgSpeed: 35,
        flowRate: 85,
        congestionLevel: 'Low'
      },
      isRunning: false,
      speed: 1.0,
      trafficDensity: 5,
      weather: 'clear',
      scenario: 'city-intersection',
      showSensorRadius: true,
      showDecisionPoints: true,
      showPathPrediction: false
    };
  }

  public resizeCanvas(): void {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Ensure minimum canvas size
    const width = Math.max(rect.width || 800, 400);
    const height = Math.max(rect.height || 600, 300);
    
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
  }

  public start(): void {
    this.state.isRunning = true;
    this.animate();
  }

  public pause(): void {
    this.state.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public setSpeed(speed: number): void {
    this.state.speed = speed;
  }

  public setTrafficDensity(density: number): void {
    this.state.trafficDensity = density;
    this.updateTrafficDensity();
  }

  public setWeather(weather: 'clear' | 'rain' | 'fog' | 'snow'): void {
    this.state.weather = weather;
  }

  public toggleSensorRadius(): void {
    this.state.showSensorRadius = !this.state.showSensorRadius;
  }

  public toggleDecisionPoints(): void {
    this.state.showDecisionPoints = !this.state.showDecisionPoints;
  }

  public togglePathPrediction(): void {
    this.state.showPathPrediction = !this.state.showPathPrediction;
  }

  public loadScenario(scenario: string): void {
    this.state.scenario = scenario;
    this.state.vehicles = [];
    this.state.obstacles = [];
    this.state.pedestrians = [];

    switch (scenario) {
      case 'city-intersection':
        this.setupCityIntersection();
        break;
      case 'highway-merge':
        this.setupHighwayMerge();
        break;
      case 'school-zone':
        this.setupSchoolZone();
        break;
      case 'construction-zone':
        this.setupConstructionZone();
        break;
    }
  }

  private setupCityIntersection(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    // Add AI vehicle
    this.state.vehicles.push({
      id: 'ai-1',
      x: rect.width * 0.1,
      y: rect.height * 0.5,
      width: 40,
      height: 20,
      vx: 0,
      vy: 0,
      angle: 0,
      type: 'ai',
      path: [
        { x: rect.width * 0.1, y: rect.height * 0.5 },
        { x: rect.width * 0.45, y: rect.height * 0.5 },
        { x: rect.width * 0.45, y: rect.height * 0.2 },
        { x: rect.width * 0.9, y: rect.height * 0.2 }
      ],
      targetIndex: 0,
      sensorRadius: 80,
      color: '#2563EB'
    });

    // Add regular vehicles
    this.state.vehicles.push({
      id: 'reg-1',
      x: rect.width * 0.7,
      y: rect.height * 0.5,
      width: 40,
      height: 20,
      vx: -1,
      vy: 0,
      angle: Math.PI,
      type: 'regular',
      path: [],
      targetIndex: 0,
      sensorRadius: 50,
      color: '#64748B'
    });

    // Add obstacles (buildings)
    this.state.obstacles.push(
      { x: rect.width * 0.4, y: 0, width: rect.width * 0.1, height: rect.height * 0.4, type: 'building' },
      { x: rect.width * 0.5, y: 0, width: rect.width * 0.1, height: rect.height * 0.4, type: 'building' },
      { x: rect.width * 0.4, y: rect.height * 0.6, width: rect.width * 0.1, height: rect.height * 0.4, type: 'building' },
      { x: rect.width * 0.5, y: rect.height * 0.6, width: rect.width * 0.1, height: rect.height * 0.4, type: 'building' }
    );

    // Add pedestrians
    this.state.pedestrians.push(
      { x: rect.width * 0.42, y: rect.height * 0.52 },
      { x: rect.width * 0.58, y: rect.height * 0.48 }
    );
  }

  private setupHighwayMerge(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    this.state.vehicles.push({
      id: 'ai-1',
      x: rect.width * 0.1,
      y: rect.height * 0.7,
      width: 40,
      height: 20,
      vx: 2,
      vy: 0,
      angle: 0,
      type: 'ai',
      path: [
        { x: rect.width * 0.1, y: rect.height * 0.7 },
        { x: rect.width * 0.4, y: rect.height * 0.7 },
        { x: rect.width * 0.6, y: rect.height * 0.5 },
        { x: rect.width * 0.9, y: rect.height * 0.5 }
      ],
      targetIndex: 0,
      sensorRadius: 100,
      color: '#2563EB'
    });

    // Add highway traffic
    for (let i = 0; i < 3; i++) {
      this.state.vehicles.push({
        id: `highway-${i}`,
        x: rect.width * (0.3 + i * 0.2),
        y: rect.height * 0.5,
        width: 40,
        height: 20,
        vx: 2,
        vy: 0,
        angle: 0,
        type: 'regular',
        path: [],
        targetIndex: 0,
        sensorRadius: 50,
        color: '#64748B'
      });
    }
  }

  private setupSchoolZone(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    this.state.vehicles.push({
      id: 'ai-1',
      x: rect.width * 0.1,
      y: rect.height * 0.5,
      width: 40,
      height: 20,
      vx: 0.5, // Slower speed in school zone
      vy: 0,
      angle: 0,
      type: 'ai',
      path: [
        { x: rect.width * 0.1, y: rect.height * 0.5 },
        { x: rect.width * 0.9, y: rect.height * 0.5 }
      ],
      targetIndex: 0,
      sensorRadius: 120, // Increased sensor range for pedestrians
      color: '#2563EB'
    });

    // Add school building
    this.state.obstacles.push({
      x: rect.width * 0.3,
      y: rect.height * 0.1,
      width: rect.width * 0.4,
      height: rect.height * 0.3,
      type: 'building'
    });

    // Add many pedestrians (children)
    for (let i = 0; i < 6; i++) {
      this.state.pedestrians.push({
        x: rect.width * (0.2 + Math.random() * 0.6),
        y: rect.height * (0.6 + Math.random() * 0.3)
      });
    }
  }

  private setupConstructionZone(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    this.state.vehicles.push({
      id: 'ai-1',
      x: rect.width * 0.1,
      y: rect.height * 0.5,
      width: 40,
      height: 20,
      vx: 1,
      vy: 0,
      angle: 0,
      type: 'ai',
      path: [
        { x: rect.width * 0.1, y: rect.height * 0.5 },
        { x: rect.width * 0.3, y: rect.height * 0.5 },
        { x: rect.width * 0.4, y: rect.height * 0.3 },
        { x: rect.width * 0.6, y: rect.height * 0.3 },
        { x: rect.width * 0.7, y: rect.height * 0.5 },
        { x: rect.width * 0.9, y: rect.height * 0.5 }
      ],
      targetIndex: 0,
      sensorRadius: 90,
      color: '#2563EB'
    });

    // Add construction obstacles
    this.state.obstacles.push(
      { x: rect.width * 0.35, y: rect.height * 0.4, width: rect.width * 0.3, height: rect.height * 0.2, type: 'construction' }
    );
  }

  private updateTrafficDensity(): void {
    // Remove existing regular vehicles
    this.state.vehicles = this.state.vehicles.filter(v => v.type === 'ai');
    
    const rect = this.canvas.getBoundingClientRect();
    const numVehicles = Math.floor(this.state.trafficDensity / 2);
    
    for (let i = 0; i < numVehicles; i++) {
      this.state.vehicles.push({
        id: `traffic-${i}`,
        x: Math.random() * rect.width,
        y: rect.height * (0.4 + Math.random() * 0.2),
        width: 40,
        height: 20,
        vx: (Math.random() - 0.5) * 2,
        vy: 0,
        angle: 0,
        type: 'regular',
        path: [],
        targetIndex: 0,
        sensorRadius: 50,
        color: '#64748B'
      });
    }
  }

  private animate = (currentTime: number = 0): void => {
    if (!this.state.isRunning) return;

    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update FPS
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.state.metrics.fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    // Update simulation
    this.updateVehicles(deltaTime);
    this.updateMetrics();
    this.render();

    this.animationId = requestAnimationFrame(this.animate);
  };

  private updateVehicles(deltaTime: number): void {
    const speedMultiplier = this.state.speed;
    
    this.state.vehicles.forEach(vehicle => {
      if (vehicle.type === 'ai') {
        this.updateAIVehicle(vehicle, deltaTime * speedMultiplier);
      } else {
        this.updateRegularVehicle(vehicle, deltaTime * speedMultiplier);
      }
    });
  }

  private updateAIVehicle(vehicle: Vehicle, deltaTime: number): void {
    if (vehicle.path.length === 0) return;

    const target = vehicle.path[vehicle.targetIndex];
    if (!target) return;

    const dx = target.x - vehicle.x;
    const dy = target.y - vehicle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 10) {
      vehicle.targetIndex = (vehicle.targetIndex + 1) % vehicle.path.length;
      return;
    }

    // Check for obstacles and other vehicles
    const obstacles = this.detectObstacles(vehicle);
    
    if (obstacles.length > 0) {
      // Implement collision avoidance
      this.avoidCollision(vehicle, obstacles);
    } else {
      // Move towards target
      const speed = this.getVehicleSpeed(vehicle);
      vehicle.vx = (dx / distance) * speed;
      vehicle.vy = (dy / distance) * speed;
      vehicle.angle = Math.atan2(dy, dx);
    }

    vehicle.x += vehicle.vx * deltaTime;
    vehicle.y += vehicle.vy * deltaTime;

    // Update metrics
    this.state.metrics.decisionsPerSecond = Math.random() * 5 + 10;
    this.state.metrics.avgResponseTime = Math.random() * 50 + 100;
  }

  private updateRegularVehicle(vehicle: Vehicle, deltaTime: number): void {
    vehicle.x += vehicle.vx * deltaTime;
    vehicle.y += vehicle.vy * deltaTime;

    // Keep vehicles on screen
    const rect = this.canvas.getBoundingClientRect();
    if (vehicle.x < -vehicle.width) vehicle.x = rect.width;
    if (vehicle.x > rect.width) vehicle.x = -vehicle.width;
  }

  private detectObstacles(vehicle: Vehicle): (Vehicle | Obstacle | Point)[] {
    const obstacles: (Vehicle | Obstacle | Point)[] = [];

    // Check other vehicles
    this.state.vehicles.forEach(other => {
      if (other.id !== vehicle.id) {
        const dx = other.x - vehicle.x;
        const dy = other.y - vehicle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < vehicle.sensorRadius) {
          obstacles.push(other);
        }
      }
    });

    // Check static obstacles
    this.state.obstacles.forEach(obstacle => {
      const dx = (obstacle.x + obstacle.width/2) - vehicle.x;
      const dy = (obstacle.y + obstacle.height/2) - vehicle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < vehicle.sensorRadius) {
        obstacles.push(obstacle);
      }
    });

    // Check pedestrians
    this.state.pedestrians.forEach(pedestrian => {
      const dx = pedestrian.x - vehicle.x;
      const dy = pedestrian.y - vehicle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < vehicle.sensorRadius) {
        obstacles.push(pedestrian);
      }
    });

    return obstacles;
  }

  private avoidCollision(vehicle: Vehicle, obstacles: (Vehicle | Obstacle | Point)[]): void {
    // Simple collision avoidance - slow down and slightly steer away
    const speed = this.getVehicleSpeed(vehicle) * 0.3; // Reduce speed
    
    // Find average position of obstacles
    let avgX = 0, avgY = 0;
    obstacles.forEach(obs => {
      if ('width' in obs && 'height' in obs) {
        // Obstacle type
        avgX += obs.x + obs.width/2;
        avgY += obs.y + obs.height/2;
      } else {
        // Vehicle or Point type
        avgX += obs.x;
        avgY += obs.y;
      }
    });
    avgX /= obstacles.length;
    avgY /= obstacles.length;

    // Steer away from obstacles
    const avoidX = vehicle.x - avgX;
    const avoidY = vehicle.y - avgY;
    const avoidDistance = Math.sqrt(avoidX * avoidX + avoidY * avoidY);

    if (avoidDistance > 0) {
      vehicle.vx = (avoidX / avoidDistance) * speed;
      vehicle.vy = (avoidY / avoidDistance) * speed;
      vehicle.angle = Math.atan2(avoidY, avoidX);
    }

    // Update safety metrics
    this.state.metrics.nearMisses++;
  }

  private getVehicleSpeed(vehicle: Vehicle): number {
    let baseSpeed = 2;
    
    // Adjust for weather
    switch (this.state.weather) {
      case 'rain':
        baseSpeed *= 0.8;
        break;
      case 'fog':
        baseSpeed *= 0.6;
        break;
      case 'snow':
        baseSpeed *= 0.5;
        break;
    }

    // Adjust for scenario
    if (this.state.scenario === 'school-zone') {
      baseSpeed *= 0.5;
    }

    return baseSpeed;
  }

  private updateMetrics(): void {
    this.state.metrics.processingTime = Math.random() * 2 + 1;
    this.state.metrics.successRate = Math.max(95, 100 - this.state.metrics.collisions * 5);
    
    const avgSpeed = this.state.vehicles.reduce((sum, v) => {
      return sum + Math.sqrt(v.vx * v.vx + v.vy * v.vy);
    }, 0) / this.state.vehicles.length;
    
    this.state.metrics.avgSpeed = Math.round(avgSpeed * 10);
    this.state.metrics.flowRate = Math.max(50, 100 - this.state.trafficDensity * 5);
    this.state.metrics.congestionLevel = this.state.trafficDensity > 7 ? 'High' : 
                                        this.state.trafficDensity > 4 ? 'Medium' : 'Low';
  }

  private render(): void {
    const rect = this.canvas.getBoundingClientRect();
    
    // Clear canvas
    this.ctx.fillStyle = '#F1F5F9';
    this.ctx.fillRect(0, 0, rect.width, rect.height);

    // Render roads
    this.renderRoads(rect);
    
    // Render obstacles
    this.renderObstacles();
    
    // Render pedestrians
    this.renderPedestrians();
    
    // Render vehicles
    this.renderVehicles();
    
    // Render weather effects
    this.renderWeatherEffects(rect);
  }

  private renderRoads(rect: DOMRect): void {
    this.ctx.fillStyle = '#64748B';
    
    // Horizontal road
    this.ctx.fillRect(0, rect.height * 0.4, rect.width, rect.height * 0.2);
    
    // Vertical road (for intersection)
    if (this.state.scenario === 'city-intersection') {
      this.ctx.fillRect(rect.width * 0.4, 0, rect.width * 0.2, rect.height);
    }

    // Road markings
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.setLineDash([10, 10]);
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, rect.height * 0.5);
    this.ctx.lineTo(rect.width, rect.height * 0.5);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  private renderObstacles(): void {
    this.state.obstacles.forEach(obstacle => {
      switch (obstacle.type) {
        case 'building':
          this.ctx.fillStyle = '#94A3B8';
          break;
        case 'construction':
          this.ctx.fillStyle = '#F59E0B';
          break;
        default:
          this.ctx.fillStyle = '#64748B';
      }
      
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }

  private renderPedestrians(): void {
    this.ctx.fillStyle = '#10B981';
    this.state.pedestrians.forEach(pedestrian => {
      this.ctx.beginPath();
      this.ctx.arc(pedestrian.x, pedestrian.y, 6, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  private renderVehicles(): void {
    this.state.vehicles.forEach(vehicle => {
      this.ctx.save();
      this.ctx.translate(vehicle.x + vehicle.width/2, vehicle.y + vehicle.height/2);
      this.ctx.rotate(vehicle.angle);
      
      // Render vehicle body
      this.ctx.fillStyle = vehicle.color;
      this.ctx.fillRect(-vehicle.width/2, -vehicle.height/2, vehicle.width, vehicle.height);
      
      // Render vehicle direction indicator
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fillRect(vehicle.width/2 - 5, -3, 5, 6);
      
      this.ctx.restore();

      // Render AI-specific visualizations
      if (vehicle.type === 'ai') {
        this.renderAIVisualizations(vehicle);
      }
    });
  }

  private renderAIVisualizations(vehicle: Vehicle): void {
    // Sensor radius
    if (this.state.showSensorRadius) {
      this.ctx.beginPath();
      this.ctx.arc(vehicle.x + vehicle.width/2, vehicle.y + vehicle.height/2, vehicle.sensorRadius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = '#8B5CF6';
      this.ctx.setLineDash([5, 5]);
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // Decision points
    if (this.state.showDecisionPoints && vehicle.path.length > 0) {
      this.ctx.fillStyle = '#F59E0B';
      vehicle.path.forEach(point => {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
        this.ctx.fill();
      });
    }

    // Path prediction
    if (this.state.showPathPrediction && vehicle.path.length > 0) {
      this.ctx.strokeStyle = '#2563EB';
      this.ctx.setLineDash([3, 3]);
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(vehicle.x + vehicle.width/2, vehicle.y + vehicle.height/2);
      vehicle.path.forEach(point => {
        this.ctx.lineTo(point.x, point.y);
      });
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }
  }

  private renderWeatherEffects(rect: DOMRect): void {
    if (this.state.weather === 'rain') {
      this.ctx.strokeStyle = '#3B82F6';
      this.ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 2, y + 10);
        this.ctx.stroke();
      }
    } else if (this.state.weather === 'fog') {
      this.ctx.fillStyle = 'rgba(156, 163, 175, 0.3)';
      this.ctx.fillRect(0, 0, rect.width, rect.height);
    } else if (this.state.weather === 'snow') {
      this.ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

  public getState(): SimulationState {
    return { ...this.state };
  }

  public reset(): void {
    this.pause();
    this.state = this.getInitialState();
    this.loadScenario(this.state.scenario);
  }
}
