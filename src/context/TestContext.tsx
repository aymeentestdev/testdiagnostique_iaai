import React, { createContext, useState, useContext, ReactNode } from 'react';
import { SubjectType, QuestionType } from '../types';
import { getAllQuestions } from '../data/questions';

interface UserAnswers {
  [questionId: string]: string;
}

interface TestContextType {
  userName: string;
  setUserName: (name: string) => void;
  currentSubject: SubjectType | null;
  setCurrentSubject: (subject: SubjectType | null) => void;
  userAnswers: UserAnswers;
  setUserAnswer: (questionId: string, answer: string) => void;
  clearAnswers: () => void;
  getSubjectQuestions: (subject: SubjectType) => QuestionType[];
  getAllSubjectQuestions: () => Record<SubjectType, QuestionType[]>;
  calculateResults: () => TestResults;
}

export interface SubjectResult {
  total: number;
  correct: number;
  percentage: number;
  weakTopics: string[];
}

export interface TestResults {
  overall: {
    total: number;
    correct: number;
    percentage: number;
  };
  subjects: Record<SubjectType, SubjectResult>;
  recommendations: string[];
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [currentSubject, setCurrentSubject] = useState<SubjectType | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  const setUserAnswer = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const clearAnswers = () => {
    setUserAnswers({});
  };

  const getSubjectQuestions = (subject: SubjectType) => {
    return getAllQuestions()[subject];
  };

  const getAllSubjectQuestions = () => {
    return getAllQuestions();
  };

  const calculateResults = (): TestResults => {
    const allQuestions = getAllQuestions();
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    
    const subjectResults: Record<SubjectType, SubjectResult> = {
      math: { total: 0, correct: 0, percentage: 0, weakTopics: [] },
      physics: { total: 0, correct: 0, percentage: 0, weakTopics: [] },
      chemistry: { total: 0, correct: 0, percentage: 0, weakTopics: [] },
      biology: { total: 0, correct: 0, percentage: 0, weakTopics: [] },
    };
    
    // Track topics per subject with performance
    const topicsPerformance: Record<SubjectType, Record<string, { total: number, correct: number }>> = {
      math: {},
      physics: {},
      chemistry: {},
      biology: {},
    };

    // Calculate results for each subject
    subjects.forEach(subject => {
      const questions = allQuestions[subject];
      subjectResults[subject].total = questions.length;
      totalQuestions += questions.length;
      
      questions.forEach(question => {
        const userAnswer = userAnswers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        // Track topic performance
        if (!topicsPerformance[subject][question.topic]) {
          topicsPerformance[subject][question.topic] = { total: 0, correct: 0 };
        }
        topicsPerformance[subject][question.topic].total += 1;
        
        if (isCorrect) {
          subjectResults[subject].correct += 1;
          totalCorrect += 1;
          topicsPerformance[subject][question.topic].correct += 1;
        }
      });
      
      // Calculate percentage for subject
      subjectResults[subject].percentage = (subjectResults[subject].correct / subjectResults[subject].total) * 100;
      
      // Identify weak topics (less than 50% correct)
      Object.entries(topicsPerformance[subject]).forEach(([topic, perf]) => {
        const topicPercentage = (perf.correct / perf.total) * 100;
        if (topicPercentage < 50) {
          subjectResults[subject].weakTopics.push(topic);
        }
      });
    });
    
    // Generate personalized recommendations in French
    const recommendations: string[] = [];
    
    // Overall recommendations
    const overallPercentage = (totalCorrect / totalQuestions) * 100;
    
    if (overallPercentage < 40) {
      recommendations.push("Votre performance globale indique un besoin d'amélioration significative. Considérez développer un plan d'étude complet en vous concentrant sur toutes les matières.");
    } else if (overallPercentage < 70) {
      recommendations.push("Vous avez une compréhension modérée des concepts. Concentrez-vous sur le renforcement de vos connaissances dans les domaines spécifiques où vous avez moins bien réussi.");
    } else {
      recommendations.push("Excellent travail ! Vous avez une base solide. Continuez à affiner votre compréhension dans les quelques domaines où vous avez rencontré des difficultés.");
    }
    
    // Subject-specific recommendations
    subjects.forEach(subject => {
      const result = subjectResults[subject];
      const subjectName = {
        math: 'mathématiques',
        physics: 'physique',
        chemistry: 'chimie',
        biology: 'biologie'
      }[subject];
      
      if (result.percentage < 50) {
        if (result.weakTopics.length > 0) {
          recommendations.push(`En ${subjectName}, concentrez-vous particulièrement sur : ${result.weakTopics.join(', ')}.`);
        } else {
          recommendations.push(`Votre performance en ${subjectName} nécessite une amélioration. Considérez réviser les concepts fondamentaux.`);
        }
      } else if (result.weakTopics.length > 0) {
        recommendations.push(`Bien que vous réussissiez bien en ${subjectName}, vous pourriez vous améliorer sur : ${result.weakTopics.join(', ')}.`);
      }
    });
    
    // Learning strategy recommendations in French
    if (subjectResults.math.percentage < 60) {
      recommendations.push("Pour les mathématiques, la pratique est essentielle. Travaillez régulièrement sur des problèmes d'exemple et leurs solutions.");
    }
    
    if (subjectResults.physics.percentage < 60) {
      recommendations.push("Pour la physique, concentrez-vous sur la compréhension des principes sous-jacents plutôt que sur la mémorisation des formules.");
    }
    
    if (subjectResults.chemistry.percentage < 60) {
      recommendations.push("Pour la chimie, créez des fiches pour les formules et réactions, et pratiquez l'équilibrage des équations.");
    }
    
    if (subjectResults.biology.percentage < 60) {
      recommendations.push("Pour la biologie, utilisez des aides visuelles et des diagrammes pour mieux comprendre les processus et structures.");
    }
    
    return {
      overall: {
        total: totalQuestions,
        correct: totalCorrect,
        percentage: overallPercentage,
      },
      subjects: subjectResults,
      recommendations,
    };
  };

  return (
    <TestContext.Provider
      value={{
        userName,
        setUserName,
        currentSubject,
        setCurrentSubject,
        userAnswers,
        setUserAnswer,
        clearAnswers,
        getSubjectQuestions,
        getAllSubjectQuestions,
        calculateResults,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export const useTest = (): TestContextType => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};