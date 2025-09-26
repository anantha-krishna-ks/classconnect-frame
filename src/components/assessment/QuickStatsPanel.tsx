import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, Clock, BarChart3, Users, Award, TrendingUp
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
}

interface QuickStatsPanelProps {
  items: GeneratedItem[];
  selectedItems: GeneratedItem[];
}

export const QuickStatsPanel: React.FC<QuickStatsPanelProps> = ({
  items,
  selectedItems
}) => {
  const totalMarks = selectedItems.reduce((sum, item) => sum + item.marks, 0);
  const selectionProgress = items.length > 0 ? (selectedItems.length / items.length) * 100 : 0;

  const bloomsDistribution = selectedItems.reduce((acc, item) => {
    acc[item.bloomsLevel] = (acc[item.bloomsLevel] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const difficultyDistribution = selectedItems.reduce((acc, item) => {
    acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const estimatedTime = Math.ceil(totalMarks * 1.5); // Rough estimate: 1.5 minutes per mark

  return (
    <div className="flex items-center space-x-4">
      {/* Selection Progress */}
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">{selectedItems.length}/{items.length}</div>
          <div className="text-xs text-gray-500">selected</div>
        </div>
        <div className="w-16">
          <Progress value={selectionProgress} className="h-2" />
        </div>
      </div>

      {/* Total Marks */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <Target className="h-4 w-4 text-blue-600" />
        <div>
          <div className="text-sm font-semibold text-blue-900">{totalMarks}</div>
          <div className="text-xs text-blue-600">marks</div>
        </div>
      </div>

      {/* Estimated Time */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
        <Clock className="h-4 w-4 text-green-600" />
        <div>
          <div className="text-sm font-semibold text-green-900">{estimatedTime}m</div>
          <div className="text-xs text-green-600">duration</div>
        </div>
      </div>

      {/* Bloom's Variety */}
      <div className="flex items-center space-x-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
        <Brain className="h-4 w-4 text-purple-600" />
        <div>
          <div className="text-sm font-semibold text-purple-900">
            {Object.keys(bloomsDistribution).length}
          </div>
          <div className="text-xs text-purple-600">levels</div>
        </div>
      </div>

      {/* Readiness Indicator */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          selectedItems.length >= 5 && totalMarks >= 20 && Object.keys(bloomsDistribution).length >= 2
            ? 'bg-green-500 animate-pulse'
            : selectedItems.length >= 3 && totalMarks >= 10
            ? 'bg-yellow-500'
            : 'bg-red-500'
        }`} />
        <span className="text-xs text-gray-600">
          {selectedItems.length >= 5 && totalMarks >= 20 && Object.keys(bloomsDistribution).length >= 2
            ? 'Ready to export'
            : selectedItems.length >= 3 && totalMarks >= 10
            ? 'Almost ready'
            : 'Select more items'
          }
        </span>
      </div>
    </div>
  );
};