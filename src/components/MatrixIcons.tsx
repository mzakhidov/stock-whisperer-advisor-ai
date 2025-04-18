
import React from 'react';
import { 
  TrendingUp, BarChart, LineChart, DollarSign, 
  Landmark, Layers, GanttChart, PieChart, 
  UserCheck, Newspaper 
} from 'lucide-react';

const MatrixIcons = () => {
  return (
    <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      <div className="matrix-container w-full h-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="matrix-icon-column absolute top-0"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          >
            {[
              TrendingUp, BarChart, LineChart, DollarSign,
              Landmark, Layers, GanttChart, PieChart,
              UserCheck, Newspaper
            ].map((Icon, index) => (
              <Icon
                key={index}
                className="text-white/20 mb-4"
                size={20 + Math.random() * 10}
                style={{
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: Math.random() * 0.5
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatrixIcons;
