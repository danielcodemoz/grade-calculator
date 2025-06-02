
export interface Assignment {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  weight: number; // percentage (0-100)
  color: string;
}

export interface Course {
  id: string;
  name: string;
  categories: Category[];
  assignments: Assignment[];
}

export interface GradeInfo {
  percentage: number;
  letterGrade: string;
  gpa: number;
  color: string;
}
