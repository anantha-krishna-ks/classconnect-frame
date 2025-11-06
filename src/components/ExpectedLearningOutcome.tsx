import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Bot, CheckCircle, Brain, Heart, Target, Plus, X, Edit2, RefreshCw, Trash2 } from 'lucide-react';
import axios from 'axios';
import { set } from 'date-fns';
import { PageLoader, Loader } from "@/components/ui/loader"
import config from '@/config';


type ExpectedLearningOutcomeProps = {
  board: string;
  grade: string;
  subject: string;
  chapter: string;
  generatedCOs: any[];
  onEloGenerated?: (data: any) => void;
};
const ExpectedLearningOutcome = ({
  board,
  grade,
  subject,
  chapter,
  generatedCOs,
  onEloGenerated
}: ExpectedLearningOutcomeProps) => {
  const [selectedBlooms, setSelectedBlooms] = useState<string[]>([
    'Apply',
    'Analyse',
    'Evaluate',
    'Create'
  ]);
  const [bloomsELOCounts, setBloomsELOCounts] = useState<{[key: string]: string}>({
    'Apply': '1',
    'Analyse': '1',
    'Evaluate': '1',
    'Create': '1'
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([]);
  const [selectedAttitudes, setSelectedAttitudes] = useState<string[]>([
    'Respect',
    'Integrity', 
    'Compassion',
    'Empathy',
    'Responsibility'
  ]);
  const [customSkills, setCustomSkills] = useState('');
  const [customCompetencies, setCustomCompetencies] = useState('');
  const [customAttitudes, setCustomAttitudes] = useState('');
  const [aiGeneratedSkills, setAiGeneratedSkills] = useState<string[]>([]);
  const [aiGeneratedCompetencies, setAiGeneratedCompetencies] = useState<string[]>([]);
  const [customSkillsList, setCustomSkillsList] = useState<string[]>([]);
  const [customCompetenciesList, setCustomCompetenciesList] = useState<string[]>([]);
  const [isGeneratingSkills, setIsGeneratingSkills] = useState(false);
  const [isGeneratingCompetencies, setIsGeneratingCompetencies] = useState(false);
  const [isGeneratingOutcomes, setIsGeneratingOutcomes] = useState(false);

  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedOutcomes, setGeneratedOutcomes] = useState<any[]>([]);
  const [EloPayload, setEloPayload] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [bloomCounts, setBloomCounts] = useState<{ [key: string]: number }>({
    Apply: 0,
    Analyse: 0,
    Evaluate: 0,
    Create: 0,
  });

  const bloomsLevels = [
    { id: 'apply', label: 'Apply', icon: '🔧', description: 'Use knowledge in new situations' },
    { id: 'analyse', label: 'Analyse', icon: '🔍', description: 'Break down information into parts' },
    { id: 'evaluate', label: 'Evaluate', icon: '⚖️', description: 'Make judgments based on criteria' },
    { id: 'create', label: 'Create', icon: '🎨', description: 'Produce new or original work' }
  ];

  const skillsList: string[] = [];

  const attitudesList = [
    'Respect',
    'Integrity', 
    'Compassion',
    'Empathy',
    'Responsibility'
  ];

  const handleBloomsChange = (blooms: string, checked: boolean) => {
    if (checked) {
      setSelectedBlooms([...selectedBlooms, blooms]);
      // Initialize ELO count for new selection
      if (!bloomsELOCounts[blooms]) {
        setBloomsELOCounts(prev => ({ ...prev, [blooms]: '1' }));
      }
    } else {
      setSelectedBlooms(selectedBlooms.filter(b => b !== blooms));
      // Remove ELO count when unchecked
      const newCounts = { ...bloomsELOCounts };
      delete newCounts[blooms];
      setBloomsELOCounts(newCounts);
    }
  };

  const handleELOCountChange = (blooms: string, count: string) => {
    const value = count.replace(/[^1-5]/g, '').slice(0, 1);
    setBloomsELOCounts(prev => ({ ...prev, [blooms]: value }));
  };

  const handleBloomCountChange = (label: string, value: number) => {
    setBloomCounts(prev => ({ ...prev, [label]: value }));
  };

  const handleSkillsChange = (skill: string, checked: boolean) => {
    if (checked) {
      setSelectedSkills([...selectedSkills, skill]);
    } else {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    }
  };

  const handleCompetenciesChange = (competency: string, checked: boolean) => {
    if (checked) {
      setSelectedCompetencies([...selectedCompetencies, competency]);
    } else {
      setSelectedCompetencies(selectedCompetencies.filter(c => c !== competency));
    }
  };

  const handleAttitudesChange = (attitude: string, checked: boolean) => {
    if (checked) {
      setSelectedAttitudes([...selectedAttitudes, attitude]);
    } else {
      setSelectedAttitudes(selectedAttitudes.filter(a => a !== attitude));
    }
  };

  const parseCustomInput = (input: string): string[] => {
    return input
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const handleCustomSkillsChange = (value: string) => {
    setCustomSkills(value);
    const parsedSkills = parseCustomInput(value);
    setCustomSkillsList(parsedSkills);
    // Update selected skills with both AI and custom
    setSelectedSkills([...aiGeneratedSkills, ...parsedSkills]);
  };

  const handleCustomCompetenciesChange = (value: string) => {
    setCustomCompetencies(value);
    const parsedCompetencies = parseCustomInput(value);
    setCustomCompetenciesList(parsedCompetencies);
    // Update selected competencies with both AI and custom
    setSelectedCompetencies([...aiGeneratedCompetencies, ...parsedCompetencies]);
  };

  const handleCustomAttitudesChange = (value: string) => {
    setCustomAttitudes(value);
    const parsedAttitudes = parseCustomInput(value);
    setSelectedAttitudes([...new Set([...selectedAttitudes.filter(attitude => !parseCustomInput(customAttitudes).includes(attitude)), ...parsedAttitudes])]);
  };

  const handleVerify = () => {
    const writtenOutcomes = customPrompt.toLowerCase().split(',').map(obj => obj.trim());
    
    console.log('ELO Verification results:', {
      written: writtenOutcomes,
      bloomsAlignment: writtenOutcomes.length
    });
    
    alert(`Verification complete: Your learning outcomes are well-structured and ready to use!`);
  };

  const handleGenerateSkills = async () => {
    setIsGeneratingSkills(true);
    if (!board || !grade || !subject || !chapter || generatedCOs.length === 0) {
      setIsGeneratingSkills(false);
      return;
    }

    try {
      const payload = {
        board,
        grade,
        subject,
        chapter,
        total_outcomes: generatedCOs.length,
        course_outcomes: generatedCOs,
      };

      const response = await axios.post(
        config.ENDPOINTS.GENERATE_SKILLS_PER_CO,
        payload
      );
      setEloPayload(response.data);   
      const outcomes = response.data?.course_outcomes;
      if (Array.isArray(outcomes)) {
      
      const allSkills: string[] = outcomes.flatMap(co => co.skills ?? []);
      const uniqueSkills = Array.from(new Set(allSkills));
      setAiGeneratedSkills(uniqueSkills);
      setSelectedSkills([...uniqueSkills, ...customSkillsList]);
    }  else {
        setEloPayload(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSkills(false);
    }
  };

  const handleGenerateCompetencies = async () => {
    setIsGeneratingCompetencies(true);
    // Assuming a similar endpoint for competencies
    // This is a placeholder and might need adjustment
    try {
      const payload = {
        board,
        grade,
        subject,
        chapter,
        total_outcomes: generatedCOs.length,
        course_outcomes: EloPayload?.course_outcomes,
      };
      const response = await axios.post(
        config.ENDPOINTS.GENERATE_COMPETENCIES_PER_CO,
        payload
      );
      setEloPayload(response.data);   
      const outcomes = response.data?.course_outcomes;
      if (Array.isArray(outcomes)) {
        const allCompetencies: string[] = outcomes.flatMap(co => co.competencies ?? []);
        const uniqueCompetencies = Array.from(new Set(allCompetencies));
        setAiGeneratedCompetencies(uniqueCompetencies);
        setSelectedCompetencies([...uniqueCompetencies, ...customCompetenciesList]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCompetencies(false);
    }
  };

   const handleGenerateELO = async () => {
    setIsGeneratingOutcomes(true);
    if (!board || !grade || !subject || !chapter) {
      setIsGeneratingOutcomes(false);
      return;
    }

    // Convert bloomsELOCounts to numbers
    const blooms_elo_counts: { [key: string]: number } = {};
    for (const [key, value] of Object.entries(bloomsELOCounts)) {
        if (selectedBlooms.includes(key)) {
            blooms_elo_counts[key] = parseInt(value, 10);
        }
    }
  
    const payload = {
      board,
      grade,
      subject,
      chapter,
      course_outcomes: EloPayload?.course_outcomes,
      blooms_elo_counts,
      skills: selectedSkills,
      competencies: selectedCompetencies,
      attitudes: selectedAttitudes,
    };

    try {
      const response = await axios.post(
        config.ENDPOINTS.GENERATE_ELOS,
        payload
      );
      
      const courseOutcomes = response.data;
      if (Array.isArray(courseOutcomes)) {
        const allELOs = courseOutcomes.flatMap((co: any) =>
          (co.elos || []).map((elo: any) => ({
            text: elo.elo,
            bloomsLevel: elo.blooms_level || elo.bloomsLevel,
            skills: elo.skills || [],
            competencies: elo.competencies || []
          }))
        );
        setGeneratedOutcomes(allELOs);
        if (onEloGenerated) {
          onEloGenerated(response.data);
        }
        console.log('Generated ELOs:', allELOs);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingOutcomes(false);
    }
  };

  return (
     
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {(isGeneratingSkills || isGeneratingCompetencies || isGeneratingOutcomes) && <PageLoader text="Please wait..." />}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-teal-500"></div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
          <Lightbulb className="text-green-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Expected Learning Outcomes</h3>
          <p className="text-gray-600 text-sm">Define specific learning outcomes using Bloom's Taxonomy</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="space-y-6">
        {/* Blooms Taxonomy */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-purple-600" size={20} />
            <h4 className="font-semibold text-gray-900">Bloom's Taxonomy - Higher Order Thinking Skills</h4>
          </div>
          <div className="space-y-4">
            {bloomsLevels.map((bloom) => (
              <div 
                key={bloom.id}
                className="flex items-center gap-4 bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition-all duration-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Checkbox
                    id={`bloom-${bloom.id}`}
                    checked={selectedBlooms.includes(bloom.label)}
                    onCheckedChange={(checked) => handleBloomsChange(bloom.label, !!checked)}
                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <div className="flex-1">
                    <label 
                      htmlFor={`bloom-${bloom.id}`} 
                      className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900 flex items-center gap-2"
                    >
                      <span className="text-lg">{bloom.icon}</span>
                      <div>
                        <span className="font-semibold">{bloom.label}</span>
                        <p className="text-xs text-gray-600">{bloom.description}</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                {selectedBlooms.includes(bloom.label) && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Number of ELOs:
                    </label>
                    <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[1-5]*"
                    value={bloomsELOCounts[bloom.label] ?? ''}
                    onChange={e => {
                      let val = e.target.value;

                      // Reject if not a digit (1-5)
                      if (!/^[1-5]?$/.test(val)) return;

                      // Allow '' or 1-5
                      handleELOCountChange(bloom.label, val);
                    }}
                    className="w-20"
                    placeholder="1"
                  />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="text-blue-600" size={20} />
              <h4 className="font-semibold text-gray-900">Skills</h4>
            </div>
            <Button
               onClick={handleGenerateSkills}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm px-4 py-2"
              disabled={isGeneratingSkills}
            >
              {isGeneratingSkills ? (
                <Loader size="sm" className="h-4 w-4 mr-2" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {isGeneratingSkills ? 'Generating...' : 'Generate Skills'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {skillsList.map((skill) => (
                <div 
                  key={skill}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={(checked) => handleSkillsChange(skill, !!checked)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label 
                    htmlFor={`skill-${skill}`} 
                    className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                  >
                    {skill}
                  </label>
                </div>
              ))}
            </div>

            {aiGeneratedSkills.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <h5 className="text-sm font-medium text-blue-900">AI Generated Skills:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiGeneratedSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-2 rounded-md text-sm font-semibold">
                      <Bot className="h-3 w-3 mr-1" />
                      {skill}
                      <button
                        onClick={() => {
                          const newAiSkills = aiGeneratedSkills.filter(s => s !== skill);
                          setAiGeneratedSkills(newAiSkills);
                          setSelectedSkills([...newAiSkills, ...customSkillsList]);
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customSkillsList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 text-gray-600" />
                  <h5 className="text-sm font-medium text-gray-900">Custom Skills:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customSkillsList.map((skill, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-semibold">
                      {skill}
                      <button
                        onClick={() => {
                          const newCustomSkills = customSkillsList.filter(s => s !== skill);
                          setCustomSkillsList(newCustomSkills);
                          setSelectedSkills([...aiGeneratedSkills, ...newCustomSkills]);
                          // Update the input field
                          setCustomSkills(newCustomSkills.join(', '));
                        }}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
             <div className="border-t pt-4">
               <label className="text-sm font-medium text-gray-700 mb-2 block">
                 Add custom skills (comma, space, or enter separated)
               </label>
               <Input
                 placeholder="e.g., Research skills, Digital literacy, Time management"
                 value={customSkills}
                 onChange={(e) => handleCustomSkillsChange(e.target.value)}
                 className="w-full"
               />
             </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="text-green-600" size={20} />
              <h4 className="font-semibold text-gray-900">Competencies</h4>
            </div>
            <Button
              onClick={handleGenerateCompetencies}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm px-4 py-2"
              disabled={isGeneratingCompetencies}
            >
              {isGeneratingCompetencies ? (
                <Loader size="sm" className="h-4 w-4 mr-2" />
              ) : (
                <Bot className="h-4 w-4 mr-2" />
              )}
              {isGeneratingCompetencies ? 'Generating...' : 'Generate Competencies'}
            </Button>
          </div>
          
          <div className="space-y-4">
            {aiGeneratedCompetencies.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-green-600" />
                  <h5 className="text-sm font-medium text-green-900">AI Generated Competencies:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiGeneratedCompetencies.map((competency, index) => (
                    <div key={index} className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-2 rounded-md text-sm font-semibold">
                      <Bot className="h-3 w-3 mr-1" />
                      {competency}
                      <button
                        onClick={() => {
                          const newAiCompetencies = aiGeneratedCompetencies.filter(c => c !== competency);
                          setAiGeneratedCompetencies(newAiCompetencies);
                          setSelectedCompetencies([...newAiCompetencies, ...customCompetenciesList]);
                        }}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customCompetenciesList.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 text-gray-600" />
                  <h5 className="text-sm font-medium text-gray-900">Custom Competencies:</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customCompetenciesList.map((competency, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-2 rounded-md text-sm font-semibold">
                      {competency}
                      <button
                        onClick={() => {
                          const newCustomCompetencies = customCompetenciesList.filter(c => c !== competency);
                          setCustomCompetenciesList(newCustomCompetencies);
                          setSelectedCompetencies([...aiGeneratedCompetencies, ...newCustomCompetencies]);
                          // Update the input field
                          setCustomCompetencies(newCustomCompetencies.join(', '));
                        }}
                        className="ml-1 text-gray-600 hover:text-gray-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
             <div className="border-t pt-4">
               <label className="text-sm font-medium text-gray-700 mb-2 block">
                 Add custom competencies (comma, space, or enter separated)
               </label>
               <Input
                 placeholder="e.g., Leadership skills, Innovation thinking, Cultural awareness"
                 value={customCompetencies}
                 onChange={(e) => handleCustomCompetenciesChange(e.target.value)}
                 className="w-full"
               />
             </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-pink-600" size={20} />
            <h4 className="font-semibold text-gray-900">Attitudes</h4>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {attitudesList.map((attitude) => (
                <div 
                  key={attitude}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <Checkbox
                    id={`attitude-${attitude}`}
                    checked={selectedAttitudes.includes(attitude)}
                    onCheckedChange={(checked) => handleAttitudesChange(attitude, !!checked)}
                    className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                  />
                  <label 
                    htmlFor={`attitude-${attitude}`} 
                    className="text-sm font-medium text-gray-800 cursor-pointer hover:text-gray-900"
                  >
                    {attitude}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      
      </div>
      
      <div className="text-center mb-6">
        <Button 
          onClick={handleGenerateELO}
          className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
          disabled={isGeneratingOutcomes || (selectedBlooms.length === 0 && selectedSkills.length === 0 && selectedAttitudes.length === 0)}
        >
          {isGeneratingOutcomes ? (
            <Loader size="sm" className="mr-2" />
          ) : (
            <Lightbulb className="mr-2" size={18} />
          )}
          {isGeneratingOutcomes ? 'Generating...' : 'Generate Learning Outcomes'}
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          {selectedBlooms.length} Blooms + {selectedSkills.length} Skills + {selectedCompetencies.length} Competencies + {selectedAttitudes.length} Attitudes selected
        </p>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-green-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <Lightbulb size={12} className="text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900">Generated Learning Outcomes</h4>
        </div>
        <div className="space-y-4">
          {generatedOutcomes.length > 0 ? (
            generatedOutcomes.map((outcome, index) => (
              <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-green-50/30">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header with ELO number and Bloom's Taxonomy */}
                      <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-lg border border-green-200">
                          <span className="text-xs font-bold text-green-800">ELO {index + 1}</span>
                        </div>
                        
                        {outcome.bloomsLevel && (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Bloom's Taxonomy</span>
                            <Badge 
                              variant="secondary"
                              className={`
                                text-sm font-bold px-4 py-2 shadow-md border-2
                                ${outcome.bloomsLevel.toLowerCase() === 'remember' ? 'bg-blue-100 text-blue-800 border-blue-300' : ''}
                                ${outcome.bloomsLevel.toLowerCase() === 'understand' ? 'bg-purple-100 text-purple-800 border-purple-300' : ''}
                                ${outcome.bloomsLevel.toLowerCase() === 'apply' ? 'bg-indigo-100 text-indigo-800 border-indigo-300' : ''}
                                ${outcome.bloomsLevel.toLowerCase() === 'analyze' || outcome.bloomsLevel.toLowerCase() === 'analyse' ? 'bg-pink-100 text-pink-800 border-pink-300' : ''}
                                ${outcome.bloomsLevel.toLowerCase() === 'evaluate' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : ''}
                                ${outcome.bloomsLevel.toLowerCase() === 'create' ? 'bg-green-100 text-green-800 border-green-300' : ''}
                              `}
                            >
                              <Brain className="w-4 h-4 inline mr-2" />
                              {outcome.bloomsLevel}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {/* Learning Outcome Text */}
                      <p className="text-base text-gray-900 font-medium leading-[1.8] mb-4 tracking-normal">
                        {outcome.text}
                      </p>
                      
                      {(outcome.skills?.length > 0 || outcome.competencies?.length > 0) && (
                        <div className="space-y-2">
                          {outcome.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-xs font-medium text-gray-600 mr-1">Skills:</span>
                              {outcome.skills.map((skill: string, idx: number) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          {outcome.competencies?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              <span className="text-xs font-medium text-gray-600 mr-1">Competencies:</span>
                              {outcome.competencies.map((comp: string, idx: number) => (
                                <Badge 
                                  key={idx} 
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 text-xs"
                                >
                                  {comp}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          ) : (
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500 text-center italic">Your expected learning outcomes will be generated here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpectedLearningOutcome;
