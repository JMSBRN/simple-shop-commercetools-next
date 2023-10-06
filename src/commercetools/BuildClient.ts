import {
  type AuthMiddlewareOptions,
  ClientBuilder,
  type HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import dotenv from 'dotenv';

dotenv.config();

const projectKey = process.env.PROJECT_KEY!;
const clientSecret = process.env.CLIENT_SECRET!;
const clientId = process.env.CLIENT_ID!;
const authUrl = process.env.AUTH_URL!;
const baseUrl = process.env.API_URL!;
const scopes = [process.env.SCOPES!];

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  scopes,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: baseUrl,
};

export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey,
});

export const getApiRootWithPasswordFlow = (email: string, password: string) => {
  const client = new ClientBuilder()
    .withProjectKey(projectKey)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withPasswordFlow({
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
        user: {
          username: email,
          password,
        },
      },
      scopes,
    })
    .build();

  return createApiBuilderFromCtpClient(client).withProjectKey({ projectKey });
};
