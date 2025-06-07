class FileSystem {
    constructor() {
        this.root = {
            type: 'dir',
            name: '/',
            children: {
                home: {
                    type: 'dir',
                    name: 'home',
                    children: {
                        user: {
                            type: 'dir',
                            name: 'user',
                            children: {
                                'readme.txt': {
                                    type: 'file',
                                    name: 'readme.txt',
                                    content: 'Welcome to CyberSec Terminal!\nType "help" to get started.'
                                }
                            }
                        }
                    }
                }
            }
        };
        this.currentPath = '/home/user';
    }

    parsePath(path) {
        return path.split('/').filter(Boolean);
    }

    resolvePath(path) {
        const parts = path.startsWith('/')
            ? this.parsePath(path)
            : this.parsePath(this.currentPath + '/' + path);

        let current = this.root;
        for (const part of parts) {
            if (part === '..') {
                parts.pop();
                continue;
            }
            if (!current.children || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        return current;
    }

    listDirectory(path = '.') {
        const target = this.resolvePath(path);
        if (!target || target.type !== 'dir') {
            return null;
        }
        return Object.values(target.children);
    }

    readFile(path) {
        const target = this.resolvePath(path);
        if (!target || target.type !== 'file') {
            return null;
        }
        return target.content;
    }

    chmod(path, mode) {
        const file = this.resolvePath(path);
        if (!file) return false;
        file.permissions = mode;
        return true;
    }

    mkdir(path) {
        const parts = this.parsePath(path);
        const dirName = parts.pop();
        const parent = this.resolvePath(parts.join('/'));

        if (!parent || parent.type !== 'dir') return false;

        parent.children[dirName] = {
            type: 'dir',
            name: dirName,
            children: {},
            permissions: '755',
            owner: 'user',
            created: new Date().toISOString()
        };
        return true;
    }

    writeFile(path, content) {
        const parts = this.parsePath(path);
        const fileName = parts.pop();
        const parent = this.resolvePath(parts.join('/'));

        if (!parent || parent.type !== 'dir') return false;

        parent.children[fileName] = {
            type: 'file',
            name: fileName,
            content,
            permissions: '644',
            owner: 'user',
            created: new Date().toISOString(),
            modified: new Date().toISOString()
        };
        return true;
    }

    getStats(path) {
        const file = this.resolvePath(path);
        if (!file) return null;

        return {
            type: file.type,
            name: file.name,
            permissions: file.permissions || '644',
            owner: file.owner || 'user',
            created: file.created || new Date().toISOString(),
            modified: file.modified || new Date().toISOString(),
            size: file.content ? file.content.length : 0
        };
    }
}

export default FileSystem;
