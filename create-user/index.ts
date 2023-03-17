import type { AzureFunction, Context, HttpRequest } from "@azure/functions";

import "module-alias/register";

import "whatwg-fetch";
import dotenv from "dotenv";
dotenv.config();

import { getGraphApiAsync } from "~/services/auth";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  // const userFormResponse:  = req.body;

  // const users = await getAzureUserByMailAsync("/users");

  console.log(req.body);

  context.res = {
    body: "OK",
  };
};

export default httpTrigger;
