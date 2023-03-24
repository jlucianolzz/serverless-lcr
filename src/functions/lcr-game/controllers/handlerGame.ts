import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { RedisService } from "../database/RedisService";
import { ResultGame } from "../interfaces/ResultGame";
import { Game } from "../logic/Game";

import { EventBridge } from "aws-sdk";
const eventBridge = new EventBridge();

class Handler {
  private redisService: RedisService;

  constructor() {
    this.redisService = new RedisService({
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
  }

  async getInputData(): Promise<string[]> {
    let index = 0;
    let data: string[] = [];

    const firstInputDat = await this.redisService.get("test" + index);
    if (firstInputDat) {
      data.push(firstInputDat);
      do {
        index++;
        const test = await this.redisService.get("test" + index);
        if (test) data.push(test);
        else break;
      } while (index < 11);
    } else {
      data = ["3 LR.CCR.L.RLLLCLR.LL..R...CLR.", "5 RL....C.L", "0"];
      await Promise.all(
        data.map(async (test, index) => {
          await this.redisService.set("test" + index, test);
        })
      );
    }
    return data;
  }

  async procesingData(inputData: string[]): Promise<ResultGame[]> {
    return new Promise((resolve, reject) => {
      try {
        let result: ResultGame[] = [];

        for (const game of inputData) {
          const [numPlayers, rolls] = game.split(" ");
          if (rolls) {
            const gameInstance = new Game(parseInt(numPlayers), rolls);
            result.push(gameInstance.play());
          }
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  async sendToEventBridge(resultItem: ResultGame): Promise<any> {
    const params = {
      Entries: [
        {
          Source: "game-event-source",
          DetailType: "game-event-type",
          Detail: JSON.stringify(resultItem),
          EventBusName: "game-event-bus"
        },
      ],
    };
    return await eventBridge.putEvents(params).promise();
  }

  async handle(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      await this.redisService.connect();
      let inputData = await this.getInputData();
      let resultData = await this.procesingData(inputData);

      console.log(resultData.length)
      for (const resultItem of resultData) {
        await this.sendToEventBridge(resultItem);
      }
      await this.redisService.disconnect();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Game played",
          results: resultData,
        }),
      };
    } catch (error) {
      await this.redisService.disconnect();
      console.log(error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          // message: "Game not played, a error ocurred",
          message : error
        }),
      };
    }
  }
}

const handler = new Handler();

export const main = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  return handler.handle(event);
};
