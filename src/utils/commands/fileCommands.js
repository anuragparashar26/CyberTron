import FileSystem from '../../components/Terminal/FileSystem';

const fs = new FileSystem();

export const createFileCommands = () => {
    const lsCommand = (args) => {
        const path = args[0] || '.';
        const contents = fs.listDirectory(path);

        if (!contents) {
            return [`ls: cannot access '${path}': No such directory`];
        }

        return contents.map(item =>
            `${item.type === 'dir' ? 'd' : '-'} ${item.name}`
        );
    };

    const catCommand = (args) => {
        if (args.length === 0) {
            return ['Usage: cat <filename>'];
        }

        const content = fs.readFile(args[0]);
        if (content === null) {
            return [`cat: ${args[0]}: No such file`];
        }

        return content.split('\n');
    };

    return {
        ls: lsCommand,
        cat: catCommand
    };
};
