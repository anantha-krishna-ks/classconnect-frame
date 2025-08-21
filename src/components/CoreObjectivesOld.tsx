
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Target, Sparkles, Star, Heart, Trophy, CheckCircle2, Zap, Lightbulb, Bot } from 'lucide-react';
import CoreObjectivesShortlist from './CoreObjectivesShortlist';

interface CoreObjectivesProps {
  onGenerateCO: (objectives: string[]) => void;
}

const CoreObjectives = ({ onGenerateCO }: CoreObjectivesProps) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'aiAssist'>('recommended');
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [customObjective, setCustomObjective] = useState('');
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const availableObjectives = [
    { 
      id: 'timeless', 
      label: 'Timeless values', 
      icon: '⭐', 
      description: 'Help students understand eternal principles and moral values',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'lifeskill', 
      label: 'Life skill', 
      icon: '💪', 
      description: 'Develop practical skills for personal and professional growth',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'relevance', 
      label: 'Relevance to life', 
      icon: '🌱', 
      description: 'Connect learning to real-world applications and daily life',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1000);
  };

  const handleObjectiveToggle = (objective: string) => {
    if (activeTab === 'aiAssist') return; // Don't allow changes in AI mode
    
    const isSelected = selectedObjectives.includes(objective);
    
    if (isSelected) {
      setSelectedObjectives(selectedObjectives.filter(obj => obj !== objective));
    } else {
      setSelectedObjectives([...selectedObjectives, objective]);
      triggerCelebration();
    }
  };

  const handleAddToShortlist = (objective: string) => {
    if (!shortlistedObjectives.includes(objective)) {
      setShortlistedObjectives([...shortlistedObjectives, objective]);
      triggerCelebration();
    }
  };

  const handleRemoveFromShortlist = (objective: string) => {
    setShortlistedObjectives(shortlistedObjectives.filter(obj => obj !== objective));
  };

  const handleGenerateCO = () => {
    const objectives = customObjective.trim() 
      ? [...selectedObjectives, customObjective.trim()] 
      : selectedObjectives;
    onGenerateCO(objectives);
  };

  const totalSelected = selectedObjectives.length + (customObjective.trim() ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
      {/* Celebration Effect */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping">
            <Sparkles className="text-yellow-400" size={32} />
          </div>
          <div className="absolute top-1/4 left-1/4 animate-bounce delay-100">
            <Star className="text-purple-500" size={16} />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-200">
            <Heart className="text-pink-500" size={14} />
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
          <Target className="text-purple-600" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Core Objectives</h3>
          <p className="text-gray-600">Choose what matters most for your students ✨</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'recommended'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Star size={16} className={activeTab === 'recommended' ? 'fill-current' : ''} />
          <span className="font-medium">Recommended</span>
        </button>
        <button
          onClick={() => setActiveTab('aiAssist')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200 ${
            activeTab === 'aiAssist'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Star size={16} className={activeTab === 'aiAssist' ? 'fill-current' : ''} />
          <span className="font-medium">AI Assist</span>
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-yellow-500" size={16} />
          <span className="text-sm font-medium text-gray-700">
            {totalSelected === 0 ? "Choose your objectives" : `${totalSelected} objective${totalSelected > 1 ? 's' : ''} selected! 🎉`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((totalSelected / 3) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Recommended Tab Content */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          {/* Main Objectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availableObjectives.map((objective) => {
              const isSelected = selectedObjectives.includes(objective.label);
              return (
                <div
                  key={objective.id}
                  className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group
                    ${isSelected 
                      ? `border-transparent bg-gradient-to-br ${objective.color} text-white shadow-lg` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  {/* Star button for shortlisting */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToShortlist(objective.label);
                    }}
                    className={`absolute top-2 left-2 p-1 rounded-full transition-all duration-200 ${
                      shortlistedObjectives.includes(objective.label)
                        ? 'text-yellow-400'
                        : isSelected ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Star size={16} className={shortlistedObjectives.includes(objective.label) ? 'fill-current' : ''} />
                  </button>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                  )}
                  
                  <div 
                    className="text-center pt-4"
                    onClick={() => handleObjectiveToggle(objective.label)}
                  >
                    <div className="text-3xl mb-3">{objective.icon}</div>
                    <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {objective.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                      {objective.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Objective */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-2xl">💡</div>
              <h4 className="font-semibold text-orange-900">Got Something Specific in Mind?</h4>
            </div>
            
            <Textarea
              placeholder="Type your own teaching objective here... (e.g., Students will learn to solve real-world problems creatively)"
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              className="w-full min-h-[80px] resize-none border-orange-200 focus:border-orange-400 focus:ring-orange-400 bg-white"
            />
          </div>
        </div>
      )}

      {/* AI Assist Tab Content */}
      {activeTab === 'aiAssist' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-blue-600" size={20} />
            <h4 className="font-medium text-blue-900">AI-Powered Objective Suggestions</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {availableObjectives.map((objective) => {
              const isSelected = selectedObjectives.includes(objective.label);
              return (
                <div
                  key={`ai-${objective.id}`}
                  className={`
                    relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 group
                    ${isSelected 
                      ? `border-transparent bg-gradient-to-br ${objective.color} text-white shadow-lg` 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                    }
                  `}
                >
                  {/* Selection indicator for AI Assist */}
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className={isSelected ? "text-white" : "text-gray-400"} size={20} />
                  </div>
                  
                  <div 
                    className="text-center pt-2"
                    onClick={() => handleObjectiveToggle(objective.label)}
                  >
                    <div className="text-3xl mb-3">{objective.icon}</div>
                    <h4 className={`font-semibold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {objective.label}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                      {objective.description}
                    </p>
                  </div>
                  
                  {/* Always selected in AI Assist */}
                  <div className="absolute bottom-2 right-2">
                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                      AI Selected
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-900">AI Custom Suggestion</span>
            </div>
            <Textarea
              placeholder="Describe your teaching context and let AI suggest objectives..."
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              className="w-full min-h-[60px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-400"
            />
          </div>
        </div>
      )}

      {/* Shortlisted Objectives */}
      <div className="mt-6">
        <CoreObjectivesShortlist
          shortlistedObjectives={shortlistedObjectives}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onAddToShortlist={handleAddToShortlist}
          availableObjectives={availableObjectives.map(obj => obj.label)}
        />
      </div>

      {/* Generate Button */}
      <div className="text-center mt-6">
        <Button 
          onClick={handleGenerateCO}
          disabled={totalSelected === 0}
          className={`
            px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 transform
            ${totalSelected > 0 
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105 hover:shadow-xl' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Sparkles className="mr-2" size={20} />
          {totalSelected === 0 ? 'Choose at least one objective' : `Create My Lesson Plan! 🚀`}
        </Button>
        
        {totalSelected > 0 && (
          <p className="text-sm text-gray-600 mt-3">
            Ready to create an amazing lesson with {totalSelected} objective{totalSelected > 1 ? 's' : ''}! 
          </p>
        )}
      </div>
    </div>
  );
};

export default CoreObjectives;
