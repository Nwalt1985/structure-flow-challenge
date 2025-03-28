# Structure Flow

A serverless application built with AWS Lambda, TypeScript, and MongoDB for managing company data and users.

## Features

- Company management (create, retrieve)
- Company user management (add, remove)
- Type-safe API with Zod validation
- MongoDB integration
- Serverless architecture using AWS Lambda
- API Gateway with CORS support

## Tech Stack

- Node.js (>=20.12.2)
- TypeScript
- AWS Lambda
- MongoDB
- Serverless Framework
- Zod for schema validation
- Jest for testing

## API Endpoints

### Company Management

#### Create Company

- **POST** `https://wsy737jvpj.execute-api.eu-west-2.amazonaws.com/dev/company`
- Creates a new company
- Request body:

```json
{
  "name": "company1",
  "dateIncorporated": "28/03/2025",
  "description": "Test company",
  "totalEmployees": 0,
  "address": "some street"
}
```

#### Get Company

- **GET** `https://wsy737jvpj.execute-api.eu-west-2.amazonaws.com/dev/company`
- Retrieves company information
- Request parameters:
  - `id`: The ID of the company to retrieve

### User Management

#### Add Company User

- **POST** `https://wsy737jvpj.execute-api.eu-west-2.amazonaws.com/dev/company/user`
- Adds a user to a company
- Request body:

```json
{
  "companyId": "66f000000000000000000000",
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

#### Remove Company User

- **DELETE** `https://wsy737jvpj.execute-api.eu-west-2.amazonaws.com/dev/company/user`
- Removes a user from a company
- Request body:

```json
{
  "companyId": "66f000000000000000000000",
  "user": {
    "id": "67e6a85fdb38870babe98887",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

## Improvements

- More tests (ran out of time)
- Add an API key & use rate limiting
- Set VPC
- Add CI/CD pipeline
- Use a queing system (AWS SQS) & DLQ for updating the companies/users
- Add JSDoc comments & Swagger docs for API documentation
- Add a loadbalancer in front of the API Gateway
- Add a WAF to the API Gateway for added security

## Code improvements & functional improvements

- Add a function to get all the company users
- Add a function to get the company user by id
- Add a function to get the company user by email
- Add multiple users to a company
- Add a function to remove multiple users from a company
- When adding/removing multiple users, make sure to update the totalEmployees field by user array length
- consider adding pool of connections to the db to improve performance
- add schema validation at the gateway level instead of in the handler
