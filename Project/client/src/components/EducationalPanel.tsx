import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChevronDown, ChevronUp, Route, Eye, Brain } from 'lucide-react';

export function EducationalPanel() {
  const [isExpanded, setIsExpanded] = useState(true);

  const concepts = [
    {
      icon: Route,
      title: 'Pathfinding',
      description: 'The AI uses A* algorithm to find the optimal path while considering real-time obstacles and traffic rules.',
      color: 'text-ai-blue',
      bgColor: 'bg-ai-blue/10'
    },
    {
      icon: Eye,
      title: 'Collision Detection',
      description: 'Advanced sensor simulation detects obstacles using bounding box calculations and predictive modeling.',
      color: 'text-ai-green',
      bgColor: 'bg-ai-green/10'
    },
    {
      icon: Brain,
      title: 'Decision Making',
      description: 'The AI evaluates multiple factors including safety, efficiency, and traffic laws to make optimal driving decisions.',
      color: 'text-ai-amber',
      bgColor: 'bg-ai-amber/10'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl">
            <GraduationCap className="w-6 h-6 text-ai-blue mr-3" />
            AI Concepts Explained
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concepts.map((concept, index) => {
              const IconComponent = concept.icon;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 hover:border-ai-blue transition-colors cursor-pointer"
                >
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 ${concept.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                      <IconComponent className={`w-5 h-5 ${concept.color}`} />
                    </div>
                    <h4 className="font-medium text-slate-900">{concept.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600">{concept.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
