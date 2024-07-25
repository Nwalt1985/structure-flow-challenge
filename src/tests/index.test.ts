import { handler } from "../handlers/battle/index";
import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";
import { StatusCodes } from "http-status-codes";

const event = {} as APIGatewayProxyEvent;
const context = {} as Context;

describe("handler", () => {
  it("should return a successful response", async () => {
    const callback: Callback<{
      statusCode: number;
      body: string | Error;
    }> = (error, result) => {
      expect(result).toEqual({
        statusCode: StatusCodes.OK,
        body: JSON.stringify("hello world", null, 2),
      });
    };

    await handler(event, context, callback);
  });

  it("should return an error response", async () => {
    const callback: Callback<{
      statusCode: number;
      body: string | Error;
    }> = (error, result) => {
      expect(result).toEqual({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: expect.anything(),
      });
    };

    jest.spyOn(JSON, "stringify").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    await handler(event, context, callback);
  });
});
