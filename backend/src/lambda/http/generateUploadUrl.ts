import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.TODO_S3_BUCKET
const urlExpiration = parseInt (process.env.SIGNED_URL_EXPIRATION, 10)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })

  return {
    statusCode: 200,
    body: JSON.stringify({
        uploadUrl: uploadUrl
    })
  }
}
