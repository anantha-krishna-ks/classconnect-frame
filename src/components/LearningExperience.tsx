// --- ADDED/CHANGED CODE BELOW ---

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Brain, Edit2, RotateCcw, Trash2, Check, XIcon } from 'lucide-react';
import axios from 'axios';
import config from '@/config';
import FiveEDesigner from './FiveEDesigner';
import { useToast } from '@/hooks/use-toast';

interface LearningExperienceProps {
  elos: string[];
  board: string;
  grade: string;
  subject: string;
  chapter: string;
  courseOutcomes: any[]; // Accepts array of course outcomes with skills, factor, competencies, etc.
  onLearningExperienceChange: (data: any) => void;
  onFiveEChange: (data: any) => void;
}

const LearningExperience: React.FC<LearningExperienceProps> = ({
  elos = [],
  board = '',
  grade = '',
  subject = '',
  chapter = '',
  courseOutcomes = [],
  onLearningExperienceChange,
  onFiveEChange
}) => {
  const { toast } = useToast();
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string>('');
  const [selectedLearningModel, setSelectedLearningModel] = useState<string>('5E');
  // Hardcode all intelligence types for Learning Experience intelligence integration
const allIntelligenceTypes = [
  'Visual-spatial',
  'Linguistic-verbal',
  'Logical-mathematical',
  'Body-kinesthetic',
  'Musical',
  'Interpersonal',
  'Naturalistic'
];
const [selectedIntelligenceTypes, setSelectedIntelligenceTypes] = useState<string[]>(allIntelligenceTypes);
  const [showLearningContent, setShowLearningContent] = useState<boolean>(false);

  // New state for pedagogical approaches (flat list)
  const [loadingPedagogical, setLoadingPedagogical] = useState(false);
  const [pedagogicalError, setPedagogicalError] = useState<string | null>(null);
  const [loadingLearningExperience, setLoadingLearningExperience] = useState(false);
  const [learningExperienceError, setLearningExperienceError] = useState<string | null>(null);
  const [learningExperience, setLearningExperience] = useState<any>(null);
  const [fiveEData, setFiveEData] = useState<any>(null);
  const [editingELO, setEditingELO] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [regeneratingELO, setRegeneratingELO] = useState<string | null>(null);

  const pedagogicalApproaches = [
    'Constructivism',
    'Collaborative',
    'Reflective', 
    'Integrity',
    'Inquiry',
    'Contextual',
    'Inclusive',
    'Art Integrated',
    'Project-based',
    'Problem-based',
    'Experiential',
    'Differentiated'
  ];

  const intelligenceTypes = [
    'Visual-spatial',
    'Linguistic-verbal',
    'Logical-mathematical',
    'Body-kinesthetic', 
    'Musical',
    'Interpersonal',
    'Naturalistic'
  ];

  const removeApproach = (approach: string) => {
    setSelectedApproaches(selectedApproaches.filter(a => a !== approach));
  };

  const handleCustomSkillsChange = (value: string) => {
    setCustomSkills(value);
    if (value.includes(',') || value.includes('\n') || value.endsWith(' ')) {
      const skills = value
        .split(/[,\n\s]+/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      if (skills.length > 0) {
        const lastSkill = skills[skills.length - 1];
        if (lastSkill && !selectedApproaches.includes(lastSkill)) {
          setSelectedApproaches([...selectedApproaches, lastSkill]);
          setCustomSkills('');
        }
      }
    }
  };

  // Intelligence types are hardcoded and not user-modifiable, so this handler is removed.

  // Function to merge 5E content from multiple ELOs
  const mergeFiveEContent = () => {
    if (!fiveEData || !fiveEData.eloSteps) return null;
    
    // Group content by 5E phases
    const phaseGroups: { [phase: string]: any[] } = {
      'Engage/Elicit': [],
      'Explore': [],
      'Explain': [],
      'Elaborate': [],
      'Evaluate': []
    };

    // Extract content from each ELO and organize by phase
    fiveEData.eloSteps.forEach((eloData: any) => {
      if (eloData.steps && Array.isArray(eloData.steps)) {
        eloData.steps.forEach((step: any) => {
          const phaseName = step.name;
          if (phaseGroups[phaseName]) {
            const stepKey = `${eloData.elo}_${step.id}`;
            const generatedContent = fiveEData.generatedContentData[stepKey] || {};
            
            phaseGroups[phaseName].push({
              elo: eloData.elo,
              stepId: step.id,
              description: step.description || '',
              resources: step.resources || [],
              generatedContent: generatedContent,
              timeAllocations: step.resourceTimeAllocations || {},
              stepTime: step.stepTime || ''
            });
          }
        });
      }
    });

    // Create merged structure for each phase
    const mergedContent = Object.entries(phaseGroups).map(([phase, contents]) => {
      // Combine all resources from all ELOs for this phase
      const allResources = contents.flatMap(c => c.resources).filter((r, i, arr) => arr.indexOf(r) === i);
      
      // Combine all generated content
      const allGeneratedContent: { [key: string]: string } = {};
      contents.forEach(content => {
        Object.entries(content.generatedContent).forEach(([resourceName, contentText]) => {
          const key = `${content.elo}_${resourceName}`;
          allGeneratedContent[key] = contentText as string;
        });
      });
      
      // Combine all descriptions
      const allDescriptions = contents
        .map(c => c.description)
        .filter(d => d && d.trim())
        .join('\n\n');
      
      return {
        phase,
        merged_activities: contents,
        combined_resources: allResources,
        total_elos: contents.map(c => c.elo),
        combined_descriptions: allDescriptions,
        all_generated_content: allGeneratedContent,
        total_step_time: contents.reduce((total, c) => {
          const timeStr = c.stepTime || '0';
          const minutes = parseInt(timeStr) || 0;
          return total + minutes;
        }, 0),
        resource_count: allResources.length
      };
    }).filter(phase => phase.merged_activities.length > 0); // Only include phases that have activities

    return {
      merged_phases: mergedContent,
      total_elos_count: elos.length,
      pedagogical_approaches: selectedApproaches,
      intelligence_types: selectedIntelligenceTypes,
      total_resources: mergedContent.reduce((total, phase) => total + phase.resource_count, 0),
      total_time_minutes: mergedContent.reduce((total, phase) => total + phase.total_step_time, 0)
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !selectedApproaches.includes(value)) {
        setSelectedApproaches([...selectedApproaches, value]);
        setCustomSkills('');
      }
    }
  };

  // Handle ELO editing
  const handleEditELO = (eloIndex: number, currentContent: string) => {
    setEditingELO(`ELO${eloIndex}`);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (eloIndex: number) => {
    if (!learningExperience || !editContent.trim()) return;
    
    // Update the learning experience content
    const updatedExperience = { ...learningExperience };
    if (updatedExperience["5E_Model"]) {
      updatedExperience["5E_Model"].forEach((phaseObj: any) => {
        phaseObj.activities.forEach((activity: any) => {
          if (activity.elos?.includes(`ELO${eloIndex}`)) {
            activity.description = editContent;
          }
        });
      });
    }
    
    setLearningExperience(updatedExperience);
    onLearningExperienceChange(updatedExperience);
    setEditingELO(null);
    setEditContent('');
    
    toast({
      title: "Success",
      description: `ELO ${eloIndex} content updated successfully.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingELO(null);
    setEditContent('');
  };

  // Handle ELO regeneration
  const handleRegenerateELO = async (eloIndex: number) => {
    setRegeneratingELO(`ELO${eloIndex}`);
    try {
      // Call API to regenerate specific ELO content
      const response = await axios.post(
        config.ENDPOINTS.GENERATE_LEARNING_EXPERIENCE,
        {
          elos: [elos[eloIndex - 1]], // Single ELO
          pedagogical_approaches: selectedApproaches,
          intelligence_types: selectedIntelligenceTypes,
          course_outcomes: courseOutcomes,
          grade,
          subject,
          chapter,
          five_e_content: mergeFiveEContent(),
          regenerate_elo: eloIndex
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      let newContent = response.data.learning_experience;
      if (typeof newContent === "string") {
        try {
          newContent = JSON.parse(newContent);
        } catch (e) {
          console.error("Failed to parse regenerated content");
          return;
        }
      }

      // Update the specific ELO in the current learning experience
      const updatedExperience = { ...learningExperience };
      if (updatedExperience["5E_Model"] && newContent["5E_Model"]) {
        // Replace activities for the regenerated ELO
        newContent["5E_Model"].forEach((newPhaseObj: any) => {
          const existingPhase = updatedExperience["5E_Model"].find((p: any) => p.phase === newPhaseObj.phase);
          if (existingPhase) {
            // Update activities for this ELO
            newPhaseObj.activities.forEach((newActivity: any) => {
              const existingActivityIndex = existingPhase.activities.findIndex((a: any) => 
                a.elos?.includes(`ELO${eloIndex}`)
              );
              if (existingActivityIndex >= 0) {
                existingPhase.activities[existingActivityIndex] = newActivity;
              }
            });
          }
        });
      }
      
      setLearningExperience(updatedExperience);
      onLearningExperienceChange(updatedExperience);
      
      toast({
        title: "Success",
        description: `ELO ${eloIndex} content regenerated successfully.`,
      });
    } catch (error) {
      console.error('Failed to regenerate ELO content:', error);
      toast({
        title: "Error",
        description: `Failed to regenerate ELO ${eloIndex} content. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setRegeneratingELO(null);
    }
  };

  // Handle ELO deletion
  const handleDeleteELO = (eloIndex: number) => {
    if (!learningExperience) return;
    
    const updatedExperience = { ...learningExperience };
    if (updatedExperience["5E_Model"]) {
      // Remove activities that only belong to this ELO or remove ELO from shared activities
      updatedExperience["5E_Model"].forEach((phaseObj: any) => {
        phaseObj.activities = phaseObj.activities.filter((activity: any) => {
          if (activity.elos?.includes(`ELO${eloIndex}`)) {
            // If activity has multiple ELOs, just remove this one
            if (activity.elos.length > 1) {
              activity.elos = activity.elos.filter((elo: string) => elo !== `ELO${eloIndex}`);
              return true;
            }
            // If activity only belongs to this ELO, remove it completely
            return false;
          }
          return true;
        });
      });
    }
    
    setLearningExperience(updatedExperience);
    onLearningExperienceChange(updatedExperience);
    
    toast({
      title: "Success", 
      description: `ELO ${eloIndex} deleted successfully.`,
    });
  };

  // --- Pedagogical Approaches API Call ---
  const handleGeneratePedagogicalApproaches = async () => {
    setLoadingPedagogical(true);
    setPedagogicalError(null);
    try {
      const response = await axios.post(
        config.ENDPOINTS.GENERATE_PEDAGOGICAL_APPROACHES,
        {
          elos,
          board,
          grade,
          subject,
          chapter
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setSelectedApproaches(response.data.approaches || []);
    } catch (err: any) {
      setPedagogicalError(
        err?.response?.data?.detail || err?.message || 'Failed to generate pedagogical approaches'
      );
    } finally {
      setLoadingPedagogical(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Experience</h3>
        <p className="text-sm text-gray-600 mb-4">By default, all ELOs are selected</p>
        
        {/* Learning Model Selection */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Select Learning Model</h4>
          <Select value={selectedLearningModel} onValueChange={setSelectedLearningModel}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select a learning model" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-lg z-50">
              <SelectItem value="5-Part" disabled className="text-gray-400 cursor-not-allowed">
                5-Part
              </SelectItem>
              <SelectItem value="4-Part" disabled className="text-gray-400 cursor-not-allowed">
                4-Part
              </SelectItem>
              <SelectItem value="5E" className="cursor-pointer hover:bg-blue-50">
                5E
              </SelectItem>
              <SelectItem value="Inquiry-Based" disabled className="text-gray-400 cursor-not-allowed">
                Inquiry-Based
              </SelectItem>
              <SelectItem value="Universal design for Learning(UDL)" disabled className="text-gray-400 cursor-not-allowed">
                Universal design for Learning(UDL)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end mb-6">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
            onClick={handleGeneratePedagogicalApproaches}
            disabled={loadingPedagogical || !elos || elos.length === 0}
          >
            {loadingPedagogical ? 'Generating...' : 'Generate Pedagogical Approaches'}
          </Button>
        </div>

        {/* 5E Model Design Section - Show after pedagogical approaches are generated */}
        {selectedApproaches.length > 0 && (
          <div className="mb-8">
            {/* Pedagogical Approaches Results */}
            {pedagogicalError && (
              <div className="text-red-500 mb-4">{pedagogicalError}</div>
            )}
            <div className="mb-8 flex flex-wrap gap-2">
              {selectedApproaches.map((approach) => (
                <Badge
                  key={approach}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer flex items-center gap-1 px-3 py-1"
                  onClick={() => removeApproach(approach)}
                >
                  {approach}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>

            {/* Custom Skills Input */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Add custom pedagogical approaches (comma, space, or enter separated)
              </h4>
              <Input
                value={customSkills}
                onChange={(e) => handleCustomSkillsChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type custom pedagogical approaches and press Enter, comma, or space to add..."
                className="w-full"
              />
            </div>

            {/* Intelligence Types Multi-Select */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Select Intelligence Types
              </h4>
              <div className="grid grid-cols-2 gap-3 p-4 bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
                {allIntelligenceTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50 transition-colors">
                    <Checkbox
                      id={type}
                      checked={selectedIntelligenceTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedIntelligenceTypes([...selectedIntelligenceTypes, type]);
                        } else {
                          setSelectedIntelligenceTypes(selectedIntelligenceTypes.filter(t => t !== type));
                        }
                      }}
                    />
                    <label
                      htmlFor={type}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-foreground"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent mb-2">
                5E Model Design
              </h3>
              <p className="text-muted-foreground">
                Organize your learning activities using the 5E instructional model
              </p>
            </div>
            
            <FiveEDesigner 
              elos={elos}
              onFiveEChange={(data) => {
                setFiveEData(data);
                onFiveEChange(data);
              }}
              pedagogicalApproaches={selectedApproaches}
            />
          </div>
        )}

        {/* Generate Learning Experience Button */}
        <div className="flex justify-center">
          <Button
            onClick={async () => {
              // Merge all 5E content from multiple ELOs
              const mergedFiveEContent = mergeFiveEContent();
              
              setLoadingLearningExperience(true);
              setLearningExperienceError(null);
              setLearningExperience(null);
              try {
                const response = await axios.post(
                  config.ENDPOINTS.GENERATE_LEARNING_EXPERIENCE,
                  {
                    elos,
                    pedagogical_approaches: selectedApproaches,
                    intelligence_types: selectedIntelligenceTypes,
                    course_outcomes: courseOutcomes,
                    grade,
                    subject,
                    chapter,
                    five_e_content: mergedFiveEContent // Add merged 5E content
                  },
                  { headers: { 'Content-Type': 'application/json' } }
                );
                let le = response.data.learning_experience;
                if (typeof le === "string") {
                  try {
                    le = JSON.parse(le);
                  } catch (e) {
                    setLearningExperienceError("Failed to parse learning experience JSON.");
                    setLearningExperience(response.data.learning_experience); // set raw string
                    setShowLearningContent(true);
                    setLoadingLearningExperience(false);
                    return;
                  }
                }
                setLearningExperience(le);
                onLearningExperienceChange(le);
                setShowLearningContent(true);
              } catch (err: any) {
                setLearningExperienceError(
                  err?.response?.data?.detail || err?.message || 'Failed to generate learning experience'
                );
              } finally {
                setLoadingLearningExperience(false);
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base rounded-lg"
            disabled={
              loadingLearningExperience ||
              selectedApproaches.length === 0 ||
              selectedIntelligenceTypes.length === 0 ||
              !elos.length ||
              !courseOutcomes.length ||
              !fiveEData // Ensure 5E data is available
            }
          >
            {loadingLearningExperience ? (
              <>
                <Brain className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Generate Learning Experience
              </>
            )}
          </Button>
        </div>

        {/* Learning Experience Content */}
        {learningExperienceError && (
          <div className="text-red-500 mt-4">{learningExperienceError}</div>
        )}
        {showLearningContent && learningExperience && (
          <div className="mt-8 animate-fade-in">
            <Card className="p-8 bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-6 flex items-center">
                <Brain className="w-7 h-7 mr-3 text-primary animate-pulse" />
                Learning Experience (5E Model)
              </h3>
              {/* Organized by 5E phases, then by ELOs */}
              {(() => {
                let parsed = learningExperience;
                if (typeof parsed === "string") {
                  try {
                    const jsonStart = parsed.indexOf('{');
                    const jsonEnd = parsed.lastIndexOf('}') + 1;
                    if (jsonStart !== -1 && jsonEnd !== -1) {
                      parsed = JSON.parse(parsed.substring(jsonStart, jsonEnd));
                    }
                  } catch (e) {
                    parsed = null;
                  }
                }
                
                if (parsed && parsed["5E_Model"]) {
                  // Group activities by phase, then by ELO
                  const phaseGroups: { [phase: string]: { [elo: string]: any[] } } = {};
                  
                  parsed["5E_Model"].forEach((phaseObj: any) => {
                    const phaseName = phaseObj.phase;
                    if (!phaseGroups[phaseName]) {
                      phaseGroups[phaseName] = {};
                    }
                    
                    phaseObj.activities.forEach((activity: any) => {
                      if (activity.elos && Array.isArray(activity.elos)) {
                        activity.elos.forEach((elo: string) => {
                          if (!phaseGroups[phaseName][elo]) {
                            phaseGroups[phaseName][elo] = [];
                          }
                          phaseGroups[phaseName][elo].push(activity);
                        });
                      }
                    });
                  });
                  
                  return Object.entries(phaseGroups).map(([phase, eloActivities]) => (
                    <div key={phase} className="mb-8">
                      <div className="flex items-center mb-6">
                        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
                        <h4 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mx-4 px-4 py-2 rounded-full border border-primary/20 bg-background/50">
                          {phase}
                        </h4>
                        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent flex-1"></div>
                      </div>
                      
                      <div className="space-y-4">
                        {Object.entries(eloActivities).map(([elo, activities], index) => {
                          const eloIndex = index + 1;
                          const activity = activities[0]; // Get first activity for display
                          
                          return (
                            <Card key={elo} className="border border-muted-foreground/20 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                              <div className="p-6 border-l-4 border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex items-center gap-3">
                                     <h5 className="text-lg font-bold text-foreground">ELO {eloIndex}</h5>
                                   </div>
                                  
                                </div>


                                {/* Description */}
                                <div className="mt-4 pt-4 border-t border-muted-foreground/10">
                                  {editingELO === `ELO${eloIndex}` ? (
                                    <div className="space-y-3">
                                      <Textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="min-h-[100px] text-sm"
                                        placeholder="Edit the learning experience content..."
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => handleSaveEdit(eloIndex)}
                                          className="bg-primary hover:bg-primary/90"
                                        >
                                          <Check className="h-4 w-4 mr-1" />
                                          Save
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={handleCancelEdit}
                                        >
                                          <XIcon className="h-4 w-4 mr-1" />
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                     <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
                                       <div className="font-semibold text-foreground">
                                         **Engage/Elicit Exploration Worksheet**
                                       </div>
                                       
                                       <div className="font-medium text-foreground">
                                         **Part 1: What I Think I Know**
                                       </div>
                                       
                                       <p className="pl-4">
                                         Fill in your initial thoughts about demonstrate respectful communication in a group task scenario to achieve a common goal collaboratively:
                                       </p>
                                       
                                       <div className="pl-4 space-y-3">
                                         <p>1. I think demonstrate respectful communication in a group task scenario to achieve a common goal collaboratively involves listening actively to all team members, ensuring everyone has a chance to share their ideas, and being open to different perspectives.</p>
                                         
                                         <p>2. Respectful communication means using appropriate language, avoiding interrupting others, and providing constructive feedback rather than criticism.</p>
                                         
                                         <p>3. To achieve a common goal collaboratively, team members should establish clear roles and responsibilities, set shared objectives, and regularly check in with each other to ensure progress.</p>
                                         
                                         <p>4. I believe effective group communication requires patience, empathy, and the ability to compromise when there are disagreements.</p>
                                         
                                         <p>5. Successful collaboration also involves recognizing and utilizing each team member's strengths while supporting those who may need assistance.</p>
                                         
                                         <div className="font-medium text-foreground mt-4">
                                           **Part 2: What I Want to Learn**
                                         </div>
                                         
                                         <p>6. I want to learn specific techniques for managing conflicts that arise during group discussions while maintaining respect for all participants.</p>
                                         
                                         <p>7. I would like to understand how to encourage participation from quieter team members without making them feel pressured.</p>
                                         
                                         <p>8. I want to explore strategies for keeping group discussions focused and productive when working toward a shared goal.</p>
                                       </div>
                                     </div>
                                  )}
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ));
                }
                
                // Fallback: show raw content
                return (
                  <pre className="bg-muted/50 rounded-lg p-4 text-xs overflow-x-auto max-h-[500px] text-destructive">
                    {typeof learningExperience === "string"
                      ? learningExperience
                      : JSON.stringify(learningExperience, null, 2)}
                  </pre>
                );
              })()}
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningExperience;
