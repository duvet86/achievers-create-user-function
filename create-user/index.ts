import dotenv from "dotenv";
dotenv.config();

import "whatwg-fetch";

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { callGraphApiAsync } from "../services/auth";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const users = await callGraphApiAsync("/users");

  console.log("users", users);

  context.res = {
    body: users,
  };
};

export default httpTrigger;
