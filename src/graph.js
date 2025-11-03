export const loginRequest = {
  scopes: ['User.Read','UserAuthenticationMethod.Read']
};

export async function callGraphApi(token) {
  const res = await fetch('https://graph.microsoft.com/v1.0/me/authentication/methods', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) throw new Error('Graph request failed ' + res.status);
  const json = await res.json();
  return json.value || [];
}
