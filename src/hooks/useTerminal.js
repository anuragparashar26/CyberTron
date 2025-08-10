import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import challenges from '../data/challenges.json';

const useTerminal = () => {
  const { user, profile, updateProfile } = useAuth();
  const [output, setOutput] = useState([
    { type: 'info', text: 'CyberTron Terminal v1.0. Type "help" for commands.' }
  ]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [activeChallenge, setActiveChallenge] = useState(null);

  const addOutput = (line) => {
    setOutput(prev => [...prev, line]);
  };

  const processCommand = async (command) => {
    const [cmd, ...args] = command.trim().split(' ');
    addOutput({ type: 'command', text: `$ ${command}` });
    setHistory(prev => [command, ...prev]);
    setHistoryIndex(-1);

    switch (cmd) {
      case 'help':
        const helpTopic = args[0];
        if (helpTopic) {
          switch(helpTopic) {
            case 'challenge':
              addOutput({ type: 'info', text: 'Usage: challenge <challenge_id>' });
              addOutput({ type: 'info', text: 'Starts a new challenge. To see available challenges, check the dashboard.' });
              addOutput({ type: 'info', text: 'Example: challenge ctf001' });
              break;
            case 'submit':
              addOutput({ type: 'info', text: 'Usage: submit <flag>' });
              addOutput({ type: 'info', text: 'Submits a flag for the active challenge. The flag is the solution to the challenge prompt.' });
              addOutput({ type: 'info', text: 'Example: submit TheSecretFlag123' });
              break;
            case 'scan':
              addOutput({ type: 'info', text: 'Usage: scan <url>' });
              addOutput({ type: 'info', text: 'Scans a URL using VirusTotal.' });
              addOutput({ type: 'info', text: 'Example: scan https://example.com' });
              break;
            default:
              addOutput({ type: 'error', text: `No help topic found for "${helpTopic}".` });
          }
        } else {
          addOutput({ type: 'response', text: 'Available commands: help, whois, nmap, clear, echo, challenge, submit, scan' });
          addOutput({ type: 'info', text: 'Type "help <command>" for more details on a specific command.' });
        }
        break;
      case 'scan':
        const urlToScan = args[0];
        if (!urlToScan) {
          addOutput({ type: 'error', text: 'Please provide a URL to scan.' });
          return;
        }
        addOutput({ type: 'info', text: `Scanning ${urlToScan}...` });
        try {
          const { data, error } = await supabase.functions.invoke('virustotal-proxy', {
            body: { url: urlToScan },
          });
          if (error) throw error;
          const stats = data.data.attributes.stats;
          addOutput({ type: 'success', text: 'Scan complete.' });
          addOutput({ type: 'info', text: `Results -> Malicious: ${stats.malicious}, Suspicious: ${stats.suspicious}, Harmless: ${stats.harmless}` });
        } catch (err) {
          addOutput({ type: 'error', text: `Scan failed: ${err.message}` });
        }
        break;
      case 'whois':
        addOutput({ type: 'response', text: `Running WHOIS on ${args[0] || 'nothing'}...` });
        addOutput({ type: 'info', text: `[Simulated] Registrar: CyberTron Domains, Registered On: 2023-01-01, Expires On: 2033-01-01` });
        break;
      case 'nmap':
        addOutput({ type: 'response', text: `Scanning ports on ${args[0] || 'localhost'}...` });
        addOutput({ type: 'info', text: `[Simulated] Open Ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)` });
        break;
      case 'echo':
        addOutput({ type: 'response', text: args.join(' ') });
        break;
      case 'clear':
        setOutput([]);
        break;
      case 'challenge':
        const challengeId = args[0];
        const foundChallenge = challenges.find(c => c.id === challengeId);
        if (foundChallenge) {
          setActiveChallenge(foundChallenge);
          addOutput({ type: 'info', text: `Challenge Started: ${foundChallenge.title}` });
          addOutput({ type: 'info', text: foundChallenge.description });
          addOutput({ type: 'info', text: `Prompt: ${foundChallenge.prompt}` });
        } else {
          addOutput({ type: 'error', text: `Challenge '${challengeId}' not found.` });
        }
        break;
      case 'submit':
        if (!activeChallenge) {
          addOutput({ type: 'error', text: 'No active challenge. Use "challenge <id>" to start one.' });
          return;
        }
        const flag = args.join(' ');
        if (flag === activeChallenge.flag) {
          const newXp = profile.xp + activeChallenge.reward.xp;
          const { error } = await supabase
            .from('profiles')
            .update({ xp: newXp })
            .eq('id', user.id);
          
          if (error) {
            addOutput({ type: 'error', text: `Error updating profile: ${error.message}` });
          } else {
            updateProfile({ xp: newXp });
            addOutput({ type: 'success', text: `Correct! You earned ${activeChallenge.reward.xp} XP. New total: ${newXp} XP.` });
            addOutput({ type: 'success', text: `Badge Unlocked: ${activeChallenge.reward.badge}` });
            setActiveChallenge(null);
          }
        } else {
          addOutput({ type: 'error', text: 'Incorrect flag. Try again.' });
        }
        break;
      default:
        addOutput({ type: 'error', text: `Command not found: ${cmd}` });
    }
  };

  return { output, processCommand, history, historyIndex, setHistoryIndex };
};

export default useTerminal;
