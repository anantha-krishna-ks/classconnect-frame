import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Save, Edit, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import axios from 'axios';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import { set } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PageLoader } from "@/components/ui/loader"


const UnitPlanPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [unitPlan, setUnitPlan] = useState<any>(null);
  const [issaved, setissaved] = useState(false);
  const lessonData = location.state?.lessonData;
  const unitPlanRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
      setUnitPlan(lessonData.unitplandata);
  });
  // useEffect(() => {
  //   generateUnitPlan();
  // }, []);

  const SaveUnitPlan = async () => {
    try {
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
        UnitPlanTitle: lessonData.lessonName,
        AILessonPlan: lessonData.unitplandata,
        ModifiedLessonPlan: lessonData.unitplandata,
        InputToken: 123,
        ResponseToken: 456
      }
      const response = await axios.post(
        'https://ai.excelsoftcorp.com/aiapps/AIToolKit/UnitPlanGen/save-unit-plan-details',
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
  if (!unitPlanRef.current) return;

  const element = unitPlanRef.current;

  const canvas = await html2canvas(element, {
    scale: 2, // higher resolution
    useCORS: true
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    setLoading(false);
  pdf.save(`${lessonData.lessonName || 'unit-plan'}.pdf`);
};

  return (
    <div className="w-full min-h-screen bg-background">
       {loading && <PageLoader text="Please wait..." />}
      <Header />
{saveSuccess && (
     <Dialog
    open={saveSuccess}
    onClose={() => setSaveSuccess(false)}
    PaperProps={{ sx: { borderRadius: 3, px: 3, py: 2, textAlign: 'center' } }}
  >
    <DialogTitle sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
      ✅ Unit Plan Saved Successfully!
    </DialogTitle>
    <DialogActions sx={{ justifyContent: 'center' }}>
      <Button variant="contained" onClick={() => setSaveSuccess(false)}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
)}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate("/lesson-plan-assistant")}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lesson Plan Repository
          </Button>
        </div>

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
                        28/07/2025
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        Execution Period
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        03/08/2025 to 31/08/2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-6">
                <section>
                  <h2 className="text-xl font-bold">Core Objectives</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {unitPlan.coreObjectives.map((obj: any, idx: number) => (
                      <li key={idx}>
                        <p>{obj.text}</p>
                        {obj.label?.value && (
                          <p className="text-sm text-gray-600">
                            Label: {obj.label.value}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold">Expected Learning Outcomes</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {unitPlan.expectedLearningOutcomes.map((outcome: string, idx: number) => (
                      <li key={idx}>{outcome}</li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold">Learning Progression</h2>
                  {unitPlan.learningProgression.map((step: any, idx: number) => (
                    <div key={idx} className="border p-2 rounded mb-2">
                      <h3 className="font-semibold">{step.step}</h3>
                      <p><strong>Rationale:</strong> {step.rationale}</p>
                      <p><strong>Example:</strong> {step.example}</p>
                      <p><strong>Connection:</strong> {step.connection}</p>
                    </div>
                  ))}
                </section>

                <section>
                  <h2 className="text-xl font-bold">Assessment</h2>
                  <p><strong>Stimulus:</strong> {unitPlan.assessment.stimulus}</p>
                  <p><strong>Stem:</strong> {unitPlan.assessment.stem}</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {unitPlan.assessment.questions.map((q: any, idx: number) => (
                      <li key={idx}>
                        <strong>{q.type}:</strong> {q.text}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold">Assignments</h2>
                  <ul className="list-disc pl-5 space-y-1">
                    {unitPlan.assignments.map((a: any, idx: number) => (
                      <li key={idx}>
                        <strong>{a.title}:</strong> {a.purpose}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold">Learning Experiences</h2>
                  {unitPlan.learningExperiences.map((exp: any, idx: number) => (
                    <div key={idx} className="border p-2 rounded mb-2">
                      <h3 className="font-semibold">{exp.phase}</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {exp.activities.map((act: string, actIdx: number) => (
                          <li key={actIdx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
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

export default UnitPlanPreview;
