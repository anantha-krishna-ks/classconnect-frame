import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, X } from 'lucide-react';

interface FiveEDesignerProps {
  elos: string[];
  onFiveEChange: (data: any) => void;
}

interface FiveEStep {
  id: string;
  name: string;
  description: string;
  color: string;
}

const fiveESteps: FiveEStep[] = [
  { id: 'engage', name: 'Engage/Elicit', description: '', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'explore', name: 'Explore', description: '', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'explain', name: 'Explain', description: '', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'elaborate', name: 'Elaborate', description: '', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'evaluate', name: 'Evaluate', description: '', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

const FiveEDesigner: React.FC<FiveEDesignerProps> = ({ elos = [], onFiveEChange }) => {
  const [activeELO, setActiveELO] = useState<string>(elos[0] || '');
  const [droppedSteps, setDroppedSteps] = useState<{[key: string]: FiveEStep[]}>({});
  const [stepDescriptions, setStepDescriptions] = useState<{[key: string]: {[stepId: string]: string}}>({});
  const [draggedStep, setDraggedStep] = useState<FiveEStep | null>(null);

  const handleDragStart = (e: React.DragEvent, step: FiveEStep) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, eloIndex: string) => {
    e.preventDefault();
    if (!draggedStep) return;

    const newStep = { ...draggedStep, id: `${draggedStep.id}_${Date.now()}` };
    setDroppedSteps(prev => ({
      ...prev,
      [eloIndex]: [...(prev[eloIndex] || []), newStep]
    }));
    setDraggedStep(null);
  };

  const removeStep = (eloIndex: string, stepId: string) => {
    setDroppedSteps(prev => ({
      ...prev,
      [eloIndex]: (prev[eloIndex] || []).filter(step => step.id !== stepId)
    }));
    
    setStepDescriptions(prev => ({
      ...prev,
      [eloIndex]: {
        ...prev[eloIndex],
        [stepId]: ''
      }
    }));
  };

  const updateStepDescription = (eloIndex: string, stepId: string, description: string) => {
    setStepDescriptions(prev => ({
      ...prev,
      [eloIndex]: {
        ...prev[eloIndex],
        [stepId]: description
      }
    }));
  };

  const saveFiveEData = () => {
    const fiveEData = elos.map(elo => ({
      elo,
      steps: (droppedSteps[elo] || []).map(step => ({
        ...step,
        description: stepDescriptions[elo]?.[step.id] || ''
      }))
    }));
    onFiveEChange(fiveEData);
  };

  return (
    <div className="space-y-8">
      {/* Available 5E Steps for Dragging */}
      <Card className="p-6 bg-white border-2 border-dashed border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Available 5E Steps</h3>
        <p className="text-sm text-gray-600 mb-4">Drag and drop these steps into the ELO tabs below</p>
        
        <div className="flex flex-wrap gap-3">
          {fiveESteps.map((step) => (
            <Badge
              key={step.name}
              draggable
              onDragStart={(e) => handleDragStart(e, step)}
              className={`${step.color} cursor-grab active:cursor-grabbing px-4 py-2 text-sm font-medium border-2 hover:shadow-md transition-shadow`}
            >
              <GripVertical className="w-3 h-3 mr-1" />
              {step.name}
            </Badge>
          ))}
        </div>
      </Card>

      {/* ELO Tabs with Drop Zones */}
      <Card className="p-6 bg-white border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">5E Model Design by ELO</h3>
        
        {elos.length > 0 ? (
          <Tabs value={activeELO} onValueChange={setActiveELO}>
            <TabsList className="flex overflow-x-auto bg-muted/30 p-1 rounded-lg mb-6 gap-1">
              {elos.map((elo, index) => (
                <TabsTrigger 
                  key={index} 
                  value={elo}
                  className="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-background/50 transition-all min-w-fit flex-shrink-0"
                >
                  ELO {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {elos.map((elo, index) => (
              <TabsContent key={index} value={elo} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Learning Outcome</h4>
                  <p className="text-sm text-gray-600">{elo}</p>
                </div>

                {/* Drop Zone for 5E Steps */}
                <div 
                  className="min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50/50"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, elo)}
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-4">5E Learning Sequence</h4>
                  
                  {droppedSteps[elo] && droppedSteps[elo].length > 0 ? (
                    <div className="space-y-4">
                      {droppedSteps[elo].map((step, stepIndex) => (
                        <Card key={step.id} className="p-4 bg-white border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={step.color}>
                              {step.name}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStep(elo, step.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <Textarea
                            placeholder={`Describe the ${step.name} activities for this ELO...`}
                            value={stepDescriptions[elo]?.[step.id] || ''}
                            onChange={(e) => updateStepDescription(elo, step.id, e.target.value)}
                            className="min-h-[100px] resize-none"
                          />
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="mb-2">Drop 5E steps here</div>
                      <div className="text-sm">Drag steps from above to organize this ELO's learning sequence</div>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-2">No ELOs available</div>
            <div className="text-sm">Complete previous steps to load Expected Learning Outcomes</div>
          </div>
        )}

        {elos.length > 0 && Object.keys(droppedSteps).length > 0 && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={saveFiveEData}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base rounded-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Save 5E Design
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FiveEDesigner;