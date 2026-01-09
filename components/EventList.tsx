import React from 'react';
import { HistoricalEvent } from '../types';
import { ChevronRight, Calendar, Bookmark } from 'lucide-react';

interface EventListProps {
  events: HistoricalEvent[];
  onSelectEvent: (event: HistoricalEvent) => void;
  dateStr: string;
}

const EventList: React.FC<EventListProps> = ({ events, onSelectEvent, dateStr }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'War': return 'bg-red-900/40 text-red-200 border-red-800';
      case 'Politics': return 'bg-blue-900/40 text-blue-200 border-blue-800';
      case 'Science': return 'bg-emerald-900/40 text-emerald-200 border-emerald-800';
      case 'Culture': return 'bg-purple-900/40 text-purple-200 border-purple-800';
      default: return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center space-x-2 text-accent-gold mb-4 uppercase tracking-widest text-sm font-bold">
          <Calendar className="w-4 h-4" />
          <span>Today in History</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-serif text-historical-50 mb-4">{dateStr}</h1>
        <p className="text-historical-100/60 max-w-xl mx-auto">
          Explore the defining moments that shaped our world on this very day.
        </p>
      </header>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div 
            key={`${event.year}-${index}`}
            onClick={() => onSelectEvent(event)}
            className="group relative bg-historical-800 border border-historical-700 hover:border-accent-gold/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="text-accent-gold" />
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-shrink-0 flex items-center">
                <span className="font-serif text-3xl font-bold text-accent-gold tabular-nums w-24">
                  {event.year}
                </span>
                <span className={`md:hidden ml-auto text-xs px-2 py-1 rounded border ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
              </div>
              
              <div className="flex-grow border-l border-historical-700 md:pl-8">
                <div className="hidden md:flex mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(event.category)} uppercase tracking-wider font-semibold`}>
                    {event.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-historical-50 mb-2 group-hover:text-accent-gold transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
