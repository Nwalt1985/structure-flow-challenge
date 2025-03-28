import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  connectToMongoDB,
  disconnectFromMongoDB,
  getMongoDBDatabase,
} from "../../db/config";
import { ObjectId, UpdateFilter, Document } from "mongodb";
import { updateCompanyUserSchema } from "../../models/schemas";
import { handleError } from "../../helpers/error.helper";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  let client;
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const userData = JSON.parse(event.body);

    const parsedUserData = updateCompanyUserSchema.parse(userData);

    client = await connectToMongoDB();
    const db = client.db(await getMongoDBDatabase());
    const collection = db.collection("companies");

    const company = await collection.findOne({
      _id: new ObjectId(parsedUserData.companyId),
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const companyId = company._id;

    const user = company.employees.find(
      (employee: { userId: ObjectId | string; name: string }) =>
        employee.userId.toString() === parsedUserData.user.id,
    );

    if (!user) {
      throw new Error("User not found");
    }

    await collection.updateOne({ _id: new ObjectId(companyId) }, {
      $pull: { employees: { userId: new ObjectId(parsedUserData.user.id) } },
      $inc: { totalEmployees: -1 },
    } as unknown as UpdateFilter<Document>);

    await disconnectFromMongoDB(client);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(
        {
          message: `User ${parsedUserData.user.name} removed from company ${companyId}`,
        },
        null,
        2,
      ),
    };
  } catch (err) {
    return handleError(err as Error);
  }
};
