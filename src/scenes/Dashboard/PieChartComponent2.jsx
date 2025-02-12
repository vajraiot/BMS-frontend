import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';  // Import from recharts
import { Box, Typography } from '@mui/material';

const PieChartComponent2 = ({ data1, handlePieClickCommu }) => {
  const outerRadius = 85;  // Outer radius for the pie chart
  const innerRadius = 30;  // Inner radius for the donut effect
  const chartSize = 200;   // Chart size to ensure proper spacing

  return (
    <Box display="flex" justifyContent="center" alignItems="center" >
      <PieChart width={chartSize} height={chartSize}>
        <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="2"
              dy="2"
              stdDeviation="3"
              floodColor="rgba(0, 0, 0, 0.7)"
            />
          </filter>
          {/* Define Gradients */}
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0d900b" />
            <stop offset="50%" stopColor="#02DEB2" />
            <stop offset="100%" stopColor="#62B816" />
        </linearGradient>
          <linearGradient id="notcommuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e41c38" />
              <stop offset="100%" stopColor="#F71735" />
            </linearGradient>

        </defs>

        <Pie
          data={data1}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          paddingAngle= "5"
          cornerRadius= "5"
          outerRadius={outerRadius}  // Outer radius for the pie chart
          label
          onClick={handlePieClickCommu}
          style={{ filter: 'url(#shadow)' }}
        >
          {data1.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === 0 ? 'url(#greenGradient)' : 'url(#notcommuGradient)'}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Legend Section */}
      <Box ml={2} display="flex" flexDirection="column" justifyContent="center">
        {data1.map((entry, index) => (
          <Box key={index} display="flex" alignItems="center" mb={1}>
            <Box
              width={10}
              height={10}
              borderRadius="50%"
              mr={1}
              style={{
                background: `linear-gradient(to right, ${
                  index === 0 ? '#0d900b, #02DEB2,#62B816' : '#e41c38, #F71735'
                })`,
              }}
            />
            <Typography variant="body2" style={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PieChartComponent2;
