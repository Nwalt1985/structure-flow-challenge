/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handler } from "../handlers/battle";

describe("AWS API Gateway Endpoint", () => {
  it("should return expected response when called with correct query parameters", async () => {
    const queryStringParameters = {
      hero: "hero",
      villain: "villain",
    };

    const event: APIGatewayProxyEvent = {
      queryStringParameters,
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(
      JSON.stringify({ message: "Hello friend" }, null, 2),
    );
  });

  it("should return an error response when called with bad query parameters", async () => {
    const event: APIGatewayProxyEvent = {
      queryStringParameters: {
        hero: "unknownHero",
        villain: "",
      },
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify(
        { message: "Missing query parameters", name: "Error" },
        null,
        2,
      ),
    );
  });
});
