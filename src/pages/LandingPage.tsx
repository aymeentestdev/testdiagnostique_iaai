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
      setError('Please enter a valid name (at least 2 characters)');
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
                Discover Your Academic Strengths and Weaknesses
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8">
                Take our comprehensive diagnostic test designed for Moroccan post-baccalaureate entrance exams in Mathematics, Physics, Chemistry, and Biology.
              </p>
              
              <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-200 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent transition-all"
                    placeholder="Enter your name to start"
                  />
                  {error && <p className="text-red-300 mt-1 text-sm">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Start Diagnostic Test</span>
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Take Our Diagnostic Test?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Assess your readiness for Moroccan post-baccalaureate entrance exams with our comprehensive diagnostic test.
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
              <h3 className="font-heading text-xl font-semibold mb-2">Identify Strengths</h3>
              <p className="text-gray-600">Discover the subjects and topics where you excel to build confidence.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-physics rounded-full flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Target Weaknesses</h3>
              <p className="text-gray-600">Pinpoint areas that need improvement to focus your study efforts effectively.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-chemistry rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Exam Preparation</h3>
              <p className="text-gray-600">Get accustomed to the difficulty level and question style of actual entrance exams.</p>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-biology rounded-full flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">Personalized Advice</h3>
              <p className="text-gray-600">Receive tailored recommendations based on your test performance.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Subjects Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Test Subjects</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our diagnostic test covers four key subjects with challenging questions designed to match the level of Moroccan post-baccalaureate entrance exams.
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
                      <p className="text-sm text-gray-500">{info.numQuestions} challenging questions</p>
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
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Ready to Discover Your Academic Profile?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-3xl mx-auto">
            Start the diagnostic test now to identify your strengths and weaknesses. Get personalized recommendations to improve your chances of success in Moroccan post-baccalaureate entrance exams.
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
                placeholder="Enter your name to start"
              />
              {error && <p className="text-red-300 mt-1 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-primary-900 font-medium px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              <span>Begin Your Assessment</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;