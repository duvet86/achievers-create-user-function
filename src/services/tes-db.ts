import type {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import type { DBChapter } from "../models";

import { HTTP_STATUS_CODES } from "./http-status-codes";
import { getConnectionAsync } from "./dbContext";

export async function testDB(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log("HTTP createStudent function processed a request.");

  const connection = await getConnectionAsync();

  const [chapters] = await connection.query<DBChapter[]>(
    "SELECT * FROM Chapter",
  );

  return {
    status: HTTP_STATUS_CODES.CREATED,
    body: JSON.stringify(chapters),
  };
}
