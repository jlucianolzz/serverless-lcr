import { Player } from "../interfaces/Player";
import { ResultGame } from "../interfaces/ResultGame";
import { v4 as uuidv4 } from 'uuid';

export class Game {
  private readonly numPlayers: number;
  private readonly rolls: string;
  private readonly players: Player[];
  private centerChips = 0;
  private currentPlayerIndex = 0;
  private finishedPlayers = 0;
  private static gamesPlayed = 1;

  constructor(numPlayers: number, rolls: string) {
    this.numPlayers = numPlayers;
    this.rolls = rolls;
    this.players = Array(numPlayers)
      .fill(null)
      .map(() => ({ chips: 3, rolls: 3 }));
  }

  play(): ResultGame {
    for (let i = 0; i < this.rolls.length; i++) {
      const roll = this.rolls[i];
      const currentPlayer = this.players[this.currentPlayerIndex];

      if (currentPlayer.chips === 0) {
        i--;
        this.currentPlayerIndex =
          (this.currentPlayerIndex + 1) % this.numPlayers;
        continue;
      }

      if (roll === "R") {
        currentPlayer.chips--;
        this.players[
          (this.currentPlayerIndex + this.numPlayers - 1) % this.numPlayers
        ].chips++;
      } else if (roll === "C") {
        currentPlayer.chips--;
        this.centerChips++;
      } else if (roll === "L") {
        currentPlayer.chips--;
        this.players[(this.currentPlayerIndex + 1) % this.numPlayers].chips++;
      }

      currentPlayer.rolls--;

      if (currentPlayer.chips === 0) {
        this.finishedPlayers++;
      }

      if (this.finishedPlayers === this.numPlayers - 1) {
        break;
      }

      if (currentPlayer.rolls === 0) {
        this.currentPlayerIndex =
          (this.currentPlayerIndex + 1) % this.numPlayers;
      }
    }

    const resultGame: ResultGame = {
      game: Game.gamesPlayed,
      players: [],
      center: this.centerChips,
      firma: uuidv4(),
    };
    Game.gamesPlayed++;
    const hasWinner = this.finishedPlayers === this.numPlayers - 1;

    for (let i = 0; i < this.numPlayers; i++) {
      const player = this.players[i];
      const isWinner = player.chips > 0 && hasWinner;
      const isNextToRoll = i === this.currentPlayerIndex;
      const chipsString = `${player.chips}${
        isWinner ? "(W)" : isNextToRoll && !hasWinner ? "(*)" : ""
      }`;

      resultGame.players.push({
        player: i + 1,
        chips: chipsString,
      });
    }

    return resultGame;
  }

}
