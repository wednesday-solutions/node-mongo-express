import { AuthenticationClient, ManagementClient } from 'auth0';
import config from 'config';

let client;

export const auth0 = () => {
    if (!client) {
        client = new AuthenticationClient({
            domain: config().domain,
            clientId: config().clientId,
            clientSecret: config().clientSecret
        });
    }
    return client;
};

export const clientCredentialsGrant = () =>
    auth0().clientCredentialsGrant({
        audience: config().audience,
        grant_type: config().grantType
    });

export const managementClient = auth =>
    new ManagementClient({
        token: auth.access_token,
        domain: config().domain
    });
