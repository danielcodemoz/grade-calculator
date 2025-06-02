
import { Course, Assignment, Category, GradeInfo } from '@/types/course';

export const calculateCourseGrade = (course: Course): GradeInfo => {
  if (course.assignments.length === 0) {
    return {
      percentage: 0,
      letterGrade: 'N/A',
      gpa: 0,
      color: 'gray'
    };
  }

  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Group assignments by category
  const assignmentsByCategory = course.assignments.reduce((acc, assignment) => {
    if (!acc[assignment.categoryId]) {
      acc[assignment.categoryId] = [];
    }
    acc[assignment.categoryId].push(assignment);
    return acc;
  }, {} as Record<string, Assignment[]>);

  // Calculate weighted average for each category
  course.categories.forEach(category => {
    const categoryAssignments = assignmentsByCategory[category.id] || [];
    
    if (categoryAssignments.length > 0) {
      // Calculate average for this category as raw score
      const categoryTotal = categoryAssignments.reduce((sum, assignment) => 
        sum + (assignment.score / assignment.maxScore), 0
      );
      const categoryAverage = categoryTotal / categoryAssignments.length;
      
      // Add to weighted total
      totalWeightedScore += (categoryAverage * category.weight) / 100;
      totalWeight += category.weight;
    }
  });

  // Calculate final grade as a number out of 100
  const finalGrade = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
  
  return {
    percentage: Math.round(finalGrade * 100) / 100,
    letterGrade: getLetterGrade(finalGrade),
    gpa: getGPA(finalGrade),
    color: getGradeColor(finalGrade)
  };
};

export const getLetterGrade = (grade: number): string => {
  if (grade >= 97) return 'A+';
  if (grade >= 93) return 'A';
  if (grade >= 90) return 'A-';
  if (grade >= 87) return 'B+';
  if (grade >= 83) return 'B';
  if (grade >= 80) return 'B-';
  if (grade >= 77) return 'C+';
  if (grade >= 73) return 'C';
  if (grade >= 70) return 'C-';
  if (grade >= 67) return 'D+';
  if (grade >= 63) return 'D';
  if (grade >= 60) return 'D-';
  return 'F';
};

export const getGPA = (grade: number): number => {
  if (grade >= 97) return 4.0;
  if (grade >= 93) return 4.0;
  if (grade >= 90) return 3.7;
  if (grade >= 87) return 3.3;
  if (grade >= 83) return 3.0;
  if (grade >= 80) return 2.7;
  if (grade >= 77) return 2.3;
  if (grade >= 73) return 2.0;
  if (grade >= 70) return 1.7;
  if (grade >= 67) return 1.3;
  if (grade >= 63) return 1.0;
  if (grade >= 60) return 0.7;
  return 0.0;
};

export const getGradeColor = (grade: number): string => {
  if (grade >= 90) return 'emerald';
  if (grade >= 80) return 'green';
  if (grade >= 70) return 'yellow';
  if (grade >= 60) return 'orange';
  return 'red';
};

export const getMotivationalMessage = (grade: number): string => {
  if (grade >= 95) return "You're absolutely crushing it! 🔥🏆";
  if (grade >= 90) return "Excellent work! Keep it up! ⭐";
  if (grade >= 85) return "Great job! You're doing amazing! 🌟";
  if (grade >= 80) return "Good work! Keep pushing forward! 💪";
  if (grade >= 75) return "You're on the right track! 📈";
  if (grade >= 70) return "Keep working hard! You've got this! 💯";
  if (grade >= 60) return "Don't give up! Improvement is coming! 🚀";
  return "Every step forward counts! Keep going! 💪";
};
