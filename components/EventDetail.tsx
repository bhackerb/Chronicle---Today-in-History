import React, { useEffect, useState } from 'react';
import { HistoricalEvent, EventDetailData } from '../types';
import { getEventDetails, generateEventImage } from '../services/geminiService';
import { ArrowLeft, ExternalLink, Youtube, BookOpen, Share2, Globe, Image as ImageIcon } from 'lucide-react';
import Loading from './Loading';

interface EventDetailProps {
  event: HistoricalEvent;
  onBack: () => void;
}

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack }) => {
  const [details, setDetails] = useState<EventDetailData | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch text details
        const data = await getEventDetails(event);
        if (isMounted) setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchImage = async () => {
        setImageLoading(true);
        try {
            const img = await generateEventImage(event);
            if (isMounted) setImageUrl(img);
        } catch (err) {
            console.error(err);
        } finally {
            if(isMounted) setImageLoading(false);
        }
    }

    fetchData();
    fetchImage();

    return () => { isMounted = false; };
  }, [event]);

  if (loading || !details) {
    return <Loading message="Consulting the archives..." fullScreen />;
  }

  const wikipediaUrl = `https://en.wikipedia.org/wiki/${details.wikipediaTopic}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(event.title + " history")}`;

  return (
    <div className="w-full min-h-screen bg-historical-900 text-historical-50 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-historical-900/95 backdrop-blur-md border-b border-historical-700 px-4 py-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-historical-100 hover:text-accent-gold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold hidden sm:inline">Back to Timeline</span>
        </button>
        <div className="text-center">
            <span className="font-serif text-accent-gold text-xl font-bold">{event.year}</span>
        </div>
        <div className="w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        
        {/* Title Section */}
        <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">
            {event.title}
            </h1>
            <div className="flex items-center justify-center space-x-4">
                <span className="px-3 py-1 bg-historical-800 rounded-full border border-historical-700 text-sm text-gray-300">
                    {event.category}
                </span>
            </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-video bg-historical-800 rounded-2xl overflow-hidden border border-historical-700 shadow-2xl mb-12 group">
           {imageLoading ? (
               <div className="absolute inset-0 flex items-center justify-center">
                   <Loading message="Painting scene..." />
               </div>
           ) : imageUrl ? (
             <>
                <img 
                    src={imageUrl} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-historical-900/80 via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 right-4 text-xs text-white/50 flex items-center bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    <ImageIcon className="w-3 h-3 mr-1"/> AI Generated
                </div>
             </>
           ) : (
               <div className="flex items-center justify-center h-full text-gray-500">
                   Image unavailable
               </div>
           )}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                <section>
                    <h2 className="text-2xl font-serif text-accent-gold mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2" /> Historical Account
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-300">
                        {details.summary}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-accent-gold mb-4">Key Insights</h2>
                    <ul className="space-y-3">
                        {details.bulletPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start">
                                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-accent-gold mt-2 mr-3"></span>
                                <span className="text-gray-300">{point}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Sidebar / Resources */}
            <div className="space-y-6">
                <div className="bg-historical-800/50 rounded-xl p-6 border border-historical-700">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-accent-gold" />
                        Explore Further
                    </h3>
                    
                    <div className="space-y-3">
                        <a 
                            href={wikipediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-historical-700/50 rounded-lg hover:bg-historical-700 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-white/20">
                                <span className="font-serif font-bold text-white">W</span>
                            </div>
                            <div className="flex-grow">
                                <div className="text-sm font-semibold text-white">Wikipedia Article</div>
                                <div className="text-xs text-gray-400">Read full entry</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                        </a>

                        <a 
                            href={youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 bg-historical-700/50 rounded-lg hover:bg-historical-700 transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center mr-3 group-hover:bg-red-600/30">
                                <Youtube className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="flex-grow">
                                <div className="text-sm font-semibold text-white">Watch Videos</div>
                                <div className="text-xs text-gray-400">Documentaries & Clips</div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
                        </a>
                    </div>
                </div>

                {details.relatedLinks.length > 0 && (
                     <div className="bg-historical-800/50 rounded-xl p-6 border border-historical-700">
                        <h3 className="text-lg font-bold text-white mb-4">Curated Sources</h3>
                        <ul className="space-y-3">
                            {details.relatedLinks.map((link, i) => (
                                <li key={i}>
                                    <a 
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-sm text-gray-400 hover:text-accent-gold transition-colors truncate"
                                    >
                                        <div className="font-medium text-gray-300 truncate mb-0.5">{link.title}</div>
                                        <div className="text-xs opacity-60 truncate">{new URL(link.url).hostname}</div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                     </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default EventDetail;
