import React, { createContext, useContext, useState } from 'react';

const FlightStatsContext = createContext();

export function FlightStatsProvider({ children }) {
  const [stats, setStats] = useState({
    totalFlights: 42,
    totalHours: 156,
  });

  const addFlight = (duration) => {
    setStats(prevStats => {
      const [hours, minutes] = duration.split(':').map(Number);
      const newHours = prevStats.totalHours + hours + (minutes / 60);
      return {
        totalFlights: prevStats.totalFlights + 1,
        totalHours: Math.round(newHours * 10) / 10, // Round to 1 decimal place
      };
    });
  };

  return (
    <FlightStatsContext.Provider value={{ stats, addFlight }}>
      {children}
    </FlightStatsContext.Provider>
  );
}

export function useFlightStats() {
  const context = useContext(FlightStatsContext);
  if (!context) {
    throw new Error('useFlightStats must be used within a FlightStatsProvider');
  }
  return context;
} 