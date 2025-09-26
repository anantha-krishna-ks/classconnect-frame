import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileDown, Eye, CheckCircle2, Download, FileText, Image,
  Share2, Clock, Award, BarChart3, Users, Target, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  bloomsLevel: string;
  difficulty: string;
  marks: number;
  eloId: string;
  eloTitle: string;
  isSelected: boolean;
  options?: string[];
  correctAnswer?: string;
}

interface ExportFinalizePanelProps {
  items: GeneratedItem[];
  assessmentData: any;
  totalMarks: number;
}

export const ExportFinalizePanel: React.FC<ExportFinalizePanelProps> = ({
  items,
  assessmentData,
  totalMarks
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [previewMode, setPreviewMode] = useState<'student' | 'teacher'>('student');

  const calculateBloomsTaxonomyDistribution = () => {
    const distribution: { [key: string]: number } = {};
    items.forEach(item => {
      distribution[item.bloomsLevel] = (distribution[item.bloomsLevel] || 0) + 1;
    });
    return distribution;
  };

  const calculateItemTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    items.forEach(item => {
      distribution[item.itemType] = (distribution[item.itemType] || 0) + 1;
    });
    return distribution;
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate export process
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      toast.success('PDF export completed', {
        description: 'Your assessment has been downloaded successfully.'
      });

      // Create mock PDF download
      const mockPDFContent = `Assessment: ${assessmentData.assessmentName || 'Untitled Assessment'}`;
      const blob = new Blob([mockPDFContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${assessmentData.assessmentName || 'assessment'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Export failed', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const exportAsWord = async () => {
    toast.success('Word export initiated', {
      description: 'Your assessment will be exported as a Word document.'
    });

    // Mock Word export
    const mockWordContent = `Assessment: ${assessmentData.assessmentName || 'Untitled Assessment'}`;
    const blob = new Blob([mockWordContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessmentData.assessmentName || 'assessment'}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsQTI = async () => {
    toast.success('QTI export initiated', {
      description: 'Your assessment will be exported in QTI format.'
    });

    // Create QTI XML structure (simplified)
    const qtiContent = `<?xml version="1.0" encoding="UTF-8"?>
<assessmentItem xmlns="http://www.imsglobal.org/xsd/imsqti_v2p1">
  <itemBody>
    <!-- Assessment content would go here -->
  </itemBody>
</assessmentItem>`;

    const blob = new Blob([qtiContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessmentData.assessmentName || 'assessment'}.qti`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const bloomsDistribution = calculateBloomsTaxonomyDistribution();
  const itemTypeDistribution = calculateItemTypeDistribution();

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white/80">
        <CardContent className="p-12 text-center">
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No items to finalize</h3>
          <p className="text-gray-500">Select and edit items before finalizing your assessment</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Award className="h-6 w-6" />
            <span>Assessment Ready for Export</span>
            <Badge className="bg-green-100 text-green-700">
              {items.length} items • {totalMarks} marks
            </Badge>
          </CardTitle>
          <p className="text-green-700">
            Your assessment is complete and ready to be exported in your preferred format.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessment Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Assessment Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                  <div className="text-sm text-blue-700">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalMarks}</div>
                  <div className="text-sm text-green-700">Total Marks</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {Object.keys(bloomsDistribution).length}
                  </div>
                  <div className="text-sm text-purple-700">Bloom's Levels</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.keys(itemTypeDistribution).length}
                  </div>
                  <div className="text-sm text-orange-700">Question Types</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloom's Taxonomy Distribution */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  <span>Bloom's Taxonomy</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(bloomsDistribution).map(([level, count]) => (
                  <div key={level} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{level}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{
                            width: `${(count / items.length) * 100}%`
                          }}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Item Type Distribution */}
            <Card className="border border-gray-200 bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Question Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(itemTypeDistribution).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{
                            width: `${(count / items.length) * 100}%`
                          }}
                        />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={previewMode} onValueChange={setPreviewMode as any}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student View</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher View</TabsTrigger>
                </TabsList>
              </Tabs>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Assessment Preview - {previewMode === 'student' ? 'Student' : 'Teacher'} View</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center border-b pb-4">
                      <h2 className="text-xl font-bold">
                        {assessmentData.assessmentName || 'Assessment Title'}
                      </h2>
                      <p className="text-gray-600">
                        Subject: {assessmentData.subject || 'Subject'} | 
                        Class: {assessmentData.class || 'Class'} | 
                        Total Marks: {totalMarks}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {items.slice(0, 3).map((item, index) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Q{index + 1}.</span>
                            <Badge variant="outline">[{item.marks} marks]</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{item.question}</p>
                          {item.options && previewMode === 'student' && (
                            <div className="space-y-1">
                              {item.options.map((option, optIndex) => (
                                <div key={optIndex} className="text-sm text-gray-600">
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </div>
                              ))}
                            </div>
                          )}
                          {item.options && previewMode === 'teacher' && (
                            <div className="space-y-1">
                              {item.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`text-sm ${
                                    option === item.correctAnswer
                                      ? 'text-green-700 font-medium bg-green-50 p-1 rounded'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {option === item.correctAnswer && ' ✓'}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      {items.length > 3 && (
                        <div className="text-center text-gray-500 text-sm">
                          ... and {items.length - 3} more questions
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <FileDown className="h-5 w-5 text-green-600" />
                <span>Export Formats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={exportAsPDF}
                disabled={isExporting}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </Button>

              <Button
                onClick={exportAsWord}
                variant="outline"
                className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as Word
              </Button>

              <Button
                onClick={exportAsQTI}
                variant="outline"
                className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Export as QTI
              </Button>

              {isExporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Exporting...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                <Share2 className="h-4 w-4 mr-2" />
                Share Assessment
              </Button>

              <Button variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save as Template
              </Button>

              <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};