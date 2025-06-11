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
  
  // Generate study plans based on performance
  const generateStudyPlans = () => {
    const plans: Record<SubjectType, { hours10: string[], hours20: string[], hours30: string[], hours50: string[] }> = {
      math: { hours10: [], hours20: [], hours30: [], hours50: [] },
      physics: { hours10: [], hours20: [], hours30: [], hours50: [] },
      chemistry: { hours10: [], hours20: [], hours30: [], hours50: [] },
      biology: { hours10: [], hours20: [], hours30: [], hours50: [] },
    };

    Object.entries(results.subjects).forEach(([subject, data]) => {
      const subjectType = subject as SubjectType;
      const percentage = data.percentage;
      
      if (percentage < 30) {
        // Very weak - intensive preparation needed
        plans[subjectType] = {
          hours10: [
            'Révision des concepts de base',
            'Exercices fondamentaux',
            'Fiches de formules essentielles'
          ],
          hours20: [
            'Approfondissement des bases',
            'Exercices d\'application',
            'Première série d\'annales',
            'Correction détaillée des erreurs'
          ],
          hours30: [
            'Consolidation des acquis',
            'Exercices de niveau intermédiaire',
            'Deuxième série d\'annales',
            'Travail sur les points faibles identifiés',
            'Révision générale'
          ],
          hours50: [
            'Maîtrise complète des bases',
            'Exercices avancés',
            'Trois séries d\'annales complètes',
            'Approfondissement des sujets difficiles',
            'Simulations d\'examens',
            'Révision intensive finale'
          ]
        };
      } else if (percentage < 50) {
        // Weak - significant improvement needed
        plans[subjectType] = {
          hours10: [
            'Révision ciblée des lacunes',
            'Exercices de renforcement',
            'Mémorisation des formules clés'
          ],
          hours20: [
            'Consolidation des bases',
            'Exercices d\'application variés',
            'Première série d\'annales',
            'Analyse des erreurs récurrentes'
          ],
          hours30: [
            'Approfondissement méthodique',
            'Exercices de niveau moyen à difficile',
            'Deux séries d\'annales',
            'Travail spécifique sur les faiblesses',
            'Révision structurée'
          ],
          hours50: [
            'Perfectionnement des connaissances',
            'Exercices complexes et variés',
            'Trois séries d\'annales complètes',
            'Maîtrise des sujets avancés',
            'Entraînement intensif',
            'Préparation finale optimisée'
          ]
        };
      } else if (percentage < 70) {
        // Average - moderate improvement needed
        plans[subjectType] = {
          hours10: [
            'Révision des points faibles',
            'Exercices ciblés',
            'Perfectionnement des méthodes'
          ],
          hours20: [
            'Approfondissement sélectif',
            'Exercices de niveau élevé',
            'Annales récentes',
            'Optimisation des stratégies'
          ],
          hours30: [
            'Perfectionnement avancé',
            'Exercices complexes',
            'Deux séries d\'annales complètes',
            'Maîtrise des subtilités',
            'Entraînement chronométré'
          ],
          hours50: [
            'Excellence dans tous les domaines',
            'Exercices de très haut niveau',
            'Trois séries d\'annales + sujets bonus',
            'Perfectionnement des techniques',
            'Préparation de compétition',
            'Révision d\'excellence'
          ]
        };
      } else {
        // Good - fine-tuning needed
        plans[subjectType] = {
          hours10: [
            'Perfectionnement des détails',
            'Exercices de haut niveau',
            'Révision rapide des formules'
          ],
          hours20: [
            'Optimisation des performances',
            'Exercices complexes',
            'Annales difficiles',
            'Perfectionnement de la rapidité'
          ],
          hours30: [
            'Excellence et précision',
            'Défis mathématiques avancés',
            'Annales de concours prestigieux',
            'Techniques d\'optimisation',
            'Préparation de l\'excellence'
          ],
          hours50: [
            'Maîtrise absolue',
            'Problèmes de recherche',
            'Concours internationaux',
            'Innovation méthodologique',
            'Préparation aux grandes écoles',
            'Perfectionnement ultime'
          ]
        };
      }
    });

    return plans;
  };

  const studyPlans = generateStudyPlans();
  
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
      doc.text('IAAI - Résultats du Test Diagnostique', 105, 15, { align: 'center' });
      
      // Add student info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text(`Étudiant : ${userName}`, 14, 40);
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 14, 48);
      
      // Add overall performance
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Performance Globale', 14, 65);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text(`Total des Questions : ${results.overall.total}`, 14, 75);
      doc.text(`Réponses Correctes : ${results.overall.correct}`, 14, 83);
      doc.text(`Score Global : ${results.overall.percentage.toFixed(1)}%`, 14, 91);
      
      // Add performance rating
      let performanceRating = '';
      
      if (results.overall.percentage >= 80) {
        performanceRating = 'Excellent';
      } else if (results.overall.percentage >= 65) {
        performanceRating = 'Bien';
      } else if (results.overall.percentage >= 50) {
        performanceRating = 'Moyen';
      } else {
        performanceRating = 'À Améliorer';
      }
      
      doc.setTextColor(0, 0, 0);
      doc.text('Niveau de Performance :', 14, 99);
      doc.setFont('helvetica', 'bold');
      doc.text(performanceRating, 75, 99);
      
      // Add subject performance table
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Performance par Matière', 14, 115);
      
      // Create table for subject performance
      const subjectTableData = Object.entries(results.subjects).map(([subject, data]) => [
        subjectInfo[subject as SubjectType].title,
        `${data.correct}/${data.total}`,
        `${data.percentage.toFixed(1)}%`,
        data.weakTopics.length > 0 ? data.weakTopics.join(', ') : 'Aucune',
      ]);
      
      (doc as any).autoTable({
        startY: 120,
        head: [['Matière', 'Score', 'Pourcentage', 'Domaines à Améliorer']],
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
      
      // Add study plans
      let currentY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Plans d\'Étude Personnalisés', 14, currentY);
      
      Object.entries(studyPlans).forEach(([subject, plans]) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(subjectInfo[subject as SubjectType].title, 14, currentY);
        
        // Add plans for different hour commitments
        const planTypes = [
          { key: 'hours10', title: '10h de préparation' },
          { key: 'hours20', title: '20h de préparation' },
          { key: 'hours30', title: '30h de préparation' },
          { key: 'hours50', title: '50h de préparation' }
        ];
        
        planTypes.forEach(planType => {
          if (currentY > 260) {
            doc.addPage();
            currentY = 20;
          }
          
          currentY += 8;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(`• ${planType.title} :`, 20, currentY);
          
          const planItems = plans[planType.key as keyof typeof plans];
          planItems.forEach((item, index) => {
            currentY += 5;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            const wrappedText = doc.splitTextToSize(`  - ${item}`, 170);
            doc.text(wrappedText, 25, currentY);
            currentY += (wrappedText.length - 1) * 4;
          });
        });
        
        currentY += 5;
      });
      
      // Add recommendations
      if (currentY > 220) {
        doc.addPage();
        currentY = 20;
      }
      
      currentY += 15;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Recommandations Personnalisées', 14, currentY);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      
      currentY += 10;
      results.recommendations.forEach((recommendation, index) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        
        const textLines = doc.splitTextToSize(`• ${recommendation}`, 180);
        doc.text(textLines, 14, currentY);
        currentY += 7 * textLines.length;
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Institut IAAI - Page ${i} sur ${pageCount}`,
          105,
          285,
          { align: 'center' }
        );
      }
      
      // Save the PDF
      doc.save(`IAAI_ResultatsDiagnostic_${userName.replace(/\s/g, '_')}.pdf`);
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
                <span>Télécharger les Résultats</span>
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
          Plans d'Étude Personnalisés
        </h2>
        
        <div className="space-y-8">
          {Object.entries(studyPlans).map(([subject, plans]) => {
            const subjectType = subject as SubjectType;
            
            return (
              <div key={subject} className={`border-l-4 border-${subjectType} p-6 bg-gray-50 rounded-r-lg`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 rounded-full bg-${subjectType} flex items-center justify-center`}>
                    {getSubjectIcon(subject)}
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{subjectInfo[subjectType].title}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'hours10', title: '10h', icon: Clock, color: 'bg-blue-100 text-blue-800' },
                    { key: 'hours20', title: '20h', icon: Clock, color: 'bg-green-100 text-green-800' },
                    { key: 'hours30', title: '30h', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
                    { key: 'hours50', title: '50h', icon: TrendingUp, color: 'bg-purple-100 text-purple-800' }
                  ].map(({ key, title, icon: Icon, color }) => (
                    <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${color}`}>
                        <Icon className="w-4 h-4 mr-1" />
                        {title} de préparation
                      </div>
                      <ul className="space-y-2 text-sm">
                        {plans[key as keyof typeof plans].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <ChevronRight className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
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
            <h3 className="font-medium text-secondary-300 mb-2">Réviser les Domaines Faibles</h3>
            <p className="text-sm text-gray-200">
              Concentrez votre temps d'étude sur les sujets où vous avez obtenu les scores les plus bas pour maximiser l'amélioration.
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
              Considérez le tutorat ou des ressources supplémentaires pour les matières nécessitant une amélioration significative.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <h3 className="font-medium text-secondary-300 mb-2">Reprendre le Test Plus Tard</h3>
            <p className="text-sm text-gray-200">
              Après avoir étudié, revenez et reprenez le test pour mesurer vos progrès.
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