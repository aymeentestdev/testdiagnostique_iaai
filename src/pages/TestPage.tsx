import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Atom, FlaskRound as Flask, Microscope, CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useTest } from '../context/TestContext';
import { SubjectType, QuestionType } from '../types';
import { getSubjectInfo } from '../data/questions';

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
      // 5 minutes per subject (300 seconds)
      setTimeLeft(300);
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
      setTimeLeft(300); // Reset timer for new subject
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
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-2">Test Completed!</h2>
            <p className="text-lg text-gray-600 mb-6">
              You've completed the diagnostic test across all subjects.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-heading text-xl font-semibold mb-4">Test Summary</h3>
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
                      <p className="text-sm text-gray-500">{answeredCount}/{subjectQuestions.length} answered</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <button
              onClick={handleSubmitTest}
              className="bg-primary-700 hover:bg-primary-800 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              View My Results
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
  
  if (!currentSubject || !currentQuestion) {
    return <div className="container mx-auto p-8 text-center">Loading test...</div>;
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
        <h3 className="text-xl font-bold text-center mb-4">Submit Test Early?</h3>
        <p className="text-gray-600 mb-6 text-center">
          You haven't completed all questions. Are you sure you want to submit your test?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowConfirmation(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Continue Test
          </button>
          <button
            onClick={handleSubmitTest}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Submit Now
          </button>
        </div>
      </motion.div>
    </div>
  );
  
  return (
    <>
      {showConfirmation && <ConfirmationDialog />}
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Progress bar and timer */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            {getSubjectIcon()}
            <span className="ml-2 font-medium text-lg">
              {subjectInfo[currentSubject].title}
            </span>
            <span className="ml-2 text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Time Remaining</div>
              <div className={`font-mono font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </div>
            </div>
            
            <button
              onClick={() => setShowConfirmation(true)}
              className="bg-primary-700 hover:bg-primary-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
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
            className="bg-white p-6 md:p-8 rounded-xl shadow-md mb-6"
          >
            <h2 className="text-xl md:text-2xl font-heading font-semibold mb-6">
              {currentQuestion.question}
            </h2>
            
            <div className="space-y-4 mb-8">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <div
                  key={key}
                  onClick={() => handleSelectAnswer(currentQuestion.id, key)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    userAnswers[currentQuestion.id] === key
                      ? `bg-${currentSubject}-100 border-${currentSubject} text-${currentSubject}-800`
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      userAnswers[currentQuestion.id] === key
                        ? `bg-${currentSubject} text-white`
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {formatOptionLetter(key)}
                    </div>
                    <div className="pt-1">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                className={`flex items-center px-5 py-2 rounded-lg ${
                  isCurrentQuestionAnswered()
                    ? `bg-${currentSubject} text-white hover:bg-${currentSubject}-600`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                ) : (
                  <>
                    Next Subject
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Question navigation */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-medium text-lg mb-4">Question Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full h-10 rounded-md flex items-center justify-center font-medium ${
                  index === currentQuestionIndex
                    ? `bg-${currentSubject} text-white`
                    : userAnswers[q.id]
                    ? `bg-${currentSubject}-100 text-${currentSubject}-800 border border-${currentSubject}-200`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestPage;