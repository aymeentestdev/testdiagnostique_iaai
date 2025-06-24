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
  allocatedHours: number;
  studyPlan: string[];
}

export interface TestResults {
  overall: {
    total: number;
    correct: number;
    percentage: number;
  };
  subjects: Record<SubjectType, SubjectResult>;
  totalStudyHours: number;
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

  // Fonction pour déterminer le temps total de préparation basé sur la performance globale
  const getTotalStudyHours = (overallPercentage: number): number => {
    if (overallPercentage < 25) return 60; // Niveau très faible
    if (overallPercentage < 40) return 50; // Niveau faible
    if (overallPercentage < 55) return 40; // Niveau moyen-faible
    if (overallPercentage < 70) return 30; // Niveau moyen
    if (overallPercentage < 85) return 20; // Niveau bon
    return 15; // Niveau excellent
  };

  // Fonction pour répartir les heures entre les matières selon les performances
  const allocateStudyHours = (subjectPerformances: Record<SubjectType, number>, totalHours: number): Record<SubjectType, number> => {
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    
    // Calculer les scores inversés (plus faible = plus d'heures)
    const invertedScores = subjects.map(subject => ({
      subject,
      score: subjectPerformances[subject],
      invertedScore: 100 - subjectPerformances[subject] // Plus le score est faible, plus l'inversé est élevé
    }));

    // Calculer la somme des scores inversés
    const totalInvertedScore = invertedScores.reduce((sum, item) => sum + item.invertedScore, 0);

    // Répartir les heures proportionnellement aux scores inversés
    const allocation: Record<SubjectType, number> = {} as Record<SubjectType, number>;
    let allocatedHours = 0;

    invertedScores.forEach((item, index) => {
      if (index === invertedScores.length - 1) {
        // Dernière matière : attribuer les heures restantes pour éviter les erreurs d'arrondi
        allocation[item.subject] = Math.max(2, totalHours - allocatedHours);
      } else {
        // Calculer la proportion et arrondir
        const proportion = item.invertedScore / totalInvertedScore;
        const hours = Math.max(2, Math.round(proportion * totalHours)); // Minimum 2h par matière
        allocation[item.subject] = hours;
        allocatedHours += hours;
      }
    });

    return allocation;
  };

  // Fonction pour générer le plan d'étude basé sur les heures allouées et les faiblesses
  const generateStudyPlan = (subject: SubjectType, hours: number, weakTopics: string[], percentage: number): string[] => {
    const baseActivities = {
      math: [
        "Révision des concepts fondamentaux",
        "Exercices d'application progressive",
        "Résolution d'annales récentes",
        "Maîtrise des formules essentielles",
        "Entraînement aux calculs rapides",
        "Travail sur les méthodes de résolution",
        "Perfectionnement des techniques avancées",
        "Optimisation de la gestion du temps"
      ],
      physics: [
        "Révision des lois physiques fondamentales",
        "Compréhension des phénomènes physiques",
        "Exercices d'application des formules",
        "Maîtrise des unités et conversions",
        "Analyse de schémas et graphiques",
        "Résolution de problèmes complexes",
        "Travail sur l'analyse dimensionnelle",
        "Perfectionnement des calculs vectoriels"
      ],
      chemistry: [
        "Révision des concepts de base",
        "Maîtrise des réactions chimiques",
        "Exercices de stœchiométrie",
        "Compréhension des équilibres",
        "Travail sur la cinétique chimique",
        "Étude de la thermochimie",
        "Perfectionnement des calculs",
        "Analyse des mécanismes réactionnels"
      ],
      biology: [
        "Révision de l'organisation du vivant",
        "Compréhension des processus biologiques",
        "Étude des mécanismes cellulaires",
        "Maîtrise des cycles biologiques",
        "Travail sur la génétique",
        "Analyse des systèmes physiologiques",
        "Perfectionnement de l'écologie",
        "Développement de l'observation scientifique"
      ]
    };

    const activities = baseActivities[subject];
    const selectedActivities: string[] = [];

    // Sélectionner les activités en fonction du nombre d'heures
    const numActivities = Math.min(Math.max(3, Math.ceil(hours / 3)), activities.length);
    
    // Prioriser les activités de base si le pourcentage est faible
    if (percentage < 50) {
      selectedActivities.push(...activities.slice(0, numActivities));
    } else if (percentage < 75) {
      // Mélange d'activités de base et avancées
      const baseCount = Math.ceil(numActivities * 0.6);
      const advancedCount = numActivities - baseCount;
      selectedActivities.push(...activities.slice(0, baseCount));
      selectedActivities.push(...activities.slice(-advancedCount));
    } else {
      // Focus sur les activités avancées
      selectedActivities.push(...activities.slice(-numActivities));
    }

    // Ajouter des activités spécifiques aux faiblesses détectées
    if (weakTopics.length > 0) {
      selectedActivities.unshift(`Focus spécial sur : ${weakTopics.slice(0, 2).join(', ')}`);
    }

    return selectedActivities;
  };

