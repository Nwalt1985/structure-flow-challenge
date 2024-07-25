import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { GetQuerySchema } from "../../models/schemas";
// import { battle } from "./battle";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    GetQuerySchema.parse(event);

    const { hero, villain } = event.queryStringParameters || {};

    if (!hero || !villain) {
      throw new Error("Missing query parameters");
    }

    // const result = battle(hero, villain);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Hello friend",
        },
        null,
        2,
      ),
    };
  } catch (err) {
    let statusCode;
    let message;

    const error = err as Error;

    switch (error.name) {
      case "ZodError":
        statusCode = StatusCodes.BAD_REQUEST;
        message = error.message;
        break;
      default:
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = error.message;
    }

    return {
      statusCode,
      body: JSON.stringify({ message, name: error.name }, null, 2),
    };
  }
};
