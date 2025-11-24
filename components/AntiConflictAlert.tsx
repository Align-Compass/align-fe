import React from 'react';

interface Props {
  message: string;
  onDismiss: () => void;
}

const AntiConflictAlert: React.FC<Props> = ({ message, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 p-4 rounded-r-lg shadow-sm mb-4 relative animate-fade-in-up">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-purple-700 font-medium">
            Modo Harmonia (IA)
          </p>
          <p className="text-sm text-gray-600 mt-1 italic">
            "{message}"
          </p>
        </div>
        <button onClick={onDismiss} className="ml-auto text-gray-400 hover:text-gray-600">
          <span className="sr-only">Fechar</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AntiConflictAlert;