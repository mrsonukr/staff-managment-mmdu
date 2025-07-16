import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

const PasscodeScreen = ({ onAuthenticated }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  
  const correctPasscode = '123456';

  useEffect(() => {
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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Staff Management System</h1>
          <p className="text-blue-100">Enter passcode to continue</p>
        </div>

        <div className={`mb-8 ${shake ? 'animate-pulse' : ''}`}>
          <div className="flex justify-center space-x-4 mb-4">
            {renderDots()}
          </div>
          {error && (
            <p className="text-red-300 text-sm animate-pulse">{error}</p>
          )}
        </div>

        <div className="text-blue-100 text-sm space-y-2">
          <p>Use your keyboard to enter the passcode</p>
          <a 
            href="https://wa.me/917061543815" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs opacity-75 hover:opacity-100 underline cursor-pointer transition-opacity"
          >
            Contact Developer
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasscodeScreen;