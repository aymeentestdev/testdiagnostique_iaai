export type SubjectType = 'math' | 'physics' | 'chemistry' | 'biology';

export interface QuestionType {
  id: string;
  subject: SubjectType;
  topic: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: string;
  explanation: string;
}

export interface SubjectInfo {
  title: string;
  description: string;
  color: string;
  icon: string;
  numQuestions: number;
}