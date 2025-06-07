export const createNetworkCommands = (gameState, updateGameState) => {
  const nmapCommand = (args) => {
    if (args.length === 0) {
      return ["Usage: nmap <target>"];
    }

    const target = args[0];
    const openPorts = [22, 80, 443, 3389];
    
    updateGameState.addScore(8);
    
    return [
      `🌐 Nmap scan report for ${target}`,
      "═══════════════════════════════",
      "Host is up (0.001s latency)",
      "",
      "PORT     STATE SERVICE",
      ...openPorts.map(port => {
        const service = getServiceName(port);
        return `${port}/tcp  open  ${service}`;
      }),
      "",
      `Nmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 10 + 5).toFixed(1)}s`,
      "✨ +8 points earned!"
    ];
  };

  const pingCommand = (args) => {
    if (args.length === 0) {
      return ["Usage: ping <host>"];
    }

    const host = args[0];
    const ip = generateMockIP();
    
    return [
      `PING ${host} (${ip}): 56 data bytes`,
      `64 bytes from ${ip}: icmp_seq=0 ttl=64 time=12.3 ms`,
      `64 bytes from ${ip}: icmp_seq=1 ttl=64 time=11.8 ms`,
      `64 bytes from ${ip}: icmp_seq=2 ttl=64 time=13.1 ms`,
      "",
      `--- ${host} ping statistics ---`,
      "3 packets transmitted, 3 received, 0% packet loss"
    ];
  };

  const whoisCommand = (args) => {
    if (args.length === 0) {
      return ["Usage: whois <domain>"];
    }

    const domain = args[0];
    return [
      `Domain Name: ${domain.toUpperCase()}`,
      "Registry Domain ID: 12345678",
      "Registrar: Example Registrar",
      `Creation Date: ${new Date(Date.now() - Math.random() * 1000000000000).toISOString()}`,
      "Registrant Organization: Example Corp",
      "Admin Email: admin@example.com"
    ];
  };

  return {
    nmap: nmapCommand,
    ping: pingCommand,
    whois: whoisCommand
  };
};

const getServiceName = (port) => {
  const services = { 22: 'ssh', 80: 'http', 443: 'https', 3389: 'ms-wbt-server' };
  return services[port] || 'unknown';
};

const generateMockIP = () => {
  return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
};