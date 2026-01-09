import React, { useState, useEffect } from 'react';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import Loading from './components/Loading';
import { getEventsForDate } from './services/geminiService';
import { HistoricalEvent } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [events, setEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const init = async () => {
      const now = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[now.getMonth()];
      const day = now.getDate();
      
      setCurrentDate(`${month} ${day}`);
      
      try {
        const fetchedEvents = await getEventsForDate(month, day);
        setEvents(fetchedEvents);
      } catch (e) {
        console.error("Failed to load events", e);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSelectEvent = (event: HistoricalEvent) => {
    setSelectedEvent(event);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('list');
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-historical-900 text-historical-50 flex items-center justify-center">
        <Loading message={`Consulting history books for ${currentDate}...`} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-historical-900 text-historical-50 font-sans selection:bg-accent-gold/30">
      {view === 'list' ? (
        <EventList 
          events={events} 
          onSelectEvent={handleSelectEvent} 
          dateStr={currentDate} 
        />
      ) : (
        selectedEvent && (
          <EventDetail 
            event={selectedEvent} 
            onBack={handleBack} 
          />
        )
      )}
      
      {/* Footer */}
      <footer className="py-8 text-center text-historical-100/30 text-xs border-t border-historical-800 mt-auto">
        <p>Chronicle - AI Powered History Explorer</p>
        <p className="mt-1">Powered by Google Gemini 2.5 & 3.0 Models</p>
      </footer>
    </div>
  );
};

export default App;
