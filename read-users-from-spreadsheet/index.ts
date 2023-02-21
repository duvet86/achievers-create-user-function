import "whatwg-fetch";
import dotenv from "dotenv";
dotenv.config();

import { Readable } from "stream";

import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import multipart from "parse-multipart";
import { stream, read, utils } from "xlsx";

import HTTP_CODES from "~/services/http-status-codes";

stream.set_readable(Readable);

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  // File content must be passed in as body.
  if (!req.body || !req.body.length) {
    context.res = {
      status: HTTP_CODES.BAD_REQUEST,
      body: {
        errorMessage: "Request body is not defined",
      },
    };
    return;
  }

  // Content type is required to know how to parse multi-part form.
  if (!req.headers || !req.headers["content-type"]) {
    context.res = {
      status: HTTP_CODES.BAD_REQUEST,
      body: {
        errorMessage: "Content type is not sent in header 'content-type'",
      },
    };
    return;
  }

  try {
    // Each chunk of the file is delimited by a special string.
    const bodyBuffer = Buffer.from(req.body);
    const boundary = multipart.getBoundary(req.headers["content-type"]);
    const parts = multipart.Parse(bodyBuffer, boundary);

    // The file buffer is corrupted or incomplete?
    if (!parts?.length) {
      context.res = {
        status: HTTP_CODES.BAD_REQUEST,
        body: {
          errorMessage: "File buffer is incorrect",
        },
      };
      return;
    }

    // Filename is a required property of the parse-multipart package.
    if (parts[0]?.filename) {
      console.log(`Original filename = ${parts[0]?.filename}`);
    }
    if (parts[0]?.type) {
      console.log(`Content type = ${parts[0]?.type}`);
    }
    if (parts[0]?.data?.length) {
      console.log(`Size = ${parts[0]?.data?.length}`);
    }

    const buffers: Buffer[] = [];
    for (const part of parts) {
      buffers.push(part.data);
    }

    const workbook = read(Buffer.concat(buffers));

    const firstWs = workbook.Sheets[workbook.SheetNames[0]];

    context.res = {
      status: HTTP_CODES.OK,
      body: utils.sheet_to_json(firstWs),
    };
  } catch (err: any) {
    context.log.error(err.message);

    context.res = {
      status: HTTP_CODES.INTERNAL_SERVER_ERROR,
      body: {
        errorMessage: err.message,
      },
    };
  }
};

export default httpTrigger;
