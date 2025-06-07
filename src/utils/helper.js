export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getApiKey = (service) => localStorage.getItem(`${service}_api_key`);

export const setApiKey = (service, key) => localStorage.setItem(`${service}_api_key`, key);
