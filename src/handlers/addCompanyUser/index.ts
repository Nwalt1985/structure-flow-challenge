import { StatusCodes } from "http-status-codes";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { connectToMongoDB, getMongoDBDatabase } from "../../db/config";
import { updateCompanyUserSchema } from "../../models/schemas";
import { ObjectId, UpdateFilter, Document } from "mongodb";
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

    if (company.employees && company.totalEmployees > 0) {
      const userExists = company.employees.find(
        (employee: { name: string; userId?: string }) =>
          employee.name === parsedUserData.user.name,
      );

      if (userExists) {
        throw new Error("User already exists");
      }
    }

    const companyId = company._id;
    const user = {
      ...parsedUserData.user,
      userId: new ObjectId(),
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(companyId) },
      {
        $push: { employees: user },
        $inc: { totalEmployees: 1 },
      } as unknown as UpdateFilter<Document>,
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(
        {
          message: `User ${parsedUserData.user.name} updated successfully`,
        },
        null,
        2,
      ),
    };
  } catch (err) {
    return handleError(err as Error);
  }
};
