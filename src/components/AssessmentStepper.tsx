import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, Target, Settings, CheckSquare } from 'lucide-react';
import AssessmentBasicSetup from './AssessmentBasicSetup';
import AssessmentELOSelection from './AssessmentELOSelection';
import AssessmentItemConfiguration from './AssessmentItemConfiguration';

interface AssessmentStepperProps {
  onComplete?: (assessmentData: any) => void;
}

const AssessmentStepper = ({ onComplete }: AssessmentStepperProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  
  // Assessment data state
  const [assessmentData, setAssessmentData] = useState({
    board: '',
    grade: '',
    subject: '',
    assessmentName: '',
    duration: '',
    marks: '',
    assessmentType: '',
    selectedChapters: [],
    selectedELOs: [],
    itemConfiguration: []
  });
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stepperRef = useRef<HTMLDivElement>(null);

  // Auto-detect current step based on scroll position and sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionRefs.current;
      const stepperElement = stepperRef.current;
      const scrollPosition = window.scrollY;
      const headerHeight = 120; // Actual header height including padding and breadcrumbs
      
      // Check if stepper should be sticky
      if (stepperElement) {
        const stepperTop = stepperElement.offsetTop;
        setIsSticky(scrollPosition > stepperTop - headerHeight);
      }
      
      // Update current step based on scroll position
      const adjustedScrollPosition = scrollPosition + headerHeight + 60;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= adjustedScrollPosition) {
          setCurrentStep(i + 1);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      number: 1,
      title: 'Basic Setup',
      description: 'Configure assessment details',
      icon: FileText
    },
    {
      number: 2,
      title: 'Select ELOs',
      description: 'Choose learning outcomes',
      icon: Target
    },
    {
      number: 3,
      title: 'Configure Items',
      description: 'Set question parameters',
      icon: Settings
    },
    {
      number: 4,
      title: 'Review & Create',
      description: 'Finalize assessment',
      icon: CheckSquare
    }
  ];

  const isStepCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isStepActive = (stepNumber: number) => currentStep === stepNumber;

  const scrollToSection = (stepNumber: number) => {
    const section = sectionRefs.current[stepNumber - 1];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentStep(stepNumber);
    }
  };

  const handleStepClick = (stepNumber: number) => {
    scrollToSection(stepNumber);
  };

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const updateAssessmentData = (newData: Partial<typeof assessmentData>) => {
    setAssessmentData(prev => ({ ...prev, ...newData }));
  };

  // Check if basic setup is complete
  const isBasicSetupComplete = () => {
    return assessmentData.board && assessmentData.grade && assessmentData.subject && 
           assessmentData.assessmentName && assessmentData.duration && 
           assessmentData.marks && assessmentData.assessmentType && 
           assessmentData.selectedChapters.length > 0;
  };

  // Auto-complete steps based on data
  useEffect(() => {
    const newCompletedSteps: number[] = [];
    
    if (isBasicSetupComplete()) {
      newCompletedSteps.push(1);
    }
    
    if (assessmentData.selectedELOs.length > 0) {
      newCompletedSteps.push(2);
    }
    
    if (assessmentData.itemConfiguration.length > 0) {
      newCompletedSteps.push(3);
    }
    
    setCompletedSteps(newCompletedSteps);
  }, [assessmentData]);

  return (
    <div className="w-full bg-background">
      {/* Sticky Stepper */}
      <div 
        ref={stepperRef}
        className={`${
          isSticky 
            ? `fixed top-[120px] left-0 right-0 z-40 border-b border-gray-200/30 shadow-sm bg-white/95 backdrop-blur-md` 
            : 'bg-white border-b border-gray-200'
        } py-4 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center space-x-8 w-full max-w-4xl">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <div key={step.number} className="flex items-center">
                    <div 
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => handleStepClick(step.number)}
                    >
                      {/* Enhanced Step Circle with Icon */}
                       <div className={`
                         relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 mb-2 border
                         ${isStepActive(step.number)
                           ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white border-purple-300 scale-110 ring-2 ring-purple-100'
                           : isStepCompleted(step.number)
                           ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-300'
                           : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 border-gray-300 hover:from-gray-200 hover:to-gray-300 group-hover:scale-105'
                         }
                      `}>
                        {isStepCompleted(step.number) ? (
                          <CheckCircle2 size={20} className="drop-shadow-sm" />
                        ) : (
                          <StepIcon size={20} className={isStepActive(step.number) ? 'drop-shadow-sm' : ''} />
                        )}
                        
                        {/* Active Pulse */}
                        {isStepActive(step.number) && (
                          <div className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20"></div>
                        )}
                      </div>

                      {/* Step Title and Description */}
                      <div className={`text-center transition-all duration-200 ${isSticky ? 'max-w-20' : 'max-w-32'}`}>
                        <div className={`text-sm font-medium transition-colors duration-200 ${
                          isStepActive(step.number)
                            ? 'text-purple-600'
                            : isStepCompleted(step.number)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}>
                          {isSticky ? step.title.split(' ')[0] : step.title}
                        </div>
                        {!isSticky && (
                          <div className="text-xs text-gray-400 mt-1">
                            {step.description}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Enhanced Connector Line */}
                    {index < steps.length - 1 && (
                      <div className={`${isSticky ? 'w-12 mx-3 mb-6' : 'w-16 mx-4 mb-8'} h-0.5 transition-all duration-300 ${
                        isStepCompleted(step.number) 
                          ? 'bg-gradient-to-r from-green-400 to-green-500' 
                          : isStepActive(step.number)
                          ? 'bg-gradient-to-r from-purple-400 to-blue-500'
                          : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic spacer for sticky stepper */}
      {isSticky && <div className="h-[88px]"></div>}

      {/* Sections Container */}
      <div className="relative">
        {/* Step 1: Basic Setup */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[0] = el; }}
          className="relative bg-gradient-to-br from-purple-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto border border-border/20">
                <FileText className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Basic Setup
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Configure your assessment details and select chapters
                </p>
              </div>
            </div>
            
            <AssessmentBasicSetup
              assessmentData={assessmentData}
              updateAssessmentData={updateAssessmentData}
              onComplete={() => {
                markStepComplete(1);
                scrollToSection(2);
              }}
            />
          </div>
        </section>

        {/* Step 2: ELO Selection */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[1] = el; }}
          className="relative bg-gradient-to-br from-blue-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto border border-border/20">
                <Target className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-800 bg-clip-text text-transparent">
                  Select Expected Learning Outcomes
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Choose the learning outcomes you want to assess
                </p>
              </div>
            </div>
            
            <AssessmentELOSelection
              assessmentData={assessmentData}
              updateAssessmentData={updateAssessmentData}
              onComplete={() => {
                markStepComplete(2);
                scrollToSection(3);
              }}
            />
          </div>
        </section>

        {/* Step 3: Item Configuration */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[2] = el; }}
          className="relative bg-gradient-to-br from-green-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-border/20">
                <Settings className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-800 bg-clip-text text-transparent">
                  Configure Assessment Items
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Set up question types, difficulty levels, and marking schemes
                </p>
              </div>
            </div>
            
            <AssessmentItemConfiguration
              assessmentData={assessmentData}
              updateAssessmentData={updateAssessmentData}
              onComplete={() => {
                markStepComplete(3);
                scrollToSection(4);
              }}
            />
          </div>
        </section>

        {/* Step 4: Review & Create */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[3] = el; }}
          className="relative bg-gradient-to-br from-orange-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto border border-border/20">
                <CheckSquare className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-800 bg-clip-text text-transparent">
                  Review & Create Assessment
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Review your settings and generate the final assessment
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-border/50 p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Assessment Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Assessment Type</div>
                    <div className="text-lg font-semibold text-purple-700">{assessmentData.assessmentType || 'Not set'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="text-lg font-semibold text-blue-700">{assessmentData.duration ? `${assessmentData.duration} min` : 'Not set'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Marks</div>
                    <div className="text-lg font-semibold text-green-700">{assessmentData.marks || 'Not set'}</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground">ELOs Selected</div>
                    <div className="text-lg font-semibold text-orange-700">{assessmentData.selectedELOs.length}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (onComplete) {
                        onComplete(assessmentData);
                      }
                      navigate('/assessment-assist/item-generation', { state: { assessmentData } });
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-12 py-4 rounded-xl border border-purple-400/20 hover:scale-105 transition-all duration-300 transform"
                    disabled={completedSteps.length < 3}
                  >
                    Generate Assessment
                  </button>
                  
                  {completedSteps.length < 3 && (
                    <p className="text-sm text-muted-foreground">
                      Complete all previous steps to generate assessment
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AssessmentStepper;