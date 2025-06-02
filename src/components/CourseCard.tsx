
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, Edit, Plus, TrendingUp } from 'lucide-react';
import { Course } from '@/types/course';
import { calculateCourseGrade, getMotivationalMessage } from '@/utils/gradeCalculations';
import { AssignmentTable } from './AssignmentTable';
import { CategoryManager } from './CategoryManager';
import { AddAssignmentDialog } from './AddAssignmentDialog';

interface CourseCardProps {
  course: Course;
  onUpdate: (course: Course) => void;
  onDelete: (courseId: string) => void;
  darkMode: boolean;
}

export const CourseCard = ({ course, onUpdate, onDelete, darkMode }: CourseCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const gradeInfo = calculateCourseGrade(course);

  const getGradeColorClasses = (color: string) => {
    const colors = {
      emerald: 'from-emerald-500 to-green-500 text-white',
      green: 'from-green-500 to-emerald-500 text-white',
      yellow: 'from-yellow-500 to-amber-500 text-white',
      orange: 'from-orange-500 to-red-500 text-white',
      red: 'from-red-500 to-pink-500 text-white',
      gray: 'from-gray-500 to-gray-600 text-white'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-xl ${
      darkMode 
        ? 'bg-gray-800/80 border-gray-700 hover:bg-gray-800' 
        : 'bg-white/80 border-gray-200 hover:bg-white'
    } backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {course.name}
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDetails(!showDetails)}
              className={darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(course.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grade Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getGradeColorClasses(gradeInfo.color)} font-bold text-lg shadow-lg`}>
              {gradeInfo.letterGrade} ({gradeInfo.percentage.toFixed(1)}/100)
            </div>
            <div className="text-right">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                GPA: {gradeInfo.gpa.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Progress
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {gradeInfo.percentage.toFixed(1)}/100
              </span>
            </div>
            <Progress 
              value={gradeInfo.percentage} 
              className="h-2"
            />
          </div>

          {gradeInfo.percentage > 0 && (
            <div className={`text-center p-3 rounded-lg ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            } border-l-4 border-gradient-to-b ${getGradeColorClasses(gradeInfo.color).split(' ')[0]}`}>
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className={`h-4 w-4 ${
                  gradeInfo.percentage >= 80 ? 'text-green-500' : 'text-blue-500'
                }`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {getMotivationalMessage(gradeInfo.percentage)}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Assignment Count */}
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {course.assignments.length} assignment{course.assignments.length !== 1 ? 's' : ''}
            </span>
            <Button
              size="sm"
              onClick={() => setShowAddAssignment(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Assignment
            </Button>
          </div>

          {/* Categories Preview */}
          <div className="flex flex-wrap gap-2">
            {course.categories.map((category) => (
              <Badge 
                key={category.id} 
                variant="secondary"
                className={`${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
              >
                {category.name} ({category.weight}%)
              </Badge>
            ))}
          </div>

          {/* Expandable Details */}
          {showDetails && (
            <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <CategoryManager
                course={course}
                onUpdate={onUpdate}
                darkMode={darkMode}
              />
              
              <AssignmentTable
                course={course}
                onUpdate={onUpdate}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      </CardContent>

      <AddAssignmentDialog
        open={showAddAssignment}
        onOpenChange={setShowAddAssignment}
        course={course}
        onUpdate={onUpdate}
        darkMode={darkMode}
      />
    </Card>
  );
};
