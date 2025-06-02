
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Settings } from 'lucide-react';
import { Course, Category } from '@/types/course';

interface CategoryManagerProps {
  course: Course;
  onUpdate: (course: Course) => void;
  darkMode: boolean;
}

export const CategoryManager = ({ course, onUpdate, darkMode }: CategoryManagerProps) => {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');

  const updateCategoryWeight = (categoryId: string, weight: number) => {
    const updatedCategories = course.categories.map(cat =>
      cat.id === categoryId ? { ...cat, weight } : cat
    );
    onUpdate({ ...course, categories: updatedCategories });
  };

  const updateCategoryName = (categoryId: string, name: string) => {
    const updatedCategories = course.categories.map(cat =>
      cat.id === categoryId ? { ...cat, name } : cat
    );
    onUpdate({ ...course, categories: updatedCategories });
    setEditingCategory(null);
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'New Category',
      weight: 10,
      color: 'gray'
    };
    onUpdate({ 
      ...course, 
      categories: [...course.categories, newCategory] 
    });
  };

  const removeCategory = (categoryId: string) => {
    // Remove category and its assignments
    const updatedCategories = course.categories.filter(cat => cat.id !== categoryId);
    const updatedAssignments = course.assignments.filter(assignment => assignment.categoryId !== categoryId);
    onUpdate({ 
      ...course, 
      categories: updatedCategories,
      assignments: updatedAssignments
    });
  };

  const totalWeight = course.categories.reduce((sum, cat) => sum + cat.weight, 0);

  return (
    <Card className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Settings className="h-5 w-5 mr-2" />
            Category Weights
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={Math.abs(totalWeight - 100) < 0.1 ? 'default' : 'destructive'}>
              Total: {totalWeight.toFixed(1)}%
            </Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={addCategory}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-600' : ''}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {course.categories.map((category) => (
          <div 
            key={category.id} 
            className={`p-4 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
            }`}
          >
            <div className="space-y-3">
              {/* Category Name */}
              <div className="flex items-center justify-between">
                {editingCategory === category.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Input
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateCategoryName(category.id, tempName);
                        }
                        if (e.key === 'Escape') {
                          setEditingCategory(null);
                        }
                      }}
                      onBlur={() => updateCategoryName(category.id, tempName)}
                      className={`text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingCategory(category.id);
                      setTempName(category.name);
                    }}
                    className={`font-medium hover:underline ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  >
                    {category.name}
                  </button>
                )}
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {category.weight}%
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeCategory(category.id)}
                    className="h-6 w-6 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <Slider
                  value={[category.weight]}
                  onValueChange={([value]) => updateCategoryWeight(category.id, value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {Math.abs(totalWeight - 100) > 0.1 && (
          <div className={`p-3 rounded-lg border-l-4 border-yellow-500 ${
            darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
              ⚠️ Category weights should add up to 100% for accurate grade calculation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
