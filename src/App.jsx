import React, { useState } from 'react';
import Terminal from './components/Terminal/Terminal';
import Header from './components/UI/Header';
import Sidebar from './components/Sidebar/Sidebar';
import CommandHandler from './components/Terminal/CommandHandler';
import useGameState from './hooks/useGameState';
import { createSecurityCommands } from './utils/commands/securityCommands';
import { createNetworkCommands } from './utils/commands/networkCommands';
import { createGameCommands } from './utils/commands/gameCommands';
import Notifications from './components/UI/Notifications';

function App() {
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const { gameState, ...gameActions } = useGameState();

  const commandHandler = new CommandHandler();


  const securityCommands = createSecurityCommands(gameState, gameActions);
  const networkCommands = createNetworkCommands(gameState, gameActions);
  const gameCommands = createGameCommands(gameState, gameActions);

  Object.entries(securityCommands).forEach(([name, handler]) => {
    commandHandler.registerCommand(name, handler);
  });

  Object.entries(networkCommands).forEach(([name, handler]) => {
    commandHandler.registerCommand(name, handler);
  });

  Object.entries(gameCommands).forEach(([name, handler]) => {
    commandHandler.registerCommand(name, handler);
  });

  const handleCommand = async (command) => {
    setCommandHistory(prev => [...prev, command]);
    setTerminalHistory(prev => [...prev, {
      type: 'input',
      content: `user@cybertron:~$ ${command}`
    }]);

    try {
      const result = await commandHandler.executeCommand(command, { gameState });

      if (result.notifications) {
        setNotifications(prev => [...prev, ...result.notifications]);
      }

      if (result.action === 'clear') {
        setTerminalHistory([]); 
      } else if (Array.isArray(result)) {
        setTerminalHistory(prev => [...prev, ...result.map(line => ({
          type: 'output',
          content: line
        }))]);
      }
    } catch (error) {
      setTerminalHistory(prev => [...prev, {
        type: 'error',
        content: `Error: ${error.message}`
      }]);
    }

    setCurrentInput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      <Header gameState={gameState} />
      <Notifications notifications={notifications} />
      <div className="flex h-[calc(100vh-80px)]">
        <Terminal
          onCommand={handleCommand}
          history={terminalHistory}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
        />
        <Sidebar gameState={gameState} onCommand={handleCommand} />
      </div>
    </div>
  );
}

export default App;