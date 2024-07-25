import { handler } from "../handlers/index";
import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";
import { StatusCodes } from "http-status-codes";

describe("handler", () => {
  it("should return a successful response", async () => {
    const event: APIGatewayProxyEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback<any> = (error, result) => {
      expect(result).toEqual({
        statusCode: StatusCodes.OK,
        body: JSON.stringify("hello world", null, 2),
      });
    };

    await handler(event, context, callback);
  });

  it("should return an error response", async () => {
    const event: APIGatewayProxyEvent = {} as any;
    const context: Context = {} as any;
    const callback: Callback<any> = (error, result) => {
      expect(result).toEqual({
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: expect.anything(),
      });
    };

    // Mock an error
    jest.spyOn(JSON, "stringify").mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    await handler(event, context, callback);
  });
});
