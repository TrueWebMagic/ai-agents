export const apiConfig = {
    perplexity: {
        baseUrl: 'https://api.perplexity.ai',
        authType: 'API_KEY',
        requiredParams: ['query'],
    },
    runway: {
        baseUrl: 'https://api.runwayml.com',
        authType: 'BEARER_TOKEN',
        requiredParams: ['input', 'model'],
    },
    gmail: {
        baseUrl: 'https://gmail.googleapis.com',
        authType: 'OAUTH2',
        requiredParams: ['to', 'subject', 'body'],
    },
};