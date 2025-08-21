import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Layout, Presentation, BookOpen, GraduationCap, Users, BarChart3, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  slides: number;
  color: string;
}

const SlideGeneratorTemplates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Templates', icon: Layout },
    { id: 'education', label: 'Education', icon: BookOpen },
    { id: 'science', label: 'Science', icon: GraduationCap },
    { id: 'presentation', label: 'General', icon: Presentation },
    { id: 'training', label: 'Training', icon: Users },
    { id: 'business', label: 'Business', icon: BarChart3 }
  ];

  const templates: Template[] = [
    {
      id: '1',
      title: 'Modern Education',
      description: 'Clean and professional template for educational content',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
      slides: 15,
      color: 'blue'
    },
    {
      id: '2',
      title: 'Science Lab',
      description: 'Perfect for science lessons and laboratory presentations',
      category: 'science',
      thumbnail: 'bg-gradient-to-br from-green-400 via-green-500 to-green-600',
      slides: 20,
      color: 'green'
    },
    {
      id: '3',
      title: 'Math & Numbers',
      description: 'Specialized template for mathematics and statistics',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600',
      slides: 18,
      color: 'purple'
    },
    {
      id: '4',
      title: 'History Timeline',
      description: 'Interactive timeline layouts for historical content',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600',
      slides: 25,
      color: 'orange'
    },
    {
      id: '5',
      title: 'Creative Writing',
      description: 'Inspiring template for language and literature classes',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600',
      slides: 12,
      color: 'pink'
    },
    {
      id: '6',
      title: 'Business Basics',
      description: 'Professional template for business education',
      category: 'business',
      thumbnail: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
      slides: 22,
      color: 'gray'
    },
    {
      id: '7',
      title: 'Geography World',
      description: 'Interactive maps and geographical content layouts',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600',
      slides: 16,
      color: 'teal'
    },
    {
      id: '8',
      title: 'Workshop Training',
      description: 'Interactive template for workshops and training sessions',
      category: 'training',
      thumbnail: 'bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600',
      slides: 30,
      color: 'indigo'
    },
    {
      id: '9',
      title: 'Art & Design',
      description: 'Creative template for art and design presentations',
      category: 'education',
      thumbnail: 'bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600',
      slides: 14,
      color: 'rose'
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: Template) => {
    navigate('/slide-generator/editor', { state: { template } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/slide-generator')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Slide Generator
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                <Layout className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Template Gallery</h1>
                <p className="text-sm text-gray-500">Choose from professional designs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
              <CardContent className="p-0">
                {/* Template Preview */}
                <div className={`${template.thumbnail} h-48 rounded-t-lg relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="sm"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700">
                      {template.slides} slides
                    </Badge>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">{template.title}</h3>
                    <Badge variant="outline" className="capitalize text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  
                  <Button
                    className="w-full"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    Start Creating
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlideGeneratorTemplates;