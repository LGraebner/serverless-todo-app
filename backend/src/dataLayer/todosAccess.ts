import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { v4 as uuid } from 'uuid'
import * as Utils from '../lambda/utils'


export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly todoIdIndex = process.env.TODO_ID_INDEX,
        private readonly bucketName = process.env.TODO_S3_BUCKET) { 
    }

    async getAllTodoItemsForUser(userId: string): Promise<TodoItem[]> {
        console.log('Getting all todo items')

        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
          }).promise()
        
          let items
          if (result.Count !== 0) {
            items = result.Items.map(item => Utils.createTodoItemDto(item))
          } else {
            items = []
          }

        return items as TodoItem[]
    }

    async createNewTodoItem(newTodo : CreateTodoRequest, userId: string): Promise<TodoItem> {
        console.log(`Creating new todo item ${newTodo} for user ${userId}`)

        const itemId = uuid()
        const newItem = {
          todoId: itemId,
          userId: userId,
          createdAt: new Date().toISOString(),
          attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${itemId}`,
          done: false,
          ...newTodo
        }
      
        console.log('new Item ', newItem)
      
        await this.docClient.put({
          TableName: this.todoTable,
          Item: newItem
        }).promise()

        return Utils.createTodoItemDto(newItem)
    }

    async deleteTodoItem(todoId : string, userId: string) {
        console.log(`Deleting todo item ${todoId} for user ${userId}`)
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIdIndex,
            KeyConditionExpression: 'todoId = :todoId and userId = :userId',
            ExpressionAttributeValues: {
                ':todoId': todoId,
                ':userId' : userId
            }
          }).promise()
        
        if (result.Count !== 0) {
            const item = result.Items[0]
        
            await this.docClient.delete({
                TableName: this.todoTable,
                Key: {
                userId: item.userId,
                createdAt: item.createdAt
                }
            }).promise()
    
        }
    }

    async updateTodoItem(updatedTodo : UpdateTodoRequest, todoId: string, userId: string): Promise<TodoItem> {
        console.log(`Updating todo item with ${updatedTodo} for user ${userId}`)
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIdIndex,
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
         
            await this.docClient.put({
                TableName: this.todoTable,
                Item: updatedItem
            }).promise()

            return Utils.createTodoItemDto(updatedItem)
        } else {
            return null
        }
    }

}