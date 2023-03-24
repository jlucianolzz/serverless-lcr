import { SQSHandler } from "aws-lambda";
import { DynamoDbService } from "../database/DynamoDbService ";

class HandlerResults {
  private dbService: DynamoDbService;

  constructor() {
    this.dbService = new DynamoDbService();
  }


  async handle(event: SQSHandler ): Promise<void> {
    try {
      for (const message of event.Records) {
        await this.dbService.putItem(JSON.parse(message.body).detail);
      }
     
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

const handler = new HandlerResults();

export const main = async (
  event: SQSHandler 
): Promise<void> => {
  return handler.handle(event);
};
