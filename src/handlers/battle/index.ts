import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, Callback, Context } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<{
    statusCode: number;
    body: string | Error;
  }>,
) => {
  try {
    const response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify("hello world", null, 2),
    };

    callback(null, response);
  } catch (err) {
    const response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: err as Error,
    };

    callback(null, response);
  }
};
