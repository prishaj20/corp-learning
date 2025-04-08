import React from 'react';
import { Link } from 'react-router-dom';
import {FaChartLine, FaHome} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  // Cast FaHome to a React functional component.
  const HomeIcon: React.FC<any> = FaHome as React.FC<any>;
  const ChartLine: React.FC<any> = FaChartLine as React.FC<any>;

  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-home">
        <HomeIcon />
      </Link>
      <ul>
      <li>
      <Link to="/mystats" className="sidebar-link">
        <ChartLine style={{ marginRight: '8px' }} /> My Stats
      </Link>
        </li>
        <li>
          <Link to="/leaderboard" className="sidebar-link">
            Leaderboard
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;