// --- ADDED/CHANGED CODE BELOW ---

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Brain } from 'lucide-react';
import axios from 'axios';
import config from '@/config';
import FiveEDesigner from './FiveEDesigner';

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
const [selectedIntelligenceTypes] = useState<string[]>(allIntelligenceTypes); // always all selected
  const [showLearningContent, setShowLearningContent] = useState<boolean>(false);

  // New state for pedagogical approaches (flat list)
  const [loadingPedagogical, setLoadingPedagogical] = useState(false);
  const [pedagogicalError, setPedagogicalError] = useState<string | null>(null);
  const [loadingLearningExperience, setLoadingLearningExperience] = useState(false);
  const [learningExperienceError, setLearningExperienceError] = useState<string | null>(null);
  const [learningExperience, setLearningExperience] = useState<any>(null);
  const [fiveEData, setFiveEData] = useState<any>(null);

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
            {loadingPedagogical ? 'Generating...' : 'Generate Pedagogical Approaches and Resources'}
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
            <Card className="p-6 bg-background border-2 border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-primary" />
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
                        <div className="h-px bg-muted-foreground/30 flex-1"></div>
                        <h4 className="text-xl font-bold text-primary mx-4">{phase}</h4>
                        <div className="h-px bg-muted-foreground/30 flex-1"></div>
                      </div>
                      
                      <div className="space-y-4 ml-6">
                        {Object.entries(eloActivities).map(([elo, activities]) => (
                          <div key={elo} className="border-l-4 border-primary/30 pl-4">
                            <h5 className="font-semibold text-foreground mb-2">{elo}:</h5>
                            <div className="space-y-3">
                              {activities.map((activity: any, idx: number) => (
                                <div key={idx} className="bg-muted/20 rounded-lg p-4">
                                  {activity.title && (
                                    <h6 className="font-medium text-foreground mb-2">{activity.title}</h6>
                                  )}
                                  <p className="text-muted-foreground mb-3">
                                    {activity.description || activity.content || "Generated learning activity"}
                                  </p>
                                  
                                  {activity.materials && activity.materials.length > 0 && (
                                    <div className="mb-2">
                                      <span className="text-sm font-medium text-foreground">Materials: </span>
                                      <span className="text-sm text-muted-foreground">
                                        {activity.materials.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  
                                  {activity.duration && (
                                    <div className="mb-2">
                                      <span className="text-sm font-medium text-foreground">Duration: </span>
                                      <span className="text-sm text-muted-foreground">{activity.duration}</span>
                                    </div>
                                  )}
                                  
                                  {activity.pedagogical_approach && (
                                    <Badge variant="secondary" className="text-xs">
                                      {activity.pedagogical_approach}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
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
