import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GripVertical, Plus, X, Merge, ChevronDown } from 'lucide-react';

interface FiveEDesignerProps {
  elos: string[];
  onFiveEChange: (data: any) => void;
  pedagogicalApproaches?: string[];
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

const FiveEDesigner: React.FC<FiveEDesignerProps> = ({ elos = [], onFiveEChange, pedagogicalApproaches = [] }) => {
  const [activeELO, setActiveELO] = useState<string>(elos[0] || '');
  const [droppedSteps, setDroppedSteps] = useState<{[key: string]: FiveEStep[]}>({});
  const [stepDescriptions, setStepDescriptions] = useState<{[key: string]: {[stepId: string]: string}}>({});
  const [draggedStep, setDraggedStep] = useState<FiveEStep | null>(null);
  const [selectedELOsToMerge, setSelectedELOsToMerge] = useState<string[]>([]);
  
  // Resources for each 5E step
  const getResourcesForStep = (stepName: string): string[] => {
    const stepKey = stepName.toLowerCase().replace('/', '').replace(' ', '');
    const resourceMap: {[key: string]: string[]} = {
      'engageelicit': [
        'Paragraph reading',
        'Driving question with Image(s)',
        'Scenario based',
        'Provocative Questions and Discussions (open ended question)',
        'Debates and polls',
        'Think, pair, share',
        'Driving question on Pre-requisite',
        'Previous class quiz questions',
        'Discrepant Events and Demonstrations',
        'Unexpected phenomena or magic tricks',
        'Simple experiments',
        'Short videos or video clips',
        'Intriguing images or photos',
        'Infographics or data visualizations',
        'Personal anecdotes and stories',
        'Problem scenarios or case studies',
        'Relevant object presentation',
        'Newspaper articles',
        'Charts and graphic organizers',
        'Brainstorming sessions',
        'Writing prompts'
      ],
      'explore': [
        'Showcase the ELO dealt',
        'Create word wall',
        'Grammar aspects',
        'Real time examples',
        'Place holders for files from teachers',
        'Hands-on Experiments',
        'Investigate scenarios',
        'Interactive activities'
      ],
      'explain': [
        'Word wall for introduction of new words',
        'Lecturing',
        'Story telling',
        'Flip learning',
        'Extra information relevant to the topic',
        'Analogy',
        'Story board',
        'Concept explanations'
      ],
      'elaborate': [
        'Experiments',
        'Suggesting books to read',
        'Short stories',
        'Scenario demonstrations',
        'Visual and Multimedia Resources',
        'Placeholder for simulations',
        'Olabs and manim resources',
        'Phet simulations',
        'Extended activities'
      ],
      'evaluate': [
        'Quiz',
        'Exit card',
        'Questions',
        'Concept maps',
        'Puzzles',
        'Jigsaw activities',
        'Worksheet',
        'Provision to upload customized worksheets',
        'Assessment rubrics',
        'Peer evaluation'
      ]
    };
    
    return resourceMap[stepKey] || [];
  };
  
  // Pre-populate all 5E steps for each ELO on mount
  useEffect(() => {
    if (elos.length > 0 && Object.keys(droppedSteps).length === 0) {
      const initialSteps: {[key: string]: FiveEStep[]} = {};
      elos.forEach(elo => {
        initialSteps[elo] = fiveESteps.map((step, index) => ({
          ...step,
          id: `${step.id}_${elo}_${index}`
        }));
      });
      setDroppedSteps(initialSteps);
    }
  }, [elos]);

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

  const addApproachToDescription = (eloIndex: string, stepId: string, approach: string) => {
    const currentDescription = stepDescriptions[eloIndex]?.[stepId] || '';
    const newDescription = currentDescription ? `${currentDescription}\n• ${approach}` : `• ${approach}`;
    updateStepDescription(eloIndex, stepId, newDescription);
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

  const mergeELOs = () => {
    if (selectedELOsToMerge.length < 2) return;
    
    const mergedELOText = selectedELOsToMerge.join(' + ');
    
    // Merge the steps and descriptions
    const mergedSteps: FiveEStep[] = [];
    const mergedDescriptions: {[stepId: string]: string} = {};
    
    selectedELOsToMerge.forEach(elo => {
      const eloSteps = droppedSteps[elo] || [];
      eloSteps.forEach(step => {
        const existingStep = mergedSteps.find(s => s.name === step.name);
        if (existingStep) {
          const existingDesc = mergedDescriptions[existingStep.id] || '';
          const newDesc = stepDescriptions[elo]?.[step.id] || '';
          if (newDesc) {
            mergedDescriptions[existingStep.id] = existingDesc ? `${existingDesc}\n\n${newDesc}` : newDesc;
          }
        } else {
          const newStep = { ...step, id: `${step.id}_merged_${Date.now()}` };
          mergedSteps.push(newStep);
          mergedDescriptions[newStep.id] = stepDescriptions[elo]?.[step.id] || '';
        }
      });
    });
    
    // Update state with merged data
    const newDroppedSteps = { ...droppedSteps };
    const newStepDescriptions = { ...stepDescriptions };
    
    selectedELOsToMerge.forEach(elo => {
      delete newDroppedSteps[elo];
      delete newStepDescriptions[elo];
    });
    
    newDroppedSteps[mergedELOText] = mergedSteps;
    newStepDescriptions[mergedELOText] = mergedDescriptions;
    
    setDroppedSteps(newDroppedSteps);
    setStepDescriptions(newStepDescriptions);
    setSelectedELOsToMerge([]);
    setActiveELO(mergedELOText);
  };

  const saveFiveEData = () => {
    // Use the keys from droppedSteps which represent the current ELOs (including merged ones)
    const currentELOs = Object.keys(droppedSteps);
    const fiveEData = currentELOs.map(elo => ({
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
      {/* ELO Tabs with Drop Zones */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">5E Model Design by ELO</h3>
          
          {/* Merge ELOs Dropdown */}
          {elos.length > 1 && (
            <div className="flex items-center gap-3">
              <Select value="" onValueChange={(value) => {
                if (value && !selectedELOsToMerge.includes(value)) {
                  setSelectedELOsToMerge([...selectedELOsToMerge, value]);
                }
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select ELOs to merge" />
                </SelectTrigger>
                <SelectContent>
                  {elos.map((elo, index) => (
                    <SelectItem key={index} value={elo} disabled={selectedELOsToMerge.includes(elo)}>
                      ELO {index + 1}: {elo.substring(0, 50)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedELOsToMerge.length > 1 && (
                <Button
                  onClick={mergeELOs}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Merge className="w-4 h-4" />
                  Merge ({selectedELOsToMerge.length})
                </Button>
              )}
            </div>
          )}
        </div>

        {selectedELOsToMerge.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">Selected ELOs for merging:</p>
            <div className="flex flex-wrap gap-2">
              {selectedELOsToMerge.map((elo, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  ELO {elos.findIndex(e => e === elo) + 1}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedELOsToMerge(selectedELOsToMerge.filter(e => e !== elo))}
                    className="ml-1 h-auto p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {elos.length > 0 ? (
          <Tabs value={activeELO} onValueChange={setActiveELO}>
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none bg-white border-b border-gray-200 w-full p-0 mb-6">
              {elos.map((elo, index) => (
                <TabsTrigger 
                  key={index} 
                  value={elo}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-all duration-200 rounded-none bg-transparent"
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
                  className="min-h-[200px] border-2 border-dashed border-blue-300 rounded-xl p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 hover:bg-blue-50/70 transition-all duration-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, elo)}
                >
                  <h4 className="text-sm font-semibold text-blue-700 mb-4 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    5E Learning Sequence
                  </h4>
                  
                  {droppedSteps[elo] && droppedSteps[elo].length > 0 ? (
                    <div className="space-y-4">
                      {droppedSteps[elo].map((step, stepIndex) => (
                        <Card key={step.id} className="p-4 bg-white border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={step.color}>
                              {step.name}
                            </Badge>
                          </div>
                          
                           <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Activity Description</label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-xs">
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Resources
                                      <ChevronDown className="w-3 h-3 ml-1" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-80 p-0" align="end">
                                    <div className="p-3 border-b">
                                      <h4 className="font-medium text-sm text-gray-900">Select {step.name} Resources</h4>
                                      <p className="text-xs text-gray-500 mt-1">Click to add to the description</p>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                      {getResourcesForStep(step.name).map((resource, index) => (
                                        <button
                                          key={index}
                                          onClick={() => addApproachToDescription(elo, step.id, resource)}
                                          className="w-full text-left px-3 py-2 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                                        >
                                          {resource}
                                        </button>
                                      ))}
                                    </div>
                                  </PopoverContent>
                                </Popover>
                              </div>
                             <Textarea
                               placeholder={`Describe the ${step.name} activities for this ELO...`}
                               value={stepDescriptions[elo]?.[step.id] || ''}
                               onChange={(e) => updateStepDescription(elo, step.id, e.target.value)}
                               className="min-h-[100px] resize-none"
                             />
                           </div>
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