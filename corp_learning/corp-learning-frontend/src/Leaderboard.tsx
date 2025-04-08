import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css';

interface LeaderboardEntry {
  username: string;  // New field from the updated serializer
  points: number;
  total_quiz_time: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get<LeaderboardEntry[]>("http://127.0.0.1:8000/api/leaderboard/", {
          withCredentials: true,
        });
        setLeaderboard(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Leaderboard</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Rank</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Username</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Points</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Total Quiz Time (s)</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={entry.username}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{index + 1}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.username}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.points}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{entry.total_quiz_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;