import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Calculator, Atom, FlaskRound as Flask, Microscope, Download, Award, BookOpen, Brain, ChevronRight, Clock, Target, TrendingUp } from 'lucide-react';
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
        label: 'Score en Pourcentage',
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
  
  // Generate and download PDF with academic design
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Colors for academic design
      const primaryBlue = [30, 58, 138];
      const lightBlue = [219, 234, 254];
      const darkGray = [55, 65, 81];
      const lightGray = [243, 244, 246];
      
      // Header with academic design
      doc.setFillColor(...primaryBlue);
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      // IAAI Logo area
      doc.setFillColor(255, 255, 255);
      doc.rect(15, 8, 25, 19, 'F');
      doc.setTextColor(...primaryBlue);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('IAAI', 27.5, 20, { align: 'center' });
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('RAPPORT DE DIAGNOSTIC ACADÉMIQUE', pageWidth/2, 18, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Test d\'Évaluation des Compétences Post-Baccalauréat', pageWidth/2, 26, { align: 'center' });
      
      // Student information section
      doc.setFillColor(...lightBlue);
      doc.rect(15, 45, pageWidth - 30, 25, 'F');
      doc.setDrawColor(...primaryBlue);
      doc.rect(15, 45, pageWidth - 30, 25, 'S');
      
      doc.setTextColor(...darkGray);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('INFORMATIONS DE L\'ÉTUDIANT', 20, 55);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Nom de l'étudiant : ${userName}`, 20, 62);
      doc.text(`Date d'évaluation : ${new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 20, 67);
      
      // Overall performance section
      let currentY = 85;
      doc.setFillColor(...primaryBlue);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PERFORMANCE GLOBALE', 20, currentY + 5);
      
      currentY += 15;
      doc.setTextColor(...darkGray);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      // Performance metrics in a structured layout
      const performanceData = [
        ['Total des Questions', results.overall.total.toString()],
        ['Réponses Correctes', results.overall.correct.toString()],
        ['Score Global', `${results.overall.percentage.toFixed(1)}%`],
        ['Niveau de Performance', results.overall.percentage >= 80 ? 'Excellent' : 
                                 results.overall.percentage >= 65 ? 'Bien' : 
                                 results.overall.percentage >= 50 ? 'Moyen' : 'À Améliorer']
      ];
      
      (doc as any).autoTable({
        startY: currentY,
        body: performanceData,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 60 },
          1: { cellWidth: 40, halign: 'center' },
        },
        margin: { left: 20, right: 20 },
      });
      
      // Subject performance table
      currentY = (doc as any).lastAutoTable.finalY + 20;
      
      doc.setFillColor(...primaryBlue);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('ANALYSE DÉTAILLÉE PAR MATIÈRE', 20, currentY + 5);
      
      currentY += 15;
      
      const subjectTableData = Object.entries(results.subjects).map(([subject, data]) => [
        subjectInfo[subject as SubjectType].title,
        `${data.correct}/${data.total}`,
        `${data.percentage.toFixed(1)}%`,
        `${data.recommendedHours}h`,
        data.weakTopics.length > 0 ? data.weakTopics.slice(0, 2).join(', ') + (data.weakTopics.length > 2 ? '...' : '') : 'Aucune'
      ]);
      
      (doc as any).autoTable({
        startY: currentY,
        head: [['Matière', 'Score', 'Pourcentage', 'Préparation', 'Domaines à Améliorer']],
        body: subjectTableData,
        theme: 'striped',
        headStyles: {
          fillColor: primaryBlue,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        columnStyles: {
          0: { cellWidth: 35, fontStyle: 'bold' },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
          4: { cellWidth: 80 },
        },
        margin: { left: 20, right: 20 },
      });
      
      // Study plans section
      currentY = (doc as any).lastAutoTable.finalY + 20;
      
      if (currentY > pageHeight - 50) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFillColor(...primaryBlue);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PLANS DE PRÉPARATION PERSONNALISÉS', 20, currentY + 5);
      
      currentY += 20;
      
      Object.entries(results.subjects).forEach(([subject, data]) => {
        if (currentY > pageHeight - 60) {
          doc.addPage();
          currentY = 20;
        }
        
        // Subject header
        doc.setFillColor(...lightGray);
        doc.rect(15, currentY, pageWidth - 30, 12, 'F');
        doc.setDrawColor(...primaryBlue);
        doc.rect(15, currentY, pageWidth - 30, 12, 'S');
        
        doc.setTextColor(...primaryBlue);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(`${subjectInfo[subject as SubjectType].title} - Plan de ${data.recommendedHours} heures`, 20, currentY + 7);
        
        currentY += 18;
        
        // Study plan items
        doc.setTextColor(...darkGray);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        
        data.studyPlan.forEach((item, index) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
          
          const wrappedText = doc.splitTextToSize(`${index + 1}. ${item}`, pageWidth - 50);
          doc.text(wrappedText, 25, currentY);
          currentY += wrappedText.length * 4 + 2;
        });
        
        currentY += 8;
      });
      
      // Recommendations section
      if (currentY > pageHeight - 80) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFillColor(...primaryBlue);
      doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('RECOMMANDATIONS PÉDAGOGIQUES', 20, currentY + 5);
      
      currentY += 20;
      
      doc.setTextColor(...darkGray);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      
      results.recommendations.forEach((recommendation, index) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 20;
        }
        
        const wrappedText = doc.splitTextToSize(`• ${recommendation}`, pageWidth - 40);
        doc.text(wrappedText, 20, currentY);
        currentY += wrappedText.length * 5 + 3;
      });
      
      // Footer on all pages
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(...primaryBlue);
        doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
        
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(...darkGray);
        doc.text(
          'Institut IAAI - Centre d\'Excellence Académique',
          20,
          pageHeight - 12
        );
        doc.text(
          `Page ${i} sur ${pageCount}`,
          pageWidth - 20,
          pageHeight - 12,
          { align: 'right' }
        );
        
        // Date in footer
        doc.text(
          `Généré le ${new Date().toLocaleDateString('fr-FR')}`,
          pageWidth/2,
          pageHeight - 12,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`IAAI_Diagnostic_${userName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      setShowDownloadMessage(true);
      
      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowDownloadMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
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
    if (percentage >= 65) return { label: 'Bien', color: 'text-blue-500' };
    if (percentage >= 50) return { label: 'Moyen', color: 'text-amber-500' };
    return { label: 'À Améliorer', color: 'text-red-500' };
  };

  // Get color for recommended hours
  const getHoursColor = (hours: number) => {
    switch (hours) {
      case 10: return 'bg-green-100 text-green-800 border-green-200';
      case 20: return 'bg-blue-100 text-blue-800 border-blue-200';
      case 30: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 50: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Download notification */}
      {showDownloadMessage && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>PDF téléchargé avec succès !</p>
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
              Vos Résultats du Test Diagnostique
            </h1>
            <p className="text-gray-600">
              Bonjour {userName}, voici une analyse détaillée de votre performance.
            </p>
          </div>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isLoading}
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-primary-700 hover:bg-primary-800 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Génération du PDF...</span>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Télécharger le Rapport</span>
              </>
            )}
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Score Global</h3>
            </div>
            <p className="text-3xl font-bold text-primary-700">{results.overall.percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-500">
              {results.overall.correct} correctes sur {results.overall.total} questions
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Meilleure Matière</h3>
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
                    <p className="text-sm text-gray-500">{bestSubject.percentage.toFixed(1)}% de réussite</p>
                  </>
                );
              }
              return <p>Aucune donnée disponible</p>;
            })()}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold">Niveau de Performance</h3>
            </div>
            {(() => {
              const { label, color } = getPerformanceLevel(results.overall.percentage);
              return (
                <>
                  <p className={`text-2xl font-bold ${color}`}>{label}</p>
                  <p className="text-sm text-gray-500">Basé sur votre performance globale</p>
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
          <h2 className="font-heading text-xl font-semibold mb-6">Performance Globale</h2>
          <div className="h-64" ref={overallChartRef}>
            <Doughnut data={overallChartData} options={doughnutOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-semibold">
              Vous avez obtenu {results.overall.percentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">
              {results.overall.correct} correctes sur {results.overall.total} questions
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
          <h2 className="font-heading text-xl font-semibold mb-6">Performance par Matière</h2>
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
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-6">Analyse Détaillée par Matière</h2>
        
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
                      <p className="text-sm text-gray-500">Pourcentage</p>
                      <p className="font-semibold">{data.percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Niveau</p>
                      <p className={`font-semibold ${color}`}>{label}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Préparation</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getHoursColor(data.recommendedHours)}`}>
                        <Clock className="w-4 h-4 mr-1" />
                        {data.recommendedHours}h
                      </span>
                    </div>
                  </div>
                </div>
                
                {data.weakTopics.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Domaines à améliorer :</p>
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
      
      {/* Study Plans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-primary-600" />
          Plans de Préparation Personnalisés
        </h2>
        
        <div className="space-y-8">
          {Object.entries(results.subjects).map(([subject, data]) => {
            const subjectType = subject as SubjectType;
            
            return (
              <div key={subject} className={`border-l-4 border-${subjectType} p-6 bg-gray-50 rounded-r-lg`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full bg-${subjectType} flex items-center justify-center`}>
                      {getSubjectIcon(subject)}
                    </div>
                    <h3 className="font-heading text-lg font-semibold">{subjectInfo[subjectType].title}</h3>
                  </div>
                  
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getHoursColor(data.recommendedHours)}`}>
                    <Clock className="w-4 h-4 mr-2" />
                    Plan de {data.recommendedHours} heures
                  </span>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-medium text-gray-800 mb-3">Programme de préparation recommandé :</h4>
                  <ul className="space-y-2">
                    {data.studyPlan.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <ChevronRight className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-6">Recommandations Personnalisées</h2>
        
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
        transition={{ delay: 0.6 }}
        className="bg-primary-900 text-white rounded-xl shadow-md p-6 md:p-8"
      >
        <h2 className="font-heading text-xl md:text-2xl font-semibold mb-4">Prochaines Étapes</h2>
        <p className="mb-6 text-gray-200">
          Utilisez ces informations pour améliorer votre préparation aux concours d'entrée post-baccalauréat marocains. Considérez les étapes suivantes :
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Suivre Votre Plan Personnalisé</h3>
            <p className="text-sm text-gray-200">
              Respectez les heures de préparation recommandées pour chaque matière selon votre niveau actuel.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Télécharger Votre Rapport</h3>
            <p className="text-sm text-gray-200">
              Sauvegardez vos résultats détaillés en PDF pour référence future et pour suivre vos progrès.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Chercher de l'Aide Supplémentaire</h3>
            <p className="text-sm text-gray-200">
              Considérez le tutorat ou des ressources supplémentaires pour les matières nécessitant plus de 30 heures de préparation.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Reprendre le Test Plus Tard</h3>
            <p className="text-sm text-gray-200">
              Après avoir suivi votre plan d'étude, revenez et reprenez le test pour mesurer vos progrès.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-200 mb-4">Merci d'avoir passé le Test Diagnostique IAAI !</p>
          <button
            onClick={() => navigate('/')}
            className="bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Retour à l'Accueil
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;