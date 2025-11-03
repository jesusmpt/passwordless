import React, { useEffect, useState } from 'react';
import { msalInstance } from './msalConfig';
import { loginRequest, callGraphApi } from './graph';

function SignInButton({onSignIn}) {
  return <button onClick={onSignIn} className="btn">Sign in with Entra ID</button>;
}

function StepMFA({onCheck}) {
  return (
    <div>
      <h2>Step 1 — Check Microsoft Authenticator</h2>
      <p>Please ensure you have registered Microsoft Authenticator or another method. Click below to check.</p>
      <button className="btn" onClick={onCheck}>Check registration</button>
    </div>
  );
}

function StepFIDO2({onFinish}) {
  return (
    <div>
      <h2>Step 2 — Register FIDO2 or Authenticator</h2>
      <p>If you do not have a security key, follow your organization's instructions to register one or install Microsoft Authenticator.</p>
      <p><a href="https://learn.microsoft.com/en-us/azure/active-directory/authentication/howto-authentication-passwordless-enable" target="_blank" rel="noreferrer">Passwordless setup guide</a></p>
      <button className="btn" onClick={onFinish}>I completed registration</button>
    </div>
  );
}

function StepComplete() {
  return (
    <div>
      <h2>Complete</h2>
      <p>Congratulations — you appear to have a passwordless method registered.</p>
    </div>
  );
}

export default function App(){
  const [account, setAccount] = useState(null);
  const [authMethods, setAuthMethods] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const accts = msalInstance.getAllAccounts();
    if (accts.length) setAccount(accts[0]);
  }, []);

  const signIn = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      setAccount(response.account);
      setMessage('Signed in as ' + response.account.username);
    } catch(e) {
      console.error(e);
      setMessage('Sign in failed: ' + e.message);
    }
  };

  const loadAuthMethods = async () => {
    setMessage('Loading authentication methods...');
    try {
      const tokenResponse = await msalInstance.acquireTokenSilent(loginRequest);
      const data = await callGraphApi(tokenResponse.accessToken);
      setAuthMethods(data);
      setMessage('Loaded ' + data.length + ' authentication methods');
    } catch(e) {
      console.error(e);
      setMessage('Failed to load auth methods: ' + e.message);
    }
  };

  const onFinish = () => {
    setMessage('Process complete. You can close this page.');
  };

  const hasFido = authMethods.some(m => m['@odata.type'] && m['@odata.type'].toLowerCase().includes('fido2'));
  const hasWhfb = authMethods.some(m => m['@odata.type'] && m['@odata.type'].toLowerCase().includes('windowshelloforbusiness'));

  return (
    <div className="container">
      <header><h1>Passwordless Wizard</h1></header>
      {!account ? (
        <SignInButton onSignIn={signIn}/>
      ) : (
        <div>
          <p>Welcome, {account.username}</p>
          <p className="message">{message}</p>
          {!authMethods.length ? (
            <StepMFA onCheck={loadAuthMethods}/>
          ) : hasFido || hasWhfb ? (
            <StepComplete />
          ) : (
            <StepFIDO2 onFinish={onFinish} />
          )}
        </div>
      )}
      <footer><small>Provided by IT</small></footer>
    </div>
  );
}
