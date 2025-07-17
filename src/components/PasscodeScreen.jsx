import { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';

const PasscodeScreen = ({ onAuthenticated }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  
  const correctPasscode = '123456';

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPasscode(value);
    
    if (value.length === 6) {
      setTimeout(() => {
        if (value === correctPasscode) {
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
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      setError('');
    }
  };

  useEffect(() => {
    // Focus input on mount for mobile
    focusInput();
    
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        if (passcode.length < 6) {
          const newPasscode = passcode + e.key;
          setPasscode(newPasscode);
          
          if (newPasscode.length === 6) {
            setTimeout(() => {
              if (newPasscode === correctPasscode) {
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
            }, 100);
          }
        }
      } else if (e.key === 'Backspace') {
        setPasscode(prev => prev.slice(0, -1));
        setError('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [passcode, onAuthenticated]);

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

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="text-center text-white w-full max-w-sm">
        <div className="mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold mb-2">Staff Management System</h1>
          <p className="text-blue-100 text-sm sm:text-base">Enter passcode to continue</p>
        </div>

        {/* Hidden input for mobile keyboard */}
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={passcode}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 pointer-events-none"
          autoComplete="off"
          maxLength={6}
        />

        <div className={`mb-6 sm:mb-8 ${shake ? 'animate-pulse' : ''}`}>
          <div 
            className="flex justify-center space-x-3 sm:space-x-4 mb-4 cursor-pointer"
            onClick={focusInput}
          >
            {renderDots()}
          </div>
          {error && (
            <p className="text-red-300 text-sm sm:text-base animate-pulse">{error}</p>
          )}
        </div>

        <div className="text-blue-100 text-xs sm:text-sm space-y-2">
          <p className="sm:hidden">Tap the dots above to enter passcode</p>
          <p className="hidden sm:block">Use your keyboard to enter the passcode</p>
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