import "whatwg-fetch";
import dotenv from "dotenv";
dotenv.config();

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { getGraphApiAsync } from "~/services/auth";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const users = await getGraphApiAsync("/users");

  console.log("users", users);

  context.res = {
    body: users,
  };
};

export default httpTrigger;
