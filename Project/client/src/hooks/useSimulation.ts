import { useState, useEffect, useRef, useCallback } from 'react';
import { SimulationEngine, SimulationState } from '@/lib/simulation-engine';

export function useSimulation(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [state, setState] = useState<SimulationState | null>(null);
  const engineRef = useRef<SimulationEngine | null>(null);

  useEffect(() => {
    const initializeEngine = () => {
      console.log('Trying to initialize engine, canvas:', canvasRef.current);
      if (canvasRef.current && !engineRef.current) {
        try {
          console.log('Creating simulation engine...');
          engineRef.current = new SimulationEngine(canvasRef.current);
          console.log('Engine created successfully');
          setState(engineRef.current.getState());
        } catch (error) {
          console.error('Failed to initialize simulation engine:', error);
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    const frame = requestAnimationFrame(() => {
      initializeEngine();
      
      // If still not ready, try again with longer delay
      if (!engineRef.current) {
        const timeout = setTimeout(initializeEngine, 500);
        return () => clearTimeout(timeout);
      }
    });

    const handleResize = () => {
      engineRef.current?.resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef.current]); // Depend on actual canvas element

  const updateState = useCallback(() => {
    if (engineRef.current) {
      setState(engineRef.current.getState());
    }
  }, []);

  const toggleSimulation = useCallback(() => {
    if (engineRef.current) {
      const currentState = engineRef.current.getState();
      if (currentState.isRunning) {
        engineRef.current.pause();
      } else {
        engineRef.current.start();
      }
      updateState();
    }
  }, [updateState]);

  const setSpeed = useCallback((speed: number) => {
    if (engineRef.current) {
      engineRef.current.setSpeed(speed);
      updateState();
    }
  }, [updateState]);

  const setTrafficDensity = useCallback((density: number) => {
    if (engineRef.current) {
      engineRef.current.setTrafficDensity(density);
      updateState();
    }
  }, [updateState]);

  const setWeather = useCallback((weather: 'clear' | 'rain' | 'fog' | 'snow') => {
    if (engineRef.current) {
      engineRef.current.setWeather(weather);
      updateState();
    }
  }, [updateState]);

  const toggleSensorRadius = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleSensorRadius();
      updateState();
    }
  }, [updateState]);

  const toggleDecisionPoints = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.toggleDecisionPoints();
      updateState();
    }
  }, [updateState]);

  const togglePathPrediction = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.togglePathPrediction();
      updateState();
    }
  }, [updateState]);

  const loadScenario = useCallback((scenario: string) => {
    if (engineRef.current) {
      engineRef.current.loadScenario(scenario);
      updateState();
    }
  }, [updateState]);

  const reset = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
      updateState();
    }
  }, [updateState]);

  // Update state periodically while simulation is running
  useEffect(() => {
    if (state?.isRunning) {
      const interval = setInterval(updateState, 100);
      return () => clearInterval(interval);
    }
  }, [state?.isRunning, updateState]);

  return {
    state,
    toggleSimulation,
    setSpeed,
    setTrafficDensity,
    setWeather,
    toggleSensorRadius,
    toggleDecisionPoints,
    togglePathPrediction,
    loadScenario,
    reset
  };
}
