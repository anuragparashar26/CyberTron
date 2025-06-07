class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.registerDefaultCommands();
  }

  registerCommand(name, handler, description = '') {
    this.commands.set(name.toLowerCase(), { handler, description });
  }

  async executeCommand(input, context = {}) {
    const parts = input.trim().split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands.has(command)) {
      const { handler } = this.commands.get(command);
      try {
        return await handler(args, context);
      } catch (error) {
        return [`Error executing command: ${error.message}`];
      }
    }

    return [`Command '${command}' not found. Type 'help' for available commands.`];
  }

  registerDefaultCommands() {
    this.registerCommand('help', this.handleHelp.bind(this), 'Show available commands');
    this.registerCommand('clear', this.handleClear.bind(this), 'Clear terminal screen');
    this.registerCommand('history', this.handleHistory.bind(this), 'Show command history');
    this.registerCommand('config', this.handleConfig.bind(this), 'Configure API keys and settings');
  }

  handleHelp(args) {
    if (args.length > 0) {
      const cmd = args[0].toLowerCase();
      if (this.commands.has(cmd)) {
        const { description } = this.commands.get(cmd);
        return [`${cmd}: ${description}`];
      }
      return [`Unknown command: ${cmd}`];
    }

    const commandList = Array.from(this.commands.keys()).map(cmd => {
      const { description } = this.commands.get(cmd);
      return `  ${cmd.padEnd(15)} - ${description}`;
    });

    return [
      'Available Commands:',
      '==================',
      ...commandList
    ];
  }

  handleClear() {
    return { action: 'clear' };
  }

  handleHistory(args, context) {
    const { history } = context;
    if (!history || history.length === 0) {
      return ["No commands in history."];
    }
    return history.map((entry, index) => `${index + 1}: ${entry.content}`);
  }

  async handleConfig(args) {
    if (args.length < 2) {
      return [
        'Usage: config <service> <api-key>',
        'Available services: virustotal'
      ];
    }

    const [service, apiKey] = args;

    if (service === 'virustotal') {
      try {
        await configureApiKey(apiKey);
        return ['✅ VirusTotal API key configured successfully'];
      } catch (error) {
        return ['❌ Failed to configure VirusTotal API key', error.message];
      }
    }

    return [`Unknown service: ${service}`];
  }
}

export default CommandHandler;