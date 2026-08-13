import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Players from './pages/Players';
import CreateMatch from './pages/CreateMatch';
import MatchDetails from './pages/MatchDetails';
import LiveScoring from './pages/LiveScoring';
import Scorecard from './pages/Scorecard';
import AiSummary from './pages/AiSummary';
import NotFound from './pages/NotFound';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-wrapper">
          <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="content-area">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/players" element={<Players />} />
              <Route path="/matches/create" element={<CreateMatch />} />
              <Route path="/matches/:matchId" element={<MatchDetails />} />
              <Route path="/matches/:matchId/live" element={<LiveScoring />} />
              <Route path="/matches/:matchId/scorecard" element={<Scorecard />} />
              <Route path="/matches/:matchId/ai-summary" element={<AiSummary />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
