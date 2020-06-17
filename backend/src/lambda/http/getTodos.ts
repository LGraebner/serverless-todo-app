import 'source-map-support/register'
import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as Utils from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const todoIdIndex = process.env.TODO_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  const userId = Utils.getUserId(event)

  const result = await docClient.query({
    TableName: todoTable,
    IndexName: todoIdIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    }
  }).promise()

  let content
  if (result.Count !== 0) {
      content = result.Items.map(item =>  {
        return {
          todoId: item.todoId,
          createdAt: item.createdAt,
          name: item.name,
          dueDate: item.dueDate,
          done: item.done,
          attachmentUrl: item.attachmentUrl
        }
      })
  } else {
      content = []
  }

  return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(content)
  }

}
