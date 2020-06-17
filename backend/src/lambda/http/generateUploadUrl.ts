import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { generateUploadUrl } from '../../businessLogic/todos'
import *  as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const uploadUrl =  await generateUploadUrl(todoId)

  return {
    statusCode: 200,
    body: JSON.stringify({
        uploadUrl: uploadUrl
    })
  }
})

handler.use(
  cors({
      credentials: true
  })
)
