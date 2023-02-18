import {
  ConfidentialClientApplication,
  Configuration,
  ClientCredentialRequest,
  AuthenticationResult,
} from "@azure/msal-node";

import invariant from "tiny-invariant";

invariant(process.env.CLIENT_ID);
invariant(process.env.TENANT_ID);
invariant(process.env.CLIENT_SECRET);
invariant(process.env.AAD_ENDPOINT);
invariant(process.env.GRAPH_ENDPOINT);

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
const msalConfig: Configuration = {
  auth: {
    clientId: process.env.CLIENT_ID!,
    authority: process.env.AAD_ENDPOINT + "/" + process.env.TENANT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource>/.default'. For more, visit:
 * https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
const tokenRequest: ClientCredentialRequest = {
  scopes: [process.env.GRAPH_ENDPOINT + "/.default"],
};

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 */
async function getTokenAsync(): Promise<AuthenticationResult | null> {
  return await cca.acquireTokenByClientCredential(tokenRequest);
}

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 */
export async function callGraphApiAsync(endpoint: string) {
  const accessTokenResponse = await getTokenAsync();

  if (accessTokenResponse === null) {
    throw new Error("No token");
  }

  const options = {
    headers: {
      Authorization: `Bearer ${accessTokenResponse.accessToken}`,
    },
  };

  console.log("request made to web API at: " + new Date().toString());

  const response = await fetch(
    `${process.env.GRAPH_ENDPOINT}/v1.0${endpoint}`,
    options
  );

  return await response.json();
}
