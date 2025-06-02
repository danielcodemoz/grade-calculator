
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Course, Category } from '@/types/course';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCourse: (course: Course) => void;
  darkMode: boolean;
}

const defaultCategories: Omit<Category, 'id'>[] = [
  { name: 'Homework', weight: 30, color: 'blue' },
  { name: 'Exams', weight: 40, color: 'red' },
  { name: 'Projects', weight: 20, color: 'green' },
  { name: 'Participation', weight: 10, color: 'purple' }
];

export const AddCourseDialog = ({ open, onOpenChange, onAddCourse, darkMode }: AddCourseDialogProps) => {
  const [courseName, setCourseName] = useState('');
  const [categories, setCategories] = useState<Omit<Category, 'id'>[]>(defaultCategories);

  const addCategory = () => {
    setCategories([...categories, { name: '', weight: 0, color: 'gray' }]);
  };

  const updateCategory = (index: number, field: keyof Omit<Category, 'id'>, value: string | number) => {
    const updated = categories.map((cat, i) => 
      i === index ? { ...cat, [field]: value } : cat
    );
    setCategories(updated);
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!courseName.trim()) return;

    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    if (Math.abs(totalWeight - 100) > 0.1) {
      alert('Category weights must add up to 100%');
      return;
    }

    const course: Course = {
      id: '', // Will be set by parent
      name: courseName.trim(),
      categories: categories.map(cat => ({
        ...cat,
        id: Date.now().toString() + Math.random().toString()
      })),
      assignments: []
    };

    onAddCourse(course);
    setCourseName('');
    setCategories(defaultCategories);
    onOpenChange(false);
  };

  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className={darkMode ? 'text-white' : 'text-gray-900'}>
            Add New Course
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="courseName" className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Course Name
            </Label>
            <Input
              id="courseName"
              placeholder="e.g., Calculus I, Biology 101"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                Grade Categories
              </Label>
              <div className={`text-sm ${
                Math.abs(totalWeight - 100) < 0.1 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                Total: {totalWeight.toFixed(1)}%
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    placeholder="Category name"
                    value={category.name}
                    onChange={(e) => updateCategory(index, 'name', e.target.value)}
                    className={`flex-1 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={category.weight || ''}
                      onChange={(e) => updateCategory(index, 'weight', parseFloat(e.target.value) || 0)}
                      className={`w-20 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>%</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(index)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={addCategory}
              className={`w-full ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>

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
              disabled={!courseName.trim() || Math.abs(totalWeight - 100) > 0.1}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Add Course
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
