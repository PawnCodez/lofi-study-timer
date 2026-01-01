import React, { useState, useEffect } from 'react';
import { RefreshCw, Quote as QuoteIcon } from 'lucide-react';
import { Quote } from '../types';
import { QUOTE_API_URL, FALLBACK_QUOTES } from '../constants';

const QuoteCard: React.FC = () => {
  const [quote, setQuote] = useState<Quote>(FALLBACK_QUOTES[0]);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch(QUOTE_API_URL);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setQuote({ content: data.content, author: data.author });
    } catch (error) {
      console.warn("Using fallback quote", error);
      const randomFallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(randomFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-teal-900/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
            onClick={fetchQuote} 
            className={`text-gray-400 hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
        >
            <RefreshCw size={16} />
        </button>
      </div>
      
      <QuoteIcon className="absolute top-4 left-4 text-white/5 w-16 h-16 transform -rotate-12" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className={`text-lg font-medium text-gray-200 mb-3 italic transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          "{quote.content}"
        </p>
        <div className="w-8 h-1 bg-secondary/30 rounded-full mb-2"></div>
        <p className="text-sm text-gray-400 font-semibold tracking-wide uppercase">
          {quote.author}
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;