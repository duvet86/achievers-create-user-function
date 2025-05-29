import "module-alias/register";
import dotenv from "dotenv";
dotenv.config();

import { app } from "@azure/functions";

import { createMentor, createStudentApplication } from "./services/";

app.http("create-user", {
  methods: ["POST"],
  handler: createMentor,
});

app.http("create-student-application", {
  methods: ["POST"],
  handler: createStudentApplication,
});
