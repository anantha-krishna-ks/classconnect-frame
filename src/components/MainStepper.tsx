import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, BookOpen, Target, FileBarChart, Sparkles, Award, Clock, Users, FileCheck, Lightbulb } from 'lucide-react';
import SelectionPanel from './SelectionPanel';  // Format ELO data for the lesson plan
import { getGrades, getSubjects, getChapters, generateCourseOutcomes, Grade, Subject, Chapter, CourseOutcome } from '@/pages/api';
import CoreObjectives from './CoreObjectives';
import ExpectedLearningOutcome from './ExpectedLearningOutcome';
import ObjectiveMapping from './ObjectiveMapping';
import Assessment from './Assessment';
import axios from 'axios';
import { PageLoader } from "@/components/ui/loader"
import LearningExperience from './LearningExperience';
import FiveEDesigner from './FiveEDesigner';
import config from '@/config';


interface MainStepperProps {
  board: string;
  setBoard: (board: string) => void;
  grade: string;
  setGrade: (grade: string) => void;
  subject: string;
  setSubject: (subject: string) => void;
  chapters: string;
  setChapters: (chapters: string) => void;
  onGenerateCO: (objectives: any[]) => void;
  generatedCOs: CourseOutcome[];
  onSaveCustomObjective: (objective: CourseOutcome) => void;
}

