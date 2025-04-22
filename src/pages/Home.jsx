import { useState } from 'react';
import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';

function Home() {
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <h1 className="text-3xl font-bold mb-2 text-surface-800 dark:text-surface-100">
          Your Smart Calculator
        </h1>
        <p className="text-surface-600 dark:text-surface-400">
          Perform calculations with style and precision
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative"
      >
        <MainFeature onCalculation={addToHistory} />
        
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-primary-dark dark:text-primary-light font-medium text-sm hover:underline"
            >
              {showHistory ? 'Hide History' : 'Show History'}
            </button>
            
            {history.length > 0 && showHistory && (
              <button 
                onClick={clearHistory}
                className="text-accent text-sm hover:underline"
              >
                Clear All
              </button>
            )}
          </div>
          
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card"
            >
              {history.length === 0 ? (
                <p className="text-center text-surface-500 py-2">No calculations yet</p>
              ) : (
                <ul className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {history.map((item, index) => (
                    <li 
                      key={index}
                      className="p-2 border-b border-surface-200 dark:border-surface-700 last:border-0"
                    >
                      <div className="text-sm text-surface-500 dark:text-surface-400">
                        {item.expression}
                      </div>
                      <div className="font-medium calculator-display">
                        = {item.result}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;