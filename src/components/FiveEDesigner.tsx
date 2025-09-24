import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GripVertical, Plus, X, Merge, ChevronDown, Brain, Loader2, AlertCircle, CheckCircle, Edit3, Trash2, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

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

interface ResourceItem {
  id: string;
  name: string;
}

const fiveESteps: FiveEStep[] = [
  { id: 'engage', name: 'Engage/Elicit', description: '', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'explore', name: 'Explore', description: '', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'explain', name: 'Explain', description: '', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'elaborate', name: 'Elaborate', description: '', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'evaluate', name: 'Evaluate', description: '', color: 'bg-purple-100 text-purple-800 border-purple-200' },
];

// Sortable Resource Item Component
const SortableResourceItem: React.FC<{
  resource: ResourceItem;
  eloKey: string;
  stepId: string;
  index: number;
  onRemove: () => void;
  resourceTimeAllocations: any;
  stepTimes: any;
  generatedContentData: any;
  generatingContent: any;
  editGeneratedContent: (stepKey: string, resourceId: string) => void;
  deleteGeneratedContent: (stepKey: string, resourceId: string) => void;
}> = ({ 
  resource, 
  eloKey, 
  stepId, 
  index, 
  onRemove, 
  resourceTimeAllocations, 
  stepTimes, 
  generatedContentData, 
  generatingContent,
  editGeneratedContent,
  deleteGeneratedContent
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: resource.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const stepKey = `${eloKey}_${stepId}`;
  const resourceContent = generatedContentData[stepKey]?.[resource.id];
  const isGenerating = generatingContent[stepKey];

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="space-y-2">
      <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
        <div className="flex items-center gap-2">
          <div {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </div>
          <span className="text-sm text-gray-800 font-medium">• {resource.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">Estimated time:</span>
          <Badge variant="outline" className="text-xs font-semibold text-blue-700 border-blue-300">
            {resourceTimeAllocations[eloKey]?.[stepId]?.[resource.id] 
              ? `${resourceTimeAllocations[eloKey][stepId][resource.id]} min`
              : stepTimes[eloKey]?.[stepId] 
                ? 'Calculating...'
                : 'Enter time above'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Generated Content for this Resource */}
      {isGenerating ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-yellow-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Generating content for {resource.name}...</span>
          </div>
        </div>
      ) : resourceContent ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Generated Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => editGeneratedContent(stepKey, resource.id)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 h-6 text-xs px-2"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteGeneratedContent(stepKey, resource.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-6 text-xs px-2"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          <div className="bg-white rounded border border-emerald-200 p-3 max-h-48 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
              {resourceContent.length > 300 ? (
                <div>
                  {resourceContent.substring(0, 300)}...
                  <div className="mt-2 text-xs text-gray-500">
                    Content truncated. Click Edit to see full content.
                  </div>
                </div>
              ) : (
                resourceContent
              )}
            </pre>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const FiveEDesigner: React.FC<FiveEDesignerProps> = ({ elos = [], onFiveEChange, pedagogicalApproaches = [] }) => {
  const { toast } = useToast();
  const [activeELO, setActiveELO] = useState<string>(elos[0] || '');
  const [droppedSteps, setDroppedSteps] = useState<{[key: string]: FiveEStep[]}>({});
  const [stepDescriptions, setStepDescriptions] = useState<{[key: string]: {[stepId: string]: string}}>({});
  const [selectedResources, setSelectedResources] = useState<{[key: string]: {[stepId: string]: ResourceItem[]}}>({});
  const [draggedStep, setDraggedStep] = useState<FiveEStep | null>(null);
  const [selectedELOsToMerge, setSelectedELOsToMerge] = useState<string[]>([]);
  
  // State for custom resource entry
  const [customResourceInput, setCustomResourceInput] = useState<{[key: string]: {[key: string]: string}}>({});
  
  // State for step times and resource time allocations
  const [stepTimes, setStepTimes] = useState<{[key: string]: {[key: string]: string}}>({});
  const [resourceTimeAllocations, setResourceTimeAllocations] = useState<{[key: string]: {[key: string]: {[resourceId: string]: number}}}>({});
  const [isGeneratingTimeBasedContent, setIsGeneratingTimeBasedContent] = useState<{[key: string]: boolean}>({});
  const [apiKey, setApiKey] = useState<string>('');
  
  // New states for content generation
  const [perplexityApiKey, setPerplexityApiKey] = useState<string>('');
  const [generatingContent, setGeneratingContent] = useState<{[key: string]: boolean}>({});
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [contentGenerated, setContentGenerated] = useState<{[key: string]: boolean}>({});
  const [generatedContentData, setGeneratedContentData] = useState<{[key: string]: {[resourceId: string]: string}}>({});
  
  // Merge tracking state
  const [mergedELOs, setMergedELOs] = useState<{[mergedKey: string]: string[]}>({});
  const [originalELOData, setOriginalELOData] = useState<{
    droppedSteps: {[key: string]: FiveEStep[]};
    stepDescriptions: {[key: string]: {[stepId: string]: string}};
    selectedResources: {[key: string]: {[stepId: string]: ResourceItem[]}};
    generatedContentData: {[key: string]: {[resourceId: string]: string}};
    contentGenerated: {[key: string]: boolean};
  }>({
    droppedSteps: {},
    stepDescriptions: {},
    selectedResources: {},
    generatedContentData: {},
    contentGenerated: {}
  });
  
  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end for resource reordering
  const handleResourceDragEnd = (event: DragEndEvent, eloKey: string, stepId: string) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedResources(prev => {
        const resources = prev[eloKey]?.[stepId] || [];
        const oldIndex = resources.findIndex(resource => resource.id === active.id);
        const newIndex = resources.findIndex(resource => resource.id === over?.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          const newResources = [...resources];
          const [movedItem] = newResources.splice(oldIndex, 1);
          newResources.splice(newIndex, 0, movedItem);
          
          return {
            ...prev,
            [eloKey]: {
              ...prev[eloKey],
              [stepId]: newResources
            }
          };
        }
        return prev;
      });
    }
  };

  // All available resources across all 5E steps
  const getAllResources = (): string[] => {
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
    
    const allResources = Object.values(resourceMap).flat();
    return [...new Set(allResources)].sort();
  };

  const getResourcesForStep = (stepName: string): string[] => {
    return getAllResources();
  };
  
  const getELODisplayName = (eloKey: string) => {
    if (mergedELOs[eloKey]) {
      const originalCount = mergedELOs[eloKey].length;
      return `Merged: ${originalCount} ELOs`;
    }
    const originalIndex = elos.findIndex(elo => elo === eloKey);
    return originalIndex !== -1 ? `ELO ${originalIndex + 1}` : eloKey.substring(0, 20) + '...';
  };

  const getCurrentELOs = () => Object.keys(droppedSteps);

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
      setActiveELO(elos[0]);
    }
  }, [elos]);

  useEffect(() => {
    const currentELOs = getCurrentELOs();
    if (currentELOs.length > 0 && (!activeELO || !currentELOs.includes(activeELO))) {
      setActiveELO(currentELOs[0]);
    }
  }, [droppedSteps, activeELO]);

  const addApproachToDescription = (eloIndex: string, stepId: string, approach: string) => {
    setSelectedResources(prev => {
      const newResource: ResourceItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: approach
      };
      
      const updatedResources = {
        ...prev,
        [eloIndex]: {
          ...prev[eloIndex],
          [stepId]: [...(prev[eloIndex]?.[stepId] || []), newResource]
        }
      };
      
      const stepTime = stepTimes[eloIndex]?.[stepId];
      if (stepTime && stepTime.trim()) {
        setTimeout(() => {
          distributeTimeAmongResources(eloIndex, stepId, stepTime);
        }, 100);
      }
      
      return updatedResources;
    });
  };

  const removeResource = (eloIndex: string, stepId: string, resourceIndex: number) => {
    setSelectedResources(prev => ({
      ...prev,
      [eloIndex]: {
        ...prev[eloIndex],
        [stepId]: (prev[eloIndex]?.[stepId] || []).filter((_, index) => index !== resourceIndex)
      }
    }));
  };

  const addCustomResource = (eloKey: string, stepId: string) => {
    const customResource = customResourceInput[eloKey]?.[stepId]?.trim();
    if (customResource) {
      addApproachToDescription(eloKey, stepId, customResource);
      setCustomResourceInput(prev => ({
        ...prev,
        [eloKey]: {
          ...prev[eloKey],
          [stepId]: ''
        }
      }));
    }
  };

  const updateCustomResourceInput = (eloKey: string, stepId: string, value: string) => {
    setCustomResourceInput(prev => ({
      ...prev,
      [eloKey]: {
        ...prev[eloKey],
        [stepId]: value
      }
    }));
  };

  const updateStepTime = (eloKey: string, stepId: string, time: string) => {
    setStepTimes(prev => ({
      ...prev,
      [eloKey]: {
        ...prev[eloKey],
        [stepId]: time
      }
    }));
  };

  const distributeTimeAmongResources = async (eloKey: string, stepId: string, totalTime: string) => {
    const resources = selectedResources[eloKey]?.[stepId] || [];
    if (resources.length === 0 || !totalTime.trim()) return;

    try {
      const timeInMinutes = parseTimeToMinutes(totalTime);
      const timePerResource = Math.floor(timeInMinutes / resources.length);
      const remainder = timeInMinutes % resources.length;
      const allocations: {[resourceId: string]: number} = {};
      
      resources.forEach((resource, index) => {
        allocations[resource.id] = timePerResource + (index < remainder ? 1 : 0);
      });
      
      setResourceTimeAllocations(prev => {
        const updated = {
          ...prev,
          [eloKey]: {
            ...prev[eloKey],
            [stepId]: allocations
          }
        };
        return updated;
      });
        
    } catch (error) {
      console.error('Error distributing time:', error);
      toast({
        title: "Error",
        description: "Failed to distribute time among resources",
        variant: "destructive"
      });
    }
  };

  const parseTimeToMinutes = (timeStr: string): number => {
    const cleanTime = timeStr.toLowerCase().replace(/\s+/g, '');
    
    if (cleanTime.includes('hour')) {
      const hours = parseInt(cleanTime) || 1;
      return hours * 60;
    } else if (cleanTime.includes('min')) {
      return parseInt(cleanTime) || 30;
    } else {
      return parseInt(cleanTime) || 30;
    }
  };

  const editGeneratedContent = (stepKey: string, resourceId: string) => {
    const content = generatedContentData[stepKey]?.[resourceId] || '';
    const [eloIndex, stepId] = stepKey.split('_');
    const currentDescription = stepDescriptions[eloIndex]?.[stepId] || '';
    
    updateStepDescription(eloIndex, stepId, currentDescription + '\n\n' + content);
  };

  const deleteGeneratedContent = (stepKey: string, resourceId: string) => {
    setGeneratedContentData(prev => {
      const updated = { ...prev };
      if (updated[stepKey]) {
        delete updated[stepKey][resourceId];
        if (Object.keys(updated[stepKey]).length === 0) {
          delete updated[stepKey];
        }
      }
      return updated;
    });
    
    setContentGenerated(prev => {
      const updated = { ...prev };
      const hasAnyContent = generatedContentData[stepKey] && 
                           Object.keys(generatedContentData[stepKey]).length > 1;
      if (!hasAnyContent) {
        delete updated[stepKey];
      }
      return updated;
    });

    const resourceName = selectedResources[stepKey.split('_')[0]]?.[stepKey.split('_')[1]]?.find(r => r.id === resourceId)?.name || 'resource';
    toast({
      title: "Content Deleted",
      description: `Generated content for ${resourceName} has been removed.`,
    });
  };

  const updateStepDescription = (eloKey: string, stepId: string, description: string) => {
    setStepDescriptions(prev => ({
      ...prev,
      [eloKey]: {
        ...prev[eloKey],
        [stepId]: description
      }
    }));
  };

  const saveFiveEData = async () => {
    setIsSaving(true);
    
    try {
      const fiveEData: any = {};
      
      Object.keys(droppedSteps).forEach(eloKey => {
        fiveEData[eloKey] = {
          steps: droppedSteps[eloKey]?.map(step => ({
            id: step.id,
            name: step.name,
            description: stepDescriptions[eloKey]?.[step.id] || '',
            resources: selectedResources[eloKey]?.[step.id]?.map(r => r.name) || [],
            timeAllocations: resourceTimeAllocations[eloKey]?.[step.id] || {},
            generatedContent: generatedContentData[`${eloKey}_${step.id}`] || {}
          })) || []
        };
      });

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onFiveEChange(fiveEData);
      
      toast({
        title: "Success!",
        description: "5E Design has been saved successfully with generated content.",
      });
      
    } catch (error) {
      console.error('Error saving 5E data:', error);
      toast({
        title: "Error",
        description: "Failed to save 5E design. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {!apiKey && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p>Enter your Perplexity API key to enable AI-powered time distribution and content generation:</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="Enter Perplexity API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button onClick={() => {
                  if (apiKey) {
                    toast({
                      title: "API Key Saved",
                      description: "You can now use AI features for time distribution and content generation."
                    });
                  }
                }}>
                  Save
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* ELO Tabs with Drop Zones */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">5E Model Design by ELO</h3>
        </div>
        
        {elos.length > 0 ? (
          <Tabs value={activeELO} onValueChange={setActiveELO} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
              {getCurrentELOs().map((eloKey) => (
                <TabsTrigger key={eloKey} value={eloKey} className="text-xs px-2">
                  {getELODisplayName(eloKey)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {getCurrentELOs().map((eloKey) => (
              <TabsContent key={eloKey} value={eloKey} className="mt-0">
                <div className="space-y-6">
                  {droppedSteps[eloKey] && droppedSteps[eloKey].length > 0 ? (
                    <div className="space-y-4">
                      {droppedSteps[eloKey].map((step, index) => (
                        <Card key={step.id} className={`p-4 border-2 ${step.color} hover:shadow-md transition-all duration-200`}>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-semibold text-gray-800">{step.name}</h4>
                              <Badge variant="outline" className="text-sm">
                                Step {index + 1}
                              </Badge>
                            </div>
                            
                            <div className="space-y-4">
                              <Textarea
                                placeholder={`Describe the ${step.name} activities and objectives...`}
                                value={stepDescriptions[eloKey]?.[step.id] || ''}
                                onChange={(e) => updateStepDescription(eloKey, step.id, e.target.value)}
                                className="min-h-[100px] text-sm"
                              />
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-gray-700">Estimated Time</Label>
                                  <Input
                                    type="text"
                                    placeholder="e.g., 30 mins, 1 hour"
                                    value={stepTimes[eloKey]?.[step.id] || ''}
                                    onChange={(e) => updateStepTime(eloKey, step.id, e.target.value)}
                                    onBlur={() => {
                                      const time = stepTimes[eloKey]?.[step.id];
                                      if (time && time.trim()) {
                                        distributeTimeAmongResources(eloKey, step.id, time);
                                      }
                                    }}
                                    className="text-sm"
                                  />
                                </div>
                                
                                <div className="flex items-end">
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" size="sm" className="w-full">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Resources
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 p-0" align="start">
                                      <div className="p-3 border-b">
                                        <h4 className="font-medium text-sm text-gray-900">Add Resources</h4>
                                        <p className="text-xs text-gray-500 mt-1">Select from available resources or add custom</p>
                                      </div>
                                      
                                      <div className="p-3 border-b bg-gray-50">
                                        <div className="space-y-2">
                                          <label className="text-xs font-medium text-gray-700">Custom Resource:</label>
                                          <div className="flex gap-2">
                                            <input
                                              type="text"
                                              placeholder="Enter custom resource..."
                                              value={customResourceInput[eloKey]?.[step.id] || ''}
                                              onChange={(e) => updateCustomResourceInput(eloKey, step.id, e.target.value)}
                                              className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                              onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                  addCustomResource(eloKey, step.id);
                                                }
                                              }}
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => addCustomResource(eloKey, step.id)}
                                              className="px-2 py-1 text-xs h-auto"
                                              disabled={!customResourceInput[eloKey]?.[step.id]?.trim()}
                                            >
                                              Add
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="max-h-60 overflow-y-auto">
                                        {getAllResources().map((resource, index) => (
                                          <button
                                            key={index}
                                            onClick={() => addApproachToDescription(eloKey, step.id, resource)}
                                            className="w-full text-left px-3 py-2 text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 last:border-b-0"
                                          >
                                            {resource}
                                          </button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                {selectedResources[eloKey]?.[step.id]?.length > 0 && (
                                  <div className="space-y-3">
                                    <label className="text-sm font-medium text-gray-700">Selected Resources:</label>
                                    <DndContext
                                      sensors={sensors}
                                      collisionDetection={closestCenter}
                                      onDragEnd={(event) => handleResourceDragEnd(event, eloKey, step.id)}
                                    >
                                      <SortableContext
                                        items={selectedResources[eloKey][step.id].map(r => r.id)}
                                        strategy={verticalListSortingStrategy}
                                      >
                                        <div className="space-y-3">
                                          {selectedResources[eloKey][step.id].map((resource, index) => (
                                            <SortableResourceItem
                                              key={resource.id}
                                              resource={resource}
                                              eloKey={eloKey}
                                              stepId={step.id}
                                              index={index}
                                              onRemove={() => removeResource(eloKey, step.id, index)}
                                              resourceTimeAllocations={resourceTimeAllocations}
                                              stepTimes={stepTimes}
                                              generatedContentData={generatedContentData}
                                              generatingContent={generatingContent}
                                              editGeneratedContent={editGeneratedContent}
                                              deleteGeneratedContent={deleteGeneratedContent}
                                            />
                                          ))}
                                        </div>
                                      </SortableContext>
                                    </DndContext>
                                  </div>
                                )}
                              </div>
                            </div>
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
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base rounded-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Content & Saving...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Save 5E Design & Generate Content
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FiveEDesigner;
