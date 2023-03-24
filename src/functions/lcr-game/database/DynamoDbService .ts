import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export class DynamoDbService {
  private db: DynamoDB.DocumentClient;

  constructor() {
    this.db = new DynamoDB.DocumentClient();
  }

  async putItem(item: any): Promise<void> {
    const params = {
      TableName: 'game-table',
      Item: {
        id: uuidv4(),
        ...item
      }
    };

    await this.db.put(params).promise();
  }

  async getItem(id: string): Promise<any> {
    const params = {
      TableName: 'game-table',
      Key: {
        id
      }
    };

    const result = await this.db.get(params).promise();

    return result.Item;
  }
}