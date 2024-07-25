/* eslint-disable import/no-import-module-exports */
import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
  try {
    const { sku } = event.queryStringParameters as any;

    const response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify("hello world", null, 2),
    };

    callback(null, response);
  } catch (err) {
    const response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: err,
    };

    callback(null, response);
  }
};
