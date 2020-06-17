import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AuthUtils from '../../auth/utils'
import { getAllTodoItems } from '../../businessLogic/todos'
import *  as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler= middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  const token: string = AuthUtils.getTokenFromApiGatewayEvent(event)
  const items = await getAllTodoItems(token)

  return {
      statusCode: 200,
      headers: {
          'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(items)
  }

})


handler.use(
    cors({
        credentials: true
    })
  )