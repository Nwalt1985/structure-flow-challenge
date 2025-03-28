import { MongoClient } from "mongodb";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({
  region: process.env.AWS_REGION || "eu-west-2",
});

export async function getMongoDBDatabase(): Promise<string> {
  try {
    const command = new GetParameterCommand({
      Name: "/structure-flow/mongodb-database",
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    const database = response.Parameter?.Value;

    if (!database) {
      throw new Error("MongoDB database name not found in Parameter Store");
    }

    return database;
  } catch (error) {
    console.error("Error fetching MongoDB database name:", error);
    throw error;
  }
}

export async function connectToMongoDB() {
  try {
    const command = new GetParameterCommand({
      Name: "/structure-flow/mongodb-uri",
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    const uri = response.Parameter?.Value;

    if (!uri) {
      throw new Error("MongoDB URI not found in Parameter Store");
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function disconnectFromMongoDB(client: MongoClient) {
  await client.close();
  console.log("Disconnected from MongoDB");
}
