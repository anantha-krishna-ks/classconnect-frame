import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Sparkles } from 'lucide-react';
import AssessmentItemGeneration from './AssessmentItemGeneration';

interface ItemConfigRow {
  id: string;
  bloomsLevel: string;
  itemType: string;
  difficulty: string;
  noOfItems: number;
  marksPerItem: number;
  questionText?: string;
}

interface AssessmentItemConfigurationProps {
  assessmentData: any;
  updateAssessmentData: (data: any) => void;
  onComplete?: () => void;
}

const AssessmentItemConfiguration = ({ assessmentData, updateAssessmentData, onComplete }: AssessmentItemConfigurationProps) => {
  const [itemConfig, setItemConfig] = useState<ItemConfigRow[]>(assessmentData.itemConfiguration || []);
  const [showItemGeneration, setShowItemGeneration] = useState(false);

  const bloomsLevels = [
    'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'
  ];

  const itemTypes = [
    'Multiple Choice', 'True/False', 'Short Answer', 'Long Answer', 
    'Problem Solving', 'Case Study', 'Essay', 'Application Based'
  ];

  const difficultyLevels = ['Easy', 'Medium', 'Hard'];

  const addItemConfigRow = () => {
    const newRow: ItemConfigRow = {
      id: Date.now().toString(),
      bloomsLevel: '',
      itemType: '',
      difficulty: '',
      noOfItems: 1,
      marksPerItem: 1,
      questionText: ''
    };
    const updatedConfig = [...itemConfig, newRow];
    setItemConfig(updatedConfig);
    updateAssessmentData({ itemConfiguration: updatedConfig });
  };

  const updateItemConfigRow = (id: string, field: keyof ItemConfigRow, value: any) => {
    const updatedConfig = itemConfig.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    setItemConfig(updatedConfig);
    updateAssessmentData({ itemConfiguration: updatedConfig });
  };

  const removeItemConfigRow = (id: string) => {
    const updatedConfig = itemConfig.filter(row => row.id !== id);
    setItemConfig(updatedConfig);
    updateAssessmentData({ itemConfiguration: updatedConfig });
  };

  const calculateTotals = () => {
    const totalItems = itemConfig.reduce((sum, row) => sum + row.noOfItems, 0);
    const totalMarks = itemConfig.reduce((sum, row) => sum + (row.noOfItems * row.marksPerItem), 0);
    return { totalItems, totalMarks };
  };

  const { totalItems, totalMarks } = calculateTotals();

  return (
    <div className="space-y-8">
      {/* Selected ELOs Summary */}
      <Card className="border border-border/50 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Selected Learning Outcomes</h3>
              <p className="text-muted-foreground">Configure assessment items for these ELOs</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{assessmentData.selectedELOs?.length || 0}</div>
              <div className="text-sm text-muted-foreground">ELOs to assess</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Configuration */}
      <Card className="border border-border/50 bg-white">
        <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-t-lg">
          <CardTitle className="text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Item Configuration
          </CardTitle>
          <p className="text-muted-foreground">
            Configure the types of questions for your selected learning outcomes
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          {/* Configuration Table */}
          <div className="border-2 border-green-200 rounded-xl overflow-hidden bg-gradient-to-br from-green-50/50 to-emerald-50/50">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-4 grid grid-cols-6 gap-4 font-semibold text-sm text-green-800">
              <div>Bloom's Level</div>
              <div>Item Type</div>
              <div>Difficulty</div>
              <div>No. of Items</div>
              <div>Marks/Item</div>
              <div>Actions</div>
            </div>
            {itemConfig.map(row => (
              <div key={row.id} className="border-t border-green-200 bg-white/50">
                <div className="px-4 py-4 grid grid-cols-6 gap-4">
                  <Select 
                    value={row.bloomsLevel} 
                    onValueChange={(value) => updateItemConfigRow(row.id, 'bloomsLevel', value)}
                  >
                    <SelectTrigger className="h-10 border-green-200 hover:border-green-300 transition-colors">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {bloomsLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={row.itemType} 
                    onValueChange={(value) => updateItemConfigRow(row.id, 'itemType', value)}
                  >
                    <SelectTrigger className="h-10 border-green-200 hover:border-green-300 transition-colors">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={row.difficulty} 
                    onValueChange={(value) => updateItemConfigRow(row.id, 'difficulty', value)}
                  >
                    <SelectTrigger className="h-10 border-green-200 hover:border-green-300 transition-colors">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    type="number"
                    min="1"
                    value={row.noOfItems}
                    onChange={(e) => updateItemConfigRow(row.id, 'noOfItems', parseInt(e.target.value) || 1)}
                    className="h-10 border-green-200 hover:border-green-300 focus:border-green-400 transition-colors"
                  />
                  
                  <Input
                    type="number"
                    min="1"
                    value={row.marksPerItem}
                    onChange={(e) => updateItemConfigRow(row.id, 'marksPerItem', parseInt(e.target.value) || 1)}
                    className="h-10 border-green-200 hover:border-green-300 focus:border-green-400 transition-colors"
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItemConfigRow(row.id)}
                    className="h-10 w-10 p-0 hover:bg-red-100 rounded-full"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                {/* Question Text Input for specific item types */}
                {(row.itemType === 'Long Answer' || row.itemType === 'Short Answer' || row.itemType === 'Application Based') && (
                  <div className="px-4 pb-4">
                    <label className="text-sm font-medium text-green-700 block mb-2">
                      Item Sub-Type
                    </label>
                    <textarea
                      placeholder="Enter your question here..."
                      value={row.questionText || ''}
                      onChange={(e) => updateItemConfigRow(row.id, 'questionText', e.target.value)}
                      className="w-full min-h-[80px] rounded-md border border-green-200 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 hover:border-green-300 transition-colors resize-y"
                      rows={3}
                    />
                  </div>
                )}
              </div>
            ))}
            
            {itemConfig.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground bg-white/50">
                No items configured yet. Click "Add Item" to get started.
              </div>
            )}
          </div>

          {/* Add Item Button */}
          <div className="flex justify-start">
            <Button 
              variant="outline" 
              onClick={addItemConfigRow}
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Summary */}
          {itemConfig.length > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6 rounded-xl">
              <h4 className="font-semibold text-green-900 mb-4">Assessment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/70 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">{totalItems}</div>
                  <div className="text-sm text-green-600">Total Items</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-700">{totalMarks}</div>
                  <div className="text-sm text-emerald-600">Total Marks</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">{assessmentData.selectedELOs?.length || 0}</div>
                  <div className="text-sm text-blue-600">ELOs Covered</div>
                </div>
                <div className="bg-white/70 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-700">{assessmentData.duration || 0}</div>
                  <div className="text-sm text-purple-600">Duration (min)</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Items Button */}
      {itemConfig.length > 0 && !showItemGeneration && (
        <div className="text-center animate-fade-in">
          <Button
            onClick={() => setShowItemGeneration(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-12 py-4 h-auto text-lg rounded-xl border border-green-400/20 hover:scale-105 transition-all duration-300 transform"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Items
          </Button>
        </div>
      )}

      {/* Item Generation Section */}
      {showItemGeneration && (
        <AssessmentItemGeneration 
          assessmentData={assessmentData}
          updateAssessmentData={updateAssessmentData}
        />
      )}
    </div>
  );
};

export default AssessmentItemConfiguration;