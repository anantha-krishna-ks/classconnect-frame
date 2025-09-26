import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Edit, Save, X, Plus, Trash2, Image, Upload, Eye,
  Brain, Target, Type, BarChart3, FileImage
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
  rubric?: string;
  hasImage?: boolean;
  imageUrl?: string;
}

interface ItemEditorPanelProps {
  items: GeneratedItem[];
  onUpdateItem: (item: GeneratedItem) => void;
  onDeleteItem: (itemId: string) => void;
  editingItem: GeneratedItem | null;
  onSetEditingItem: (item: GeneratedItem | null) => void;
}

export const ItemEditorPanel: React.FC<ItemEditorPanelProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  editingItem,
  onSetEditingItem
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (editingItem) {
      onSetEditingItem({
        ...editingItem,
        hasImage: false,
        imageUrl: undefined
      });
    }
  };

  const saveItem = () => {
    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        hasImage: !!imagePreview || !!editingItem.imageUrl,
        imageUrl: imagePreview || editingItem.imageUrl
      };
      onUpdateItem(updatedItem);
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const addOption = () => {
    if (editingItem) {
      const newOptions = [...(editingItem.options || []), 'New option'];
      onSetEditingItem({
        ...editingItem,
        options: newOptions
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (editingItem && editingItem.options) {
      const newOptions = [...editingItem.options];
      newOptions[index] = value;
      onSetEditingItem({
        ...editingItem,
        options: newOptions
      });
    }
  };

  const removeOption = (index: number) => {
    if (editingItem && editingItem.options) {
      const newOptions = editingItem.options.filter((_, i) => i !== index);
      onSetEditingItem({
        ...editingItem,
        options: newOptions
      });
    }
  };

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

  if (items.length === 0) {
    return (
      <Card className="border-0 shadow-sm bg-white/80">
        <CardContent className="p-12 text-center">
          <Edit className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No items selected for editing</h3>
          <p className="text-gray-500">Select items from the generation panel to edit them here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm bg-white/80">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-indigo-600" />
            <span>Edit Selected Items</span>
            <Badge variant="secondary">{items.length} items</Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs border ${getTypeColor(item.itemType)}`}>
                      <Type className="h-3 w-3 mr-1" />
                      {item.itemType}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
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
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSetEditingItem(item)}
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {item.question}
                </p>
                
                {item.options && (
                  <div className="space-y-2">
                    {item.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-3 py-2 rounded-md flex items-center ${
                          option === item.correctAnswer 
                            ? 'bg-green-100 text-green-800 font-medium' 
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                      >
                        <span className="font-mono mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                        {option === item.correctAnswer && (
                          <span className="ml-auto text-green-600 text-xs font-medium">✓ Correct</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {item.hasImage && item.imageUrl && (
                  <div className="mt-3">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <FileImage className="h-3 w-3 mr-1" />
                      Attached Image
                    </div>
                    <img
                      src={item.imageUrl}
                      alt="Question attachment"
                      className="max-w-full h-auto max-h-32 rounded border object-contain"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => onSetEditingItem(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-indigo-600" />
              <span>Edit Item</span>
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Item Type</label>
                  <Select
                    value={editingItem.itemType}
                    onValueChange={(value) => onSetEditingItem({ ...editingItem, itemType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="True/False">True/False</SelectItem>
                      <SelectItem value="Short Answer">Short Answer</SelectItem>
                      <SelectItem value="Long Answer">Long Answer</SelectItem>
                      <SelectItem value="Essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bloom's Level</label>
                  <Select
                    value={editingItem.bloomsLevel}
                    onValueChange={(value) => onSetEditingItem({ ...editingItem, bloomsLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remember">Remember</SelectItem>
                      <SelectItem value="Understand">Understand</SelectItem>
                      <SelectItem value="Apply">Apply</SelectItem>
                      <SelectItem value="Analyze">Analyze</SelectItem>
                      <SelectItem value="Evaluate">Evaluate</SelectItem>
                      <SelectItem value="Create">Create</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Marks</label>
                  <Input
                    type="number"
                    value={editingItem.marks}
                    onChange={(e) => onSetEditingItem({ ...editingItem, marks: parseInt(e.target.value) || 0 })}
                    min="1"
                    className="text-center font-medium"
                  />
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
                <Textarea
                  value={editingItem.question}
                  onChange={(e) => onSetEditingItem({ ...editingItem, question: e.target.value })}
                  className="min-h-[100px] resize-none"
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Question Image (Optional)</label>
                {(imagePreview || editingItem.imageUrl) ? (
                  <div className="relative">
                    <img
                      src={imagePreview || editingItem.imageUrl}
                      alt="Question preview"
                      className="max-w-full h-auto max-h-48 rounded border object-contain mb-2"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                />
              </div>

              {/* Options for Multiple Choice */}
              {editingItem.itemType === 'Multiple Choice' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Answer Options</label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                      className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Option
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {editingItem.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm font-mono w-6 text-center">
                          {String.fromCharCode(65 + index)}.
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          className={`flex-1 ${
                            option === editingItem.correctAnswer ? 'ring-2 ring-green-200 border-green-300' : ''
                          }`}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        <Button
                          variant={option === editingItem.correctAnswer ? "default" : "outline"}
                          size="sm"
                          onClick={() => onSetEditingItem({ ...editingItem, correctAnswer: option })}
                          className={
                            option === editingItem.correctAnswer
                              ? "bg-green-600 hover:bg-green-700"
                              : "text-green-600 border-green-200 hover:bg-green-50"
                          }
                        >
                          {option === editingItem.correctAnswer ? "✓ Correct" : "Set Correct"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={editingItem.options!.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => onSetEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveItem}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};