  const calculateResults = (): TestResults => {
    const allQuestions = getAllQuestions();
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    
    const subjectResults: Record<SubjectType, SubjectResult> = {
      math: { total: 0, correct: 0, percentage: 0, weakTopics: [], allocatedHours: 0, studyPlan: [] },
      physics: { total: 0, correct: 0, percentage: 0, weakTopics: [], allocatedHours: 0, studyPlan: [] },
      chemistry: { total: 0, correct: 0, percentage: 0, weakTopics: [], allocatedHours: 0, studyPlan: [] },
      biology: { total: 0, correct: 0, percentage: 0, weakTopics: [], allocatedHours: 0, studyPlan: [] },
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
    
    // Calculate overall performance
    const overallPercentage = (totalCorrect / totalQuestions) * 100;
    
    // Determine total study hours based on overall performance
    const totalStudyHours = getTotalStudyHours(overallPercentage);
    
    // Get subject performances for allocation
    const subjectPerformances: Record<SubjectType, number> = {
      math: subjectResults.math.percentage,
      physics: subjectResults.physics.percentage,
      chemistry: subjectResults.chemistry.percentage,
      biology: subjectResults.biology.percentage,
    };
    
    // Allocate hours between subjects
    const hourAllocation = allocateStudyHours(subjectPerformances, totalStudyHours);
    
    // Generate study plans for each subject
    subjects.forEach(subject => {
      const allocatedHours = hourAllocation[subject];
      subjectResults[subject].allocatedHours = allocatedHours;
      subjectResults[subject].studyPlan = generateStudyPlan(
        subject, 
        allocatedHours, 
        subjectResults[subject].weakTopics,
        subjectResults[subject].percentage
      );
    });
    
    // Generate personalized recommendations in French
    const recommendations: string[] = [];
    
    // Overall recommendations
    if (overallPercentage < 40) {
      recommendations.push(`Votre performance globale (${overallPercentage.toFixed(1)}%) nécessite une préparation intensive de ${totalStudyHours} heures. Concentrez-vous d'abord sur les bases avant d'aborder les concepts avancés.`);
    } else if (overallPercentage < 70) {
      recommendations.push(`Avec ${overallPercentage.toFixed(1)}% de réussite, un plan de ${totalStudyHours} heures vous permettra de consolider vos acquis et d'améliorer vos points faibles.`);
    } else {
      recommendations.push(`Excellente performance (${overallPercentage.toFixed(1)}%) ! Un programme ciblé de ${totalStudyHours} heures suffira pour optimiser votre préparation.`);
    }
    
    // Subject-specific recommendations
    const sortedSubjects = subjects.sort((a, b) => subjectResults[a].percentage - subjectResults[b].percentage);
    const weakestSubject = sortedSubjects[0];
    const strongestSubject = sortedSubjects[sortedSubjects.length - 1];
    
    const subjectNames = {
      math: 'mathématiques',
      physics: 'physique',
      chemistry: 'chimie',
      biology: 'biologie'
    };
    
    recommendations.push(`Votre point faible principal est en ${subjectNames[weakestSubject]} (${subjectResults[weakestSubject].percentage.toFixed(1)}%) - nous avons alloué ${hourAllocation[weakestSubject]} heures pour cette matière.`);
    
    if (subjectResults[strongestSubject].percentage > 80) {
      recommendations.push(`Vous excellez en ${subjectNames[strongestSubject]} (${subjectResults[strongestSubject].percentage.toFixed(1)}%) - seulement ${hourAllocation[strongestSubject]} heures sont nécessaires pour maintenir ce niveau.`);
    }
    
    // Time distribution recommendation
    const hoursDistribution = subjects.map(subject => 
      `${subjectNames[subject]}: ${hourAllocation[subject]}h`
    ).join(', ');
    recommendations.push(`Répartition recommandée du temps d'étude : ${hoursDistribution}.`);
    
    return {
      overall: {
        total: totalQuestions,
        correct: totalCorrect,
        percentage: overallPercentage,
      },
      subjects: subjectResults,
      totalStudyHours,
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