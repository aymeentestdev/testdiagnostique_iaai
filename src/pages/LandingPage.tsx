import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, GraduationCap, Award, Zap, Calculator, Atom, FlaskRound as Flask, Microscope, ArrowRight } from 'lucide-react';
import { useTest } from '../context/TestContext';
import { getSubjectInfo } from '../data/questions';

const LandingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { setUserName } = useTest();
  const navigate = useNavigate();
  const subjectInfo = getSubjectInfo();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Veuillez entrer un nom valide (au moins 2 caractères)');
      return;
    }
    
    setUserName(name);
    navigate('/test');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
                Découvrez Vos Forces et Faiblesses Académiques
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Passez notre test diagnostique complet conçu pour les concours d'entrée post-baccalauréat marocains en Mathématiques, Physique, Chimie et Biologie.
              </p>
              
              <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-200 mb-2">Votre Nom</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all"
                    placeholder="Entrez votre nom pour commencer"
                  />
                  {error && <p className="text-red-300 mt-1 text-sm">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Commencer le Test Diagnostique</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-32 h-32 text-secondary-400" />
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-math rounded-full flex items-center justify-center shadow-lg">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-0 right-8 w-16 h-16 bg-physics rounded-full flex items-center justify-center shadow-lg">
                  <Atom className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-12 left-0 w-14 h-14 bg-chemistry rounded-full flex items-center justify-center shadow-lg">
                  <Flask className="w-7 h-7 text-white" />
                </div>
                <div className="absolute top-16 left-4 w-12 h-12 bg-biology rounded-full flex items-center justify-center shadow-lg">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi Passer Notre Test Diagnostique ?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Évaluez votre préparation aux concours d'entrée post-baccalauréat marocains avec notre test diagnostique complet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-math rounded-full flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Identifier les Forces</h3>
              <p className="text-gray-600">Découvrez les matières et sujets où vous excellez pour renforcer votre confiance.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-physics rounded-full flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Cibler les Faiblesses</h3>
              <p className="text-gray-600">Identifiez les domaines nécessitant une amélioration pour concentrer efficacement vos efforts d'étude.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-chemistry rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Préparation aux Concours</h3>
              <p className="text-gray-600">Familiarisez-vous avec le niveau de difficulté et le style des questions des vrais concours d'entrée.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-biology rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Conseils Personnalisés</h3>
              <p className="text-gray-600">Recevez des recommandations sur mesure basées sur votre performance au test.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Subjects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Matières du Test</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre test diagnostique couvre quatre matières clés avec des questions difficiles conçues pour correspondre au niveau des concours d'entrée post-baccalauréat marocains.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(subjectInfo).map(([key, info]) => {
              const Icon = {
                'Calculator': Calculator,
                'Atom': Atom,
                'Flask': Flask,
                'Microscope': Microscope
              }[info.icon];
              
              return (
                <motion.div 
                  key={key}
                  className={`bg-white p-6 rounded-xl shadow-md border-l-4 border-${info.color}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-${info.color} rounded-full flex items-center justify-center mr-4 flex-shrink-0`}>
                      {Icon && <Icon className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-semibold mb-2">{info.title}</h3>
                      <p className="text-gray-600 mb-3">{info.description}</p>
                      <p className="text-sm text-gray-500">{info.numQuestions} questions difficiles</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Prêt à Découvrir Votre Profil Académique ?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-3xl mx-auto">
            Commencez le test diagnostique maintenant pour identifier vos forces et faiblesses. Obtenez des recommandations personnalisées pour améliorer vos chances de réussite aux concours d'entrée post-baccalauréat marocains.
          </p>
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all"
                placeholder="Entrez votre nom pour commencer"
              />
              {error && <p className="text-red-300 mt-1 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <span>Commencer Votre Évaluation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;