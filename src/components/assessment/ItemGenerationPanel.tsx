import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Eye, Edit, Trash2, CheckCircle2, Filter, RefreshCw, Search,
  Brain, Target, BarChart3, Sparkles, Grid, List, SortAsc
} from 'lucide-react';

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

interface ItemGenerationPanelProps {
  items: GeneratedItem[];
  selectedItems: string[];
  onToggleSelection: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (item: GeneratedItem) => void;
  onRegenerateItems: () => void;
  isGenerating: boolean;
}

export const ItemGenerationPanel: React.FC<ItemGenerationPanelProps> = ({
  items,
  selectedItems,
  onToggleSelection,
  onDeleteItem,
  onEditItem,
  onRegenerateItems,
  isGenerating
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterBloomsLevel, setFilterBloomsLevel] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'type' | 'blooms' | 'marks'>('type');

  const getTypeColor = (type: string) => {
    const colors = {
      'Multiple Choice': 'bg-blue-50 text-blue-700 border-blue-200',
      'True/False': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Short Answer': 'bg-amber-50 text-amber-700 border-amber-200',
      'Long Answer': 'bg-purple-50 text-purple-700 border-purple-200',
      'Problem Solving': 'bg-orange-50 text-orange-700 border-orange-200',
      'Case Study': 'bg-pink-50 text-pink-700 border-pink-200',
      'Essay': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getBloomsColor = (level: string) => {
    const colors = {
      'Remember': 'bg-red-50 text-red-700 border-red-200',
      'Understand': 'bg-orange-50 text-orange-700 border-orange-200',
      'Apply': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Analyze': 'bg-green-50 text-green-700 border-green-200',
      'Evaluate': 'bg-blue-50 text-blue-700 border-blue-200',
      'Create': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.eloTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.itemType === filterType;
      const matchesBlooms = filterBloomsLevel === 'all' || item.bloomsLevel === filterBloomsLevel;
      return matchesSearch && matchesType && matchesBlooms;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'type':
          return a.itemType.localeCompare(b.itemType);
        case 'blooms':
          return a.bloomsLevel.localeCompare(b.bloomsLevel);
        case 'marks':
          return b.marks - a.marks;
        default:
          return 0;
      }
    });

  const itemTypes = [...new Set(items.map(item => item.itemType))];
  const bloomsLevels = [...new Set(items.map(item => item.bloomsLevel))];

  const selectAllFiltered = () => {
    filteredItems.forEach(item => {
      if (!item.isSelected) {
        onToggleSelection(item.id);
      }
    });
  };

  const deselectAllFiltered = () => {
    filteredItems.forEach(item => {
      if (item.isSelected) {
        onToggleSelection(item.id);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="border-0 shadow-sm bg-white/80">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search questions or learning objectives..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-white border-gray-200">
                  <SelectValue placeholder="Item Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {itemTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterBloomsLevel} onValueChange={setFilterBloomsLevel}>
                <SelectTrigger className="w-40 bg-white border-gray-200">
                  <SelectValue placeholder="Bloom's Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {bloomsLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy as any}>
                <SelectTrigger className="w-32 bg-white border-gray-200">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="blooms">Bloom's</SelectItem>
                  <SelectItem value="marks">Marks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex border rounded-lg bg-white overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Showing {filteredItems.length} of {items.length} items
              </span>
              {filteredItems.length > 0 && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllFiltered}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deselectAllFiltered}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}
            </div>
            <Button
              onClick={onRegenerateItems}
              disabled={isGenerating}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Items Display */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`border transition-all duration-200 hover:shadow-lg ${
              item.isSelected 
                ? 'ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={item.isSelected}
                    onCheckedChange={() => onToggleSelection(item.id)}
                    className="mt-1"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs border ${getTypeColor(item.itemType)}`}>
                        {item.itemType}
                      </Badge>
                      <Badge className={`text-xs border ${getBloomsColor(item.bloomsLevel)}`}>
                        <Brain className="h-3 w-3 mr-1" />
                        {item.bloomsLevel}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {item.marks} marks
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      {item.eloTitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditItem(item)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                {item.question}
              </p>
              {item.options && (
                <div className="mt-3 space-y-1">
                  {item.options.slice(0, 2).map((option, idx) => (
                    <div
                      key={idx}
                      className={`text-xs px-2 py-1 rounded ${
                        option === item.correctAnswer 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </div>
                  ))}
                  {item.options.length > 2 && (
                    <div className="text-xs text-gray-400">
                      +{item.options.length - 2} more options
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="border-0 shadow-sm bg-white/80">
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};