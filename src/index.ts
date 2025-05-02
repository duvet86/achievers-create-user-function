import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import { app } from "@azure/functions";

import { createMentor } from "./services/create-mentor";
import { createStudent } from "./services/create-student";

app.http("create-user", {
  methods: ["POST"],
  handler: createMentor,
});

app.http("create-student", {
  methods: ["POST"],
  handler: createStudent,
});
