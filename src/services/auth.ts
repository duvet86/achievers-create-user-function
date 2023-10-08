import type {
  Configuration,
  ClientCredentialRequest,
  AuthenticationResult,
} from "@azure/msal-node";

import { ConfidentialClientApplication } from "@azure/msal-node";

import invariant from "tiny-invariant";

invariant(process.env.CLIENT_ID);
invariant(process.env.TENANT_ID);
invariant(process.env.CLIENT_SECRET);
invariant(process.env.AAD_ENDPOINT);
invariant(process.env.GRAPH_ENDPOINT);

const msalConfig: Configuration = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: process.env.AAD_ENDPOINT + "/" + process.env.TENANT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
};

const tokenRequest: ClientCredentialRequest = {
  scopes: [process.env.GRAPH_ENDPOINT + "/.default"],
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getTokenAsync(): Promise<AuthenticationResult | null> {
  return await cca.acquireTokenByClientCredential(tokenRequest);
}

export async function getGraphApiAsync<T>(endpoint: string): Promise<T> {
  const accessTokenResponse = await getTokenAsync();

  if (accessTokenResponse === null) {
    throw new Error("No token");
  }

  const options: RequestInit = {
    headers: {
      Authorization: `Bearer ${accessTokenResponse.accessToken}`,
    },
  };

  console.log(`request made to web API ${endpoint} at: ${new Date()}`);

  const response = await fetch(
    `${process.env.GRAPH_ENDPOINT}/v1.0${endpoint}`,
    options
  );

  return await response.json();
}

export async function postGraphApiAsync<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  const accessTokenResponse = await getTokenAsync();

  if (accessTokenResponse === null) {
    throw new Error("No token");
  }

  const options: RequestInit = {
    headers: {
      Authorization: `Bearer ${accessTokenResponse.accessToken}`,
    },
    method: "POST",
    body: JSON.stringify(body),
  };

  console.log(`request made to web API ${endpoint} at: ${new Date()}`);

  const response = await fetch(
    `${process.env.GRAPH_ENDPOINT}/v1.0${endpoint}`,
    options
  );

  return await response.json();
}
