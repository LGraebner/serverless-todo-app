import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

import * as AWS from 'aws-sdk'

import * as Utils from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE
const todoIdIndex = process.env.TODO_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event: ', event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const userId = Utils.getUserId(event)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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
    const updatedItem = {
      ...item,
      ...updatedTodo
    } 

    await docClient.put({
      TableName: todoTable,
      Item: updatedItem
    }).promise()

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(updatedItem)
    }
  }

  return {
      statusCode: 404,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
  }
}
