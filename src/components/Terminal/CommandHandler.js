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
    this.registerCommand('clear', () => ({ action: 'clear' }), 'Clear terminal screen');
  }

  handleHelp(args) {
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
}

export default CommandHandler;