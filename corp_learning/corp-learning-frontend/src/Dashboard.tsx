import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export interface User {
  username: string;
  email: string;
  division?: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  content: string;
  difficulty: number;
  // You might eventually add a "completed" property or other fields
}

export interface Gamification {
  points: number;
  badges: string[];
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [modules, setModules] = useState<TrainingModule[]>([]);
  const [gamification, setGamification] = useState<Gamification | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await axios.get<TrainingModule[]>("http://127.0.0.1:8000/api/modules/", {
          withCredentials: true,
        });
        setModules(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchGamification = async () => {
      try {
        const res = await axios.get<Gamification>("http://127.0.0.1:8000/api/gamification/", {
          withCredentials: true,
        });
        setGamification(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchModules();
    fetchGamification();
  }, []);

  // Navigates to the module detail page, passing the module as state
  const openModule = (module: TrainingModule) => {
    navigate(`/module/${module.id}`, { state: { module } });
  };

  return (
    <div>
      <h1>Welcome, {user.username}</h1>

      {gamification && (
        <div className="gamification-stats">
          <h2>Gamification Stats</h2>
          <p>Points: {gamification.points}</p>
          <p>Badges: {gamification.badges.join(', ')}</p>
        </div>
      )}

      <div className="modules-grid">
        {modules.map((module) => (
          <div key={module.id} className="module-card" onClick={() => openModule(module)}>
            <img
              src={`images/${module.title.replace(/\s+/g, '_').toLowerCase()}.jpg`}
              alt={module.title}
              className="module-card-image"
            />
            <div className="module-card-content">
              <h3>{module.title}</h3>
              <p>{module.content.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;