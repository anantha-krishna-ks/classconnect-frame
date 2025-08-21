import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Edit, Trash2, FileBarChart, FileCheck, Minus } from 'lucide-react';
import QuestionCard from './QuestionCard';
import { CourseOutcome } from '@/pages/api';
import config from '@/config';

interface AssessmentProps {
  board: string;
  grade: string;
  subject: string;
  chapter: string;
  generatedCOs: CourseOutcome[];
  eloData: any;
  onAssessmentChange: (data: ELOAssessment[]) => void;
}

interface AssessmentItemRow {
  id: string;
  noOfItems: string;
  itemType: string;
  includeLOTS: boolean;
}

interface GeneratedItem {
  id: string;
  question: string;
  itemType: string;
  eloName: string;
  bloomsLevel: string;
}

interface ELOAssessment {
  id: string;
  name: string;
  fullText: string;
  assessmentRows: AssessmentItemRow[];
  generatedItems: GeneratedItem[];
}

const Assessment: React.FC<AssessmentProps> = ({
  board,
  grade,
  subject,
  chapter,
  generatedCOs,
  eloData,
  onAssessmentChange
}) => {
  const [elos, setElos] = useState<ELOAssessment[]>([]);
  const [warnings, setWarnings] = useState<{ [key: string]: string }>({});
  const [generatingEloIds, setGeneratingEloIds] = useState<string[]>([]);

  React.useEffect(() => {
    if (Array.isArray(eloData) && eloData.length > 0) {
      if (elos.length === 0) { // Only initialize if not already set
        let eloCounter = 1;
        const allELOs: ELOAssessment[] = eloData.flatMap((co: any) => {
          if (Array.isArray(co.elos) && co.elos.length > 0) {
            return co.elos.map((elo: any, eloIdx: number) => {
              if (elo && elo.elo) {
                return {
                  id: `${co.co_id || `co${eloIdx}`}-${elo.id || eloIdx + 1}`,
                  name: `ELO ${eloCounter++}`,
                  fullText: elo.elo,
                  assessmentRows: [
                    {
                      id: `${co.co_id || `co${eloIdx}`}-${eloIdx + 1}-row-1`,
                      noOfItems: '',
                      itemType: '',
                      includeLOTS: false,
                    },
                  ],
                  generatedItems: [],
                };
              }
              return null;
            }).filter(Boolean);
          }
          return [];
        });
        setElos(allELOs);
        onAssessmentChange(allELOs);
      }
    } else {
      setElos([]);
      onAssessmentChange([]);
    }
    // eslint-disable-next-line
  }, [eloData]);

  const addELO = () => {
    const newELO: ELOAssessment = {
      id: Date.now().toString(),
      name: `ELO ${elos.length + 1}`,
      fullText: '',
      assessmentRows: [{
        id: `${Date.now()}-row-1`,
        noOfItems: '',
        itemType: '',
        includeLOTS: false
      }],
      generatedItems: []
    };
    const newElos = [...elos, newELO];
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  const addAssessmentRow = (eloId: string) => {
    const newElos = elos.map(elo => {
      if (elo.id === eloId) {
        const currentTotal = elo.assessmentRows.reduce((total, r) => total + (parseInt(r.noOfItems) || 0), 0);
        if (currentTotal >= 10) {
          setWarnings({ ...warnings, [elo.id]: 'Cannot add more rows as the total number of items is 10.' });
          return elo;
        }
        return {
          ...elo,
          assessmentRows: [...elo.assessmentRows, {
            id: `${eloId}-row-${Date.now()}`,
            noOfItems: '',
            itemType: '',
            includeLOTS: false
          }]
        };
      }
      return elo;
    });
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  const removeAssessmentRow = (eloId: string, rowId: string) => {
    const newElos = elos.map(elo =>
      elo.id === eloId
        ? {
          ...elo,
          assessmentRows: elo.assessmentRows.filter(row => row.id !== rowId)
        }
        : elo
    );
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  const updateAssessmentRow = (eloId: string, rowId: string, field: keyof AssessmentItemRow, value: any) => {
    const newElos = elos.map(elo =>
      elo.id === eloId
        ? {
          ...elo,
          assessmentRows: elo.assessmentRows.map(row =>
            row.id === rowId
              ? { ...row, [field]: value }
              : row
          )
        }
        : elo
    );
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  // Call backend to generate assessment items
  const generateItems = async (eloId: string) => {
    setGeneratingEloIds((prev) => [...prev, eloId]);
    const elo = elos.find(e => e.id === eloId);
    if (!elo) {
      setGeneratingEloIds((prev) => prev.filter(id => id !== eloId));
      return;
    }

    const assessmentDetails = elo.assessmentRows
      .filter(row => row.noOfItems && row.itemType)
      .map(row => ({
        itemType: row.itemType,
        noOfItems: parseInt(row.noOfItems),
        includeLOTS: row.includeLOTS
      }));

    if (assessmentDetails.length === 0) {
      setWarnings(w => ({ ...w, [eloId]: 'No valid assessment rows to generate items for.' }));
      setGeneratingEloIds((prev) => prev.filter(id => id !== eloId));
      return;
    }

    try {
      // Find CO mapped to this ELO by CO ID (from ELO id: `${co_id}-...`)
      let relatedCOs = [];
      if (Array.isArray(generatedCOs)) {
        const coIdFromElo = elo.id.split('-')[0];
        relatedCOs = generatedCOs.filter(co => co.co_id === coIdFromElo);
      }
      const payload = {
        grade,
        subject,
        topic: chapter,
        elo: elo.fullText,
        course_outcome: '',
        core_objectives: relatedCOs.length > 0 ? relatedCOs.map(co => co.co_description) : [],
        assessment_details: assessmentDetails
      };

      const response = await import('axios').then(ax => ax.default.post(
        config.ENDPOINTS.GENERATE_ASSESSMENT_ITEMS,
        payload
      ));

      const eloGroupedAssessments = response.data;
      let allGeneratedItems: GeneratedItem[] = [];

      for (const key in eloGroupedAssessments) {
        if (eloGroupedAssessments.hasOwnProperty(key)) {
          const group = eloGroupedAssessments[key];
          const eloName = group.eloname;
          const items = group.assessment;

          if (Array.isArray(items)) {
            const mappedItems: GeneratedItem[] = items.map((item: any, idx: number) => ({
              id: `${eloId}-item-${Date.now()}-${idx}`,
              question: item.question,
              itemType: item.itemType,
              eloName: eloName,
              bloomsLevel: item.bloomsLevel,
              options: item.options,
              answer: item.answer,
              context: item.context
            }));
            allGeneratedItems = [...allGeneratedItems, ...mappedItems];
          }
        }
      }

      const newElos = elos.map(e =>
        e.id === eloId
          ? { ...e, generatedItems: allGeneratedItems }
          : e
      );
      setElos(newElos);
      onAssessmentChange(newElos);
    } catch (error: any) {
      let errorMessage = 'Error generating items. Please try again.';
      if (error.response && error.response.data && error.response.data.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = `Error generating assessment items: ${detail}`;
        } else {
          errorMessage = `Error generating assessment items: ${JSON.stringify(detail, null, 2)}`;
        }
      } else if (error.message) {
        errorMessage = `Error generating assessment items: ${error.message}`;
      }
      setWarnings(w => ({ ...w, [eloId]: errorMessage }));
    } finally {
      setGeneratingEloIds((prev) => prev.filter(id => id !== eloId));
    }
  };

  const editItem = (eloId: string, itemId: string, updatedItem: Partial<GeneratedItem>) => {
    const newElos = elos.map(elo =>
        elo.id === eloId
          ? {
              ...elo,
              generatedItems: elo.generatedItems.map(item =>
                item.id === itemId ? { ...item, ...updatedItem } : item
              )
            }
          : elo
      );
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  const deleteItem = (eloId: string, itemId: string) => {
    const newElos = elos.map(elo =>
      elo.id === eloId
        ? { ...elo, generatedItems: elo.generatedItems.filter(item => item.id !== itemId) }
        : elo
    );
    setElos(newElos);
    onAssessmentChange(newElos);
  };

  const itemTypes = [
    { value: 'mcq', label: 'MCQ' },
    { value: 'fill-blank', label: 'Fill in the blank' },
    { value: 'short-description', label: 'Short description' },
    { value: 'long-description', label: 'Long description' },
    { value: 'open-ended', label: 'Open Ended' },
    { value: 'case-study', label: 'Case Study' }
  ];

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="space-y-4">
        {elos.map((elo) => {
          const totalItems = elo.assessmentRows.reduce((total, row) => total + (parseInt(row.noOfItems) || 0), 0);
          return (
            <AccordionItem key={elo.id} value={elo.id} className="border border-primary/20 rounded-lg">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">{elo.name}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {elo.assessmentRows.length} rows
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  <p className="text-sm text-gray-600 mb-4">{elo.fullText}</p>
                  {/* Assessment Rows */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">Assessment Items:</h4>
                      <Button
                        onClick={() => addAssessmentRow(elo.id)}
                        variant="outline"
                        size="sm"
                        className="text-primary hover:text-primary"
                        disabled={totalItems >= 10}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Row
                      </Button>
                    </div>
                    {warnings[elo.id] && <p className="text-red-500 text-sm">{warnings[elo.id]}</p>}

                    {elo.assessmentRows.map((row, index) => (
                      <div key={row.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end p-4 bg-muted/30 rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">No Of Items</Label>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[1-9]|10"
                            value={row.noOfItems}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9]/g, '');
                              const currentTotal = elo.assessmentRows.reduce((total, r) => {
                                if (r.id !== row.id) {
                                  return total + (parseInt(r.noOfItems) || 0);
                                }
                                return total;
                              }, 0);
                              const newValue = parseInt(value) || 0;
                              if (value === '' || (newValue >= 1 && currentTotal + newValue <= 10)) {
                                updateAssessmentRow(elo.id, row.id, 'noOfItems', value);
                                setWarnings({ ...warnings, [elo.id]: '' });
                              } else {
                                setWarnings({ ...warnings, [elo.id]: 'Total number of items cannot exceed 10.' });
                              }
                            }}
                            placeholder="1-10"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Item Type</Label>
                          <Select
                            value={row.itemType}
                            onValueChange={(value) => updateAssessmentRow(elo.id, row.id, 'itemType', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {itemTypes.map((type) => {
                                const isSelectedInOtherRows = elo.assessmentRows.some(
                                  (otherRow) => otherRow.id !== row.id && otherRow.itemType === type.value
                                );
                                return (
                                  <SelectItem key={type.value} value={type.value} disabled={isSelectedInOtherRows}>
                                    {type.label}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 pt-6">
                          <Checkbox
                            checked={row.includeLOTS}
                            onCheckedChange={(checked) => updateAssessmentRow(elo.id, row.id, 'includeLOTS', checked)}
                          />
                          <Label className="text-sm font-medium">Include LOTS</Label>
                        </div>

                        <div className="pt-6">
                          <span className="text-sm text-muted-foreground">Row {index + 1}</span>
                        </div>

                        <div className="flex gap-2 pt-6">
                          {elo.assessmentRows.length > 1 && (
                            <Button
                              onClick={() => removeAssessmentRow(elo.id, row.id)}
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={() => generateItems(elo.id)}
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={generatingEloIds.includes(elo.id)}
                    >
                      {generatingEloIds.includes(elo.id) ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        "Generate All Items"
                      )}
                    </Button>
                  </div>

                  {/* Generated Items Cards */}
                  {generatingEloIds.includes(elo.id) ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      <span className="ml-3 text-primary font-medium">Generating assessment items...</span>
                    </div>
                  ) : elo.generatedItems.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Generated Items ({elo.generatedItems.length})</h4>

                      <div className="space-y-3">
                        {elo.generatedItems.map((item, index) => (
                          <QuestionCard
                            key={item.id}
                            item={item}
                            index={index}
                            eloId={elo.id}
                            onEdit={editItem}
                            onDelete={deleteItem}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

    </div>
  );
};

export default Assessment;
