import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Atom, FlaskRound as Flask, Microscope, CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useTest } from '../context/TestContext';
import { SubjectType, QuestionType } from '../types';
import { getSubjectInfo } from '../data/questions';
import QuestionRenderer from '../components/QuestionRenderer';

const TestPage: React.FC = () => {
  const { 
    userName, 
    currentSubject, 
    setCurrentSubject, 
    userAnswers, 
    setUserAnswer,
    getSubjectQuestions,
    calculateResults
  } = useTest();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const subjectInfo = getSubjectInfo();
  
  // If no username, redirect to landing page
  useEffect(() => {
    if (!userName) {
      navigate('/');
    }
  }, [userName, navigate]);
  
  // Initialize with first subject if none selected
  useEffect(() => {
    if (!currentSubject) {
      setCurrentSubject('math');
      // 8 minutes per subject (480 seconds) - increased due to difficulty
      setTimeLeft(480);
    }
  }, [currentSubject, setCurrentSubject]);
  
  // Timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentSubject) {
      // Time's up for current subject
      handleNextSubject();
    }
  }, [timeLeft]);
  
  // Get current questions
  const questions = currentSubject ? getSubjectQuestions(currentSubject) : [];
  const currentQuestion = questions[currentQuestionIndex];
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1) {
      handleNextSubject();
    }
  };
  
  // Handle previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Handle next subject
  const handleNextSubject = () => {
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    const currentIndex = subjects.indexOf(currentSubject as SubjectType);
    
    if (currentIndex < subjects.length - 1) {
      // Move to next subject
      const nextSubject = subjects[currentIndex + 1];
      setCurrentSubject(nextSubject);
      setCurrentQuestionIndex(0);
      setTimeLeft(480); // Reset timer for new subject (8 minutes)
    } else {
      // All subjects completed
      setIsTestComplete(true);
    }
  };
  
  // Handle answer selection
  const handleSelectAnswer = (questionId: string, answer: string) => {
    setUserAnswer(questionId, answer);
  };
  
  // Submit test
  const handleSubmitTest = () => {
    // Calculate results and navigate to results page
    calculateResults();
    navigate('/results');
  };
  
  // Get progress percentage
  const getProgressPercentage = () => {
    if (!currentSubject) return 0;
    
    const subjects: SubjectType[] = ['math', 'physics', 'chemistry', 'biology'];
    const currentSubjectIndex = subjects.indexOf(currentSubject);
    const totalQuestions = subjects.reduce((acc, subject) => acc + getSubjectQuestions(subject).length, 0);
    
    let completedQuestions = 0;
    for (let i = 0; i < currentSubjectIndex; i++) {
      completedQuestions += getSubjectQuestions(subjects[i]).length;
    }
    completedQuestions += currentQuestionIndex;
    
    return (completedQuestions / totalQuestions) * 100;
  };
  
  // Get icon for current subject
  const getSubjectIcon = () => {
    if (!currentSubject) return null;
    
    switch (currentSubject) {
      case 'math':
        return <Calculator className="w-6 h-6 text-math" />;
      case 'physics':
        return <Atom className="w-6 h-6 text-physics" />;
      case 'chemistry':
        return <Flask className="w-6 h-6 text-chemistry" />;
      case 'biology':
        return <Microscope className="w-6 h-6 text-biology" />;
      default:
        return null;
    }
  };
  
  // Get color class for current subject
  const getSubjectColorClass = () => {
    if (!currentSubject) return 'bg-gray-200';
    
    switch (currentSubject) {
      case 'math':
        return 'bg-math';
      case 'physics':
        return 'bg-physics';
      case 'chemistry':
        return 'bg-chemistry';
      case 'biology':
        return 'bg-biology';
      default:
        return 'bg-gray-200';
    }
  };
  
  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    return currentQuestion && userAnswers[currentQuestion.id] ? true : false;
  };
  
  // Format option letter
  const formatOptionLetter = (letter: string) => {
    return letter.toUpperCase();
  };
  
  if (isTestComplete) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">Test Terminé !</h2>
            <p className="text-lg text-gray-600 mb-6">
              Vous avez terminé le test diagnostique dans toutes les matières.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-heading text-xl font-semibold mb-4">Résumé du Test</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['math', 'physics', 'chemistry', 'biology'].map((subject) => {
                  const subjectQuestions = getSubjectQuestions(subject as SubjectType);
                  const answeredCount = subjectQuestions.filter(q => userAnswers[q.id]).length;
                  
                  return (
                    <div key={subject} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <div className={`w-10 h-10 rounded-full bg-${subject} flex items-center justify-center`}>
                          {subject === 'math' && <Calculator className="w-5 h-5 text-white" />}
                          {subject === 'physics' && <Atom className="w-5 h-5 text-white" />}
                          {subject === 'chemistry' && <Flask className="w-5 h-5 text-white" />}
                          {subject === 'biology' && <Microscope className="w-5 h-5 text-white" />}
                        </div>
                      </div>
                      <p className="font-semibold">{subjectInfo[subject as SubjectType].title}</p>
                      <p className="text-sm text-gray-500">{answeredCount}/{subjectQuestions.length} répondues</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={handleSubmitTest}
              className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Voir Mes Résultats
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (!currentSubject || !currentQuestion) {
    return <div className="container mx-auto p-8 text-center">Chargement du test...</div>;
  }
  
  // Confirmation dialog for submitting test early
  const ConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl"
      >
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-center mb-4">Soumettre le Test Maintenant ?</h3>
        <p className="text-gray-600 mb-6 text-center">
          Vous n'avez pas terminé toutes les questions. Êtes-vous sûr de vouloir soumettre votre test ?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowConfirmation(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Continuer le Test
          </button>
          <button
            onClick={handleSubmitTest}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Soumettre Maintenant
          </button>
        </div>
      </motion.div>
    </div>
  );
  
  return (
    <>
      {showConfirmation && <ConfirmationDialog />}
      
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Progress bar and timer */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            {getSubjectIcon()}
            <span className="ml-2 font-medium text-lg">
              {subjectInfo[currentSubject].title}
            </span>
            <span className="ml-2 text-gray-500">
              Question {currentQuestionIndex + 1} sur {questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Temps Restant</div>
              <div className={`font-mono font-semibold text-lg ${timeLeft < 120 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <button
              onClick={() => setShowConfirmation(true)}
              className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Soumettre le Test
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full mb-8">
          <div
            className={`h-full ${getSubjectColorClass()} rounded-full transition-all duration-300`}
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        
        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-6 border-l-4 border-current"
            style={{ borderLeftColor: `var(--color-${currentSubject})` }}
          >
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-${currentSubject} bg-opacity-10 text-${currentSubject} mb-2`}>
                {currentQuestion.topic}
              </span>
            </div>
            
            <div className="mb-8">
              <QuestionRenderer 
                content={currentQuestion.question}
                className="text-xl md:text-2xl font-heading font-semibold leading-relaxed"
              />
            </div>
            
            <div className="space-y-4 mb-8">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  onClick={() => handleSelectAnswer(currentQuestion.id, key)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    userAnswers[currentQuestion.id] === key
                      ? `bg-${currentSubject} bg-opacity-10 border-${currentSubject} shadow-md`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 font-bold ${
                      userAnswers[currentQuestion.id] === key
                        ? `bg-${currentSubject} text-white`
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formatOptionLetter(key)}
                    </div>
                    <div className="pt-2 flex-1">
                      <QuestionRenderer content={value} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Précédent
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Difficulté</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-3 h-3 rounded-full ${
                        level <= 5 ? `bg-${currentSubject}` : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleNextQuestion}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg ${
                  isCurrentQuestionAnswered()
                    ? `bg-${currentSubject} text-white hover:opacity-90`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Suivant
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Matière Suivante
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Question navigation */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-medium text-lg mb-4">Navigation des Questions</h3>
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full h-12 rounded-md flex items-center justify-center font-medium transition-all ${
                  index === currentQuestionIndex
                    ? `bg-${currentSubject} text-white shadow-md`
                    : userAnswers[q.id]
                    ? `bg-${currentSubject} bg-opacity-20 text-${currentSubject} border-2 border-${currentSubject} border-opacity-30`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded bg-${currentSubject}`}></div>
              <span>Question actuelle</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded bg-${currentSubject} bg-opacity-20 border-2 border-${currentSubject} border-opacity-30`}></div>
              <span>Répondue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-gray-100"></div>
              <span>Non répondue</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;