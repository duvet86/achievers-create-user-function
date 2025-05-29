import type {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import type { StudentForm } from "../../models";

import { HTTP_STATUS_CODES } from "~/src/services";

import { createEOIStudentAsync } from "./create-student.dbcontext";

export async function createStudentApplication(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    context.log("HTTP createStudent function processed a request.");

    const studentFormResponse = (await request.json()) as StudentForm;

    context.log(studentFormResponse);

    const id = await createEOIStudentAsync(studentFormResponse);

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
