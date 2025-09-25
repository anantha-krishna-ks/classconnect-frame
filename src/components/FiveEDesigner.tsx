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
import { GripVertical, Plus, X, Merge, ChevronDown, Brain, Loader2, AlertCircle, CheckCircle, Edit3, RefreshCw, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const { toast } = useToast();
  const [activeELO, setActiveELO] = useState<string>(elos[0] || '');
  const [droppedSteps, setDroppedSteps] = useState<{[key: string]: FiveEStep[]}>({});
  const [stepDescriptions, setStepDescriptions] = useState<{[key: string]: {[stepId: string]: string}}>({});
  const [selectedResources, setSelectedResources] = useState<{[key: string]: {[stepId: string]: string[]}}>({});
  const [draggedStep, setDraggedStep] = useState<FiveEStep | null>(null);
  const [selectedELOsToMerge, setSelectedELOsToMerge] = useState<string[]>([]);
  
  // State for custom resource entry
  const [customResourceInput, setCustomResourceInput] = useState<{[key: string]: {[key: string]: string}}>({});
  
  // State for step times and resource time allocations
  const [stepTimes, setStepTimes] = useState<{[key: string]: {[key: string]: string}}>({});
  const [resourceTimeAllocations, setResourceTimeAllocations] = useState<{[key: string]: {[key: string]: {[resource: string]: number}}}>({});
  const [generatingContent, setGeneratingContent] = useState<{[key: string]: boolean}>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [contentGenerated, setContentGenerated] = useState<{[key: string]: boolean}>({});
  const [generatedContentData, setGeneratedContentData] = useState<{[key: string]: {[resourceName: string]: string}}>({});
  // Drag state for reordering resources within a step
  const [draggingResource, setDraggingResource] = useState<{eloKey: string; stepId: string; index: number} | null>(null);
  
  // Edit content state
  const [editingContent, setEditingContent] = useState<{stepKey: string; resourceName: string} | null>(null);
  const [editedContent, setEditedContent] = useState('');
  
  // Merge tracking state
  const [mergedELOs, setMergedELOs] = useState<{[mergedKey: string]: string[]}>({});
  const [originalELOData, setOriginalELOData] = useState<{
    droppedSteps: {[key: string]: FiveEStep[]};
    stepDescriptions: {[key: string]: {[stepId: string]: string}};
    selectedResources: {[key: string]: {[stepId: string]: string[]}};
    generatedContentData: {[key: string]: {[resourceName: string]: string}};
    contentGenerated: {[key: string]: boolean};
  }>({
    droppedSteps: {},
    stepDescriptions: {},
    selectedResources: {},
    generatedContentData: {},
    contentGenerated: {}
  });
  
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
    
    // Combine all resources and remove duplicates
    const allResources = Object.values(resourceMap).flat();
    return [...new Set(allResources)].sort();
  };

  // Resources for each 5E step (kept for backward compatibility)
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
  
  // Helper function to get display name for ELO
  const getELODisplayName = (eloKey: string) => {
    if (mergedELOs[eloKey]) {
      const originalCount = mergedELOs[eloKey].length;
      return `Merged: ${originalCount} ELOs`;
    }
    const originalIndex = elos.findIndex(elo => elo === eloKey);
    return originalIndex !== -1 ? `ELO ${originalIndex + 1}` : eloKey.substring(0, 20) + '...';
  };

  // Get current available ELOs (dynamic based on droppedSteps)
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

  // Validate activeELO whenever droppedSteps changes
  useEffect(() => {
    const currentELOs = getCurrentELOs();
    if (currentELOs.length > 0 && (!activeELO || !currentELOs.includes(activeELO))) {
      setActiveELO(currentELOs[0]);
    }
  }, [droppedSteps, activeELO]);

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

  // Add custom resource function
  const addCustomResource = (eloKey: string, stepId: string) => {
    const customResource = customResourceInput[eloKey]?.[stepId]?.trim();
    if (customResource) {
      addApproachToDescription(eloKey, stepId, customResource);
      // Clear the input after adding
      setCustomResourceInput(prev => ({
        ...prev,
        [eloKey]: {
          ...prev[eloKey],
          [stepId]: ''
        }
      }));
    }
  };

  // Update custom resource input
  const updateCustomResourceInput = (eloKey: string, stepId: string, value: string) => {
    setCustomResourceInput(prev => ({
      ...prev,
      [eloKey]: {
        ...prev[eloKey],
        [stepId]: value
      }
    }));
  };

  // Update step time
  const updateStepTime = (eloKey: string, stepId: string, time: string) => {
    setStepTimes(prev => ({
      ...prev,
      [eloKey]: {
        ...prev[eloKey],
        [stepId]: time
      }
    }));
  };

  // Distribute time among resources using AI
  const distributeTimeAmongResources = async (eloKey: string, stepId: string, totalTime: string) => {
    const resources = selectedResources[eloKey]?.[stepId] || [];
    if (resources.length === 0 || !totalTime.trim()) return;

    console.log('Distributing time:', { eloKey, stepId, totalTime, resources });

    try {
      // Parse total time (assume format like "30 mins", "1 hour", etc.)
      const timeInMinutes = parseTimeToMinutes(totalTime);
      console.log('Time in minutes:', timeInMinutes);
      
      // Simple equal distribution (always use this for reliability)
      const timePerResource = Math.floor(timeInMinutes / resources.length);
      const remainder = timeInMinutes % resources.length;
      const allocations: {[resource: string]: number} = {};
      
      resources.forEach((resource, index) => {
        // Distribute remainder among first few resources
        allocations[resource] = timePerResource + (index < remainder ? 1 : 0);
      });
      
      console.log('Allocations:', allocations);
      
      setResourceTimeAllocations(prev => {
        const updated = {
          ...prev,
          [eloKey]: {
            ...prev[eloKey],
            [stepId]: allocations
          }
        };
        console.log('Updated allocations state:', updated);
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

  // Parse time string to minutes
  const parseTimeToMinutes = (timeStr: string): number => {
    const cleanTime = timeStr.toLowerCase().replace(/\s+/g, '');
    
    if (cleanTime.includes('hour')) {
      const hours = parseInt(cleanTime) || 1;
      return hours * 60;
    } else if (cleanTime.includes('min')) {
      return parseInt(cleanTime) || 30;
    } else {
      // Assume minutes if no unit specified
      return parseInt(cleanTime) || 30;
    }
  };


  const addApproachToDescription = (eloIndex: string, stepId: string, approach: string) => {
    setSelectedResources(prev => {
      const updatedResources = {
        ...prev,
        [eloIndex]: {
          ...prev[eloIndex],
          [stepId]: [...(prev[eloIndex]?.[stepId] || []), approach]
        }
      };
      
      // Auto-redistribute time if time is already set
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

  // Drag-and-drop handlers for resources within a step
  const handleResourceDragStart = (
    e: React.DragEvent,
    eloKey: string,
    stepId: string,
    index: number
  ) => {
    setDraggingResource({ eloKey, stepId, index });
    e.dataTransfer.effectAllowed = 'move';
    // Fallback for some browsers to transfer data
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({ eloKey, stepId, index })
    );
  };

  const handleResourceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleResourceDrop = (
    e: React.DragEvent,
    eloKey: string,
    stepId: string,
    dropIndex: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    let source = draggingResource;
    try {
      const data = e.dataTransfer.getData('text/plain');
      if (!source && data) source = JSON.parse(data);
    } catch {}

    if (!source) return;

    // Only allow reordering within the same step
    if (source.eloKey === eloKey && source.stepId === stepId) {
      setSelectedResources(prev => {
        const current = [...(prev[eloKey]?.[stepId] || [])];
        const [moved] = current.splice(source!.index, 1);
        const insertIndex = dropIndex > source!.index ? dropIndex - 1 : dropIndex;
        current.splice(insertIndex, 0, moved);
        return {
          ...prev,
          [eloKey]: {
            ...prev[eloKey],
            [stepId]: current,
          },
        };
      });
    }

    setDraggingResource(null);
  };

  const handleResourceDragEnd = () => setDraggingResource(null);

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
    
    // Store original data before merging
    const originalData = {
      droppedSteps: {...droppedSteps},
      stepDescriptions: {...stepDescriptions},
      selectedResources: {...selectedResources},
      generatedContentData: {...generatedContentData},
      contentGenerated: {...contentGenerated}
    };
    
    setOriginalELOData(prev => ({
      ...prev,
      ...originalData
    }));
    
    // Track this merge
    setMergedELOs(prev => ({
      ...prev,
      [mergedELOText]: [...selectedELOsToMerge]
    }));
    
    // Merge the steps and descriptions
    const mergedSteps: FiveEStep[] = [];
    const mergedDescriptions: {[stepId: string]: string} = {};
    const mergedSelectedResources: {[stepId: string]: string[]} = {};
    let mergedGeneratedContent: {[resourceName: string]: string} = {};
    const mergedContentGenerated: {[key: string]: boolean} = {};
    
    // First pass: collect all unique steps across all selected ELOs
    const stepsByName: {[stepName: string]: {
      steps: Array<{step: FiveEStep, elo: string}>,
      resources: Array<{resource: string, elo: string}>,
      descriptions: Array<{description: string, elo: string}>,
      content: Array<{resourceName: string, content: string, elo: string}>
    }} = {};

    selectedELOsToMerge.forEach(elo => {
      const eloSteps = droppedSteps[elo] || [];
      eloSteps.forEach(step => {
        if (!stepsByName[step.name]) {
          stepsByName[step.name] = { steps: [], resources: [], descriptions: [], content: [] };
        }
        
        stepsByName[step.name].steps.push({ step, elo });
        
        // Collect resources
        const resources = selectedResources[elo]?.[step.id] || [];
        resources.forEach(resource => {
          stepsByName[step.name].resources.push({ resource, elo });
        });
        
        // Collect descriptions
        const description = stepDescriptions[elo]?.[step.id] || '';
        if (description) {
          stepsByName[step.name].descriptions.push({ description, elo });
        }
        
        // Collect generated content
        const stepKey = `${elo}_${step.id}`;
        const stepContent = generatedContentData[stepKey] || {};
        Object.entries(stepContent).forEach(([resourceName, content]) => {
          stepsByName[step.name].content.push({ resourceName, content, elo });
        });
      });
    });

    // Second pass: create merged steps with combined data
    Object.entries(stepsByName).forEach(([stepName, data]) => {
      const newStep = { 
        ...data.steps[0].step, 
        id: `${stepName.toLowerCase().replace(/[^a-z0-9]/g, '')}_merged_${Date.now()}` 
      };
      mergedSteps.push(newStep);
      
      // Merge descriptions from all ELOs
      const combinedDescription = data.descriptions.length > 0 
        ? data.descriptions.map(d => `--- From ${d.elo} ---\n${d.description}`).join('\n\n')
        : '';
      mergedDescriptions[newStep.id] = combinedDescription;
      
      // Merge unique resources
      const uniqueResources = [...new Set(data.resources.map(r => r.resource))];
      mergedSelectedResources[newStep.id] = uniqueResources;
      
      // Merge content by resource name
      const resourceContentMap: {[resourceName: string]: string[]} = {};
      data.content.forEach(({ resourceName, content, elo }) => {
        if (!resourceContentMap[resourceName]) {
          resourceContentMap[resourceName] = [];
        }
        resourceContentMap[resourceName].push(`--- From ${elo} ---\n${content}`);
      });
      
      // Combine content for each resource
      Object.entries(resourceContentMap).forEach(([resourceName, contents]) => {
        mergedGeneratedContent[resourceName] = contents.join('\n\n');
      });
      
      // Mark as generated if any source had generated content
      const mergedStepKey = `${mergedELOText}_${newStep.id}`;
      const hasGeneratedContent = data.content.length > 0;
      if (hasGeneratedContent) {
        mergedContentGenerated[mergedStepKey] = true;
      }
    });
    
    // Update state with merged data
    const newDroppedSteps = { ...droppedSteps };
    const newStepDescriptions = { ...stepDescriptions };
    const newSelectedResources = { ...selectedResources };
    const newGeneratedContentData = { ...generatedContentData };
    const newContentGenerated = { ...contentGenerated };
    
    selectedELOsToMerge.forEach(elo => {
      delete newDroppedSteps[elo];
      delete newStepDescriptions[elo];
      delete newSelectedResources[elo];
      
      // Clean up generated content for removed ELOs
      Object.keys(newGeneratedContentData).forEach(key => {
        if (key.startsWith(`${elo}_`)) {
          delete newGeneratedContentData[key];
        }
      });
      Object.keys(newContentGenerated).forEach(key => {
        if (key.startsWith(`${elo}_`)) {
          delete newContentGenerated[key];
        }
      });
    });
    
    // Add merged data
    newDroppedSteps[mergedELOText] = mergedSteps;
    newStepDescriptions[mergedELOText] = mergedDescriptions;
    newSelectedResources[mergedELOText] = mergedSelectedResources;
    
    // Add merged generated content properly structured by step
    mergedSteps.forEach(step => {
      const mergedStepKey = `${mergedELOText}_${step.id}`;
      if (Object.keys(mergedGeneratedContent).length > 0) {
        newGeneratedContentData[mergedStepKey] = {...mergedGeneratedContent};
        newContentGenerated[mergedStepKey] = mergedContentGenerated[mergedStepKey] || false;
      }
    });
    
    setDroppedSteps(newDroppedSteps);
    setStepDescriptions(newStepDescriptions);
    setSelectedResources(newSelectedResources);
    setGeneratedContentData(newGeneratedContentData);
    setContentGenerated(newContentGenerated);
    setSelectedELOsToMerge([]);
    setActiveELO(mergedELOText);
    
    toast({
      title: "ELOs Merged Successfully",
      description: `Merged ${selectedELOsToMerge.length} ELOs with all their content and resources.`,
    });
  };

  const demergeELO = (mergedELOText: string) => {
    const originalELOs = mergedELOs[mergedELOText];
    if (!originalELOs) return;
    
    // Restore original data for the ELOs that were merged
    const newDroppedSteps = { ...droppedSteps };
    const newStepDescriptions = { ...stepDescriptions };
    const newSelectedResources = { ...selectedResources };
    const newGeneratedContentData = { ...generatedContentData };
    const newContentGenerated = { ...contentGenerated };
    
    // Remove merged ELO
    delete newDroppedSteps[mergedELOText];
    delete newStepDescriptions[mergedELOText];
    delete newSelectedResources[mergedELOText];
    
    // Clean up merged generated content
    Object.keys(newGeneratedContentData).forEach(key => {
      if (key.startsWith(`${mergedELOText}_`)) {
        delete newGeneratedContentData[key];
      }
    });
    Object.keys(newContentGenerated).forEach(key => {
      if (key.startsWith(`${mergedELOText}_`)) {
        delete newContentGenerated[key];
      }
    });
    
    // Restore original ELOs
    originalELOs.forEach(elo => {
      if (originalELOData.droppedSteps[elo]) {
        newDroppedSteps[elo] = originalELOData.droppedSteps[elo];
        newStepDescriptions[elo] = originalELOData.stepDescriptions[elo] || {};
        newSelectedResources[elo] = originalELOData.selectedResources[elo] || {};
        
        // Restore generated content
        Object.keys(originalELOData.generatedContentData).forEach(key => {
          if (key.startsWith(`${elo}_`)) {
            newGeneratedContentData[key] = originalELOData.generatedContentData[key];
          }
        });
        Object.keys(originalELOData.contentGenerated).forEach(key => {
          if (key.startsWith(`${elo}_`)) {
            newContentGenerated[key] = originalELOData.contentGenerated[key];
          }
        });
      }
    });
    
    setDroppedSteps(newDroppedSteps);
    setStepDescriptions(newStepDescriptions);
    setSelectedResources(newSelectedResources);
    setGeneratedContentData(newGeneratedContentData);
    setContentGenerated(newContentGenerated);
    
    // Remove from merged tracking
    setMergedELOs(prev => {
      const updated = { ...prev };
      delete updated[mergedELOText];
      return updated;
    });
    
    setActiveELO(originalELOs[0]);
    
    toast({
      title: "ELOs De-merged Successfully", 
      description: `Restored ${originalELOs.length} original ELOs with their content.`,
    });
  };

  const saveFiveEData = async () => {
    console.log('Starting save process...');

    setIsSaving(true);
    let generatedCount = 0;
    let errorCount = 0;
    
    try {
      // Use the keys from droppedSteps which represent the current ELOs (including merged ones)
      const currentELOs = Object.keys(droppedSteps);
      console.log('Current ELOs:', currentELOs);
      
      // Check for steps with resources
      let stepsToGenerate = 0;
      for (const elo of currentELOs) {
        const steps = droppedSteps[elo] || [];
        for (const step of steps) {
          const selectedResourcesForStep = selectedResources[elo]?.[step.id] || [];
          console.log(`Checking step ${step.name} in ${elo}:`, selectedResourcesForStep);
          
          // Check if there are any selected resources for this step
          const hasResources = selectedResourcesForStep.length > 0;
          
          if (hasResources) {
            stepsToGenerate++;
          }
        }
      }
      
      if (stepsToGenerate === 0) {
        toast({
          title: "No Resources Found",
          description: "Please add resources to at least one step before generating content.",
          variant: "destructive"
        });
        return;
      }
      
      console.log(`Found ${stepsToGenerate} steps with resources to generate content for`);
      
      // Generate content for all steps first
      for (const elo of currentELOs) {
        const steps = droppedSteps[elo] || [];
        for (const step of steps) {
          const selectedResourcesForStep = selectedResources[elo]?.[step.id] || [];
          
          // Check if there are any selected resources for this step
          const hasResources = selectedResourcesForStep.length > 0;
          
          if (hasResources) {
            console.log(`Generating content for ${step.name} in ${elo}`);
            const success = await generateContentForStep(elo, step.id, step.name);
            if (success) {
              generatedCount++;
            } else {
              errorCount++;
            }
          }
        }
      }
      
      // Prepare final data with all content, resources, and generated data
      const fiveEData = {
        eloSteps: currentELOs.map(elo => ({
          elo,
          steps: (droppedSteps[elo] || []).map(step => ({
            ...step,
            description: stepDescriptions[elo]?.[step.id] || '',
            resources: selectedResources[elo]?.[step.id] || [],
            stepTime: stepTimes[elo]?.[step.id] || '',
            resourceTimeAllocations: resourceTimeAllocations[elo]?.[step.id] || {},
          }))
        })),
        generatedContentData: generatedContentData,
        contentGenerated: contentGenerated,
        selectedResources: selectedResources,
        stepDescriptions: stepDescriptions,
        stepTimes: stepTimes,
        resourceTimeAllocations: resourceTimeAllocations
      };
      
      onFiveEChange(fiveEData);
      
      // Show success message
      if (generatedCount > 0) {
        toast({
          title: "Content Generated Successfully",
          description: `Generated content for ${generatedCount} step(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`,
        });
      }
      
    } catch (error) {
      console.error('Error in save process:', error);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Predefined content templates for different resources
  const getPredefinedContent = (stepName: string, resourceType: string, eloIndex: string): string => {
    const contentTemplates = {
      quiz: {
        'Engage/Elicit': `**${stepName} Quiz: Prior Knowledge Assessment**

1. What do you already know about ${eloIndex.toLowerCase()}?
   a) I know a lot about this topic
   b) I've heard about it but don't know much
   c) This is completely new to me
   d) I'm not sure
   
2. Which of the following best describes your interest in learning about ${eloIndex.toLowerCase()}?
   a) Very interested - I want to learn everything
   b) Somewhat interested - sounds useful
   c) Not very interested - but willing to learn
   d) I'd rather learn something else
   
3. How do you think ${eloIndex.toLowerCase()} might be relevant to your daily life?
   a) Very relevant - I see connections everywhere
   b) Somewhat relevant - in specific situations
   c) Not very relevant - but good to know
   d) I don't see the connection yet
   
4. What questions do you have about ${eloIndex.toLowerCase()}?
   [Open-ended response area]
   
5. Rate your confidence level in learning this topic:
   a) Very confident - I learn new things easily
   b) Confident - with some effort I can master it
   c) Somewhat confident - might need extra help
   d) Not confident - this seems challenging

**Answer Key:**
All answers are valid as this is a prior knowledge assessment. Use responses to gauge student readiness and adjust instruction accordingly.`,

        'Explore': `**${stepName} Discovery Quiz**

1. Based on your exploration activities, what patterns did you notice?
   a) Clear, consistent patterns
   b) Some patterns with exceptions
   c) No clear patterns yet
   d) Conflicting information
   
2. What was the most surprising discovery during your exploration?
   [Open-ended response]
   
3. Which exploration method gave you the most useful information?
   a) Hands-on experimentation
   b) Research and reading
   c) Discussion with peers
   d) Teacher demonstrations
   
4. What connections can you make between your findings and ${eloIndex.toLowerCase()}?
   [Open-ended response]
   
5. What questions emerged from your exploration that you'd like to investigate further?
   [Open-ended response]

**Teacher Notes:**
Use student responses to guide the transition to the Explain phase. Address common misconceptions and build on student discoveries.`,

        'Explain': `**${stepName} Comprehension Check**

1. The key concept of ${eloIndex.toLowerCase()} can be defined as:
   a) [Correct definition]
   b) [Common misconception A]
   c) [Common misconception B]
   d) [Incomplete definition]
   
2. Which example best demonstrates ${eloIndex.toLowerCase()}?
   a) [Clear example]
   b) [Non-example that might confuse]
   c) [Partial example]
   d) [Unrelated example]
   
3. The main components of ${eloIndex.toLowerCase()} include:
   a) Components A, B, and C
   b) Components A and B only
   c) Components B, C, and D
   d) Component A only
   
4. How does ${eloIndex.toLowerCase()} relate to what we learned previously?
   a) It builds directly on previous concepts
   b) It's completely separate from previous learning
   c) It contradicts what we learned before
   d) It's somewhat related but distinct
   
5. The most important thing to remember about ${eloIndex.toLowerCase()} is:
   a) [Key takeaway A]
   b) [Key takeaway B]
   c) [Detail that's not central]
   d) [Common confusion]

**Answer Key:** 1-a, 2-a, 3-a, 4-a, 5-a (Customize based on your specific content)`,

        'Elaborate': `**${stepName} Application Quiz**

1. In a real-world scenario, ${eloIndex.toLowerCase()} would be most useful when:
   a) [Practical application A]
   b) [Practical application B]
   c) [Less relevant situation]
   d) [Irrelevant situation]
   
2. If you had to teach ${eloIndex.toLowerCase()} to a younger student, you would:
   a) Use simple examples and analogies
   b) Give them the textbook definition
   c) Show them complex applications
   d) Tell them it's too advanced for them
   
3. The biggest challenge in applying ${eloIndex.toLowerCase()} is likely:
   a) [Common challenge A]
   b) [Common challenge B]
   c) [Minor issue]
   d) [Unrelated problem]
   
4. How could ${eloIndex.toLowerCase()} be improved or modified for different situations?
   [Open-ended response]
   
5. Create your own example of ${eloIndex.toLowerCase()} in action:
   [Open-ended creative response]

**Extension Questions:**
- How might this concept evolve in the future?
- What other subjects or areas connect to this learning?`,

        'Evaluate': `**${stepName} Mastery Assessment**

1. Demonstrate your understanding of ${eloIndex.toLowerCase()} by explaining it in your own words:
   [Extended response area]
   
2. Compare and contrast ${eloIndex.toLowerCase()} with a similar concept:
   [Comparison chart or paragraph]
   
3. Solve this problem using ${eloIndex.toLowerCase()}:
   [Authentic problem scenario]
   
4. Evaluate the effectiveness of ${eloIndex.toLowerCase()} in this situation:
   [Case study for analysis]
   
5. Self-Assessment Checklist:
   □ I can define ${eloIndex.toLowerCase()} clearly
   □ I can give examples from my own experience
   □ I can explain why this concept is important
   □ I can apply this concept to new situations
   □ I can teach this concept to someone else
   
**Reflection Questions:**
- What was most challenging about learning this concept?
- How has your understanding changed since we began?
- Where will you use this knowledge in the future?`
      },

      worksheet: {
        'Engage/Elicit': `**${stepName} Exploration Worksheet**

**Part 1: What I Think I Know**
Fill in your initial thoughts about ${eloIndex.toLowerCase()}:

1. I think ${eloIndex.toLowerCase()} means: ________________
2. I've seen this in: ________________
3. It reminds me of: ________________

**Part 2: Observation Activity**
Complete the following observation task and record your findings:

| What I See | What I Notice | Questions I Have |
|------------|---------------|------------------|
|            |               |                  |
|            |               |                  |
|            |               |                  |

**Part 3: Prediction Corner**
Based on your observations, predict what will happen next:
_________________________________________________

**Part 4: Share & Compare**
Partner's predictions: _________________________
How are they similar/different from yours? _____`,

        'Explore': `**${stepName} Investigation Worksheet**

**Investigation Question:** How does ${eloIndex.toLowerCase()} work?

**Materials Needed:**
- ________________
- ________________
- ________________

**Step-by-Step Procedure:**
1. ________________
2. ________________
3. ________________
4. ________________

**Data Collection:**
| Trial | Observation | Measurement | Notes |
|-------|-------------|-------------|-------|
|   1   |            |             |       |
|   2   |            |             |       |
|   3   |            |             |       |

**Analysis Questions:**
1. What patterns do you see in your data?
2. What was consistent across all trials?
3. What surprised you?
4. What would you investigate next?`,

        'Explain': `**${stepName} Concept Organization Worksheet**

**Main Concept:** ${eloIndex.toLowerCase()}

**Definition in My Own Words:**
_________________________________________________

**Key Components:**
1. ________________ - What it means: ________________
2. ________________ - What it means: ________________
3. ________________ - What it means: ________________

**Concept Map:**
[Draw connections between related ideas]

**Examples vs. Non-Examples:**
| Examples of ${eloIndex.toLowerCase()} | Non-Examples |
|---------------------------------------|--------------|
|                                       |              |
|                                       |              |
|                                       |              |

**How It Connects:**
This concept relates to ________________ because ________________`,

        'Elaborate': `**${stepName} Application Workshop**

**Challenge:** Apply ${eloIndex.toLowerCase()} to solve real-world problems

**Scenario 1:** Community Problem
Describe how ${eloIndex.toLowerCase()} could help solve this issue:
_________________________________________________

**Scenario 2:** Personal Application  
How could you use ${eloIndex.toLowerCase()} in your daily life?
_________________________________________________

**Design Challenge:**
Create something new using ${eloIndex.toLowerCase()}:
- Sketch your design:
- Materials needed:
- How it incorporates the concept:
- Who would benefit from this:

**Extension Project:**
Choose one to complete:
□ Research how professionals use this concept
□ Interview someone who works with this concept
□ Create a presentation for younger students
□ Write a story that includes this concept`,

        'Evaluate': `**${stepName} Portfolio Assessment**

**Self-Evaluation Rubric:**
Rate yourself on each criteria (1-4 scale):

| Criteria | 1 (Beginning) | 2 (Developing) | 3 (Proficient) | 4 (Advanced) | My Rating |
|----------|---------------|----------------|----------------|---------------|-----------|
| Understanding | Can identify basic elements | Shows partial understanding | Demonstrates clear understanding | Shows deep, nuanced understanding | ___ |
| Application | Needs significant support | Applies with some guidance | Applies independently | Applies creatively to new situations | ___ |
| Communication | Difficulty explaining | Explains with some clarity | Explains clearly | Explains clearly and helps others | ___ |

**Portfolio Pieces:**
Include evidence of your learning:
□ Best example of my work
□ Most challenging problem I solved  
□ Creative application I developed
□ Reflection on my learning process

**Goal Setting:**
Based on this unit, my next learning goals are:
1. ________________
2. ________________
3. ________________`
      },

      experiment: {
        'Engage/Elicit': `**${stepName} Demonstration Experiment**

**Purpose:** Generate curiosity and questions about ${eloIndex.toLowerCase()}

**Materials:**
- ________________ (common household items)
- ________________ 
- Safety equipment as needed

**Quick Demo:**
1. Show students the materials
2. Ask: "What do you think will happen if...?"
3. Record predictions on the board
4. Perform the demonstration
5. Discuss results vs. predictions

**Student Observations:**
- What happened?
- Was this what you expected?
- What questions does this raise?

**Follow-up Questions:**
- Why do you think this happened?
- What would happen if we changed ________________?
- Where have you seen something similar?

**Safety Notes:**
- Teacher demonstration only
- Point out safety considerations
- Explain why safety is important in ${eloIndex.toLowerCase()}`,

        'Explore': `**${stepName} Hands-On Investigation**

**Research Question:** What factors affect ${eloIndex.toLowerCase()}?

**Hypothesis:** If we change ________________, then ________________ will happen because ________________.

**Materials List:**
□ ________________
□ ________________  
□ ________________
□ Safety equipment

**Procedure:**
1. Set up your materials as shown in the diagram
2. Measure and record initial conditions
3. Change one variable at a time
4. Record observations after each change
5. Repeat trials for accuracy
6. Clean up and organize data

**Data Table:**
| Variable Changed | Trial 1 | Trial 2 | Trial 3 | Average |
|------------------|---------|---------|---------|---------|
|                  |         |         |         |         |
|                  |         |         |         |         |

**Observations:**
What patterns do you notice? What was unexpected?`,

        'Explain': `**${stepName} Controlled Experiment**

**Scientific Explanation of ${eloIndex.toLowerCase()}**

**Background Theory:**
${eloIndex.toLowerCase()} works because ________________

**Controlled Variables:** (Keep these the same)
- ________________
- ________________
- ________________

**Independent Variable:** (What we change)
________________

**Dependent Variable:** (What we measure)
________________

**Detailed Procedure:**
1. Prepare materials according to specifications
2. Establish baseline measurements
3. Systematically vary the independent variable
4. Record precise measurements
5. Calculate averages and identify trends
6. Graph results to visualize patterns

**Analysis:**
- Do your results support the theory? Why or why not?
- What sources of error might affect your results?
- How does this connect to the scientific principle of ${eloIndex.toLowerCase()}?`,

        'Elaborate': `**${stepName} Design Challenge Experiment**

**Engineering Problem:** Use ${eloIndex.toLowerCase()} to solve a real-world problem

**Problem Statement:**
________________

**Design Requirements:**
- Must incorporate ${eloIndex.toLowerCase()}
- Should be cost-effective
- Must be safe and practical
- Should benefit the target audience

**Prototype Development:**
1. Brainstorm multiple solutions
2. Select best design based on criteria
3. Build and test prototype
4. Collect performance data
5. Iterate and improve design

**Testing Protocol:**
| Test | Criteria | Expected Result | Actual Result | Modifications Needed |
|------|----------|-----------------|---------------|---------------------|
|  1   |          |                 |               |                     |
|  2   |          |                 |               |                     |
|  3   |          |                 |               |                     |

**Reflection:**
How did understanding ${eloIndex.toLowerCase()} help you solve this problem?`,

        'Evaluate': `**${stepName} Laboratory Practical Assessment**

**Independent Investigation:** Design and conduct your own experiment related to ${eloIndex.toLowerCase()}

**Your Research Question:**
________________

**Experimental Design:**
- Variables you will test:
- Controls you will use:
- Materials needed:
- Safety considerations:

**Data Collection Plan:**
How will you measure results?
How many trials will you conduct?
What tools will you use?

**Expected Results:**
Based on your understanding of ${eloIndex.toLowerCase()}, predict your results and explain your reasoning.

**Evaluation Criteria:**
□ Clear, testable hypothesis
□ Appropriate experimental design
□ Accurate data collection
□ Logical analysis of results
□ Valid conclusions
□ Effective communication of findings

**Peer Review:**
Have a classmate evaluate your experimental design before conducting the investigation.`
      },

      discussion: {
        'Engage/Elicit': `**${stepName} Discussion Starters**

**Opening Question:** What comes to mind when you hear "${eloIndex.toLowerCase()}"?

**Think-Pair-Share Activity:**
1. **Think** (2 minutes): Individually brainstorm everything you know
2. **Pair** (5 minutes): Share with a partner and find connections
3. **Share** (10 minutes): Pairs report interesting ideas to class

**Discussion Prompts:**
- "I used to think... but now I think..."
- "This reminds me of..."
- "I wonder why..."
- "What if..."

**Gallery Walk Questions:**
Post these around the room for students to discuss:
- Where have you encountered ${eloIndex.toLowerCase()} before?
- What questions do you have about this topic?
- How might this be useful in real life?
- What would happen if ${eloIndex.toLowerCase()} didn't exist?

**Participation Guidelines:**
- Listen actively to others
- Build on previous ideas
- Ask clarifying questions
- Share your own experiences
- Respect different perspectives`,

        'Explore': `**${stepName} Collaborative Investigation**

**Jigsaw Discussion Structure:**
Groups investigate different aspects of ${eloIndex.toLowerCase()}:

**Group 1:** Historical perspective
- How did ${eloIndex.toLowerCase()} develop over time?
- Who were key figures in this field?

**Group 2:** Current applications  
- How is ${eloIndex.toLowerCase()} used today?
- What industries or fields rely on this?

**Group 3:** Future possibilities
- How might ${eloIndex.toLowerCase()} evolve?
- What new applications might emerge?

**Group 4:** Challenges and limitations
- What problems exist with current approaches?
- What are the limitations of ${eloIndex.toLowerCase()}?

**Discussion Protocol:**
1. **Research Phase** (15 minutes): Groups gather information
2. **Expert Groups** (10 minutes): Same-topic groups compare findings
3. **Teaching Phase** (20 minutes): Return to mixed groups and teach others
4. **Synthesis** (10 minutes): Class discussion on connections

**Guiding Questions for All Groups:**
- What evidence supports your findings?
- How does this connect to other groups' research?
- What surprised you most?`,

        'Explain': `**${stepName} Structured Academic Controversy**

**Topic:** The role and importance of ${eloIndex.toLowerCase()}

**Position A:** ${eloIndex.toLowerCase()} is essential and should be prioritized
**Position B:** ${eloIndex.toLowerCase()} has limitations and shouldn't be overemphasized

**Discussion Process:**
1. **Preparation** (10 minutes): Teams prepare arguments with evidence
2. **Presentation** (15 minutes): Each side presents their strongest case
3. **Open Discussion** (15 minutes): Teams challenge each other respectfully
4. **Switch Sides** (10 minutes): Teams argue the opposite position
5. **Synthesis** (10 minutes): Work together to find common ground

**Evidence Requirements:**
- Scientific studies or data
- Real-world examples
- Expert opinions
- Historical evidence
- Logical reasoning

**Discussion Norms:**
- Critique ideas, not people
- Use evidence to support claims
- Listen to understand, not just to respond
- Build on others' ideas
- Stay focused on the topic

**Reflection Questions:**
- What was the strongest argument from each side?
- How did your thinking change during the discussion?
- What aspects of ${eloIndex.toLowerCase()} are most important to consider?`,

        'Elaborate': `**${stepName} Solution-Focused Discussion**

**Central Challenge:** How can we apply ${eloIndex.toLowerCase()} to address real-world problems?

**Case Study Discussions:**
Choose from these scenarios to discuss in small groups:

**Scenario 1:** Environmental Challenge
How could ${eloIndex.toLowerCase()} help address climate change or sustainability?

**Scenario 2:** Social Issue  
How might ${eloIndex.toLowerCase()} contribute to solving inequality or access problems?

**Scenario 3:** Technological Innovation
What role could ${eloIndex.toLowerCase()} play in future technological advances?

**Scenario 4:** Educational Reform
How should ${eloIndex.toLowerCase()} be taught in schools to maximize student learning?

**Discussion Framework:**
- **Problem Analysis:** What are the root causes?
- **Solution Brainstorming:** How could ${eloIndex.toLowerCase()} help?
- **Implementation Planning:** What would this look like in practice?
- **Evaluation:** How would we measure success?

**Presentation Format:**
Each group presents their solution using:
- Visual aids or diagrams
- Concrete examples
- Timeline for implementation
- Potential challenges and solutions`,

        'Evaluate': `**${stepName} Socratic Seminar**

**Essential Question:** What is the significance of ${eloIndex.toLowerCase()} in our understanding of [broader concept]?

**Pre-Seminar Preparation:**
Students prepare by:
- Reviewing all unit materials
- Developing thoughtful questions
- Gathering evidence for discussions
- Practicing active listening skills

**Seminar Questions:** (Choose 3-4 for discussion)
1. How has your understanding of ${eloIndex.toLowerCase()} evolved throughout this unit?
2. What are the most important applications of ${eloIndex.toLowerCase()} in society?
3. What ethical considerations should guide the use of ${eloIndex.toLowerCase()}?
4. How does ${eloIndex.toLowerCase()} connect to other concepts we've studied?
5. What questions about ${eloIndex.toLowerCase()} do you still have?
6. How would you explain the importance of ${eloIndex.toLowerCase()} to someone unfamiliar with it?

**Assessment Rubric:**
- **Preparation:** Came with thoughtful questions and evidence
- **Participation:** Contributed meaningfully to discussion
- **Listening:** Responded thoughtfully to others' ideas
- **Critical Thinking:** Analyzed ideas deeply and made connections
- **Communication:** Expressed ideas clearly and respectfully

**Follow-up Reflection:**
Write a brief reflection on:
- What new insights did you gain from the discussion?
- How did hearing others' perspectives change your thinking?
- What would you like to explore further about ${eloIndex.toLowerCase()}?`
      },

      story: {
        'Engage/Elicit': `**${stepName} Story: "The Mystery of ${eloIndex}"**

Once upon a time, in a world not so different from ours, there lived a curious student named Alex who stumbled upon something extraordinary...

*[Opening hook that introduces the concept indirectly]*

Alex noticed that everywhere around town, there were signs of ${eloIndex.toLowerCase()}, but no one seemed to talk about it directly. There were clues in:
- The way the traffic lights worked
- How plants grew in the community garden  
- The patterns in the local library's organization system
- The efficiency of the recycling center

"What connects all of these things?" Alex wondered.

**Story Discussion Points:**
- What do you think Alex discovered?
- Have you noticed similar patterns in your own community?
- What questions would you ask if you were Alex?
- Where do you see signs of ${eloIndex.toLowerCase()} in your daily life?

**Interactive Elements:**
- Students predict what Alex will discover next
- Connect story elements to their own experiences
- Generate questions they want to investigate
- Role-play as different characters in the story

**Extension Activity:**
Students create their own "discovery story" about finding ${eloIndex.toLowerCase()} in an unexpected place.`,

        'Explore': `**${stepName} Adventure Story: "The Quest for Understanding"**

Continuing Alex's journey, our young explorer decided to investigate the mysterious patterns more closely...

*Chapter 1: The Investigation Begins*
Alex gathered tools and began systematic observations. Each location revealed new clues:

At the traffic intersection, Alex measured timing patterns and noticed...
In the community garden, careful observation of plant growth showed...
The library's system revealed organizational principles that...
The recycling center's efficiency demonstrated...

*Chapter 2: Gathering Evidence*
Working with friends Maya and Jordan, Alex's team collected data:
- Measurements and observations
- Interviews with community experts
- Research from multiple sources
- Experimental tests of their theories

*Chapter 3: Surprising Discoveries*
The team's investigations revealed unexpected connections and some results that didn't match their predictions...

**Reader Participation:**
- What data collection methods would you recommend to Alex's team?
- Predict what they'll discover in each location
- Design experiments the characters could conduct
- Analyze the "evidence" presented in the story

**Hands-On Connection:**
Students conduct similar investigations in their own environment, following Alex's methods.`,

        'Explain': `**${stepName} Educational Story: "The Revelation"**

*Chapter 4: The Expert's Explanation*
Alex's team sought out Dr. Sarah Chen, a local expert who could help them understand their findings...

"What you've discovered," Dr. Chen explained, "is ${eloIndex.toLowerCase()}. Let me show you how all your observations connect."

*Dr. Chen's Clear Explanation:*
"The traffic lights use ${eloIndex.toLowerCase()} to... [clear explanation with examples]"
"In the garden, plants demonstrate ${eloIndex.toLowerCase()} when they... [scientific explanation]"  
"The library system works because of ${eloIndex.toLowerCase()} principles that... [systematic explanation]"
"And the recycling center's efficiency comes from applying ${eloIndex.toLowerCase()} to... [practical explanation]"

*The "Aha!" Moment:*
Suddenly, everything clicked for Alex's team. They could see how ${eloIndex.toLowerCase()} was the underlying principle connecting all their observations.

**Teaching Elements in the Story:**
- Clear definitions with context
- Multiple examples from different fields
- Visual descriptions students can imagine
- Connection between observations and theory
- Vocabulary introduced naturally

**Student Engagement:**
- Students explain concepts to each other using the story framework
- Create diagrams showing the connections Alex discovered
- Write their own "expert explanation" scenes
- Practice using new vocabulary in context`,

        'Elaborate': `**${stepName} Application Story: "Putting Knowledge to Work"**

*Chapter 5: The Challenge*
News spread about Alex's team's discoveries, and soon the mayor approached them with a real problem that needed their expertise in ${eloIndex.toLowerCase()}...

*The Community Problem:*
The town faced a challenge that could be solved using ${eloIndex.toLowerCase()}. The mayor explained the situation and asked Alex's team to propose solutions.

*Chapter 6: Creative Problem-Solving*
The team brainstormed multiple ways to apply their understanding:

**Solution 1:** Traditional approach using ${eloIndex.toLowerCase()} principles
**Solution 2:** Innovative combination with other concepts  
**Solution 3:** Creative adaptation for local conditions
**Solution 4:** Future-thinking solution considering long-term impact

*Chapter 7: Implementation and Results*
The team chose their best solution and worked with the community to implement it. They had to adapt their approach when unexpected challenges arose...

**Student Application Activities:**
- Design solutions to similar problems in their community
- Evaluate the pros and cons of each approach Alex's team considered
- Modify solutions for different contexts or constraints
- Present their ideas to "town council" (classmates) for feedback

**Real-World Connections:**
Students research how professionals actually use ${eloIndex.toLowerCase()} to solve similar problems in various careers and industries.`,

        'Evaluate': `**${stepName} Reflection Story: "The Journey's End"**

*Chapter 8: Looking Back and Forward*
Six months later, Alex reflected on the incredible learning journey that started with simple curiosity...

*Alex's Learning Portfolio:*
"When I started this investigation, I thought ${eloIndex.toLowerCase()} was... But now I understand it's actually..."

"The most surprising thing I learned was..."
"The most challenging part of understanding ${eloIndex.toLowerCase()} was..."
"I can now see ${eloIndex.toLowerCase()} everywhere, especially in..."

*Chapter 9: Teaching Others*
Alex was invited to share the discovery with a group of younger students. Preparing this presentation helped Alex realize how much had been learned...

*Chapter 10: New Questions*
The investigation answered many questions but raised new ones:
- "I wonder what would happen if..."
- "How does ${eloIndex.toLowerCase()} connect to..."
- "What if we could improve..."

**Student Assessment Activities:**
- Write their own learning journey story
- Create a presentation from Alex's perspective
- Develop new questions for future investigation  
- Evaluate their own understanding using story-based rubrics
- Plan how they would teach this concept to others

**Metacognitive Reflection:**
Students use the story framework to reflect on:
- How their understanding has evolved
- What learning strategies worked best for them
- How they can apply their knowledge in new situations
- What they want to learn next about ${eloIndex.toLowerCase()} or related topics

**Creative Assessment Options:**
- Write an alternate ending to Alex's story
- Create a sequel focusing on new applications
- Develop a story-based game about ${eloIndex.toLowerCase()}
- Design a graphic novel version of the learning journey`
      }
    };

    const stepKey = stepName.toLowerCase().replace('/', '').replace(' ', '');
    const resourceKey = resourceType.toLowerCase();
    
    return contentTemplates[resourceKey as keyof typeof contentTemplates]?.[stepName as keyof typeof contentTemplates.quiz] || 
           `**${stepName} Activity: ${resourceType}**\n\nCustom content for ${eloIndex} using ${resourceType} in the ${stepName} phase.\n\nThis is a placeholder template. Please customize this content based on your specific learning objectives and student needs.`;
  };

  // Helper function to map dropdown resource names to content template keys
  const mapResourceToType = (resourceName: string): string | null => {
    const resourceLower = resourceName.toLowerCase();
    
    if (resourceLower.includes('quiz') || resourceLower.includes('questions')) return 'quiz';
    if (resourceLower.includes('worksheet') || resourceLower.includes('assessment')) return 'worksheet';
    if (resourceLower.includes('experiment') || resourceLower.includes('hands-on')) return 'experiment';
    if (resourceLower.includes('discussion') || resourceLower.includes('debate')) return 'discussion';
    if (resourceLower.includes('story') || resourceLower.includes('reading') || resourceLower.includes('anecdote')) return 'story';
    
    // Default mappings for common resource types
    if (resourceLower.includes('scenario') || resourceLower.includes('problem')) return 'worksheet';
    if (resourceLower.includes('video') || resourceLower.includes('demonstration')) return 'discussion';
    
    return 'worksheet'; // Default fallback
  };

  // Content generation function using predefined templates
  const generateContentForStep = async (eloIndex: string, stepId: string, stepName: string): Promise<boolean> => {
    const stepKey = `${eloIndex}_${stepId}`;
    setGeneratingContent(prev => ({ ...prev, [stepKey]: true }));
    console.log(`Generating predefined content for step: ${stepName} in ELO: ${eloIndex}`);

    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Get selected resources for this step
      const selectedResourcesForStep = selectedResources[eloIndex]?.[stepId] || [];
      console.log('Selected resources for step:', selectedResourcesForStep);
      
      if (selectedResourcesForStep.length === 0) {
        console.log('No resources found to generate content for');
        return false;
      }
      
      // Generate content for each resource
      const resourceContent: {[resourceName: string]: string} = {};
      
      for (const resource of selectedResourcesForStep) {
        const mappedType = mapResourceToType(resource);
        if (mappedType) {
          const content = getPredefinedContent(stepName, mappedType, eloIndex);
          resourceContent[resource] = content;
        }
      }
      
      // Store generated content per resource
      setGeneratedContentData(prev => ({
        ...prev,
        [stepKey]: resourceContent
      }));
      
      // Mark as generated
      setContentGenerated(prev => ({ ...prev, [stepKey]: true }));
      
      console.log('Content generated successfully');
      return true;

    } catch (error) {
      console.error('Error generating content:', error);
      return false;
    } finally {
      setGeneratingContent(prev => ({ ...prev, [stepKey]: false }));
    }
  };

  // Helper functions for generated content management
  const editGeneratedContent = (stepKey: string, resourceName: string) => {
    const content = generatedContentData[stepKey]?.[resourceName] || '';
    setEditingContent({ stepKey, resourceName });
    setEditedContent(content);
  };

  const saveEditedContent = () => {
    if (!editingContent) return;
    
    const { stepKey, resourceName } = editingContent;
    
    // Update the generated content data
    setGeneratedContentData(prev => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        [resourceName]: editedContent
      }
    }));
    
    // Close the edit mode
    setEditingContent(null);
    setEditedContent('');
    
    toast({
      title: "Content Updated",
      description: `Content for ${resourceName} has been updated successfully.`,
    });
  };

  const cancelEdit = () => {
    setEditingContent(null);
    setEditedContent('');
  };

  const deleteGeneratedContent = (stepKey: string, resourceName: string) => {
    setGeneratedContentData(prev => {
      const updated = { ...prev };
      if (updated[stepKey]) {
        delete updated[stepKey][resourceName];
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
  };

  const regenerateContentForResource = async (stepKey: string, resourceName: string) => {
    const [eloIndex, stepId] = stepKey.split('_');
    const stepName = fiveESteps.find(s => s.id === stepId)?.name || stepId;
    
    // Set generating state for this specific resource
    setGeneratingContent(prev => ({ ...prev, [stepKey]: true }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Map resource to type and generate content
      const mappedType = mapResourceToType(resourceName);
      if (mappedType) {
        const content = getPredefinedContent(stepName, mappedType, eloIndex);
        
        // Update content for this specific resource
        setGeneratedContentData(prev => ({
          ...prev,
          [stepKey]: {
            ...prev[stepKey],
            [resourceName]: content
          }
        }));
        
        // Mark as generated
        setContentGenerated(prev => ({ ...prev, [stepKey]: true }));
        
        toast({
          title: "Content Regenerated",
          description: `New content generated for ${resourceName}`,
        });
        
        console.log(`Content regenerated for ${resourceName}`);
      }
    } catch (error) {
      console.error('Error regenerating content:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate content",
        variant: "destructive"
      });
    } finally {
      setGeneratingContent(prev => ({ ...prev, [stepKey]: false }));
    }
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
              
              {/* De-merge buttons for existing merged ELOs */}
              {Object.keys(mergedELOs).map((mergedELO) => (
                <Button
                  key={mergedELO}
                  onClick={() => demergeELO(mergedELO)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-orange-600 border-orange-300 hover:bg-orange-50"
                >
                  <X className="w-4 h-4" />
                  De-merge: {mergedELO.substring(0, 20)}...
                </Button>
              ))}
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
        
        {getCurrentELOs().length > 0 ? (
          <Tabs value={activeELO} onValueChange={setActiveELO}>
            <TabsList className="inline-flex h-12 items-center justify-start rounded-none bg-white border-b border-gray-200 w-full p-0 mb-6">
              {getCurrentELOs().map((eloKey) => (
                <TabsTrigger 
                  key={eloKey} 
                  value={eloKey}
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-all duration-200 rounded-none bg-transparent"
                >
                  {getELODisplayName(eloKey)}
                  {mergedELOs[eloKey] && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        demergeELO(eloKey);
                      }}
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-1 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {getCurrentELOs().map((eloKey) => (
              <TabsContent key={eloKey} value={eloKey} className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Learning Outcome</h4>
                  {mergedELOs[eloKey] ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-blue-600">Merged ELOs ({mergedELOs[eloKey].length})</p>
                      {mergedELOs[eloKey].map((originalELO, idx) => (
                        <p key={idx} className="text-sm text-gray-600 pl-4 border-l-2 border-blue-200">
                          <span className="font-medium">ELO {elos.findIndex(e => e === originalELO) + 1}:</span> {originalELO}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{eloKey}</p>
                  )}
                </div>

                {/* Drop Zone for 5E Steps */}
                <div 
                  className="min-h-[200px] border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-gray-300 hover:bg-blue-50/70 transition-all duration-200"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, eloKey)}
                >
                  <h4 className="text-sm font-semibold text-blue-700 mb-4 flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    5E Learning Sequence
                  </h4>
                  
                  {droppedSteps[eloKey] && droppedSteps[eloKey].length > 0 ? (
                    <div className="space-y-4">
                      {droppedSteps[eloKey].map((step, stepIndex) => (
                        <Card key={step.id} className="p-4 bg-white border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <Badge className={step.color}>
                              {step.name}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Time:</label>
                                 <input
                                   type="text"
                                   placeholder="30 mins"
                                   value={stepTimes[eloKey]?.[step.id] || ''}
                                   onChange={(e) => updateStepTime(eloKey, step.id, e.target.value)}
                                   onBlur={() => {
                                     const time = stepTimes[eloKey]?.[step.id];
                                     if (time && selectedResources[eloKey]?.[step.id]?.length > 0) {
                                       distributeTimeAmongResources(eloKey, step.id, time);
                                     }
                                   }}
                                   className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                 />
                              </div>
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
                                        <h4 className="font-medium text-sm text-gray-900">Add Resources</h4>
                                        <p className="text-xs text-gray-500 mt-1">Select from available resources or add custom</p>
                                      </div>
                                      
                                      {/* Custom Resource Entry */}
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
                                      
                                      {/* Predefined Resources */}
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
                                 {/* Selected Resources Display */}
                                 {selectedResources[eloKey]?.[step.id]?.length > 0 && (
                                   <div className="space-y-3">
                                     <label className="text-sm font-medium text-gray-700">Selected Resources:</label>
                                      <div className="space-y-3" onDragOver={(e) => handleResourceDragOver(e)} onDrop={(e) => handleResourceDrop(e, eloKey, step.id, (selectedResources[eloKey]?.[step.id]?.length || 0))}>
                                     {selectedResources[eloKey][step.id].map((resource, index) => {
                                       const stepKey = `${eloKey}_${step.id}`;
                                      const resourceContent = generatedContentData[stepKey]?.[resource];
                                      const isGenerating = generatingContent[stepKey];
                                      
                                      return (
                                         <div key={`${step.id}-${index}`} className="bg-white border-2 border-blue-200 hover:border-blue-300 rounded-lg overflow-hidden transition-all duration-200" draggable onDragStart={(e) => handleResourceDragStart(e, eloKey, step.id, index)} onDragEnd={handleResourceDragEnd} onDragOver={(e) => handleResourceDragOver(e)} onDrop={(e) => handleResourceDrop(e, eloKey, step.id, index)}>
                                           {/* Unified Resource Card */}
                                           <div className="bg-blue-50 px-3 py-2 border-b border-blue-200 cursor-move" onMouseDown={(e) => e.stopPropagation()}>
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <span title="Drag to reorder" className="cursor-grab">
                                                    <GripVertical className="w-4 h-4 text-gray-500" />
                                                  </span>
                                                  <span className="text-sm text-gray-800 font-medium">• {resource}</span>
                                                </div>
                                                 <div className="flex items-center gap-2">
                                                   <span className="text-xs text-gray-600">Estimated Time:</span>
                                                   <Badge variant="outline" className="text-xs font-semibold text-blue-700 border-blue-300">
                                                     {resourceTimeAllocations[eloKey]?.[step.id]?.[resource] 
                                                       ? `${resourceTimeAllocations[eloKey][step.id][resource]} min`
                                                       : stepTimes[eloKey]?.[step.id] 
                                                         ? 'Calculating...'
                                                         : 'Enter time above'}
                                                   </Badge>
                                                   {resourceContent && (
                                                     <div className="flex items-center space-x-1">
                                                       <Button
                                                         variant="outline"
                                                         size="sm"
                                                         onClick={() => editGeneratedContent(stepKey, resource)}
                                                         className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 h-6 w-6 p-0"
                                                       >
                                                         <Edit3 className="w-3 h-3" />
                                                       </Button>
                                                       <Button
                                                         variant="outline"
                                                         size="sm"
                                                         onClick={() => regenerateContentForResource(stepKey, resource)}
                                                         className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 h-6 w-6 p-0"
                                                         title="Regenerate content"
                                                       >
                                                         <RefreshCw className="w-3 h-3" />
                                                       </Button>
                                                     </div>
                                                   )}
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeResource(eloKey, step.id, index)}
                                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                           </div>
                                           
                                           {/* Content Section */}
                                           {isGenerating ? (
                                             <div className="p-3">
                                               <div className="flex items-center space-x-2 text-yellow-700">
                                                 <Loader2 className="w-4 h-4 animate-spin" />
                                                 <span className="text-sm">Generating content...</span>
                                               </div>
                                             </div>
                                           ) : resourceContent ? (
                                               <div className="p-3 space-y-3 bg-emerald-50/30">
                                                 {editingContent?.stepKey === stepKey && editingContent?.resourceName === resource ? (
                                                   // Edit mode - show textarea and save/cancel buttons
                                                   <div className="space-y-3">
                                                     <Textarea
                                                       value={editedContent}
                                                       onChange={(e) => setEditedContent(e.target.value)}
                                                       className="min-h-[200px] resize-none font-mono text-sm"
                                                       placeholder="Edit your content here..."
                                                     />
                                                     <div className="flex gap-2 justify-end">
                                                       <Button variant="outline" size="sm" onClick={cancelEdit}>
                                                         Cancel
                                                       </Button>
                                                       <Button size="sm" onClick={saveEditedContent}>
                                                         <Save className="w-3 h-3 mr-1" />
                                                         Save
                                                       </Button>
                                                     </div>
                                                   </div>
                                                 ) : (
                                                   // View mode - show readonly content
                                                   <div className="bg-gray-50 rounded border p-3 max-h-48 overflow-y-auto">
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
                                                 )}
                                               </div>
                                           ) : (
                                             <div className="p-3 text-sm text-gray-500 italic">
                                               No content generated yet
                                             </div>
                                           )}
                                         </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
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