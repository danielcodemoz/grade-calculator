
import jsPDF from 'jspdf';
import { Course } from '@/types/course';
import { calculateCourseGrade, getLetterGrade } from './gradeCalculations';

export const exportCoursesToPDF = (courses: Course[]) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Grade Calculator Report', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  if (courses.length === 0) {
    doc.text('No courses found.', 20, yPosition);
    doc.save('grade-report.pdf');
    return;
  }

  // Overall GPA calculation
  const totalGPA = courses.reduce((sum, course) => {
    const gradeInfo = calculateCourseGrade(course);
    return sum + gradeInfo.gpa;
  }, 0);
  const overallGPA = totalGPA / courses.length;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Overall GPA: ${overallGPA.toFixed(2)}`, 20, yPosition);
  yPosition += 15;

  // Courses
  courses.forEach((course, courseIndex) => {
    const gradeInfo = calculateCourseGrade(course);

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Course header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`${courseIndex + 1}. ${course.name}`, 20, yPosition);
    yPosition += 10;

    // Course grade
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Grade: ${gradeInfo.letterGrade} (${gradeInfo.percentage.toFixed(1)}/100) | GPA: ${gradeInfo.gpa.toFixed(1)}`, 25, yPosition);
    yPosition += 15;

    // Categories
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Categories:', 25, yPosition);
    yPosition += 8;

    course.categories.forEach(category => {
      const categoryAssignments = course.assignments.filter(a => a.categoryId === category.id);
      let categoryAverage = 0;
      
      if (categoryAssignments.length > 0) {
        const categoryTotal = categoryAssignments.reduce((sum, assignment) => 
          sum + (assignment.score / assignment.maxScore), 0
        );
        categoryAverage = (categoryTotal / categoryAssignments.length) * 100;
      }

      doc.setFont('helvetica', 'normal');
      doc.text(`• ${category.name} (${category.weight}%): ${categoryAverage.toFixed(1)}/100`, 30, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Assignments
    if (course.assignments.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Assignments:', 25, yPosition);
      yPosition += 8;

      course.assignments.forEach(assignment => {
        const categoryName = course.categories.find(c => c.id === assignment.categoryId)?.name || 'Unknown';
        const gradeText = `${assignment.score.toFixed(1)}/${assignment.maxScore.toFixed(1)} (${((assignment.score / assignment.maxScore) * 100).toFixed(1)}/100)`;
        
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${assignment.name} [${categoryName}]: ${gradeText}`, 30, yPosition);
        yPosition += 6;

        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }

    yPosition += 10;
  });

  // Save the PDF
  doc.save('grade-report.pdf');
};
