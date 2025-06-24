import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Calculator, Atom, FlaskRound as Flask, Microscope, Download, Award, BookOpen, Brain, ChevronRight, Clock, Target, TrendingUp, PieChart } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  
  const results = calculateResults();
  const subjectInfo = getSubjectInfo();
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Chart data for time allocation (new)
  const timeAllocationData = {
    labels: Object.entries(results.subjects).map(([subject]) => subjectInfo[subject as SubjectType].title),
    datasets: [
      {
        data: Object.entries(results.subjects).map(([, data]) => data.allocatedHours),
        backgroundColor: [
          '#3B82F6', // Math - blue
          '#8B5CF6', // Physics - purple
          '#EC4899', // Chemistry - pink
          '#10B981', // Biology - green
        ],
        borderColor: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'],
        borderWidth: 2,
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

  const timeAllocationOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}h`,
        },
      },
    },
    cutout: '60%',
    maintainAspectRatio: false,
  };
  
  // Generate and download PDF with NEW minimalist academic design
  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // ------- Style tokens -------
      const primary = [33, 37, 41];      // Dark gray
      const accent = [25, 118, 210];     // Academic blue
      const light = [245, 245, 245];     // Light gray background for tables

      const lineGap = 18; // default line gap
      let y = 60; // cursor Y

      // ------- Header -------
      // Colored banner background
      const bannerHeight = 100;
      doc.setFillColor(...accent);
      doc.rect(0, 0, pageWidth, bannerHeight, 'F');

      // Institute name (white)
      doc.setFont('times', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text('Institut IAAI', 40, 45);

      // Subtitle
      doc.setFontSize(12);
      doc.text('Rapport de Diagnostic Académique', 40, 60);

      // Overall percentage badge on banner right
      const pct = results.overall.percentage.toFixed(1);
      const badgeRadius = 25;
      const badgeX = pageWidth - 60;
      const badgeY = bannerHeight / 2 + 5;
      doc.setFillColor(255, 255, 255);
      doc.circle(badgeX, badgeY, badgeRadius, 'F');
      doc.setFillColor(...accent);
      doc.setDrawColor(...accent);
      doc.setLineWidth(2);
      doc.circle(badgeX, badgeY, badgeRadius, 'S');
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...accent);
      doc.text(`${pct}%`, badgeX, badgeY + 5, { align: 'center' });

      // reset text color to primary for body
      doc.setTextColor(...primary);

      // Move cursor below banner
      y = bannerHeight + 30;

      // (Removed global thin divider to prevent double lines; dividers are now drawn per section)

      // ------- Étudiant -------
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text("Informations de l'étudiant", 40, y);
      y += 6;
      // divider just under title
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(40, y, pageWidth - 40, y);
      y += lineGap; // move to content start

      doc.setFont('times', 'normal');
      doc.setFontSize(11);
      doc.text(`Nom : ${userName}`, 40, y);
      y += lineGap;
      doc.text(
        `Date : ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
        40,
        y
      );
      y += lineGap * 1.5;

      // ------- Performance globale -------
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('Performance Globale', 40, y);
      y += 6;
      // divider just under title
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(40, y, pageWidth - 40, y);
      y += lineGap; // move to content start

      (doc as any).autoTable({
        startY: y,
        body: [
          ['Total Questions', results.overall.total],
          ['Réponses Correctes', results.overall.correct],
          ['Score (%)', `${results.overall.percentage.toFixed(1)} %`],
          ['Temps Préparation', `${results.totalStudyHours} h`],
        ],
        theme: 'plain',
        styles: { font: 'times', fontSize: 10, textColor: primary },
        columnStyles: { 0: { fontStyle: 'bold' } },
        margin: { left: 40, right: 40 },
      });
      y = (doc as any).lastAutoTable.finalY + lineGap * 1.5;

      // ------- Analyse par matière -------
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('Analyse par Matière', 40, y);
      y += 6;
      // divider just under title
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(40, y, pageWidth - 40, y);
      y += lineGap; // move to content start

      const subjectTableData = Object.entries(results.subjects).map(([subject, data]) => [
        subjectInfo[subject as SubjectType].title,
        `${data.correct}/${data.total}`,
        `${data.percentage.toFixed(1)} %`,
        `${data.allocatedHours} h`,
      ]);

      (doc as any).autoTable({
        startY: y,
        head: [['Matière', 'Score', '%', 'Heures allouées']],
        body: subjectTableData,
        headStyles: { fillColor: accent, textColor: 255, fontStyle: 'bold', fontSize: 10 },
        styles: {
          fillColor: light,
          textColor: primary,
          font: 'times',
          fontSize: 10,
        },
        alternateRowStyles: { fillColor: [255, 255, 255] },
        margin: { left: 40, right: 40 },
      });
      y = (doc as any).lastAutoTable.finalY + lineGap * 1.5;

      // ------- Plans de Préparation -------
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('Plans de Préparation', 40, y);
      y += 6;
      // divider just under title
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(40, y, pageWidth - 40, y);
      y += lineGap; // move to content start

      Object.entries(results.subjects).forEach(([subject, data]) => {
        doc.setFont('times', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...accent);
        doc.text(`${subjectInfo[subject as SubjectType].title} – ${data.allocatedHours} h`, 40, y);
        y += lineGap;

        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(...primary);
        const wrapped = doc.splitTextToSize(data.studyPlan.map((i, idx) => `${idx + 1}. ${i}`).join('\n'), pageWidth - 80);
        doc.text(wrapped, 60, y);
        y += wrapped.length * 12 + lineGap;

        if (y > pageHeight - 120) {
          doc.addPage();
          y = 60;
        }
      });

      // ------- Recommandations -------
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('Recommandations', 40, y);
      y += 6;
      // divider just under title
      doc.setDrawColor(...accent);
      doc.setLineWidth(1);
      doc.line(40, y, pageWidth - 40, y);
      y += lineGap; // move to content start

      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      const recText = results.recommendations.map(r => `• ${r}`).join('\n\n');
      doc.text(doc.splitTextToSize(recText, pageWidth - 80), 40, y);

      // ------- Footer (every page) -------
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        // footer accent line
        doc.setDrawColor(...accent);
        doc.setLineWidth(0.5);
        doc.line(40, pageHeight - 50, pageWidth - 40, pageHeight - 50);

        // footer texts
        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(...primary);
        doc.text('Institut IAAI – Centre d\'Excellence Académique', pageWidth / 2, pageHeight - 38, { align: 'center' });
        doc.text(`Page ${i}/${pageCount}`, pageWidth - 40, pageHeight - 38, { align: 'right' });
        doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 40, pageHeight - 38);
      }

      doc.save(`IAAI_Diagnostic_${userName.replace(/\s/g, '_')}.pdf`);
      setShowDownloadMessage(true);
      setTimeout(() => setShowDownloadMessage(false), 3000);
    } catch (err) {
      console.error('PDF error:', err);
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

  // Get color for allocated hours
  const getHoursColor = (hours: number) => {
    if (hours <= 5) return 'bg-green-100 text-green-800 border-green-200';
    if (hours <= 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (hours <= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-6xl">
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
        className="bg-white rounded-xl shadow-md p-4 md:p-8 mb-6 md:mb-8 border-t-4 border-primary-600"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="font-heading text-xl md:text-3xl font-bold text-gray-900 mb-2">
              Vos Résultats du Test Diagnostique
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Bonjour {userName}, voici une analyse détaillée de votre performance.
            </p>
          </div>
          
          {!isMobile && (
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
          )}
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-sm md:text-base">Score Global</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary-700">{results.overall.percentage.toFixed(1)}%</p>
            <p className="text-xs md:text-sm text-gray-500">
              {results.overall.correct} correctes sur {results.overall.total} questions
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-sm md:text-base">Temps Total</h3>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-primary-700">{results.totalStudyHours}h</p>
            <p className="text-xs md:text-sm text-gray-500">Préparation recommandée</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-sm md:text-base">Meilleure Matière</h3>
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
                      <p className="text-lg md:text-xl font-bold text-gray-800">
                        {subjectInfo[bestSubject.subject as SubjectType].title}
                      </p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{bestSubject.percentage.toFixed(1)}% de réussite</p>
                  </>
                );
              }
              return <p>Aucune donnée disponible</p>;
            })()}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-sm md:text-base">Niveau</h3>
            </div>
            {(() => {
              const { label, color } = getPerformanceLevel(results.overall.percentage);
              return (
                <>
                  <p className={`text-xl md:text-2xl font-bold ${color}`}>{label}</p>
                  <p className="text-xs md:text-sm text-gray-500">Performance globale</p>
                </>
              );
            })()}
          </div>
        </div>
      </motion.div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Overall performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Performance Globale</h2>
          <div className="h-48 md:h-64" ref={overallChartRef}>
            <Doughnut data={overallChartData} options={doughnutOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-base md:text-lg font-semibold">
              {results.overall.percentage.toFixed(1)}%
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              {results.overall.correct}/{results.overall.total} questions
            </p>
          </div>
        </motion.div>
        
        {/* Subject performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6">Performance par Matière</h2>
          <div className="h-48 md:h-64" ref={subjectsChartRef}>
            <Bar data={subjectsChartData} options={barOptions} />
          </div>
        </motion.div>

        {/* Time allocation chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-4 md:p-6"
        >
          <h2 className="font-heading text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Répartition du Temps
          </h2>
          <div className="h-48 md:h-64">
            <Doughnut data={timeAllocationData} options={timeAllocationOptions} />
          </div>
          <div className="mt-4 text-center">
            <p className="text-base md:text-lg font-semibold">
              {results.totalStudyHours}h au total
            </p>
            <p className="text-xs md:text-sm text-gray-600">
              Répartition intelligente
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Detailed subject analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-md p-4 md:p-8 mb-6 md:mb-8"
      >
        <h2 className="font-heading text-lg md:text-2xl font-semibold mb-4 md:mb-6">Analyse Détaillée par Matière</h2>
        
        <div className="space-y-4 md:space-y-6">
          {Object.entries(results.subjects).map(([subject, data]) => {
            const subjectType = subject as SubjectType;
            const { label, color } = getPerformanceLevel(data.percentage);
            
            return (
              <div key={subject} className={`border-l-4 border-${subjectType} p-4 bg-gray-50 rounded-r-lg`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-0">
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-${subjectType} flex items-center justify-center`}>
                      {getSubjectIcon(subject)}
                    </div>
                    <h3 className="font-heading text-base md:text-lg font-semibold">{subjectInfo[subjectType].title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-4 text-sm md:text-base">
                    <div>
                      <p className="text-xs text-gray-500">Score</p>
                      <p className="font-semibold">{data.correct}/{data.total}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pourcentage</p>
                      <p className="font-semibold">{data.percentage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Niveau</p>
                      <p className={`font-semibold ${color}`}>{label}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Temps Alloué</p>
                      <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getHoursColor(data.allocatedHours)}`}>
                        <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        {data.allocatedHours}h
                      </span>
                    </div>
                  </div>
                </div>
                
                {data.weakTopics.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs md:text-sm font-medium text-gray-700 mb-1">Domaines à améliorer :</p>
                    <ul className="list-disc list-inside text-xs md:text-sm text-gray-600 ml-2 space-y-1">
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
      
      {/* Study Plans - Hidden on mobile for better UX */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-6 md:mb-8"
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
                    
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${getHoursColor(data.allocatedHours)}`}>
                      <Clock className="w-4 h-4 mr-2" />
                      {data.allocatedHours} heures allouées
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
      )}
      
      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md p-4 md:p-8 mb-6 md:mb-8"
      >
        <h2 className="font-heading text-lg md:text-2xl font-semibold mb-4 md:mb-6">Recommandations Personnalisées</h2>
        
        <div className="space-y-3 md:space-y-4">
          {results.recommendations.map((recommendation, index) => (
            <div key={index} className="flex space-x-3 md:space-x-4 p-3 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 mt-1">
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
              </div>
              <p className="text-sm md:text-base text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Next steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-primary-900 text-white rounded-xl shadow-md p-4 md:p-8"
      >
        <h2 className="font-heading text-lg md:text-2xl font-semibold mb-4">Prochaines Étapes</h2>
        <p className="mb-6 text-gray-200 text-sm md:text-base">
          Utilisez ces informations pour améliorer votre préparation aux concours d'entrée post-baccalauréat marocains.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2 text-sm md:text-base">Suivre Votre Plan Personnalisé</h3>
            <p className="text-xs md:text-sm text-gray-200">
              Respectez la répartition de temps recommandée : {results.totalStudyHours}h au total.
            </p>
          </div>
          
          {!isMobile && (
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <h3 className="font-medium text-secondary-300 mb-2">Télécharger Votre Rapport</h3>
              <p className="text-sm text-gray-200">
                Sauvegardez vos résultats détaillés en PDF pour référence future.
              </p>
            </div>
          )}
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2 text-sm md:text-base">Prioriser les Faiblesses</h3>
            <p className="text-xs md:text-sm text-gray-200">
              Concentrez-vous d'abord sur les matières avec le plus d'heures allouées.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2 text-sm md:text-base">Reprendre le Test</h3>
            <p className="text-xs md:text-sm text-gray-200">
              Après votre préparation, revenez mesurer vos progrès.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-200 mb-4 text-sm md:text-base">Merci d'avoir passé le Test Diagnostique IAAI !</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isMobile && (
              <button
                onClick={handleDownloadPDF}
                disabled={isLoading}
                className="bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Génération...' : 'Télécharger le Rapport'}
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Retour à l'Accueil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsPage;