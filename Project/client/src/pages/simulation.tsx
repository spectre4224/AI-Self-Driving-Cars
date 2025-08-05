import { Car, HelpCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkingSimulation } from '@/components/WorkingSimulation';
import { EducationalPanel } from '@/components/EducationalPanel';

export default function Simulation() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-ai-blue rounded-lg flex items-center justify-center">
                  <Car className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">AI Self-Driving Cars</h1>
                  <p className="text-sm text-slate-500">Interactive Simulation Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Simulation */}
        <WorkingSimulation />

        {/* Educational Panel */}
        <div className="mt-6">
          <EducationalPanel />
        </div>
      </div>
    </div>
  );
}
