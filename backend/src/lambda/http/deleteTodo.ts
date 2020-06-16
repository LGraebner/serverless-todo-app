import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWS from 'aws-sdk'


import * as Utils from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()

const todoTable = process.env.TODO_TABLE
const todoIdIndex = process.env.TODO_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const userId = Utils.getUserId(event)

  const result = await docClient.query({
    TableName: todoTable,
    IndexName: todoIdIndex,
    KeyConditionExpression: 'todoId = :todoId and userId = :userId',
    ExpressionAttributeValues: {
        ':todoId': todoId,
        ':userId' : userId
    }
  }).promise()

  if (result.Count !== 0) {
    const item = result.Items[0]

    await docClient.delete({
      TableName: todoTable,
      Key: {
        userId: item.userId,
        createdAt: item.createdAt
      }
    }).promise()

  }

  return {
      statusCode: 204,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
  }

}
