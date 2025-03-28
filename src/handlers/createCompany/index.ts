import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
  getMongoDBDatabase,
} from "../../db/config";
import { companySchema, ReturnCompanyType } from "../../models/schemas";
import { handleError } from "../../helpers/error.helper";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let client;
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const companyData = JSON.parse(event.body);
    const parsedCompanyData = companySchema.parse(companyData);

    client = await connectToMongoDB();
    const db = client.db(await getMongoDBDatabase());
    const collection = db.collection("companies");

    // Add creation timestamp
    const companyToInsert = {
      ...parsedCompanyData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const companyExists = await collection.findOne({
      name: companyToInsert.name,
    });

    if (companyExists) {
      throw new Error("Company already exists");
    }

    const result = await collection.insertOne(companyToInsert);

    await disconnectFromMongoDB(client);

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(
        {
          message: "Company created successfully",
          companyId: result.insertedId,
          company: companyToInsert,
        },
        null,
        2,
      ),
    };
  } catch (err) {
    return handleError(err as Error);
  }
};
