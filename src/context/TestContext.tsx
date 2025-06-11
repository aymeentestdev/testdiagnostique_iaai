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
  recommendedHours: number;
  studyPlan: string[];
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

  // Fonction pour déterminer les heures recommandées basées sur le pourcentage
  const getRecommendedHours = (percentage: number): number => {
    if (percentage < 25) return 50;
    if (percentage < 50) return 30;
    if (percentage < 70) return 20;
    return 10;
  };

  // Fonction pour générer le plan d'étude basé sur les heures recommandées
  const generateStudyPlan = (subject: SubjectType, hours: number, weakTopics: string[]): string[] => {
    const subjectPlans = {
      math: {
        10: [
          "Révision rapide des formules essentielles",
          "Exercices de perfectionnement sur les points forts",
          "Résolution de 2 annales récentes",
          "Optimisation des techniques de calcul rapide"
        ],
        20: [
          "Consolidation des concepts avancés",
          "Pratique intensive des exercices types",
          "Résolution de 4 annales complètes",
          "Travail sur la gestion du temps",
          "Révision des méthodes de résolution"
        ],
        30: [
          "Révision approfondie des bases",
          "Maîtrise des concepts fondamentaux",
          "Exercices progressifs par niveau de difficulté",
          "Résolution de 6 annales avec correction détaillée",
          "Travail spécifique sur les domaines faibles",
          "Entraînement aux calculs complexes"
        ],
        50: [
          "Apprentissage complet des concepts de base",
          "Maîtrise des opérations arithmétiques fondamentales",
          "Étude systématique de l'algèbre élémentaire",
          "Introduction progressive à l'analyse",
          "Pratique intensive avec exercices guidés",
          "Résolution de 10 annales avec accompagnement",
          "Renforcement des bases en géométrie",
          "Développement des réflexes de calcul"
        ]
      },
      physics: {
        10: [
          "Révision des formules clés",
          "Exercices d'application directe",
          "Résolution de 2 annales récentes",
          "Perfectionnement des unités et conversions"
        ],
        20: [
          "Approfondissement des lois physiques",
          "Exercices de synthèse",
          "Résolution de 4 annales complètes",
          "Maîtrise des schémas et graphiques",
          "Travail sur l'analyse dimensionnelle"
        ],
        30: [
          "Révision des principes fondamentaux",
          "Compréhension des phénomènes physiques",
          "Exercices d'application variés",
          "Résolution de 6 annales avec analyse",
          "Travail sur les domaines faibles identifiés",
          "Maîtrise des calculs vectoriels"
        ],
        50: [
          "Étude complète des concepts de base",
          "Compréhension des grandeurs physiques",
          "Maîtrise des unités du système international",
          "Apprentissage des lois fondamentales",
          "Exercices guidés et progressifs",
          "Résolution de 10 annales avec support",
          "Développement de l'intuition physique",
          "Pratique intensive des calculs"
        ]
      },
      chemistry: {
        10: [
          "Révision des formules chimiques essentielles",
          "Exercices de stœchiométrie avancée",
          "Résolution de 2 annales récentes",
          "Perfectionnement des équilibres chimiques"
        ],
        20: [
          "Approfondissement des réactions chimiques",
          "Maîtrise des calculs de concentration",
          "Résolution de 4 annales complètes",
          "Travail sur la cinétique chimique",
          "Révision de la thermochimie"
        ],
        30: [
          "Révision des concepts fondamentaux",
          "Compréhension des liaisons chimiques",
          "Exercices sur les différents types de réactions",
          "Résolution de 6 annales avec analyse détaillée",
          "Travail spécifique sur les points faibles",
          "Maîtrise de l'équilibrage des équations"
        ],
        50: [
          "Apprentissage complet des bases de la chimie",
          "Compréhension de la structure atomique",
          "Maîtrise du tableau périodique",
          "Étude des liaisons et molécules",
          "Exercices progressifs et guidés",
          "Résolution de 10 annales avec accompagnement",
          "Développement des réflexes en stœchiométrie",
          "Pratique intensive des calculs chimiques"
        ]
      },
      biology: {
        10: [
          "Révision des processus biologiques clés",
          "Exercices sur la génétique avancée",
          "Résolution de 2 annales récentes",
          "Perfectionnement de la physiologie"
        ],
        20: [
          "Approfondissement des mécanismes cellulaires",
          "Maîtrise des cycles biologiques",
          "Résolution de 4 annales complètes",
          "Travail sur l'écologie et évolution",
          "Révision de la biochimie"
        ],
        30: [
          "Révision des concepts fondamentaux",
          "Compréhension de l'organisation du vivant",
          "Exercices sur les différents systèmes",
          "Résolution de 6 annales avec analyse",
          "Travail spécifique sur les domaines faibles",
          "Maîtrise des schémas biologiques"
        ],
        50: [
          "Apprentissage complet des bases biologiques",
          "Compréhension de la cellule et ses composants",
          "Étude des grandes fonctions du vivant",
          "Maîtrise de la classification du vivant",
          "Exercices progressifs et guidés",
          "Résolution de 10 annales avec support",
          "Développement de l'observation scientifique",
          "Pratique intensive de l'analyse biologique"
        ]
      }
    };

    return subjectPlans[subject][hours as keyof typeof subjectPlans[typeof subject]] || [];
  };

  const calculateResults = (): TestResults => {
    const allQuestions = getAllQuestions();
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    
    const subjectResults: Record<SubjectType, SubjectResult> = {
      math: { total: 0, correct: 0, percentage: 0, weakTopics: [], recommendedHours: 0, studyPlan: [] },
      physics: { total: 0, correct: 0, percentage: 0, weakTopics: [], recommendedHours: 0, studyPlan: [] },
      chemistry: { total: 0, correct: 0, percentage: 0, weakTopics: [], recommendedHours: 0, studyPlan: [] },
      biology: { total: 0, correct: 0, percentage: 0, weakTopics: [], recommendedHours: 0, studyPlan: [] },
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

      // Determine recommended hours and study plan
      const recommendedHours = getRecommendedHours(subjectResults[subject].percentage);
      subjectResults[subject].recommendedHours = recommendedHours;
      subjectResults[subject].studyPlan = generateStudyPlan(subject, recommendedHours, subjectResults[subject].weakTopics);
    });
    
    // Generate personalized recommendations in French
    const recommendations: string[] = [];
    
    // Overall recommendations
    const overallPercentage = (totalCorrect / totalQuestions) * 100;
    
    if (overallPercentage < 40) {
      recommendations.push("Votre performance globale indique un besoin d'amélioration significative. Nous recommandons un plan d'étude intensif avec un focus particulier sur les matières les plus faibles.");
    } else if (overallPercentage < 70) {
      recommendations.push("Vous avez une compréhension modérée des concepts. Concentrez-vous sur le renforcement de vos connaissances dans les domaines spécifiques où vous avez moins bien réussi.");
    } else {
      recommendations.push("Excellent travail ! Vous avez une base solide. Continuez à affiner votre compréhension dans les quelques domaines où vous avez rencontré des difficultés.");
    }
    
    // Subject-specific recommendations based on recommended hours
    subjects.forEach(subject => {
      const result = subjectResults[subject];
      const subjectName = {
        math: 'mathématiques',
        physics: 'physique',
        chemistry: 'chimie',
        biology: 'biologie'
      }[subject];
      
      if (result.recommendedHours === 50) {
        recommendations.push(`En ${subjectName}, nous recommandons 50 heures de préparation intensive pour construire des bases solides.`);
      } else if (result.recommendedHours === 30) {
        recommendations.push(`En ${subjectName}, 30 heures de préparation ciblée vous permettront d'améliorer significativement vos résultats.`);
      } else if (result.recommendedHours === 20) {
        recommendations.push(`En ${subjectName}, 20 heures de révision approfondie consolideront vos acquis.`);
      } else {
        recommendations.push(`En ${subjectName}, 10 heures de perfectionnement suffiront pour optimiser votre performance.`);
      }
    });
    
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