import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
  getMongoDBDatabase,
} from "../../db/config";
import { ObjectId } from "mongodb";
import { handleError } from "../../helpers/error.helper";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let client;
  try {
    const companyId = event.queryStringParameters?.id;

    if (!companyId) {
      throw new Error("Missing company ID");
    }

    client = await connectToMongoDB();
    const db = client.db(await getMongoDBDatabase());
    const collection = db.collection("companies");

    const company = await collection.findOne({ _id: new ObjectId(companyId) });

    if (!company) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: JSON.stringify({ message: "Company not found" }, null, 2),
      };
    }

    await disconnectFromMongoDB(client);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ data: company }, null, 2),
    };
  } catch (err) {
    return handleError(err as Error);
  }
};
