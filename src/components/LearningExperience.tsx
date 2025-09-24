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

  // Function to process 5E data and combine all ELOs by phases
  const processFiveEDataToCombinedExperience = (fiveEData: any) => {
    const phases = ['engage', 'explore', 'explain', 'elaborate', 'evaluate'];
    const phaseNames = {
      'engage': 'Engage/Elicit',
      'explore': 'Explore', 
      'explain': 'Explain',
      'elaborate': 'Elaborate',
      'evaluate': 'Evaluate'
    };

    const combinedData = {
      "5E_Model": phases.map(phaseId => {
        const phaseActivities: any[] = [];
        
        // Collect all activities from all ELOs for this phase
        fiveEData.forEach((eloData: any) => {
          const stepsForThisPhase = eloData.steps.filter((step: any) => step.id === phaseId);
          
          stepsForThisPhase.forEach((step: any) => {
            if (step.description && step.description.trim()) {
              phaseActivities.push({
                title: `${eloData.elo} - ${step.name}`,
                description: step.description,
                pedagogical_approach: selectedApproaches[0] || 'General',
                intelligence_types: selectedIntelligenceTypes.slice(0, 3), // Show first 3
                elos: [eloData.elo],
                course_outcomes: courseOutcomes.map(co => co.co_title || co.title || 'Course Outcome').slice(0, 2),
                materials: ['Whiteboard', 'Textbook', 'Digital resources']
              });
            }
          });
        });

        return {
          phase: phaseNames[phaseId as keyof typeof phaseNames],
          activities: phaseActivities.length > 0 ? phaseActivities : [{
            title: `${phaseNames[phaseId as keyof typeof phaseNames]} Activity`,
            description: `Activities for the ${phaseNames[phaseId as keyof typeof phaseNames]} phase will be designed based on the selected pedagogical approaches and learning outcomes.`,
            pedagogical_approach: selectedApproaches[0] || 'General',
            intelligence_types: selectedIntelligenceTypes.slice(0, 3),
            elos: elos,
            course_outcomes: courseOutcomes.map(co => co.co_title || co.title || 'Course Outcome').slice(0, 2),
            materials: ['Whiteboard', 'Textbook', 'Digital resources']
          }]
        };
      })
    };

    return combinedData;
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
            onClick={() => {
              if (fiveEData) {
                // Process 5E data to combine all ELOs by phases
                const combinedLearningExperience = processFiveEDataToCombinedExperience(fiveEData);
                setLearningExperience(combinedLearningExperience);
                onLearningExperienceChange(combinedLearningExperience);
                setShowLearningContent(true);
              }
            }}
            className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base rounded-lg"
            disabled={
              !fiveEData ||
              selectedApproaches.length === 0 ||
              selectedIntelligenceTypes.length === 0 ||
              !elos.length ||
              !courseOutcomes.length
            }
          >
            <Brain className="w-5 h-5 mr-2" />
            Generate Learning Experience
          </Button>
        </div>

        {/* Learning Experience Content */}
        {learningExperienceError && (
          <div className="text-red-500 mt-4">{learningExperienceError}</div>
        )}
        {showLearningContent && learningExperience && (
          <div className="mt-8 animate-fade-in">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200/50 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Combined Learning Experience
                </h3>
                <p className="text-gray-600 text-lg">
                  Integrated 5E Model with content from all {elos.length} ELOs
                </p>
              </div>
              
              {learningExperience["5E_Model"] && learningExperience["5E_Model"].map((phaseObj: any, phaseIdx: number) => {
                const phaseColors = {
                  0: 'from-red-500 to-red-600', // Engage
                  1: 'from-blue-500 to-blue-600', // Explore  
                  2: 'from-green-500 to-green-600', // Explain
                  3: 'from-yellow-500 to-orange-500', // Elaborate
                  4: 'from-purple-500 to-purple-600' // Evaluate
                };
                
                const phaseBgColors = {
                  0: 'bg-red-50 border-red-200', // Engage
                  1: 'bg-blue-50 border-blue-200', // Explore
                  2: 'bg-green-50 border-green-200', // Explain  
                  3: 'bg-yellow-50 border-orange-200', // Elaborate
                  4: 'bg-purple-50 border-purple-200' // Evaluate
                };

                return (
                  <div key={phaseIdx} className={`mb-8 p-6 rounded-xl border-2 ${phaseBgColors[phaseIdx as keyof typeof phaseBgColors]} shadow-lg`}>
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${phaseColors[phaseIdx as keyof typeof phaseColors]} flex items-center justify-center text-white font-bold text-lg mr-4`}>
                        {phaseIdx + 1}
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-gray-800">{phaseObj.phase}</h4>
                        <p className="text-gray-600">
                          {phaseObj.activities.length} combined activit{phaseObj.activities.length === 1 ? 'y' : 'ies'} from all ELOs
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4">
                      {phaseObj.activities.map((activity: any, actIdx: number) => (
                        <Card key={actIdx} className="p-6 bg-white/90 border-l-4 border-l-purple-500 shadow-md hover:shadow-lg transition-shadow">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <h5 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h5>
                              <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                                {activity.pedagogical_approach}
                              </Badge>
                              {activity.intelligence_types && activity.intelligence_types.slice(0, 2).map((type: string, i: number) => (
                                <Badge key={i} className="bg-green-100 text-green-700 border-green-200">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
                            {activity.elos && (
                              <div>
                                <h6 className="font-semibold text-gray-800 text-sm mb-2 flex items-center">
                                  <Brain className="w-4 h-4 mr-1" />
                                  Learning Outcomes
                                </h6>
                                <div className="space-y-1">
                                  {activity.elos.map((elo: string, i: number) => (
                                    <div key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      {elo}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {activity.course_outcomes && (
                              <div>
                                <h6 className="font-semibold text-gray-800 text-sm mb-2">Course Outcomes</h6>
                                <div className="space-y-1">
                                  {activity.course_outcomes.map((co: string, i: number) => (
                                    <div key={i} className="text-xs text-gray-600 bg-blue-50 px-2 py-1 rounded">
                                      {co}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {activity.materials && (
                              <div>
                                <h6 className="font-semibold text-gray-800 text-sm mb-2">Materials</h6>
                                <div className="space-y-1">
                                  {activity.materials.map((mat: string, i: number) => (
                                    <div key={i} className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded">
                                      {mat}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LearningExperience;
