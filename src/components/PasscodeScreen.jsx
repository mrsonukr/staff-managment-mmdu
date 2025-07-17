import { useState, useEffect, useRef } from 'react';
import { Lock, Delete } from 'lucide-react';

const PasscodeScreen = ({ onAuthenticated }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  
  const correctPasscode = '123456';

  const checkPasscode = (code) => {
    if (code === correctPasscode) {
      onAuthenticated();
    } else {
      setError('Incorrect passcode');
      setShake(true);
      setPasscode('');
      setTimeout(() => {
        setError('');
        setShake(false);
      }, 1000);
    }
  };

  const handleNumberClick = (number) => {
    if (passcode.length < 6) {
      const newPasscode = passcode + number;
      setPasscode(newPasscode);
      setError('');
      
      if (newPasscode.length === 6) {
        setTimeout(() => checkPasscode(newPasscode), 100);
      }
    }
  };

  const handleBackspace = () => {
    setPasscode(prev => prev.slice(0, -1));
    setError('');
  };

  const handleClear = () => {
    setPasscode('');
    setError('');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for number keys and backspace
      if ((e.key >= '0' && e.key <= '9') || e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
      }

      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);
    
    // Focus the hidden input to ensure keyboard events are captured
    if (inputRef.current) {
      inputRef.current.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [passcode]);

  // Keep focus on the hidden input
  const maintainFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    // Maintain focus when component updates
    maintainFocus();
  }, [passcode, error]);

  const renderDots = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
          index < passcode.length
            ? 'bg-white border-white'
            : 'border-white border-opacity-50'
        }`}
      />
    ));
  };

  const NumberButton = ({ number, onClick }) => (
    <button
      onClick={() => onClick(number)}
      className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-semibold text-white transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {number}
    </button>
  );

  const ActionButton = ({ onClick, children, className = "" }) => (
    <button
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-10 hover:bg-opacity-20 active:bg-opacity-30 rounded-full flex items-center justify-center text-white transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${className}`}
      onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      {/* Hidden input to capture keyboard events */}
      <input
        ref={inputRef}
        type="text"
        inputMode="none"
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none"
        style={{ left: '-9999px' }}
        onBlur={maintainFocus}
      />
      
      <div className="text-center text-white w-full max-w-sm">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Staff Management System</h1>
          <p className="text-blue-100 text-sm sm:text-base">Enter passcode to continue</p>
        </div>

        <div className={`mb-6 sm:mb-8 ${shake ? 'animate-pulse' : ''}`}>
          <div className="flex justify-center space-x-3 sm:space-x-4 mb-4">
            {renderDots()}
          </div>
          {error && (
            <p className="text-red-300 text-sm sm:text-base animate-pulse">{error}</p>
          )}
        </div>

        {/* Number Pad */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-3 gap-4 sm:gap-6 justify-items-center max-w-xs mx-auto">
            {/* Row 1 */}
            <NumberButton number="1" onClick={handleNumberClick} />
            <NumberButton number="2" onClick={handleNumberClick} />
            <NumberButton number="3" onClick={handleNumberClick} />
            
            {/* Row 2 */}
            <NumberButton number="4" onClick={handleNumberClick} />
            <NumberButton number="5" onClick={handleNumberClick} />
            <NumberButton number="6" onClick={handleNumberClick} />
            
            {/* Row 3 */}
            <NumberButton number="7" onClick={handleNumberClick} />
            <NumberButton number="8" onClick={handleNumberClick} />
            <NumberButton number="9" onClick={handleNumberClick} />
            
            {/* Row 4 */}
            <ActionButton onClick={handleClear} className="text-sm sm:text-base">
              Clear
            </ActionButton>
            <NumberButton number="0" onClick={handleNumberClick} />
            <ActionButton onClick={handleBackspace}>
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
            </ActionButton>
          </div>
        </div>

        <div className="text-blue-100 text-xs sm:text-sm space-y-2">
          <p>Use the number pad above or your keyboard</p>
          <p className="text-xs opacity-75">Press ESC to clear • Backspace to delete</p>
          <a 
            href="https://wa.me/917061543815" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs opacity-75 hover:opacity-100 underline cursor-pointer transition-opacity block"
          >
            Contact Developer
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasscodeScreen;