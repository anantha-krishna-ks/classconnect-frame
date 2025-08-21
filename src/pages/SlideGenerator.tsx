import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, LayoutTemplate, Presentation, Sparkles, Image, Video, BarChart3, Users, Settings, Palette, Download, RefreshCw, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import sampleGeneratedImage from '@/assets/sample-generated-image.png';

const SlideGenerator = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<'lesson-plan' | 'template' | null>(null);
  const [isTextToImageOpen, setIsTextToImageOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const features = [
    {
      icon: FileText,
      title: 'Smart Conversion',
      description: 'AI converts lesson plans to slides'
    },
    {
      icon: LayoutTemplate,
      title: 'Professional Templates',
      description: 'Pre-designed layouts for education'
    },
    {
      icon: Image,
      title: 'Visual Elements',
      description: 'Images, diagrams, and media integration'
    },
    {
      icon: BarChart3,
      title: 'Data Visualization',
      description: 'Charts and interactive elements'
    }
  ];

  const stats = [
    { value: '2.5K+', label: 'Presentations Created', trend: '+25% this month' },
    { value: '15+', label: 'Template Categories', trend: 'Education focused' },
    { value: '98%', label: 'User Satisfaction', trend: 'AI-powered quality' },
    { value: '5min', label: 'Average Creation Time', trend: 'Lightning fast' }
  ];

  const handleOptionSelect = (option: 'lesson-plan' | 'template') => {
    setSelectedOption(option);
    if (option === 'lesson-plan') {
      navigate('/slide-generator/lesson-plan');
    } else {
      navigate('/slide-generator/templates');
    }
  };

  const generateImageWithAI = async (promptText: string): Promise<string> => {
    // This function would integrate with Lovable's image generation API
    // For demonstration, we'll simulate the process
    const timestamp = Date.now();
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return the sample image (in production, this would be the actual generated image)
    return sampleGeneratedImage;
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to generate an image');
      return;
    }

    setIsGenerating(true);
    try {
      const imagePath = await generateImageWithAI(prompt);
      setGeneratedImage(imagePath);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateImage = () => {
    if (prompt.trim()) {
      handleGenerateImage();
    }
  };

  const handleDownloadImage = () => {
    if (generatedImage) {
      // Create a download link
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded successfully!');
    }
  };

  const handleEditPrompt = () => {
    setGeneratedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/tools')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Presentation className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Slide Generator</h1>
                  <p className="text-sm text-gray-500">AI-Powered Presentation Creator</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            Powered by Advanced AI
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Stunning Presentations in Minutes
          </h1>
        </div>


        {/* Main Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Option 1: Create from Lesson Plan */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-rose-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Create PPT using Lesson Plan</CardTitle>
              <CardDescription className="text-base">
                Upload your lesson plan or session plan and let AI transform it into a professional presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Upload your lesson plan document</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">AI analyzes and converts to slides</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Edit and customize with powerful tools</span>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                onClick={() => handleOptionSelect('lesson-plan')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Start with Lesson Plan
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: Create from Template */}
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-rose-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <LayoutTemplate className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Create PPT on Your Own</CardTitle>
              <CardDescription className="text-base">
                Choose from professionally designed templates and create your presentation from scratch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-sm text-gray-700">Browse template gallery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-sm text-gray-700">Select your preferred design</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-sm text-gray-700">Customize with rich editing tools</span>
              </div>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                onClick={() => handleOptionSelect('template')}
              >
                <LayoutTemplate className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Text to Image Converter */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-rose-200">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl mb-2">Text to Image Converter</CardTitle>
              <CardDescription className="text-base">
                Generate custom images from text descriptions using AI for your presentations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Dialog open={isTextToImageOpen} onOpenChange={setIsTextToImageOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsTextToImageOpen(true)}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Generate Images with AI
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">AI Image Generator</DialogTitle>
                    <DialogDescription>
                      Create stunning images for your presentations using AI
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
                    {/* Left Panel - Input (40%) */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="prompt" className="text-sm font-medium text-gray-700">
                          Image Description
                        </label>
                        <Textarea
                          id="prompt"
                          placeholder="Describe the image you want to generate... (e.g., 'A beautiful sunset over mountains with colorful clouds')"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-[200px] resize-none"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleGenerateImage}
                        disabled={isGenerating || !prompt.trim()}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        {isGenerating ? (
                          <>
                            <Loader size="sm" className="mr-2" />
                            Generating Image...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Image
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Right Panel - Image Display (60%) */}
                    <div className="lg:col-span-3 space-y-4">
                      <div className="flex items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 relative">
                        {isGenerating ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <Loader size="lg" text="Creating your image..." />
                            <p className="text-sm text-gray-500 mt-4">This may take a few moments</p>
                          </div>
                        ) : generatedImage ? (
                          <div className="w-full h-full flex items-center justify-center p-4">
                            <img 
                              src={generatedImage} 
                              alt="Generated image"
                              className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                            />
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Your generated image will appear here</p>
                            <p className="text-sm">Enter a prompt and click generate to start</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      {generatedImage && (
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleRegenerateImage}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            disabled={isGenerating}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate Image
                          </Button>
                          <Button 
                            onClick={handleDownloadImage}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={isGenerating}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default SlideGenerator;