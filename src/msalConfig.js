import { PublicClientApplication } from '@azure/msal-browser';

// REPLACE these values with your App Registration values
const CLIENT_ID = 'b151075c-0779-42c2-b7aa-fa1bc6c36bd5';
const TENANT_ID = '9ff87f7c-8358-46b5-88bc-d73c09ce789f';
const REDIRECT_URI = 'https://thankful-sea-07f4a4a03.3.azurestaticapps.net';

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: REDIRECT_URI
  },
  cache: {
    cacheLocation: 'localStorage'
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);
