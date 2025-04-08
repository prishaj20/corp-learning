import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyStats.css';

export interface Gamification {
  points: number;
  badges: string[];
  total_quiz_time: number;
}

const MyStats: React.FC = () => {
  const [stats, setStats] = useState<Gamification | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get<Gamification>("http://127.0.0.1:8000/api/gamification/", { withCredentials: true });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="mystats-container">
      <h2>My Stats</h2>
      {stats ? (
        <div className="stats-details">
          <p><strong>Points:</strong> {stats.points}</p>
          <p><strong>Badges:</strong> {stats.badges.length > 0 ? stats.badges.join(', ') : "None"}</p>
          <p><strong>Total Quiz Time:</strong> {stats.total_quiz_time} seconds</p>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
};

export default MyStats;