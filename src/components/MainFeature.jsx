import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Plus, Minus, Divide, Percent, 
  RotateCcw, Equal, ArrowLeft
} from 'lucide-react';

function MainFeature({ onCalculation }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [currentInput, setCurrentInput] = useState('');
  const [previousOperand, setPreviousOperand] = useState(null);
  const [operation, setOperation] = useState(null);
  const [isNewOperation, setIsNewOperation] = useState(true);
  const [calculationExpression, setCalculationExpression] = useState('');
  const [animateDisplay, setAnimateDisplay] = useState(false);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberInput(e.key);
      } else if (e.key === '.') {
        handleDecimalInput();
      } else if (e.key === '+') {
        handleOperationInput('+');
      } else if (e.key === '-') {
        handleOperationInput('-');
      } else if (e.key === '*') {
        handleOperationInput('×');
      } else if (e.key === '/') {
        handleOperationInput('÷');
      } else if (e.key === '%') {
        handlePercentage();
      } else if (e.key === 'Enter' || e.key === '=') {
        handleEquals();
      } else if (e.key === 'Escape') {
        handleClear();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentInput, previousOperand, operation, isNewOperation]);

  // Trigger display animation when value changes
  useEffect(() => {
    setAnimateDisplay(true);
    const timer = setTimeout(() => setAnimateDisplay(false), 150);
    return () => clearTimeout(timer);
  }, [displayValue]);

  const handleNumberInput = (num) => {
    if (isNewOperation) {
      setCurrentInput(num);
      setDisplayValue(num);
      setIsNewOperation(false);
    } else {
      // Prevent multiple leading zeros
      if (currentInput === '0' && num === '0') return;
      
      // Replace zero if it's the only digit
      if (currentInput === '0' && num !== '0') {
        setCurrentInput(num);
        setDisplayValue(num);
      } else {
        // Limit input length to prevent overflow
        if (currentInput.length < 12) {
          const newInput = currentInput + num;
          setCurrentInput(newInput);
          setDisplayValue(newInput);
        }
      }
    }
    
    // Update calculation expression
    if (operation && isNewOperation) {
      setCalculationExpression(previousOperand + ' ' + operation + ' ' + num);
    } else if (!operation) {
      setCalculationExpression(currentInput + num);
    }
  };

  const handleDecimalInput = () => {
    if (isNewOperation) {
      setCurrentInput('0.');
      setDisplayValue('0.');
      setIsNewOperation(false);
    } else if (!currentInput.includes('.')) {
      const newInput = currentInput + '.';
      setCurrentInput(newInput);
      setDisplayValue(newInput);
    }
  };

  const handleOperationInput = (op) => {
    if (currentInput) {
      if (previousOperand !== null) {
        // If we already have a previous operand, calculate the result first
        const result = calculate();
        setPreviousOperand(result);
        setDisplayValue(result.toString());
        setCalculationExpression(result + ' ' + op);
      } else {
        setPreviousOperand(parseFloat(currentInput));
        setCalculationExpression(currentInput + ' ' + op);
      }
      setOperation(op);
      setIsNewOperation(true);
    } else if (previousOperand !== null) {
      // Change operation if no new input yet
      setOperation(op);
      setCalculationExpression(previousOperand + ' ' + op);
    }
  };

  const handleEquals = () => {
    if (previousOperand !== null && operation && currentInput) {
      const result = calculate();
      const expression = `${previousOperand} ${operation} ${currentInput}`;
      
      // Add to history
      onCalculation({
        expression: expression,
        result: result
      });
      
      // Reset calculator state
      setDisplayValue(result.toString());
      setCurrentInput(result.toString());
      setPreviousOperand(null);
      setOperation(null);
      setIsNewOperation(true);
      setCalculationExpression(expression + ' = ' + result);
    }
  };

  const calculate = () => {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return '';
    
    let result;
    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return '';
    }
    
    // Format result to avoid floating point issues
    return parseFloat(result.toFixed(10)).toString();
  };

  const handleClear = () => {
    setDisplayValue('0');
    setCurrentInput('');
    setPreviousOperand(null);
    setOperation(null);
    setIsNewOperation(true);
    setCalculationExpression('');
  };

  const handleBackspace = () => {
    if (!isNewOperation && currentInput.length > 0) {
      const newInput = currentInput.slice(0, -1);
      setCurrentInput(newInput || '0');
      setDisplayValue(newInput || '0');
    }
  };

  const handlePercentage = () => {
    if (currentInput) {
      const result = parseFloat(currentInput) / 100;
      setCurrentInput(result.toString());
      setDisplayValue(result.toString());
    }
  };

  const handleToggleSign = () => {
    if (currentInput) {
      const result = parseFloat(currentInput) * -1;
      setCurrentInput(result.toString());
      setDisplayValue(result.toString());
    }
  };

  // Format display value for better readability
  const formatDisplayValue = (value) => {
    if (!value) return '0';
    
    // Handle potential scientific notation for very large/small numbers
    if (value.includes('e')) return value;
    
    const [intPart, decimalPart] = value.split('.');
    
    // Add thousand separators to integer part
    const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
    // Return formatted value
    return decimalPart !== undefined 
      ? `${formattedIntPart}.${decimalPart}` 
      : formattedIntPart;
  };

  return (
    <div className="bg-surface-100 dark:bg-surface-800 rounded-3xl overflow-hidden shadow-card dark:shadow-none border border-surface-200 dark:border-surface-700">
      {/* Calculator Display */}
      <div className="p-6 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-700">
        <div className="h-6 text-sm text-surface-500 dark:text-surface-400 mb-1 min-h-6 calculator-display">
          {calculationExpression}
        </div>
        <motion.div 
          animate={{ scale: animateDisplay ? 1.02 : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="text-3xl font-bold text-right calculator-display overflow-x-auto scrollbar-hide"
        >
          {formatDisplayValue(displayValue)}
        </motion.div>
      </div>
      
      {/* Calculator Keypad */}
      <div className="p-4 grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleClear}
          className="calculator-key-action h-16"
        >
          AC
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleSign}
          className="calculator-key-action h-16"
        >
          +/-
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handlePercentage}
          className="calculator-key-action h-16"
        >
          <Percent size={20} />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperationInput('÷')}
          className="calculator-key-operation h-16"
        >
          <Divide size={20} />
        </motion.button>
        
        {/* Row 2 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('7')}
          className="calculator-key-number h-16"
        >
          7
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('8')}
          className="calculator-key-number h-16"
        >
          8
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('9')}
          className="calculator-key-number h-16"
        >
          9
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperationInput('×')}
          className="calculator-key-operation h-16"
        >
          <X size={20} />
        </motion.button>
        
        {/* Row 3 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('4')}
          className="calculator-key-number h-16"
        >
          4
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('5')}
          className="calculator-key-number h-16"
        >
          5
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('6')}
          className="calculator-key-number h-16"
        >
          6
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperationInput('-')}
          className="calculator-key-operation h-16"
        >
          <Minus size={20} />
        </motion.button>
        
        {/* Row 4 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('1')}
          className="calculator-key-number h-16"
        >
          1
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('2')}
          className="calculator-key-number h-16"
        >
          2
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('3')}
          className="calculator-key-number h-16"
        >
          3
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleOperationInput('+')}
          className="calculator-key-operation h-16"
        >
          <Plus size={20} />
        </motion.button>
        
        {/* Row 5 */}
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleBackspace}
          className="calculator-key-number h-16"
        >
          <ArrowLeft size={20} />
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => handleNumberInput('0')}
          className="calculator-key-number h-16"
        >
          0
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleDecimalInput}
          className="calculator-key-number h-16"
        >
          .
        </motion.button>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={handleEquals}
          className="calculator-key-equals h-16"
        >
          <Equal size={20} />
        </motion.button>
      </div>
    </div>
  );
}

export default MainFeature;