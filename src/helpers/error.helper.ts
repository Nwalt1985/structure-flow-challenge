import { StatusCodes } from "http-status-codes";
import { ErrorResponse } from "../models/types";
export const handleError = (error: Error): ErrorResponse => {
  let statusCode: number;
  let message: string;

  switch (error.name) {
    case "ZodError":
      statusCode = StatusCodes.BAD_REQUEST;
      // Parse the Zod error message to make it more readable
      const zodError = JSON.parse(error.message);
      message = zodError
        .map((err: any) => {
          const field = err.path.join(".");
          return `${field}: ${err.message}`;
        })
        .join("; ");
      break;
    default:
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      message = error.message;
  }

  return {
    statusCode,
    body: JSON.stringify({ message, name: error.name }, null, 2),
  };
};
