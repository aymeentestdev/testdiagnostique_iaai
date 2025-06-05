import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import Layout from './components/Layout';
import { TestProvider } from './context/TestContext';

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </Layout>
      </TestProvider>
    </BrowserRouter>
  );
}

export default App;