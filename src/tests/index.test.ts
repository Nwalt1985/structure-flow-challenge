import { handler } from "../handlers/func1/index";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { StatusCodes } from "http-status-codes";

describe("handler", () => {
  it("should return a 200 status code and a greeting message", async () => {
    const event = {} as APIGatewayProxyEvent;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(
      JSON.stringify({ message: "Hello friend" }, null, 2),
    );
  });

  it("should handle ZodError and return a 400 status code", async () => {
    const event = {} as APIGatewayProxyEvent;

    const error = new Error("Invalid input");
    error.name = "ZodError";

    jest.spyOn(JSON, "stringify").mockImplementationOnce(() => {
      throw error;
    });

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(result.body).toBe(
      JSON.stringify({ message: error.message, name: error.name }, null, 2),
    );
  });

  it("should handle generic errors and return a 500 status code", async () => {
    const event = {} as APIGatewayProxyEvent;

    const error = new Error("Something went wrong");

    jest.spyOn(JSON, "stringify").mockImplementationOnce(() => {
      throw error;
    });

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(result.body).toBe(
      JSON.stringify({ message: error.message, name: error.name }, null, 2),
    );
  });
});
