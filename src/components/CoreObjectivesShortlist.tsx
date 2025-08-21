
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, StarOff, Trash2, Plus } from 'lucide-react';

interface CoreObjectivesShortlistProps {
  shortlistedObjectives: string[];
  onRemoveFromShortlist: (objective: string) => void;
  onAddToShortlist: (objective: string) => void;
  availableObjectives: string[];
}

const CoreObjectivesShortlist = ({ 
  shortlistedObjectives, 
  onRemoveFromShortlist,
  onAddToShortlist,
  availableObjectives 
}: CoreObjectivesShortlistProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="text-orange-600" size={18} />
          <h4 className="font-medium text-orange-900">Your Shortlisted Objectives</h4>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {shortlistedObjectives.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-orange-700 hover:text-orange-800"
        >
          {isExpanded ? 'Hide' : 'Show All'}
        </Button>
      </div>

      {shortlistedObjectives.length === 0 ? (
        <div className="text-center py-4">
          <StarOff className="mx-auto text-orange-400 mb-2" size={24} />
          <p className="text-orange-600 text-sm">No objectives shortlisted yet</p>
          <p className="text-orange-500 text-xs">Click the star icon next to objectives to add them here</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className={`flex flex-wrap gap-2 ${!isExpanded && shortlistedObjectives.length > 3 ? 'max-h-20 overflow-hidden' : ''}`}>
            {shortlistedObjectives.map((objective, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-orange-200 shadow-sm"
              >
                <Star className="text-orange-500" size={14} fill="currentColor" />
                <span className="text-sm text-gray-700">{objective}</span>
                <button
                  onClick={() => onRemoveFromShortlist(objective)}
                  className="text-orange-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          
          {!isExpanded && shortlistedObjectives.length > 3 && (
            <p className="text-xs text-orange-600 text-center">
              +{shortlistedObjectives.length - 3} more objectives
            </p>
          )}
        </div>
      )}

      {shortlistedObjectives.length > 0 && (
        <div className="mt-4 pt-3 border-t border-orange-200">
          <Button
            size="sm"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            <Plus className="mr-2" size={14} />
            Use Shortlisted Objectives
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoreObjectivesShortlist;
