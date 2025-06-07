export const generateHash = (length = 32) => {
    return Array.from(
        { length },
        () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
};

export const formatBytes = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const randomPort = () => Math.floor(Math.random() * 65535);

export const getApiKey = (service) => {
    return localStorage.getItem(`${service}_api_key`);
};

export const setApiKey = (service, key) => {
    localStorage.setItem(`${service}_api_key`, key);
};
