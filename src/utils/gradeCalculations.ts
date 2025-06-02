
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
      // Calculate average for this category
      const categoryTotal = categoryAssignments.reduce((sum, assignment) => 
        sum + (assignment.score / assignment.maxScore) * 100, 0
      );
      const categoryAverage = categoryTotal / categoryAssignments.length;
      
      // Add to weighted total
      totalWeightedScore += (categoryAverage * category.weight) / 100;
      totalWeight += category.weight;
    }
  });

  // Normalize if weights don't add up to 100%
  const percentage = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;
  
  return {
    percentage: Math.round(percentage * 100) / 100,
    letterGrade: getLetterGrade(percentage),
    gpa: getGPA(percentage),
    color: getGradeColor(percentage)
  };
};

export const getLetterGrade = (percentage: number): string => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
};

export const getGPA = (percentage: number): number => {
  if (percentage >= 97) return 4.0;
  if (percentage >= 93) return 4.0;
  if (percentage >= 90) return 3.7;
  if (percentage >= 87) return 3.3;
  if (percentage >= 83) return 3.0;
  if (percentage >= 80) return 2.7;
  if (percentage >= 77) return 2.3;
  if (percentage >= 73) return 2.0;
  if (percentage >= 70) return 1.7;
  if (percentage >= 67) return 1.3;
  if (percentage >= 63) return 1.0;
  if (percentage >= 60) return 0.7;
  return 0.0;
};

export const getGradeColor = (percentage: number): string => {
  if (percentage >= 90) return 'emerald';
  if (percentage >= 80) return 'green';
  if (percentage >= 70) return 'yellow';
  if (percentage >= 60) return 'orange';
  return 'red';
};

export const getMotivationalMessage = (percentage: number): string => {
  if (percentage >= 95) return "You're absolutely crushing it! 🔥🏆";
  if (percentage >= 90) return "Excellent work! Keep it up! ⭐";
  if (percentage >= 85) return "Great job! You're doing amazing! 🌟";
  if (percentage >= 80) return "Good work! Keep pushing forward! 💪";
  if (percentage >= 75) return "You're on the right track! 📈";
  if (percentage >= 70) return "Keep working hard! You've got this! 💯";
  if (percentage >= 60) return "Don't give up! Improvement is coming! 🚀";
  return "Every step forward counts! Keep going! 💪";
};
