import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Moon, Sun, GraduationCap, Download } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { AddCourseDialog } from '@/components/AddCourseDialog';
import { Course } from '@/types/course';
import { exportCoursesToPDF } from '@/utils/pdfExport';

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);

  const handleExportPDF = () => {
    exportCoursesToPDF(courses);
  };

  const addCourse = (course: Course) => {
    setCourses([...courses, { ...course, id: Date.now().toString() }]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(courses.map(course => 
      course.id === updatedCourse.id ? updatedCourse : course
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(courses.filter(course => course.id !== courseId));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Grade Calculator
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track your academic performance with style ✨
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className={`rounded-full ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {courses.length > 0 && (
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className={`${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            )}
            
            <Button
              onClick={() => setShowAddCourse(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <Card className={`border-2 border-dashed ${darkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-white/80'} backdrop-blur-sm`}>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mb-4">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                No courses yet
              </h3>
              <p className={`text-center mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add your first course to start tracking your grades and see your academic progress come to life!
              </p>
              <Button
                onClick={() => setShowAddCourse(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onUpdate={updateCourse}
                onDelete={deleteCourse}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}

        {/* Add Course Dialog */}
        <AddCourseDialog
          open={showAddCourse}
          onOpenChange={setShowAddCourse}
          onAddCourse={addCourse}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default Index;
