import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import { app } from "@azure/functions";

import { createUser } from "./create-user/index";

app.http("create-user", {
  methods: ["POST"],
  handler: createUser,
});
