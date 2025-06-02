
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Course, Assignment } from '@/types/course';

interface AddAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onUpdate: (course: Course) => void;
  darkMode: boolean;
}

export const AddAssignmentDialog = ({ 
  open, 
  onOpenChange, 
  course, 
  onUpdate, 
  darkMode 
}: AddAssignmentDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    score: '',
    maxScore: '',
    categoryId: ''
  });

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.categoryId || !formData.score || !formData.maxScore) {
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      score: parseFloat(formData.score),
      maxScore: parseFloat(formData.maxScore),
      categoryId: formData.categoryId
    };

    onUpdate({
      ...course,
      assignments: [...course.assignments, newAssignment]
    });

    // Reset form
    setFormData({
      name: '',
      score: '',
      maxScore: '',
      categoryId: ''
    });
    
    onOpenChange(false);
  };

  const isFormValid = formData.name.trim() && 
                     formData.categoryId && 
                     formData.score && 
                     formData.maxScore &&
                     parseFloat(formData.score) >= 0 &&
                     parseFloat(formData.maxScore) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={darkMode ? 'text-white' : 'text-gray-900'}>
            Add New Assignment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Assignment Name */}
          <div className="space-y-2">
            <Label htmlFor="assignmentName" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Assignment Name
            </Label>
            <Input
              id="assignmentName"
              placeholder="e.g., Midterm Exam, Homework 5"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Category
            </Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {course.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.weight}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Score */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Points Earned
              </Label>
              <Input
                id="score"
                type="number"
                placeholder="85"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Total Points
              </Label>
              <Input
                id="maxScore"
                type="number"
                placeholder="100"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
              />
            </div>
          </div>

          {/* Grade Preview */}
          {formData.score && formData.maxScore && parseFloat(formData.maxScore) > 0 && (
            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grade Preview:
                </span>
                <span className={`font-bold text-lg ${
                  ((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100) >= 90 
                    ? 'text-green-600' 
                    : ((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100) >= 80 
                    ? 'text-blue-600' 
                    : 'text-orange-600'
                }`}>
                  {parseFloat(formData.score).toFixed(1)}/{parseFloat(formData.maxScore).toFixed(1)} ({((parseFloat(formData.score) / parseFloat(formData.maxScore)) * 100).toFixed(1)}/100)
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Add Assignment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
