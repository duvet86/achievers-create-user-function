import type {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import type { UserForm } from "./models";

import { HTTP_STATUS_CODES, getAzureUserByMailAsync } from "~/src/services";

import { createEOIUsersAsync } from "./services/dbcontext";

export async function createUser(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    context.log("HTTP trigger function processed a request.");

    const userFormResponse = (await request.json()) as UserForm;

    context.log(userFormResponse);

    const userEmail = userFormResponse["EMAIL:"];

    const azureUser = await getAzureUserByMailAsync(userEmail);

    if (azureUser !== null) {
      return {
        status: HTTP_STATUS_CODES.CONFLICT,
        body: JSON.stringify({
          message: `User with email: '${userEmail}' already exists.`,
        }),
      };
    }

    const id = await createEOIUsersAsync(userFormResponse);

    return {
      status: HTTP_STATUS_CODES.CREATED,
      body: JSON.stringify({
        id,
      }),
    };
  } catch (e) {
    context.error(e);
  }

  return {
    status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
  };
}
