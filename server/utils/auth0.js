import { AuthenticationClient, ManagementClient } from 'auth0';
import config from 'config';

export const auth0 = new AuthenticationClient({
    domain: config.domain,
    clientId: config.clientId,
    clientSecret: config.clientSecret
});

export const clientCredentialsGrant = auth0.clientCredentialsGrant({
    audience: config.audience,
    grant_type: config.grantType
});

export const managementClient = auth =>
    new ManagementClient({
        token: auth.access_token,
        domain: config.domain
    });