const MainStepper = ({ 
  board, 
  setBoard, 
  grade, 
  setGrade, 
  subject, 
  setSubject, 
  chapters,
  setChapters,
  onGenerateCO,
  generatedCOs,
  onSaveCustomObjective
}: MainStepperProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [shortlistedObjectives, setShortlistedObjectives] = useState<string[]>([]);
  const [isSticky, setIsSticky] = useState(false);
  const [scrolledBeyondHeader, setScrolledBeyondHeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLearningExperienceGenerated, setIsLearningExperienceGenerated] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [chapterList, setChapterList] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unitPlan, setUnitPlan] = useState<any>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const stepperRef = useRef<HTMLDivElement>(null);
  const [eloApiResponse, setEloApiResponse] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [learningExperienceData, setLearningExperienceData] = useState<any>(null);
  const [fiveEData, setFiveEData] = useState<any>(null);
  const [isFiveEGenerated, setIsFiveEGenerated] = useState(false);
  const canProceedFromStep1 = board && grade && subject;

  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionRefs.current;
      const stepperElement = stepperRef.current;
      const scrollPosition = window.scrollY;
      const headerHeight = 110;
      
      if (stepperElement) {
        const stepperTop = stepperElement.offsetTop;
        setIsSticky(scrollPosition > stepperTop);
        setScrolledBeyondHeader(scrollPosition > headerHeight + 50);
      }
      
      const adjustedScrollPosition = scrollPosition + headerHeight + 100;
      
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

  useEffect(() => {
    if (canProceedFromStep1 && !completedSteps.includes(1)) {
      setCompletedSteps(prev => [...prev, 1]);
    }
  }, [board, grade, subject, canProceedFromStep1, completedSteps]);

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      setIsLoadingGrades(true);
      setError(null);
      try {
        const gradesData = await getGrades('eps');
        setGrades(gradesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch grades');
        console.error(err);
      } finally {
        setIsLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  const handleGradeChange = async (value: string) => {
    setLoading(true);
    setGrade(value);
    setSubject('');
    setChapters('');
    setSubjects([]);
    setChapterList([]);
    if (!value || value === 'all') {
      setLoading(false);
      return;
    }
    setIsLoadingSubjects(true);
    setError(null);
    try {
      const subjectsData = await getSubjects('eps', parseInt(value, 10));
      setSubjects(subjectsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch subjects');
      console.error(err);
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  const handleSubjectChange = async (value: string) => {
    setLoading(true);
    setSubject(value);
    setChapters('');
    setChapterList([]);
    const selectedSubject = subjects.find(s => String(s.SubjectId) === value);
    if (!selectedSubject) {
      setLoading(false);
      return;
    }
    setIsLoadingChapters(true);
    setError(null);
    try {
      const chaptersData = await getChapters('eps', selectedSubject.PlanClassId);
      setChapterList(chaptersData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch chapters');
      console.error(err);
    } finally {
      setIsLoadingChapters(false);
    }
  };

  const handleGenerateCOs = async () => {
    setLoading(true);
    const gradeName = grades.find(g => String(g.ClassId) === grade)?.ClassName;
    const subjectName = subjects.find(s => String(s.SubjectId) === subject)?.SubjectName;
    const chapterName = chapterList.find(c => c.chapterId === chapters)?.chapterName;

    if (!board || !gradeName || !subjectName || !chapterName) {
      setError("Please select a board, grade, subject, and chapter.");
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const result = await generateCourseOutcomes(board, gradeName, subjectName, chapterName);
      if (result.course_outcomes) {
        onGenerateCO(result.course_outcomes);
        const nextStep = steps.find(s => s.number === 2);
        if(nextStep) {
          scrollToSection(nextStep.number);
        }
        setLoading(false);
      } else {
        setLoading(false);
        throw new Error("Invalid response structure from CO generation API");
      }
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Setup & Content', description: 'Configure your lesson basics and upload materials', icon: BookOpen },
    { number: 2, title: 'Manage Objectives', description: 'Select learning objectives', icon: Target },
    { number: 3, title: 'Expected Learning Outcomes', description: 'Define learning outcomes', icon: FileCheck },
    { number: 4, title: 'Objective Mapping', description: 'Connect objectives to outcomes', icon: Target },
    { number: 5, title: 'Assessment', description: 'Create assessment items for ELOs', icon: FileBarChart },
    { number: 6, title: 'Learning Experience', description: 'Design learning activities', icon: Lightbulb },
    { number: 7, title: '5E Model Design', description: 'Organize activities using 5E model', icon: Sparkles },
    { number: 8, title: 'Review & Create', description: 'Finalize your lesson plan', icon: CheckCircle2 }
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
      setCompletedSteps(prev => [...prev, stepNumber]);
    }
  };
  useEffect(() => {
    const newCompletedSteps: number[] = [];
    if (board && grade && subject) newCompletedSteps.push(1);
    if (shortlistedObjectives.length > 0) newCompletedSteps.push(2);
    // Do NOT auto-complete Assessment (step 5) here; only mark as complete after generation
    setCompletedSteps(prev => {
      // Retain steps 3, 4, 5, 6 if already completed via markStepComplete
      const retain = prev.filter(step => step > 2);
      return [...newCompletedSteps, ...retain];
    });
  }, [board, grade, subject, shortlistedObjectives]);

   const generateUnitPlan = async () => {
    setLoading(true);
     const gradeName = grades.find(g => String(g.ClassId) === grade)?.ClassName;
    const subjectName = subjects.find(s => String(s.SubjectId) === subject)?.SubjectName;
    const PlanClassId = subjects.find(s => String(s.SubjectId) === subject)?.PlanClassId;
    const chapterName = chapterList.find(c => c.chapterId === chapters)?.chapterName;
      try {
       let uniqueElos :string[]  = [];;
       let uniqueSkills:string[]  = [];
       let coreObjectives: string[] = [];
       let attitudes: string[] = [];
      const outcomes =  eloApiResponse?.course_outcomes
      if (Array.isArray(outcomes)) {      
      const allElos: string[]= outcomes.flatMap(co => co.elos ?? []);
      uniqueElos = Array.from(new Set(allElos));
      const allSkills: string[] = outcomes.flatMap(co => co.skills ?? []);
     uniqueSkills = Array.from(new Set(allSkills)); 
     const allcos: string[]= outcomes.flatMap(co => co.co_description ?? []);
      coreObjectives = Array.from(new Set(allcos));
      const allattitudes: string[] = outcomes.flatMap(co => co.Attitudes ?? []);
      attitudes = Array.from(new Set(allattitudes));
      }
        const payload = {
          board: 'CBSE',
          grade: gradeName,
          subject: subjectName,
          chapter: chapterName,
          core_objectives: coreObjectives,
          skills: uniqueSkills,
          attitudes: attitudes,
          learning_outcomes: uniqueElos,
          taxonomy_levels: outcomes?.[0]?.bloomsTaxonomy?.[0]?.toLowerCase() || 'knowledge' // Default to 'knowledge' if not available
        };
  
        const response = await axios.post(
          config.ENDPOINTS.GENERATE_UNIT_PLAN,
          JSON.stringify(payload),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
  
        const apiUnitPlan = JSON.parse(response.data['unit_plan']);
        const unitPlanData = {
          // Use generated Course Outcomes for Core Objectives
          coreObjectives: generatedCOs.map(co => ({
            text: co.co_description,
            title: co.co_title,
            label: { value: co.factor }
          })),
          
          // Learning outcomes directly from ELO API response
          expectedLearningOutcomes: eloApiResponse?.course_outcomes?.flatMap((co: any) => 
            (co.elos || []).map((elo: any) => ({
              text: typeof elo === 'string' ? elo : elo.elo,
              bloomLevel: elo.bloom_level || 'Not Specified',
              skills: co.skills ? co.skills.map((s: any) => s.skill_name) : [],
              competencies: co.competencies ? co.competencies.map((c: any) => c.competency_name) : []
            }))
          ).filter(Boolean) || [],
  
          // Assessment data
          assessment: assessmentData || [], 

          // Learning experiences
          learningExperiences: learningExperienceData || null,

          // 5E Model Design
          fiveEDesign: fiveEData || null,

          // New sections from the API
          learningProgression: apiUnitPlan.learningProgression || [],
          assignments: apiUnitPlan.assignments || [],
        };
        
        setUnitPlan(unitPlanData);
        setLoading(false);
        // Debug: Log the data being passed to LessonPlanTraditional
        console.log('Navigating to LessonPlanTraditional with unitPlanData:', JSON.stringify(unitPlanData, null, 2));
        
        navigate('/lesson-plan-traditional', {
          state: {
            lessonData: {
              grade: gradeName,
              subject: subjectName,
              lessonName: chapterName || `${subjectName} Lesson Plan`,
              gradeid: grade,
              subjectid: subject,
              PlanClassId: PlanClassId,
              chapterid: chapters,
              unitplandata: unitPlanData,
            },
          },
        });
      } catch (error) {
        console.error('Failed to fetch unit plan:', error);
      }
    };

  // Debug: Log ELO API response before rendering
  console.log('ELO API Response for ObjectiveMapping:', eloApiResponse);

  
return (
  <div className="w-full bg-background">
    {loading && <PageLoader text="Please wait..." />}
    <div ref={stepperRef} className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50 border-b border-gray-200/30 shadow-sm bg-white/95 backdrop-blur-md' : 'bg-white border-b border-gray-200'} py-2 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center space-x-6">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center cursor-pointer group" onClick={() => handleStepClick(step.number)}>
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-1 ${isStepActive(step.number) ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110 ring-4 ring-blue-100' : isStepCompleted(step.number) ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 hover:from-gray-200 hover:to-gray-300 group-hover:scale-105'}`}>
                    {isStepCompleted(step.number) ? <CheckCircle2 size={18} className="drop-shadow-sm" /> : <StepIcon size={18} className={isStepActive(step.number) ? 'drop-shadow-sm' : ''} />}
                    {isStepActive(step.number) && <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></div>}
                  </div>
                  <div className={`text-center transition-all duration-200 ${isSticky ? 'max-w-20' : 'max-w-28'}`}>
                    <div className={`text-xs font-medium transition-colors duration-200 ${isStepActive(step.number) ? 'text-blue-600' : isStepCompleted(step.number) ? 'text-green-600' : 'text-gray-500'}`}>
                      {isSticky ? step.title.split(' ')[0] : step.title}
                    </div>
                    {!isSticky && <div className="text-xs text-gray-400 mt-1">{step.description}</div>}
                  </div>
                </div>
                {index < steps.length - 1 && <div className={`${isSticky ? 'w-10 mx-3 mb-4' : 'w-14 mx-4 mb-6'} h-0.5 transition-all duration-300 ${isStepCompleted(step.number) ? 'bg-gradient-to-r from-green-400 to-green-500' : isStepActive(step.number) ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
      {isSticky && <div className="h-[76px]"></div>}
      <div className="relative">
        <section ref={(el) => { if (el) sectionRefs.current[0] = el; }} className="relative bg-gradient-to-br from-blue-50/50 to-white py-16">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
                <BookOpen className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Basic Setup & Content</h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">Configure your lesson basics and upload materials to get started</p>
              </div>
            </div>
            {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
            <SelectionPanel
              board={board}
              setBoard={setBoard}
              grade={grade}
              subject={subject}
              onSubjectChange={handleSubjectChange}
              chapters={chapters}
              setChapters={setChapters}
              grades={grades}
              subjects={subjects}
              chaptersData={chapterList}
              onGradeChange={handleGradeChange}
              isLoadingGrades={isLoadingGrades}
              isLoadingSubjects={isLoadingSubjects}
              isLoadingChapters={isLoadingChapters}
              onGenerateCOs={handleGenerateCOs}
            />
          </div>
        </section>
        <section ref={(el) => { if (el) sectionRefs.current[1] = el; }} className="relative bg-gradient-to-br from-purple-50/50 to-white py-16">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                <Target className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Manage Objectives</h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">Choose and customize learning objectives for your lesson</p>
              </div>
            </div>
            <CoreObjectives 
              onGenerateCO={onGenerateCO}
              shortlistedObjectives={shortlistedObjectives}
              setShortlistedObjectives={setShortlistedObjectives}
              generatedCOs={generatedCOs}
              onSaveCustomObjective={onSaveCustomObjective}
              onContinue={() => { markStepComplete(2); scrollToSection(3); }}
            />
          </div>
        </section>
      <section 
          ref={(el) => { if (el) sectionRefs.current[2] = el; }}
          className="relative bg-gradient-to-br from-emerald-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <FileBarChart className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                  Expected Learning Outcomes
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Define measurable outcomes and success criteria
                </p>
              </div>
            </div>
            
            <ExpectedLearningOutcome 
              board={board}
              grade={grades.find(g => String(g.ClassId) === grade)?.ClassName}
              subject={subjects.find(s => String(s.SubjectId) === subject)?.SubjectName}
              chapter={chapterList.find(c => c.chapterId === chapters)?.chapterName}
              generatedCOs={generatedCOs} 
              onEloGenerated={(data) => {
                setEloApiResponse(data);
                markStepComplete(3);
              }}
            />
          </div>
        </section>

        {/* Section 4: Objective Mapping */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[3] = el; }}
          className="relative bg-gradient-to-br from-indigo-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
                <Target className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-800 bg-clip-text text-transparent">
                  Objective Mapping
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Connect Core Objectives with Expected Learning Outcomes
                </p>
              </div>
            </div>
            
            <ObjectiveMapping
              data={
                Array.isArray(eloApiResponse)
                  ? eloApiResponse.map((co, idx) => {
                      const skills = Array.isArray(co.skills)
                        ? [...new Set(co.skills)] as string[]
                        : ["N/A"];

                      const competencies = Array.isArray(co.competencies)
                        ? [...new Set(co.competencies)] as string[]
                        : ["N/A"];

                      const elos = Array.isArray(co.elos)
                        ? co.elos.filter((elo: any) => typeof elo.elo === "string")
                        : [];

                      const eloList = elos.length > 0
                        ? elos.map((elo: any, i: number) => `${i + 1}. ${elo.elo}`)
                        : ["N/A"];

                        const bloomList = elos.length > 0
                        ? elos.map((elo: any) => elo.bloom_level || "N/A")
                        : ["N/A"];
                      

                      // Mark step 4 as complete when mapping data is available
                      if (!completedSteps.includes(4) && eloList.length > 0) {
                        setTimeout(() => markStepComplete(4), 0);
                      }

                      return {
                        id: idx + 1,
                        coreObjective: co.co_title || "N/A",
                        coreObjectiveDescription: co.co_description || "N/A",
                        learningOutcomes: eloList,
                        bloomsTaxonomy: bloomList,
                        skills,
                        competencies
                      };
                    })
                  : []
              }
            />
          </div>
        </section>
      
        {/* Section 5: Assessment */}
        <section
          ref={(el) => { if (el) sectionRefs.current[4] = el; }}
          className="relative bg-gradient-to-br from-pink-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/25">
                <FileBarChart className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                  Assessment
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Create assessment items for each Expected Learning Outcome
                </p>
              </div>
            </div>
            <Assessment
              board={board}
              grade={grades.find(g => String(g.ClassId) === grade)?.ClassName}
              subject={subjects.find(s => String(s.SubjectId) === subject)?.SubjectName}
              chapter={chapterList.find(c => c.chapterId === chapters)?.chapterName}
              generatedCOs={generatedCOs}
              eloData={eloApiResponse}
              onAssessmentChange={data => {
                setAssessmentData(data);
                const hasData = Array.isArray(data)
                  ? data.length > 0
                  : (typeof data === 'object' && data !== null && Object.keys(data).length > 0);
                if (hasData) markStepComplete(5);
              }}
            />
          </div>
        </section>
        {/* Section 6: Learning Experience */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[5] = el; }}
          className="relative bg-gradient-to-br from-teal-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/25">
                <Lightbulb className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-800 bg-clip-text text-transparent">
                  Learning Experience
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Design engaging learning activities and experiences
                </p>
              </div>
            </div>
            
            <LearningExperience 
              elos={
                Array.isArray(eloApiResponse)
                  ? eloApiResponse.flatMap(co =>
                      Array.isArray(co.elos)
                        ? co.elos.map((elo: any) =>
                            typeof elo === "string"
                              ? elo
                              : elo.elo // handle both string and object
                          )
                        : []
                    )
                  : []
              }
              board={board}
              grade={grades.find(g => String(g.ClassId) === grade)?.ClassName || ""}
              subject={subjects.find(s => String(s.SubjectId) === subject)?.SubjectName || ""}
              chapter={chapterList.find(c => c.chapterId === chapters)?.chapterName || ""}
              courseOutcomes={generatedCOs}
              onLearningExperienceChange={(data) => {
                setLearningExperienceData(data);
                setIsLearningExperienceGenerated(true);
                markStepComplete(6);
              }}
            />
          </div>
        </section>

        {/* Section 7: 5E Model Design */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[6] = el; }}
          className="relative bg-gradient-to-br from-purple-50/50 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
                <Lightbulb className="h-10 w-10 text-white drop-shadow-sm" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-800 bg-clip-text text-transparent">
                  5E Model Design
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Organize learning activities using the 5E instructional model
                </p>
              </div>
            </div>
            
            <FiveEDesigner 
              elos={
                Array.isArray(eloApiResponse)
                  ? eloApiResponse.flatMap(co =>
                      Array.isArray(co.elos)
                        ? co.elos.map((elo: any) =>
                            typeof elo === "string"
                              ? elo
                              : elo.elo // handle both string and object
                          )
                        : []
                    )
                  : []
              }
              onFiveEChange={(data) => {
                setFiveEData(data);
                setIsFiveEGenerated(true);
                markStepComplete(7);
              }}
            />
          </div>
        </section>

        {/* Section 8: Review & Create - Enhanced */}
        <section 
          ref={(el) => { if (el) sectionRefs.current[7] = el; }}
          className="relative bg-gradient-to-br from-amber-50/50 via-yellow-50/30 to-white py-16"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          
          {/* Celebration Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-20 animate-bounce [animation-delay:0s]"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-amber-400 rounded-full opacity-30 animate-bounce [animation-delay:0.5s]"></div>
            <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-orange-300 rounded-full opacity-25 animate-bounce [animation-delay:1s]"></div>
            <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-yellow-400 rounded-full opacity-20 animate-bounce [animation-delay:1.5s]"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="text-center space-y-6 mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 relative">
                <CheckCircle2 className="h-10 w-10 text-white drop-shadow-sm" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
                  <span className="text-4xl">🎉</span>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent">
                    Review & Create Your Lesson Plan
                  </span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                  Everything looks perfect! You're ready to create an amazing lesson plan.
                </p>
              </div>
            </div>
            
            {/* Enhanced Summary Card */}
            <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl border-2 border-amber-200/50 p-8 space-y-8 shadow-xl shadow-amber-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Lesson Summary</h3>
              </div>
              
              {/* Enhanced Grid with Icons */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Board</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">{board || 'Not selected'}</div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Grade</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">
                    {grade ? (grades.find(g => String(g.ClassId) === grade)?.ClassName || 'Not selected') : 'Not selected'}
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Target className="h-4 w-4" />
                    <span className="text-sm font-medium">Subject</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">
                    {subject ? (subjects.find(s => String(s.SubjectId) === subject)?.SubjectName || 'Not selected') : 'Not selected'}
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <div className="font-semibold text-lg text-gray-900">30 minutes</div>
                </div>
              </div>
              
              {shortlistedObjectives.length > 0 && (
                <div className="space-y-4 p-4 bg-white/70 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Selected Objectives ({shortlistedObjectives.length})</span>
                  </div>
                  <div className="space-y-3">
                    {shortlistedObjectives.map((objective, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200/50 shadow-sm">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                          <div className="text-amber-800 font-medium leading-relaxed">{objective}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Prominent CTA Button */}
            <div className="flex justify-center mt-12">
              <Button
                onClick={() => {
                  markStepComplete(8);
                  generateUnitPlan();
                }}
                disabled={!isLearningExperienceGenerated || !isFiveEGenerated}
                size="lg"
                className={`px-12 py-6 text-lg font-bold text-white shadow-2xl shadow-amber-500/30 rounded-2xl transform transition-all duration-300 group relative overflow-hidden ${
                  (isLearningExperienceGenerated && isFiveEGenerated)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 hover:scale-105 hover:shadow-3xl hover:shadow-amber-500/40'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="mr-3 h-6 w-6 group-hover:animate-spin" />
                <span className="relative z-10">🚀 Create My Amazing Lesson Plan!</span>
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full animate-ping"></div>
                </div>
              </Button>
            </div>
            
            {/* Success Message */}
            <div className="text-center mt-6">
              <p className="text-amber-600 font-medium animate-pulse">
                ✨ Your lesson plan will be ready in seconds!
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainStepper;
