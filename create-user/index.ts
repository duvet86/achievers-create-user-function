import type { AzureFunction, Context, HttpRequest } from "@azure/functions";
import type { UserForm } from "./models";

import "module-alias/register";

import "whatwg-fetch";
import dotenv from "dotenv";
dotenv.config();

import { getAzureUserByMailAsync, HTTP_STATUS_CODES } from "~/services";

import { createEOIUsersAsync } from "./services/dbcontext";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  context.log(req.body);

  const userFormResponse: UserForm = req.body;

  const userEmail = userFormResponse["EMAIL:"];

  const azureUser = await getAzureUserByMailAsync(userEmail);

  if (azureUser !== null) {
    context.res = {
      status: HTTP_STATUS_CODES.CONFLICT,
      body: {
        message: `User with email: '${userEmail}' already exists.`,
      },
    };
  } else {
    const id = await createEOIUsersAsync(userFormResponse);

    context.res = {
      status: HTTP_STATUS_CODES.CREATED,
      body: {
        id,
      },
    };
  }
};

export default httpTrigger;
