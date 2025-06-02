
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Check, X, BookOpen } from 'lucide-react';
import { Course, Assignment } from '@/types/course';

interface AssignmentTableProps {
  course: Course;
  onUpdate: (course: Course) => void;
  darkMode: boolean;
}

export const AssignmentTable = ({ course, onUpdate, darkMode }: AssignmentTableProps) => {
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    score: 0,
    maxScore: 0,
    categoryId: ''
  });

  const startEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment.id);
    setEditForm({
      name: assignment.name,
      score: assignment.score,
      maxScore: assignment.maxScore,
      categoryId: assignment.categoryId
    });
  };

  const saveEdit = () => {
    if (!editingAssignment) return;

    const updatedAssignments = course.assignments.map(assignment =>
      assignment.id === editingAssignment
        ? { ...assignment, ...editForm }
        : assignment
    );

    onUpdate({ ...course, assignments: updatedAssignments });
    setEditingAssignment(null);
  };

  const cancelEdit = () => {
    setEditingAssignment(null);
  };

  const deleteAssignment = (assignmentId: string) => {
    const updatedAssignments = course.assignments.filter(a => a.id !== assignmentId);
    onUpdate({ ...course, assignments: updatedAssignments });
  };

  const getCategoryName = (categoryId: string) => {
    const category = course.categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (percentage >= 60) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  if (course.assignments.length === 0) {
    return (
      <Card className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <BookOpen className={`h-12 w-12 mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No assignments yet. Add your first assignment to start tracking your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
      <CardHeader>
        <CardTitle className={`text-lg flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <BookOpen className="h-5 w-5 mr-2" />
          Assignments ({course.assignments.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className={darkMode ? 'border-gray-600' : 'border-gray-200'}>
                <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Assignment</TableHead>
                <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Category</TableHead>
                <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Score</TableHead>
                <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Grade</TableHead>
                <TableHead className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.assignments.map((assignment) => (
                <TableRow 
                  key={assignment.id}
                  className={`${darkMode ? 'border-gray-600 hover:bg-gray-600/50' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  {/* Assignment Name Column */}
                  <TableCell>
                    {editingAssignment === assignment.id ? (
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={`w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                      />
                    ) : (
                      <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {assignment.name}
                      </span>
                    )}
                  </TableCell>

                  {/* Category Column */}
                  <TableCell>
                    {editingAssignment === assignment.id ? (
                      <Select
                        value={editForm.categoryId}
                        onValueChange={(value) => setEditForm({ ...editForm, categoryId: value })}
                      >
                        <SelectTrigger className={darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {course.categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant="outline" className={darkMode ? 'border-gray-600 text-gray-300' : ''}>
                        {getCategoryName(assignment.categoryId)}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Score Column */}
                  <TableCell>
                    {editingAssignment === assignment.id ? (
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          value={editForm.score}
                          onChange={(e) => setEditForm({ ...editForm, score: parseFloat(e.target.value) || 0 })}
                          className={`w-16 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        />
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>/</span>
                        <Input
                          type="number"
                          value={editForm.maxScore}
                          onChange={(e) => setEditForm({ ...editForm, maxScore: parseFloat(e.target.value) || 0 })}
                          className={`w-16 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                        />
                      </div>
                    ) : (
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {assignment.score} / {assignment.maxScore}
                      </span>
                    )}
                  </TableCell>

                  {/* Grade Column */}
                  <TableCell>
                    <Badge className={getGradeColor(assignment.score, assignment.maxScore)}>
                      {assignment.score.toFixed(1)}/{assignment.maxScore.toFixed(1)} ({((assignment.score / assignment.maxScore) * 100).toFixed(1)}/100)
                    </Badge>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {editingAssignment === assignment.id ? (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={saveEdit}
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={cancelEdit}
                            className="h-8 w-8 text-gray-600 hover:bg-gray-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(assignment)}
                            className={`h-8 w-8 ${darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-600 hover:bg-gray-100'}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteAssignment(assignment.id)}
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
