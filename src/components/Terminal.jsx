import React, { useState, useEffect, useRef } from 'react';
import useTerminal from '../hooks/useTerminal';

const Terminal = () => {
  const [input, setInput] = useState('');
  const { output, processCommand, history, historyIndex, setHistoryIndex } = useTerminal();
  const endOfOutputRef = useRef(null);

  useEffect(() => {
    endOfOutputRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getLineClassName = (type) => {
    switch (type) {
      case 'command': return 'text-primary-amber';
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-400';
      default: return 'text-primary-green';
    }
  };

  return (
    <div className="bg-black text-primary-green font-mono p-4 h-[600px] border-2 border-primary-green/50 rounded-lg overflow-y-auto flex flex-col" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="flex-grow">
        {output.map((line, index) => (
          <div key={index} className={getLineClassName(line.type)}>
            {line.text}
          </div>
        ))}
        <div ref={endOfOutputRef} />
      </div>
      <div className="flex items-center">
        <span className="text-primary-amber mr-2">$</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          className="bg-transparent border-none text-primary-green w-full focus:outline-none"
          autoFocus
        />
        <div className="w-2 h-4 bg-primary-green animate-pulse ml-2"></div>
      </div>
    </div>
  );
};

export default Terminal;
