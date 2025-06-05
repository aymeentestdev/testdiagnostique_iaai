import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Calculator, Atom, FlaskRound as Flask, Microscope, Download, Award, BookOpen, Brain, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useTest } from '../context/TestContext';
import { SubjectType } from '../types';
import { getSubjectInfo } from '../data/questions';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ResultsPage: React.FC = () => {
  const { userName, userAnswers, calculateResults } = useTest();
  const navigate = useNavigate();
  const overallChartRef = useRef<HTMLDivElement>(null);
  const subjectsChartRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDownloadMessage, setShowDownloadMessage] = useState(false);
  
  const results = calculateResults();
  const subjectInfo = getSubjectInfo();
  
  // Redirect if no username or no answers
  useEffect(() => {
    if (!userName || Object.keys(userAnswers).length === 0) {
      navigate('/');
    }
  }, [userName, userAnswers, navigate]);
  
  // Chart data for overall performance
  const overallChartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [results.overall.correct, results.overall.total - results.overall.correct],
        backgroundColor: ['#10B981', '#EF4444'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };
  
  // Chart data for subject performance
  const subjectsChartData = {
    labels: Object.entries(results.subjects).map(([subject]) => subjectInfo[subject as SubjectType].title),
    datasets: [
      {
        label: 'Percentage Score',
        data: Object.entries(results.subjects).map(([, data]) => data.percentage),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // Math - blue
          'rgba(139, 92, 246, 0.7)', // Physics - purple
          'rgba(236, 72, 153, 0.7)', // Chemistry - pink
          'rgba(16, 185, 129, 0.7)', // Biology - green
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    cutout: '70%',
    maintainAspectRatio: false,
  };
  
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: string | number) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };
  
  // Generate and download PDF
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Add IAAI logo/header
      doc.setFillColor(30, 58, 138); // primary-900
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('IAAI Diagnostic Test Results', 105, 15, { align: 'center' });
      
      // Add student info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Student: ${userName}`, 14, 40);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);
      
      // Add overall performance
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Overall Performance', 14, 65);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Total Questions: ${results.overall.total}`, 14, 75);
      doc.text(`Correct Answers: ${results.overall.correct}`, 14, 83);
      doc.text(`Overall Score: ${results.overall.percentage.toFixed(1)}%`, 14, 91);
      
      // Add performance rating
      let performanceRating = '';
      let performanceColor = '';
      
      if (results.overall.percentage >= 80) {
        performanceRating = 'Excellent';
        performanceColor = 'rgb(16, 185, 129)'; // green
      } else if (results.overall.percentage >= 65) {
        performanceRating = 'Good';
        performanceColor = 'rgb(59, 130, 246)'; // blue
      } else if (results.overall.percentage >= 50) {
        performanceRating = 'Average';
        performanceColor = 'rgb(245, 158, 11)'; // amber
      } else {
        performanceRating = 'Needs Improvement';
        performanceColor = 'rgb(239, 68, 68)'; // red
      }
      
      doc.setTextColor(0, 0, 0);
      doc.text('Performance Rating:', 14, 99);
      doc.setTextColor(performanceColor);
      doc.setFont('helvetica', 'bold');
      doc.text(performanceRating, 65, 99);
      
      // Add subject performance table
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Subject Performance', 14, 115);
      
      // Create table for subject performance
      const subjectTableData = Object.entries(results.subjects).map(([subject, data]) => [
        subjectInfo[subject as SubjectType].title,
        `${data.correct}/${data.total}`,
        `${data.percentage.toFixed(1)}%`,
        data.weakTopics.length > 0 ? data.weakTopics.join(', ') : 'None',
      ]);
      
      (doc as any).autoTable({
        startY: 120,
        head: [['Subject', 'Score', 'Percentage', 'Areas for Improvement']],
        body: subjectTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [30, 58, 138],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        styles: {
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          3: { cellWidth: 80 },
        },
      });
      
      // Add recommendations
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Personalized Recommendations', 14, finalY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      let yPosition = finalY + 10;
      results.recommendations.forEach((recommendation, index) => {
        const textLines = doc.splitTextToSize(recommendation, 180);
        doc.text(textLines, 14, yPosition);
        yPosition += 7 * textLines.length;
        
        // Add a new page if we're running out of space
        if (yPosition > 270 && index < results.recommendations.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `IAAI Institute - Page ${i} of ${pageCount}`,
          105,
          285,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`IAAI_DiagnosticResults_${userName.replace(/\s/g, '_')}.pdf`);
      setShowDownloadMessage(true);
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowDownloadMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating PDF', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get icon for a subject
  const getSubjectIcon = (subject: string) => {
    switch (subject) {
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
  
  // Get performance level based on percentage
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'text-green-500' };
    if (percentage >= 65) return { label: 'Good', color: 'text-blue-500' };
    if (percentage >= 50) return { label: 'Average', color: 'text-amber-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      {/* Download notification */}
      {showDownloadMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2\" fill="none\" stroke="currentColor\" viewBox="0 0 24 24\" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth="2\" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>PDF successfully downloaded!</p>
          </div>
        </div>
      )}
      
      {/* Header section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 border-t-4 border-primary-600"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Your Diagnostic Test Results
            </h1>
            <p className="text-gray-600">
              Hello {userName}, here's a detailed breakdown of your performance.
            </p>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-primary-700 hover:bg-primary-800 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Generating PDF...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Results</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Overall Score</h3>
            </div>
            <p className="text-3xl font-bold text-primary-700">{results.overall.percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {results.overall.correct} correct out of {results.overall.total} questions
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Best Subject</h3>
            </div>
            {(() => {
              const subjects = Object.entries(results.subjects);
              const bestSubject = subjects.reduce((best, [subject, data]) => {
                return data.percentage > best.percentage ? { subject, percentage: data.percentage } : best;
              }, { subject: '', percentage: 0 });
              
              if (bestSubject.subject) {
                return (
                  <>
                    <div className="flex items-center space-x-2">
                      {getSubjectIcon(bestSubject.subject)}
                      <p className="text-xl font-bold text-gray-800">
                        {subjectInfo[bestSubject.subject as SubjectType].title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{bestSubject.percentage.toFixed(1)}% correct</p>
                  </>
                );
              }
              return <p>No data available</p>;
            })()}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Performance Rating</h3>
            </div>
            {(() => {
              const { label, color } = getPerformanceLevel(results.overall.percentage);
              return (
                <>
                  <p className={`text-2xl font-bold ${color}`}>{label}</p>
                  <p className="text-sm text-gray-500">Based on your overall performance</p>
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Overall performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="font-heading text-xl font-semibold mb-6">Overall Performance</h2>
          <div className="h-64" ref={overallChartRef}>
            <Doughnut data={overallChartData} options={doughnutOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              You scored {results.overall.percentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              {results.overall.correct} correct out of {results.overall.total} questions
            </p>
          </div>
        </motion.div>
        
        {/* Subject performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="font-heading text-xl font-semibold mb-6">Subject Performance</h2>
          <div className="h-64" ref={subjectsChartRef}>
            <Bar data={subjectsChartData} options={barOptions} />
          </div>
        </motion.div>
      </div>
      
      {/* Detailed subject analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-6">Detailed Subject Analysis</h2>
        
        <div className="space-y-6">
          {Object.entries(results.subjects).map(([subject, data]) => {
            const subjectType = subject as SubjectType;
            const { label, color } = getPerformanceLevel(data.percentage);
            
            return (
              <div key={subject} className={`border-l-4 border-${subjectType} p-4 bg-gray-50 rounded-r-lg`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-0">
                    <div className={`w-10 h-10 rounded-full bg-${subjectType} flex items-center justify-center`}>
                      {getSubjectIcon(subject)}
                    </div>
                    <h3 className="font-heading text-lg font-semibold">{subjectInfo[subjectType].title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="font-semibold">{data.correct}/{data.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Percentage</p>
                      <p className="font-semibold">{data.percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <p className={`font-semibold ${color}`}>{label}</p>
                    </div>
                  </div>
                </div>
                
                {data.weakTopics.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Areas for improvement:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 ml-2 space-y-1">
                      {data.weakTopics.map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-6">Personalized Recommendations</h2>
        
        <div className="space-y-4">
          {results.recommendations.map((recommendation, index) => (
            <div key={index} className="flex space-x-4 p-3 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 mt-1">
                <ChevronRight className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-primary-900 text-white rounded-xl shadow-md p-6 md:p-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-4">What's Next?</h2>
        <p className="mb-6 text-gray-200">
          Use these insights to improve your preparation for Moroccan post-baccalaureate entrance exams. Consider the following next steps:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Review Weak Areas</h3>
            <p className="text-sm text-gray-200">
              Focus your study time on the topics where you scored lowest to maximize improvement.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Download Your Report</h3>
            <p className="text-sm text-gray-200">
              Save your detailed results as a PDF for future reference and to track your progress.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Seek Additional Help</h3>
            <p className="text-sm text-gray-200">
              Consider tutoring or additional resources for subjects where you need significant improvement.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Retake the Test Later</h3>
            <p className="text-sm text-gray-200">
              After studying, come back and take the test again to measure your progress.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-200 mb-4">Thank you for completing the IAAI Diagnostic Test!</p>
          <button
            onClick={() => navigate('/')}
            className="bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;