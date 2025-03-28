import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../handlers/createCompany/index";
import { connectToMongoDB, disconnectFromMongoDB } from "../db/config";
import { StatusCodes } from "http-status-codes";

// Mock the MongoDB related functions
jest.mock("../db/config", () => ({
  connectToMongoDB: jest.fn(),
  disconnectFromMongoDB: jest.fn(),
}));

describe("createCompany handler", () => {
  // Mock MongoDB client and collection
  const mockInsertOne = jest.fn();
  const mockCollection = {
    insertOne: mockInsertOne,
  };
  const mockDb = {
    collection: jest.fn().mockReturnValue(mockCollection),
  };
  const mockClient = {
    db: jest.fn().mockReturnValue(mockDb),
    close: jest.fn(),
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (connectToMongoDB as jest.Mock).mockResolvedValue(mockClient);
  });

  it("should create a company successfully", async () => {
    const mockCompanyData = {
      name: "company1",
      dateIncorporated: "28/03/2025",
      description: "Test company",
      totalEmployees: 0,
      address: "some street",
    };

    const mockEvent = {
      body: JSON.stringify(mockCompanyData),
    } as APIGatewayProxyEvent;

    const mockInsertedId = "mock-id-123";
    mockInsertOne.mockResolvedValueOnce({ insertedId: mockInsertedId });

    // Execute handler
    const response = await handler(mockEvent);

    // Assertions
    expect(response.statusCode).toBe(StatusCodes.CREATED);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Company created successfully");
    expect(responseBody.companyId).toBe(mockInsertedId);
    expect(responseBody.company).toMatchObject({
      ...mockCompanyData,
      dateIncorporated: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    // Verify MongoDB interactions
    expect(connectToMongoDB).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalled();
    expect(mockDb.collection).toHaveBeenCalledWith("companies");
    expect(mockCollection.insertOne).toHaveBeenCalled();
    expect(disconnectFromMongoDB).toHaveBeenCalledWith(mockClient);
  });

  it("should handle missing request body", async () => {
    const mockEvent = {
      body: null,
    } as APIGatewayProxyEvent;

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.message).toBe("Missing request body");
  });

  it("should handle validation errors", async () => {
    const invalidCompanyData = {
      name: "Test Company",
      // Missing required fields: dateIncorporated, description, totalEmployees, address
    };

    const mockEvent = {
      body: JSON.stringify(invalidCompanyData),
    } as APIGatewayProxyEvent;

    const response = await handler(mockEvent);

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    const responseBody = JSON.parse(response.body);
    expect(responseBody.name).toBe("ZodError");
  });
});
