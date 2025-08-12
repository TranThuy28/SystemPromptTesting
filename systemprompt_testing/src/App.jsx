import React, { useState } from 'react';

// Import CSS toàn cục
import './index.css';

// Import các components
import Header from './components/Header';

// Import các pages
import SystemPromptTester from './pages/SystemPromptTester';
import ModelBattle from './pages/ModelBattle';
import GroundTruthComparer from './pages/GroundTruthComparer';

function App() {
  // Logic routing đơn giản dựa trên state
  const getInitialPage = () => {
      const hash = window.location.hash.replace('#', '');
      if (['tester', 'battle', 'comparer'].includes(hash)) {
          return hash;
      }
      return 'tester'; // Trang mặc định
  }

  const [currentPage, setCurrentPage] = useState(getInitialPage());

  // Hàm để render page component tương ứng
  const renderPage = () => {
    switch (currentPage) {
      case 'battle':
        return <ModelBattle />;
      case 'comparer':
        return <GroundTruthComparer />;
      case 'tester':
      default:
        return <SystemPromptTester />;
    }
  };

  return (
    <div className="app-container">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
