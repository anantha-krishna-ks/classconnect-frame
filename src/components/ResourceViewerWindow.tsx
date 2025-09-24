import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Brain, Lightbulb, Target, X } from 'lucide-react';

interface ResourceViewerWindowProps {
  topic: string;
  resourceType: 'mindmap' | 'diagram' | 'flowchart' | 'concept-map';
}

const ResourceViewerWindow: React.FC<ResourceViewerWindowProps> = ({ topic, resourceType }) => {
  const generateContent = () => {
    switch (resourceType) {
      case 'mindmap':
        return (
          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                {topic}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <div className="bg-green-100 px-4 py-2 rounded-lg">
                    <span className="font-medium">Key Concepts</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-green-500 shadow-sm">
                    Definition & Properties
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-500 shadow-sm">
                    Core Principles
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <div className="bg-purple-100 px-4 py-2 rounded-lg">
                    <span className="font-medium">Applications</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500 shadow-sm">
                    Real-world Examples
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-purple-500 shadow-sm">
                    Problem Solving
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <div className="bg-orange-100 px-4 py-2 rounded-lg">
                    <span className="font-medium">Methods</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500 shadow-sm">
                    Step-by-step Process
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-orange-500 shadow-sm">
                    Best Practices
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <div className="bg-red-100 px-4 py-2 rounded-lg">
                    <span className="font-medium">Common Mistakes</span>
                  </div>
                </div>
                <div className="ml-6 space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-red-500 shadow-sm">
                    What to Avoid
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-red-500 shadow-sm">
                    Troubleshooting
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'diagram':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic} - Process Diagram</h2>
              <p className="text-gray-600">Visual representation of the concept</p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md">
                    Start: Input/Problem
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md">
                    Process: Apply Concept
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-md">
                    Analysis: Evaluate Results
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md">
                    Output: Solution/Answer
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'flowchart':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic} - Decision Flowchart</h2>
              <p className="text-gray-600">Step-by-step decision making process</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="bg-blue-500 text-white text-center py-3 px-4 rounded-lg">
                Identify the Problem
              </div>
              
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-400"></div>
              </div>
              
              <div className="bg-yellow-500 text-white text-center py-3 px-4 rounded-full">
                Is information complete?
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-600 mb-2">No</div>
                  <div className="bg-red-400 text-white text-center py-2 px-3 rounded text-sm">
                    Gather more data
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-600 mb-2">Yes</div>
                  <div className="bg-green-500 text-white text-center py-2 px-3 rounded text-sm">
                    Apply concept
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="w-px h-6 bg-gray-400"></div>
              </div>
              
              <div className="bg-purple-500 text-white text-center py-3 px-4 rounded-lg">
                Review and Validate
              </div>
            </div>
          </div>
        );

      case 'concept-map':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{topic} - Concept Map</h2>
              <p className="text-gray-600">Relationships between key concepts</p>
            </div>
            
            <div className="relative p-8">
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <line x1="50%" y1="20%" x2="25%" y2="50%" stroke="#3B82F6" strokeWidth="2" />
                  <line x1="50%" y1="20%" x2="75%" y2="50%" stroke="#3B82F6" strokeWidth="2" />
                  <line x1="25%" y1="50%" x2="25%" y2="80%" stroke="#10B981" strokeWidth="2" />
                  <line x1="75%" y1="50%" x2="75%" y2="80%" stroke="#10B981" strokeWidth="2" />
                </svg>
              </div>
              
              <div className="relative grid grid-rows-3 grid-cols-3 gap-6 h-96">
                <div className="col-start-2 flex justify-center">
                  <div className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold">
                    {topic}
                  </div>
                </div>
                
                <div className="col-start-1 row-start-2 flex justify-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Sub-concept A
                  </div>
                </div>
                
                <div className="col-start-3 row-start-2 flex justify-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                    Sub-concept B
                  </div>
                </div>
                
                <div className="col-start-1 row-start-3 flex justify-center">
                  <div className="bg-purple-400 text-white px-3 py-2 rounded text-sm">
                    Detail 1
                  </div>
                </div>
                
                <div className="col-start-3 row-start-3 flex justify-center">
                  <div className="bg-purple-400 text-white px-3 py-2 rounded text-sm">
                    Detail 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-800">
                    {resourceType.charAt(0).toUpperCase() + resourceType.slice(1).replace('-', ' ')}
                  </CardTitle>
                  <p className="text-sm text-gray-600">Visual learning resource</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.close()}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {generateContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceViewerWindow;