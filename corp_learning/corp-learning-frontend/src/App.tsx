import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ModuleDetail from './ModuleDetail';
import Leaderboard from './Leaderboard';
import MyStats from './MyStats';
import Sidebar from './Sidebar';

export interface User {
  username: string;
  email: string;
  division?: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: '60px' }}>
        <Routes>
          <Route path="/" element={user ? <Dashboard user={user} /> : <Login setUser={setUser} />} />
          <Route path="/module/:moduleId" element={<ModuleDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/mystats" element={<MyStats />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;