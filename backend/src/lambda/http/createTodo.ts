import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AuthUtils from '../../auth/utils'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createNewTodoItem } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const token: string = AuthUtils.getTokenFromApiGatewayEvent(event)
  const item = await createNewTodoItem(newTodo, token)

  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(
        item
    )
  }
}
