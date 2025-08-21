import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ArrowLeft, BookOpen, Eye, Target, Clock, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download } from 'lucide-react';

// Components for better organization
const SessionHeader = ({ navigate, downloadPDF, loading }) => (
  <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 px-6 py-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="hover:bg-primary/10 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sessions
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Session Preview
              </h1>
              <p className="text-muted-foreground">Review & Finalize Session Plan</p>
            </div>
          </div>
        </div>
        <Button
          onClick={downloadPDF}
          disabled={loading}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
        >
          {loading ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <Download className="mr-2 w-4 h-4" />
          )}
          {loading ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
    </div>
  </header>
);

const SessionMetadata = ({ plan }) => (
  <Card className="mb-6 bg-gradient-to-r from-background to-primary/5 border-primary/20">
    <CardHeader>
      <CardTitle className="flex items-center gap-3 text-2xl">
        <div className="p-2 rounded-lg bg-primary/10">
          <Target className="w-5 h-5 text-primary" />
        </div>
        {plan?.structuredData?.title || 'Untitled Session'}
      </CardTitle>
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Grade: {plan?.structuredData?.metadata?.grade || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Subject: {plan?.structuredData?.metadata?.subject || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {plan?.structuredData?.metadata?.duration || 'Not specified'}
          </Badge>
        </div>
      </div>
    </CardHeader>
  </Card>
);

const LearningObjectives = ({ objectives }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        <Target className="w-5 h-5 text-primary" />
        Learning Objectives
      </CardTitle>
    </CardHeader>
    <CardContent>
      {objectives?.length > 0 ? (
        <ul className="space-y-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="text-foreground">{obj}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No learning objectives available</p>
      )}
    </CardContent>
  </Card>
);

const Materials = ({ materials }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        🧪 Materials
      </CardTitle>
    </CardHeader>
    <CardContent>
      {materials?.length > 0 ? (
        <div className="space-y-3">
          {materials.map((mat, idx) => (
            <div key={idx} className="border border-border/50 rounded-lg p-3 bg-muted/20">
              <div className="font-medium text-foreground">
                {mat.name || 'Unnamed material'}
                {mat.quantity && <span className="text-muted-foreground"> — {mat.quantity}</span>}
              </div>
              {mat.notes && (
                <p className="text-sm text-muted-foreground mt-1">{mat.notes}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No materials added</p>
      )}
    </CardContent>
  </Card>
);

const KeyVocabulary = ({ vocabulary }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-xl">
        🗣️ Key Vocabulary
      </CardTitle>
    </CardHeader>
    <CardContent>
      {vocabulary?.length > 0 ? (
        <div className="space-y-4">
          {vocabulary.map((word, idx) => (
            <div key={idx} className="border border-border/50 rounded-lg p-4 bg-gradient-to-r from-background to-secondary/5">
              <div className="font-semibold text-foreground text-lg">
                {word.term || 'Untitled Term'}
              </div>
              {word.definition && (
                <p className="text-muted-foreground mt-1">{word.definition}</p>
              )}
              {word.example && (
                <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                  <span className="font-medium text-primary">Example: </span>
                  <span className="text-foreground italic">{word.example}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No vocabulary terms available</p>
      )}
    </CardContent>
  </Card>
);

const SessionPlanPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLessonPlan } = location.state || {};
  const [selectedPlan, setSelectedPlan] = useState(selectedLessonPlan || null);
  const [loading, setLoading] = useState(false);
  const sessionPlanRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (selectedLessonPlan) {
      setSelectedPlan(selectedLessonPlan);
    }
  }, [selectedLessonPlan]);

  const downloadPDF = async () => {
    setLoading(true);
    const element = sessionPlanRef.current;
    if (!element) {
        setLoading(false);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position -= pdf.internal.pageSize.getHeight();
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }
        
        pdf.save(`SP_${selectedPlan?.structuredData?.title}.pdf`);

    } catch (error) {
        console.error('Error generating PDF:', error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <SessionHeader navigate={navigate} downloadPDF={downloadPDF} loading={loading} />
      
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6" ref={sessionPlanRef}>
          {selectedPlan ? (
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <SessionMetadata plan={selectedPlan} />
              <LearningObjectives objectives={selectedPlan.structuredData?.learningObjectives} />
              <Materials materials={selectedPlan.structuredData?.materials} />
              <KeyVocabulary vocabulary={selectedPlan.structuredData?.keyVocabulary} />
              
              {/* Assessment */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    📝 Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.assessment?.description ? (
                    <p className="text-foreground mb-4">{selectedPlan.structuredData.assessment.description}</p>
                  ) : (
                    <p className="text-muted-foreground mb-4">No assessment description provided</p>
                  )}
                  
                  {selectedPlan.structuredData?.assessment?.successCriteria?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Success Criteria:</h4>
                      <ul className="space-y-1">
                        {selectedPlan.structuredData.assessment.successCriteria.map((criteria, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span className="text-foreground">{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Differentiation */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    ♿ Differentiation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.differentiation?.support ? (
                    <p className="text-foreground">{selectedPlan.structuredData.differentiation.support}</p>
                  ) : (
                    <p className="text-muted-foreground">No support strategies defined</p>
                  )}
                </CardContent>
              </Card>

              {/* Introduction */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    🚀 Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.lessonFlow?.introduction ? (
                    <div className="space-y-3">
                      {selectedPlan.structuredData.lessonFlow.introduction.hook && (
                        <div className="border border-border/50 rounded-lg p-3 bg-muted/20">
                          <span className="font-medium">Hook: </span>
                          <span className="text-foreground">{selectedPlan.structuredData.lessonFlow.introduction.hook}</span>
                        </div>
                      )}
                      {selectedPlan.structuredData.lessonFlow.introduction.priorKnowledge && (
                        <div className="border border-border/50 rounded-lg p-3 bg-muted/20">
                          <span className="font-medium">Prior Knowledge: </span>
                          <span className="text-foreground">{selectedPlan.structuredData.lessonFlow.introduction.priorKnowledge}</span>
                        </div>
                      )}
                      {selectedPlan.structuredData.lessonFlow.introduction.duration && (
                        <div className="border border-border/50 rounded-lg p-3 bg-muted/20">
                          <span className="font-medium">Duration: </span>
                          <span className="text-foreground">{selectedPlan.structuredData.lessonFlow.introduction.duration}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No introduction provided.</p>
                  )}
                </CardContent>
              </Card>

              {/* Activities */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    🧩 Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan?.structuredData?.lessonFlow?.activities?.length > 0 ? (
                    <div className="space-y-6">
                      {selectedPlan.structuredData.lessonFlow.activities.map((act, idx) => (
                        <div key={idx} className="border-l-4 border-primary/50 bg-gradient-to-r from-background to-primary/5 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-primary mb-3">
                            {act.title || `Activity ${idx + 1}`}
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {act.duration && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {act.duration} minutes
                                </span>
                              </div>
                            )}
                            {act.grouping && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {act.grouping}
                                </span>
                              </div>
                            )}
                            {act.materials && Array.isArray(act.materials) && act.materials.length > 0 && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {act.materials.join(', ')}
                                </span>
                              </div>
                            )}
                          </div>

                          {act.objective && (
                            <div className="mb-3">
                              <span className="font-medium">Objective: </span>
                              <span className="text-foreground">{act.objective}</span>
                            </div>
                          )}

                          {act.description && act.description.trim() !== '' && (
                            <div className="mb-3">
                              <span className="font-medium">Description: </span>
                              <span className="text-foreground">{act.description}</span>
                            </div>
                          )}

                          {act.steps && Array.isArray(act.steps) && act.steps.length > 0 && act.steps.some(step => step.trim() !== '') && (
                            <div className="mb-4">
                              <h5 className="font-medium mb-2">Steps:</h5>
                              <ol className="list-decimal list-inside space-y-1 pl-4">
                                {act.steps.filter(step => step.trim() !== '').map((step, stepIndex) => (
                                  <li key={stepIndex} className="text-foreground text-sm">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {act.teacherNotes && act.teacherNotes.trim() !== '' && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <span className="font-medium">📝 Teacher Notes: </span>
                              <span className="text-foreground italic">{act.teacherNotes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No activities available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Real World Examples */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    🌍 Real World Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(selectedPlan?.structuredData?.realWorldExamples) && selectedPlan.structuredData.realWorldExamples.length > 0 ? (
                    <div className="grid gap-4">
                      {selectedPlan.structuredData.realWorldExamples.map((ex, idx) => (
                        <div key={idx} className="border border-border/50 rounded-lg p-4 bg-gradient-to-r from-background to-secondary/5">
                          <h4 className="font-semibold text-foreground mb-2">
                            {ex.example || 'No example'}
                          </h4>
                          {ex.explanation && (
                            <p className="text-muted-foreground">{ex.explanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No real world examples added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Discussion Questions */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    💬 Discussion Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.discussionQuestions?.length > 0 ? (
                    <div className="space-y-4">
                      {selectedPlan.structuredData.discussionQuestions.map((dq, index) => (
                        <div key={index} className="border border-border/50 rounded-lg p-4 bg-muted/20">
                          <h4 className="font-medium text-foreground mb-2">
                            Q{index + 1}: {dq.question}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Purpose:</span> {dq.purpose}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No discussion questions available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Current Affairs */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    📰 Current Affairs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {((selectedPlan.structuredData?.currentAffairs || selectedPlan.structuredData?.additionalSections?.currentAffairs)?.length > 0) ? (
                    <div className="grid gap-4">
                      {(selectedPlan.structuredData.currentAffairs || selectedPlan.structuredData.additionalSections?.currentAffairs || []).map((item, index) => (
                        <div key={item.url || index} className="border border-border/50 rounded-lg p-4 bg-gradient-to-r from-background to-primary/5 hover:shadow-md transition-shadow">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                            <h4 className="font-semibold text-primary hover:text-primary/80 mb-2">
                              {item.title}
                            </h4>
                            {item.snippet && (
                              <p className="text-muted-foreground text-sm mb-2">{item.snippet}</p>
                            )}
                            {item.date && (
                              <p className="text-xs text-muted-foreground">{item.date}</p>
                            )}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No current affairs available</p>
                  )}
                </CardContent>
              </Card>

              {/* Educational Videos */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    🎬 Educational Videos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.educationalVideos?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPlan.structuredData.educationalVideos.map((video, index) => {
                        const youtubeMatch = video.url?.match(
                          /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
                        );
                        const thumbnailUrl = youtubeMatch
                          ? `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
                          : null;

                        return (
                          <div key={index} className="border border-border/50 rounded-lg overflow-hidden bg-gradient-to-r from-background to-primary/5 hover:shadow-lg transition-all duration-300">
                            <div className="relative aspect-video bg-muted/20 cursor-pointer" onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')}>
                              {thumbnailUrl ? (
                                <img
                                  src={thumbnailUrl}
                                  alt={video.title || `Video ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-2xl bg-muted/50">
                                  No Thumbnail
                                </div>
                              )}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white">
                                  ▶
                                </div>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                                {video.title || `Video ${index + 1}`}
                              </h4>
                              {video.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {video.description}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No educational videos available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Visual Aids */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    🖼️ Visual Aids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.visualAids?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPlan.structuredData.visualAids.map((aid, index) => (
                        <a 
                          key={index}
                          href={aid.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block border border-border/50 rounded-lg overflow-hidden bg-gradient-to-r from-background to-secondary/5 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="h-64 bg-muted/20 flex items-center justify-center p-4">
                            <img
                              src={aid.url}
                              alt={aid.alt_description || 'Visual aid'}
                              className="max-w-full max-h-full object-contain rounded"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-4 border-t border-border/30">
                            <h4 className="font-medium text-foreground mb-2 line-clamp-2">
                              {aid.alt_description || 'Visual Aid'}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {aid.url}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No visual aids available for this lesson.</p>
                  )}
                </CardContent>
              </Card>

              {/* Educational Documents */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    📚 Educational Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedPlan.structuredData?.resources?.length > 0 ? (
                    <div className="grid gap-4">
                      {selectedPlan.structuredData.resources.map((resource, index) => (
                        <a 
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block border border-border/50 rounded-lg p-4 bg-gradient-to-r from-background to-primary/5 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              {(resource.url || '').toLowerCase().endsWith('.pdf') ? (
                                <FileText className="w-5 h-5 text-red-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-primary" />
                              )}
                            </div>
                            <Badge variant="outline" className={`text-xs ${
                              (resource.url || '').toLowerCase().endsWith('.pdf') 
                                ? 'bg-red-50 text-red-700 border-red-200' 
                                : 'bg-primary/10 text-primary border-primary/20'
                            }`}>
                              {(resource.url || '').toLowerCase().endsWith('.pdf') ? 'PDF' : 'Web Resource'}
                            </Badge>
                          </div>
                          
                          <h4 className="font-semibold text-foreground mb-2 line-clamp-2">
                            {resource.title || 'Untitled Resource'}
                          </h4>
                          
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {resource.description || 'No description available'}
                          </p>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border border-dashed border-border/50 rounded-lg bg-muted/20">
                      <FileText className="w-12 h-12 text-muted-foreground/60 mx-auto mb-2" />
                      <p className="text-muted-foreground">No educational resources available</p>
                      <p className="text-sm text-muted-foreground mt-1">We couldn't find any resources for this topic.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="text-muted-foreground mt-4">Loading lesson plan...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionPlanPreview;
