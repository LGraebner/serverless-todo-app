import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AuthUtils from '../../auth/utils'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodoItem } from '../../businessLogic/todos'
import { TodoItem } from '../../models/TodoItem'
import *  as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy( async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event: ', event)

  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const token = AuthUtils.getTokenFromApiGatewayEvent(event)

  const updatedItem: TodoItem = await updateTodoItem(updatedTodo, todoId, token)

  if (updatedItem !== null) {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(updatedItem)
    }
  }
  else {
    return {
        statusCode: 404,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: ''
    }
  }
})

handler.use(
  cors({
      credentials: true
  })
)
