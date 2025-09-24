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
              onFiveEChange={onFiveEChange}
              pedagogicalApproaches={selectedApproaches}
            />
          </div>
        )}

        {/* Generate Learning Experience Button */}
        <div className="flex justify-center">
          <Button
            onClick={async () => {
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
                    chapter
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
              !courseOutcomes.length
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
          <div className="text-red-500 mt-4 p-4 bg-red-50 rounded-lg border border-red-200">{learningExperienceError}</div>
        )}
        {showLearningContent && learningExperience && (
          <div className="mt-8 animate-fade-in">
            <Card className="overflow-hidden bg-gradient-to-br from-background via-background/95 to-primary/5 border-2 border-primary/20 shadow-xl">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <Brain className="w-8 h-8 mr-3" />
                  Comprehensive Learning Experience
                </h3>
                <p className="text-primary-foreground/90 mt-2">Integrated 5E Model combining all ELOs</p>
              </div>
              
              <div className="p-6">
                {/* Robust parsing and fallback */}
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
                    // Group activities by phase instead of displaying them as provided
                    const phaseGroups: { [key: string]: any[] } = {};
                    const phaseOrder = ['Engage', 'Explore', 'Explain', 'Elaborate', 'Evaluate'];
                    
                    // Initialize phase groups
                    phaseOrder.forEach(phase => {
                      phaseGroups[phase] = [];
                    });
                    
                    // Collect all activities from all phases
                    parsed["5E_Model"].forEach((phaseObj: any) => {
                      const phaseName = phaseObj.phase;
                      if (phaseGroups[phaseName]) {
                        phaseGroups[phaseName].push(...phaseObj.activities);
                      }
                    });
                    
                    return phaseOrder.map((phase, phaseIdx) => {
                      const activities = phaseGroups[phase];
                      if (activities.length === 0) return null;
                      
                      return (
                        <div key={phaseIdx} className="mb-10 last:mb-0">
                          <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4 shadow-lg">
                              {phaseIdx + 1}
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-primary mb-1">{phase}</h4>
                              <p className="text-muted-foreground text-sm">
                                {activities.length} integrated {activities.length === 1 ? 'activity' : 'activities'} from all ELOs
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {activities.map((activity: any, actIdx: number) => (
                              <Card key={actIdx} className="p-5 bg-card/80 backdrop-blur-sm border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30">
                                <div className="flex flex-col h-full">
                                  <div className="flex items-start justify-between mb-3">
                                    <h5 className="text-lg font-semibold text-foreground line-clamp-2 flex-1 mr-2">
                                      {activity.title}
                                    </h5>
                                    <Badge variant="outline" className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20">
                                      {activity.pedagogical_approach}
                                    </Badge>
                                  </div>
                                  
                                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                                    {activity.description}
                                  </p>
                                  
                                  {activity.intelligence_types && activity.intelligence_types.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {activity.intelligence_types.slice(0, 3).map((type: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="text-xs bg-secondary/60 text-secondary-foreground">
                                          {type}
                                        </Badge>
                                      ))}
                                      {activity.intelligence_types.length > 3 && (
                                        <Badge variant="secondary" className="text-xs bg-secondary/60 text-secondary-foreground">
                                          +{activity.intelligence_types.length - 3}
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="mt-auto space-y-3">
                                    {activity.elos && activity.elos.length > 0 && (
                                      <div>
                                        <span className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1 block">
                                          Learning Outcomes
                                        </span>
                                        <div className="bg-muted/30 rounded-md p-2 max-h-20 overflow-y-auto">
                                          <ul className="text-xs text-muted-foreground space-y-0.5">
                                            {activity.elos.slice(0, 2).map((elo: string, i: number) => (
                                              <li key={i} className="line-clamp-1">• {elo}</li>
                                            ))}
                                            {activity.elos.length > 2 && (
                                              <li className="text-primary font-medium">+{activity.elos.length - 2} more</li>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {activity.materials && activity.materials.length > 0 && (
                                      <div>
                                        <span className="font-medium text-xs text-muted-foreground uppercase tracking-wide mb-1 block">
                                          Resources
                                        </span>
                                        <div className="bg-muted/30 rounded-md p-2">
                                          <div className="flex flex-wrap gap-1">
                                            {activity.materials.slice(0, 3).map((mat: string, i: number) => (
                                              <Badge key={i} variant="outline" className="text-xs bg-background/50">
                                                {mat}
                                              </Badge>
                                            ))}
                                            {activity.materials.length > 3 && (
                                              <Badge variant="outline" className="text-xs bg-background/50 text-primary">
                                                +{activity.materials.length - 3}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    }).filter(Boolean);
                  }
                  
                  // Fallback: show raw string
                  return (
                    <div className="bg-muted/30 rounded-lg p-6 border border-destructive/20">
                      <h4 className="text-lg font-semibold text-destructive mb-3">Unable to parse learning experience</h4>
                      <pre className="bg-background rounded-md p-4 text-xs overflow-x-auto max-h-[400px] text-muted-foreground whitespace-pre-wrap">
                        {typeof learningExperience === "string"
                          ? learningExperience
                          : JSON.stringify(learningExperience, null, 2)}
                      </pre>
                    </div>
                  );
                })()}
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningExperience;
