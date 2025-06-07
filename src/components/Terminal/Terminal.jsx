import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal = ({ onCommand, history, currentInput, setCurrentInput }) => {
    const terminalRef = useRef(null);
    const inputRef = useRef(null);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInput.trim()) {
                onCommand(currentInput.trim());
                setHistoryIndex(-1);
                setCurrentInput('');
            }
            setSuggestions([]);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const commands = history.filter(h => h.type === 'input');
            const newIndex = Math.min(commands.length - 1, historyIndex + 1);
            if (newIndex >= 0 && commands.length > 0) {
                setHistoryIndex(newIndex);
                const command = commands[commands.length - 1 - newIndex].content.replace('user@cybertron:~$ ', '');
                setCurrentInput(command);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const commands = history.filter(h => h.type === 'input');
            const newIndex = Math.max(-1, historyIndex - 1);
            setHistoryIndex(newIndex);
            if (newIndex === -1) {
                setCurrentInput('');
            } else if (commands.length > 0) {
                const command = commands[commands.length - 1 - newIndex].content.replace('user@cybertron:~$ ', '');
                setCurrentInput(command);
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const availableCommands = Array.from(commandHandler.commands.keys());
            const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));
            if (matches.length === 1) {
                setCurrentInput(matches[0]);
            } else if (matches.length > 1) {
                setSuggestions(matches);
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center space-x-2">
                <TerminalIcon className="w-4 h-4" />
                <span className="text-sm text-gray-300">Terminal - user@cybertron</span>
            </div>

            <div
                ref={terminalRef}
                className="flex-1 p-4 overflow-y-auto bg-black text-green-400 font-mono text-sm scrollbar"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((entry, index) => (
                    <div key={index} className={`mb-1 ${entry.type === 'input' ? 'text-cyan-400' : 'text-green-400'}`}>
                        {entry.content}
                    </div>
                ))}

                <div className="flex items-center text-cyan-400">
                    <span className="mr-2">user@cybertron:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-green-400"
                        autoFocus
                    />
                </div>

                {suggestions.length > 0 && (
                    <div className="absolute bottom-16 left-0 bg-gray-800 p-2 rounded">
                        {suggestions.map(s => (
                            <div key={s} className="px-2 py-1 hover:bg-gray-700 cursor-pointer"
                                onClick={() => {
                                    setCurrentInput(s);
                                    setSuggestions([]);
                                }}>
                                {s}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;