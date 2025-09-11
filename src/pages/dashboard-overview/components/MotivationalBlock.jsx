import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MotivationalBlock = () => {
  const [currentQuote, setCurrentQuote] = useState({});
  const [quoteIndex, setQuoteIndex] = useState(0);

  const motivationalQuotes = [
    {
      text: "One small step today grows a big tree tomorrow",
      emoji: "🌱",
      author: "TreeTask"
    },
    {
      text: "Progress, not perfection, is the goal",
      emoji: "📈",
      author: "TreeTask"
    },
    {
      text: "Every task completed waters your tree of success",
      emoji: "🌳",
      author: "TreeTask"
    },
    {
      text: "Focus on the process, and results will follow",
      emoji: "🎯",
      author: "TreeTask"
    },
    {
      text: "Small daily improvements lead to stunning results",
      emoji: "✨",
      author: "TreeTask"
    },
    {
      text: "Your potential grows with every completed task",
      emoji: "🚀",
      author: "TreeTask"
    },
    {
      text: "Consistency beats intensity in the long run",
      emoji: "⚡",
      author: "TreeTask"
    },
    {
      text: "Each task is a seed for your future success",
      emoji: "🌰",
      author: "TreeTask"
    },
    {
      text: "Great things never come from comfort zones",
      emoji: "💪",
      author: "TreeTask"
    },
    {
      text: "Today\'s productivity is tomorrow\'s opportunity",
      emoji: "🌅",
      author: "TreeTask"
    }
  ];

  // Initialize with a random quote
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes?.length);
    setQuoteIndex(randomIndex);
    setCurrentQuote(motivationalQuotes?.[randomIndex]);
  }, []);

  // Auto-rotate quotes every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (quoteIndex + 1) % motivationalQuotes?.length;
      setQuoteIndex(nextIndex);
      setCurrentQuote(motivationalQuotes?.[nextIndex]);
    }, 30000);

    return () => clearInterval(interval);
  }, [quoteIndex, motivationalQuotes]);

  const handleNextQuote = () => {
    const nextIndex = (quoteIndex + 1) % motivationalQuotes?.length;
    setQuoteIndex(nextIndex);
    setCurrentQuote(motivationalQuotes?.[nextIndex]);
  };

  const handlePrevQuote = () => {
    const prevIndex = quoteIndex === 0 ? motivationalQuotes?.length - 1 : quoteIndex - 1;
    setQuoteIndex(prevIndex);
    setCurrentQuote(motivationalQuotes?.[prevIndex]);
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 to-success/5 rounded-lg p-6 border border-border relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-success/5 rounded-full -ml-8 -mb-8" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Daily Motivation</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevQuote}
              className="p-1 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Previous quote"
            >
              <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleNextQuote}
              className="p-1 rounded-full hover:bg-muted/50 transition-colors"
              aria-label="Next quote"
            >
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="text-4xl mb-3" role="img" aria-label="Motivational emoji">
            {currentQuote?.emoji}
          </div>
          
          <blockquote className="text-foreground font-medium text-lg leading-relaxed">
            "{currentQuote?.text}"
          </blockquote>
          
          <cite className="text-sm text-muted-foreground">
            — {currentQuote?.author}
          </cite>

          {/* Progress dots */}
          <div className="flex justify-center space-x-1 pt-2">
            {motivationalQuotes?.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuoteIndex(index);
                  setCurrentQuote(motivationalQuotes?.[index]);
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === quoteIndex 
                    ? 'bg-primary' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to quote ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Refresh button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNextQuote}
            className="inline-flex items-center space-x-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/30"
          >
            <Icon name="RefreshCw" size={12} />
            <span>New inspiration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MotivationalBlock;