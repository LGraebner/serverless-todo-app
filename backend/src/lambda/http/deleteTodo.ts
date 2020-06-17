import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AuthUtils from '../../auth/utils'
import { deleteTodoItem } from '../../businessLogic/todos'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const token = AuthUtils.getTokenFromApiGatewayEvent(event)

  await deleteTodoItem(todoId, token)

  return {
      statusCode: 204,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: ''
  }

}
