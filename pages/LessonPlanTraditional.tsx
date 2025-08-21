import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Save, Edit, RefreshCw, ClipboardList } from 'lucide-react';
import axios from 'axios';
import config from '@/config';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { set } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PageLoader } from "@/components/ui/loader"

const getFormattedQuestionType = (type: string): string => {
  if (!type) return '';
  
  const typeMap: {[key: string]: string} = {
    'mcq': 'MCQ',
    'fill-blank': 'FIB',
    'short-description': 'SA',
    'long-description': 'LA',
    'open-ended': 'OE',
    'case-study': 'CS',
    
  };
  
  return typeMap[type.toLowerCase()] || type;
};

const LessonPlanTraditional = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [unitPlan, setUnitPlan] = useState<any>(null);
  const [issaved, setissaved] = useState(false);
  const lessonData = location.state?.lessonData;
  const unitPlanRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  React.useEffect(() => {
      console.log('LessonPlanTraditional mounted with lessonData:', JSON.stringify(lessonData, null, 2));
      if (lessonData?.unitplandata) {
          console.log('Setting unitPlan with data:', JSON.stringify(lessonData.unitplandata, null, 2));
          setUnitPlan(lessonData.unitplandata);
      } else {
          console.warn('No unitplandata found in lessonData');
      }
  }, [lessonData]);
  // useEffect(() => {
  //   generateUnitPlan();
  // }, []);

  const SaveUnitPlan = async () => {
    try {
      const eloJson = {
        Elo: (unitPlan.assessment || [])
          .filter((assessment: any) => !!assessment.fullText)
          .map((assessment: any) => assessment.fullText)
      };
      const payload ={
        AppCode: "AP01",
        CustCode: "CU01",
        OrgCode: "OR01",
        UserCode: "UO01",
        ClassName: lessonData.grade,
        ClassId: lessonData.gradeid,
        SubjectName: lessonData.subject,
        SubjectId: lessonData.subjectid,
        PlanClassId: lessonData.PlanClassId,
        ChapterId: lessonData.subjectid,
        ChapterName: lessonData.lessonName,
        UnitPlanTitle: lessonData.lessonName +' Lesson Plan',
        AILessonPlan: lessonData.unitplandata,
        ModifiedLessonPlan: lessonData.unitplandata,
        InputToken: 123,
        ResponseToken: 456,
        Elo: eloJson
      }
      const response = await axios.post(
        config.ENDPOINTS.SAVE_UNIT_PLAN_DETAILS,
        JSON.stringify(payload),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      setissaved(true);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Failed to fetch unit plan:', error);
    }
  };

  const downloadPDF = async () => {
    setLoading(true);
    const element = unitPlanRef.current;
    if (!element) {
        setLoading(false);
        return;
    }

    const allSections = Array.from(element.querySelectorAll('section'));
    const otherSections = allSections.slice(1);

    try {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pdfWidth - margin * 2;
        const pageContentHeight = pdfHeight - margin * 2;

        // --- Page 1: Header + Core Objectives ---
        otherSections.forEach(sec => ((sec as HTMLElement).style.display = 'none'));
        
        const firstPageCanvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        });
        
        otherSections.forEach(sec => ((sec as HTMLElement).style.display = ''));

        const firstPageImgData = firstPageCanvas.toDataURL('image/png');
        const firstPageImgProps = pdf.getImageProperties(firstPageImgData);
        const firstPageImgHeight = (firstPageImgProps.height * contentWidth) / firstPageImgProps.width;

        let heightLeft = firstPageImgHeight;
        let position = 0;

        pdf.addImage(firstPageImgData, 'PNG', margin, margin, contentWidth, firstPageImgHeight);
        heightLeft -= pageContentHeight;

        while (heightLeft > 0) {
            position -= pageContentHeight;
            pdf.addPage();
            pdf.addImage(firstPageImgData, 'PNG', margin, margin + position, contentWidth, firstPageImgHeight);
            heightLeft -= pageContentHeight;
        } 
            
        // --- Subsequent Pages: Other Sections ---
        for (const section of otherSections) {
            const canvas = await html2canvas(section, {
                scale: 2,
                backgroundColor: '#ffffff',
                useCORS: true,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

            let sectionHeightLeft = imgHeight;
            let sectionPosition = 0;

            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, margin, contentWidth, imgHeight);
            sectionHeightLeft -= pageContentHeight;

            while (sectionHeightLeft > 0) {
                sectionPosition -= pageContentHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, margin + sectionPosition, contentWidth, imgHeight);
                sectionHeightLeft -= pageContentHeight;
            }
        }
        
        pdf.save(`LP_${lessonData.lessonName}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        otherSections.forEach(sec => ((sec as HTMLElement).style.display = ''));
        setLoading(false);
    }
};

  return (
    <div className="w-full min-h-screen bg-background">
        {loading && <PageLoader text="Please wait..." />}
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/lesson-plan-assistant')}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lesson Plan Assistant
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg">
              <ClipboardList className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lesson Plan View</h1>
              <p className="text-sm text-gray-500">Review and download your lesson plan</p>
            </div>
          </div>
        </div>
      </header>

{saveSuccess && (
     <Dialog open={saveSuccess} onOpenChange={setSaveSuccess}>
    <DialogContent className="text-center">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          ✅ Unit Plan Saved Successfully!
        </DialogTitle>
      </DialogHeader>
      <div className="pt-4">
        <Button variant="default" onClick={() => setSaveSuccess(false)}>
          OK
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)}
      <div className="container mx-auto px-4 py-8">

        <div className="flex justify-end gap-2 mb-6">
          <Button
          style={{ display: 'none' }}
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate
          </Button>
          <Button
          style={{ display: 'none' }}
            variant="outline"
            size="sm"
            onClick={() => navigate('/lesson-plan-assistant')}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          {!issaved && (
          <Button onClick={SaveUnitPlan} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>)}
         <Button onClick={downloadPDF} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        </div>

        {unitPlan && (
          <div ref={unitPlanRef}>
          <Card className="max-w-5xl mx-auto bg-card border-border shadow-lg">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-8 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="text-primary-foreground font-bold text-xl">
                        EXCEL
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">
                        Excel Public School, Mysuru
                      </h1>
                      <h2 className="text-xl font-semibold text-primary tracking-wide">
                        UNIT PLAN
                      </h2>
                    </div>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <div className="text-sm">Academic Year</div>
                    <div className="font-semibold">2025-26</div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Class 
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {lessonData.grade}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Subject
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {lessonData.subject}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Topic
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                         {lessonData.lessonName}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Teacher's Name
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        Dr. Sriman S Kamath
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Planned Date
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {currentDate}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Execution Period
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                      {currentDate} to 31/08/2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Core Objectives</h2>
                  <ul className="list-disc pl-5 space-y-4">
                    {unitPlan.coreObjectives.map((obj: any, idx: number) => (
                      <li key={idx} className="bg-white/70 rounded-xl border border-amber-100 p-4">
                        <h3 className="text-lg font-semibold text-amber-800 mb-2">{obj.title}</h3>
                        <p className="text-gray-700 mb-2">{obj.text}</p>
                        {obj.label?.value && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                              {obj.label.value}
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Expected Learning Outcomes</h2>
                  {!unitPlan ? (
                    <div className="text-red-500">Error: No unit plan data available</div>
                  ) : (
                    <ul className="list-disc pl-5 space-y-4">
                      {unitPlan.assessment?.map((assessment: any, idx: number) => {
                        if (!assessment.fullText) return null;
                        return (
                          <li key={idx} className="bg-white/70 rounded-xl border border-emerald-100 p-4">
                            <p className="text-gray-700 mb-2">{assessment.fullText}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                                {assessment.name || `ELO ${idx + 1}`}
                              </span>
                              {assessment.bloomLevel && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                                  Bloom's Level: {assessment.bloomLevel}
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {(!unitPlan.assessment || unitPlan.assessment.length === 0) && (
                    <div className="text-gray-500 italic mt-2">No Expected Learning Outcomes available for this lesson plan.</div>
                  )}
                </section>
                
                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Assessment</h2>
                  <div className="grid gap-4">
                    {unitPlan.assessment
                      ?.filter((assessment: any) => 
                        assessment.generatedItems?.length > 0
                      )
                      .map((assessment: any, idx: number) => (
                      <div key={idx} className="bg-white/70 rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-blue-800">{assessment.name}</h3>
                            {assessment.bloomLevel && (
                              <div className="flex items-center mt-1">
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                  {assessment.bloomLevel}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {assessment.generatedItems?.length || 0} Items
                            </span>
                          </div>
                        </div>
                        
                        {assessment.generatedItems?.length > 0 ? (
                          <ul className="space-y-3">
                            {assessment.generatedItems.map((item: any, itemIdx: number) => (
                              <li key={itemIdx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="mb-1 flex flex-wrap gap-2 items-center">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {getFormattedQuestionType(item.itemType)}
                                      </span>
                                      {item.bloomsLevel && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          {item.bloomsLevel}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-gray-600 mt-1">{item.question}</p>
                                    
                                    {/* Show MCQ Options if available */}
                                    {item.itemType?.toLowerCase() === 'mcq' && item.options && (
                                      <div className="mt-2 space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Options:</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                          {Object.entries(item.options as Record<string, string>).map(([key, value], index) => {
                                            const optionLetter = String.fromCharCode(65 + index); // Convert 0,1,2,3 to A,B,C,D
                                            return (
                                              <div key={key} className="flex items-start gap-2 bg-gray-50 p-2 rounded">
                                                <span className="font-medium text-blue-600">{optionLetter}.</span>
                                                <span className="text-gray-700">{value}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    
                                    {item.answer && !['short-description', 'long-description', 'open-ended', 'case-study'].includes(item.itemType?.toLowerCase()) && (
                                      <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded text-sm text-green-700">
                                        <span className="font-medium">Answer:</span> {item.answer}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
                  
                <section style={{ display: 'none' }} className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Learning Progression</h2>
                  <div className="space-y-6">
                    {unitPlan.learningProgression?.map((step: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">{step.step}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold text-blue-800 mb-2">Rationale</h4>
                            <p className="text-gray-700">{step.rationale}</p>
                          </div>
                          
                          <div className="bg-amber-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold text-amber-800 mb-2">Example</h4>
                            <p className="text-gray-700">{step.example}</p>
                          </div>
                          
                          <div className="bg-emerald-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold text-emerald-800 mb-2">Connection</h4>
                            <p className="text-gray-700">{step.connection}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                

                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Assignments</h2>
                  <div className="space-y-6">
                    {unitPlan.assignments?.map((assignment: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">{assignment.title}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="text-md font-semibold text-indigo-800 mb-2">Purpose</h4>
                            <p className="text-gray-700">{assignment.purpose}</p>
                          </div>
                          
                          {assignment.instructions && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <h4 className="text-md font-semibold text-purple-800 mb-2">Instructions</h4>
                              <p className="text-gray-700 whitespace-pre-line">{assignment.instructions}</p>
                            </div>
                          )}
                          
                          {assignment.submission && (
                            <div className="bg-rose-50 p-4 rounded-lg">
                              <h4 className="text-md font-semibold text-rose-800 mb-2">Submission Details</h4>
                              <p className="text-gray-700">{assignment.submission}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Learning Experiences(5E Model)</h2>
                  <div className="space-y-8">
                    {unitPlan.learningExperiences?.["5E_Model"]?.map((exp: any, expIdx: number) => (
                      <div key={expIdx} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                          <h3 className="text-lg font-semibold text-gray-800">{exp.phase}</h3>
                        </div>
                        <div className="p-6">
                          <div className="space-y-6">
                            {exp.activities.map((activity: any, actIdx: number) => (
                              <div key={actIdx} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-md font-semibold text-gray-800 mb-2">{activity.title}</h4>
                                  {activity.intelligence_types?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {activity.intelligence_types.map((type: string, idx: number) => (
                                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-3">{activity.description}</p>
                                
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <div className="flex flex-wrap gap-2 items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">Pedagogical Approach:</span>
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      {activity.pedagogical_approach}
                                    </span>
                                  </div>
                                  
                                  {activity.elos?.length > 0 && (
                                    <div className="mt-2">
                                      <span className="text-sm font-medium text-gray-700">Learning Outcomes:</span>
                                      <div className="mt-1 flex flex-wrap gap-2">
                                        {activity.elos.map((elo: string, idx: number) => (
                                          <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                            {elo}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {activity.materials?.length > 0 && (
                                    <div className="mt-2">
                                      <span className="text-sm font-medium text-gray-700">Materials:</span>
                                      <div className="mt-1 flex flex-wrap gap-2">
                                        {activity.materials.map((material: string, idx: number) => (
                                          <span key={idx} className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                            {material}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlanTraditional;
