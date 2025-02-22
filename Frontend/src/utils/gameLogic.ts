import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { getDiceRoll, getMeyerRoll } from "./diceUtils";
import { Action } from "./gameTypes";

//For the static functions below
const allPossibleRollsOrdered: Int32[] = [
  41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 31,
  21, 32,
];

//Static logic functions for meyer game
function getRollsGreaterThanEqualTo(rol: Int32): Int32[] {
  let index = allPossibleRollsOrdered.indexOf(rol);
  return allPossibleRollsOrdered.slice(index, allPossibleRollsOrdered.length);
}

export function isGreaterThanEqualTo(roll1: Int32, roll2: Int32): boolean {
  return getRollsGreaterThanEqualTo(roll2).includes(roll1) || roll2 <= 0;
}

function isLessThan(roll1: Int32, roll2: Int32): boolean {
  return !isGreaterThanEqualTo(roll1, roll2);
}

function isEqualTo(roll1: Int32, roll2: Int32): boolean {
  return (
    getRollsGreaterThanEqualTo(roll2).includes(roll1) &&
    getRollsGreaterThanEqualTo(roll1).includes(roll2)
  );
}

function isLessThanEqualTo(roll1: Int32, roll2: Int32): boolean {
  return isEqualTo(roll1, roll2) || isLessThan(roll1, roll2);
}

export function bluffChoices(
  currentRoll: Int32,
  previousDeclaredRoll: Int32,
  turn: Int32
) {
  let bluffchoices = allPossibleRollsOrdered.slice(
    0,
    allPossibleRollsOrdered.length
  );
  bluffchoices = bluffchoices.filter((value): value is number =>
    isGreaterThanEqualTo(value, previousDeclaredRoll)
  );
  bluffchoices.pop(); //remove 32 (roll of cheers)
  let index = bluffchoices.indexOf(currentRoll);
  if (index == bluffchoices.length - 1) {
    //Bluffing when roll is 21 (what a nice thing to do :) )
    bluffchoices.pop();
  } else if (turn > 1 && isLessThanEqualTo(currentRoll, previousDeclaredRoll)) {
    bluffchoices = bluffchoices.slice(index + 1, bluffchoices.length);
  } else {
    bluffchoices = bluffchoices
      .slice(0, index)
      .concat(bluffchoices.slice(index + 1, bluffchoices.length));
  }
  return bluffchoices;
}
export class Meyer {
  //###############################CURRENT+PREVIOUS###############################//
  private roll: Int32 = -1;
  private previousRoll: Int32 = -1;

  private declaredRoll: Int32 = -1;
  private previousDeclaredRoll: Int32 = -1;

  private currentPlayer: Int32 = 1;
  private previousPlayer: Int32 = -1;

  private currentAction: Action = "Error";
  private previousAction: Action = "Error";
  //##############################################################################//

  //####################################GLOBAL####################################//
  private readonly numberOfPlayers: Int32 = -1;

  private winner: Int32 = -1;

  private healths: Int32[] = [];
  private hasHealthRolled: boolean[] = [];

  private canAdvanceTurn: boolean = false;
  private turn: Int32 = 1;
  private round: Int32 = 1;
  //##############################################################################//

  constructor(numberOfPlayers: Int32) {
    if (numberOfPlayers < 2 || numberOfPlayers > 20) {
      throw new Error(
        "Number of players has to be between 2 and 20 (inclusive)"
      );
    }
    this.numberOfPlayers = numberOfPlayers;
    this.setHealths();
  }

  ////////////////////////////////PRIVATE FUNCTIONS/////////////////////////////////
  private setHealths(): void {
    this.healths = [];
    this.hasHealthRolled = [];
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.healths.push(6);
      this.hasHealthRolled.push(false);
    }
  }

  private getNextPlayer(player: Int32): Int32 {
    let nextplayer = player + 1;
    if (nextplayer > this.numberOfPlayers) {
      nextplayer = 1;
    }
    while (this.healths[nextplayer - 1] <= 0) {
      nextplayer = nextplayer + 1;
      if (nextplayer > this.numberOfPlayers) {
        nextplayer = 1;
      }
    }
    return nextplayer;
  }

  private isCurrentPlayerWinner(): boolean {
    if (this.getNextPlayer(this.currentPlayer) == this.currentPlayer) {
      return true;
    }
    return false;
  }

  private decreaseHealth(player: Int32, lostHealth: Int32): void {
    this.healths[player - 1] -= lostHealth;
  }

  private updateRolls(): void {
    this.previousRoll = this.roll;
    if (this.declaredRoll != -1) {
      this.previousDeclaredRoll = this.declaredRoll;
    }
    this.declaredRoll = -1;
    this.roll = -1;
  }
  private resetRoll(): void {
    this.previousRoll = -1;
    this.previousDeclaredRoll = -1;
    this.roll = -1;
    this.declaredRoll = -1;
  }

  private endTurn(): void {
    this.updateRolls();
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = this.getNextPlayer(this.currentPlayer);
    this.canAdvanceTurn = false;
    this.turn++;
  }

  private endTurnCheersOnCheck(): void {
    //Only for edge case where the checked roll was 32
    this.declaredRoll = this.previousDeclaredRoll;
    this.roll = this.previousRoll;

    let checkingPlayer = this.currentPlayer;
    this.currentPlayer = this.previousPlayer;
    this.previousPlayer = checkingPlayer;
    this.canAdvanceTurn = false;
  }

  private endTurnToHealthRoll(player: Int32): void {
    this.resetRoll();
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = player;
    this.canAdvanceTurn = false;
  }

  private endRoundBase(): void {
    this.resetRoll();
    this.round++;
    this.canAdvanceTurn = false;
    this.turn = 1;
  }

  private endRoundCurrentPlayerLost(): void {
    this.endRoundBase();
    this.healths[this.currentPlayer - 1] > 0
      ? undefined //current player = current player
      : (this.currentPlayer = this.getNextPlayer(this.currentPlayer));
    if (this.isCurrentPlayerWinner()) {
      this.winner = this.currentPlayer;
    }
  }

  private endRoundPreviousPlayerLost(): void {
    this.endRoundBase();
    this.healths[this.previousPlayer - 1] > 0
      ? (this.currentPlayer = this.previousPlayer)
      : undefined; //current player = current player
    if (this.isCurrentPlayerWinner()) {
      this.winner = this.currentPlayer;
    }
  }

  //////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////PUBLIC FUNCTIONS//////////////////////////////////
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%FRONTEND SHARED GETTERS%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public getCurrentPlayer(): Int32 {
    return this.currentPlayer;
  }

  public getCurrentAction(): Action {
    return this.currentAction;
  }

  public getCurrentHealths(): Int32[] {
    return this.healths;
  }
  public getRoll(): Int32 {
    if (this.currentAction == "SameRollOrHigher") {
      return -1;
    }
    return this.roll;
  }

  public getPreviousRoll(): Int32 {
    return this.previousRoll;
  }

  public getRound(): Int32 {
    return this.round;
  }

  public getTurn(): Int32 {
    return this.turn;
  }

  public getActionChoices(): Action[] {
    if (this.isGameOver()) {
      return [];
    } else if (
      this.healths[this.currentPlayer - 1] == 3 &&
      !this.hasHealthRolled[this.currentPlayer - 1]
    ) {
      return ["HealthRoll"];
    } else if (this.getRoll() == 32) {
      return ["Cheers"];
    } else if (this.getRoll() == -1) {
      if (this.getTurn() == 1) {
        return ["Roll"];
      }
      return ["Check", "Roll"];
    } else if (this.getTurn() == 1) {
      return ["Truth", "Bluff"];
    } else if (this.getRoll() == 21 && this.previousDeclaredRoll == 21) {
      //Edge case: Cannot bluff if the previous declared roll was a meyer and the player rolled a meyer
      return ["Truth", "SameRollOrHigher"];
    } else if (
      isGreaterThanEqualTo(this.getRoll(), this.previousDeclaredRoll)
    ) {
      return ["Truth", "Bluff", "SameRollOrHigher"];
    }
    return ["Bluff", "SameRollOrHigher"];
  }

  public getBluffChoices(): Int32[] {
    if (this.isGameOver() || this.getRoll() == -1) {
      return [];
    }

    return bluffChoices(
      this.getRoll(),
      this.previousDeclaredRoll,
      this.getTurn()
    );
  }

  public isGameOver(): boolean {
    return this.winner != -1;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%GAME STATE UPDATERS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public advanceTurn(): void {
    if (!this.canAdvanceTurn) {
      throw new Error(`Cannot advance right now!`);
    } else if (this.currentAction == "Error") {
      throw new Error("Cannot advance state when no action has been taken!");
    }

    switch (this.currentAction as Action) {
      case "Check":
        //Edge case: The checked roll is the roll of cheers (no one loses)
        if (this.previousRoll == 32) {
          this.endTurnCheersOnCheck(); //Previous player rolled a 32 in a "Same roll or higher"
          return;
        }

        //Edge cases, if checked or declared roll is 21, losing player loses 2 health instead of 1
        let healthToLose = 0;
        this.previousRoll == 21 || this.previousDeclaredRoll == 21
          ? (healthToLose = 2)
          : (healthToLose = 1);

        //Current player lost
        if (
          this.previousDeclaredRoll == this.previousRoll ||
          (this.previousAction == "SameRollOrHigher" &&
            isGreaterThanEqualTo(this.previousRoll, this.previousDeclaredRoll))
        ) {
          this.decreaseHealth(this.currentPlayer, healthToLose);

          //Edge case: Losing player has to healthroll before new round can begin
          if (
            this.healths[this.currentPlayer - 1] == 3 &&
            !this.hasHealthRolled[this.currentPlayer - 1]
          ) {
            this.endTurnToHealthRoll(this.currentPlayer);
            return;
          }

          this.endRoundCurrentPlayerLost();
          break;

          //Previous player lost
        } else {
          this.decreaseHealth(this.previousPlayer, healthToLose);

          //Edge case: Losing player has to healthroll before new round can begin
          if (
            this.healths[this.previousPlayer - 1] == 3 &&
            !this.hasHealthRolled[this.previousPlayer - 1]
          ) {
            this.endTurnToHealthRoll(this.previousPlayer);
            return;
          }

          this.endRoundPreviousPlayerLost();
          break;
        }

      case "HealthRoll":
        this.endRoundBase();
        break;

      case "Roll":
        if (this.getRoll() != 32) {
          this.canAdvanceTurn = false;
        }
        break;

      case "Cheers":
        this.endRoundBase(); //Current player rolled a 32
        break;

      default: //SameRollOrHigher, Truth, or Bluff
        this.endTurn();
        break;
    }
    this.previousAction = this.currentAction;
    this.currentAction = "Error";
  }

  public takeAction(action: Action): void {
    if (!this.getActionChoices().includes(action)) {
      throw new Error(
        `"${action}" is not a valid action in the current state! Valid actions are: ${this.getActionChoices()}`
      );
    }
    this.currentAction = action;
    this.canAdvanceTurn = true; //If action is Bluff will be reverted back to false

    switch (action) {
      case "Error":
        throw new Error("This is unreachable");

      case "Check":
        break;

      case "HealthRoll":
        let healthRoll = getDiceRoll();
        this.healths[this.currentPlayer - 1] = healthRoll;
        this.hasHealthRolled[this.currentPlayer - 1] = true;
        break;

      case "Roll":
        this.roll = getMeyerRoll();
        break;

      case "Cheers":
        break;

      case "SameRollOrHigher":
        this.roll = getMeyerRoll();
        break;

      case "Truth":
        this.declaredRoll = this.getRoll();
        break;

      case "Bluff":
        this.canAdvanceTurn = false;
        break;
    }
  }

  public chooseBluff(choice: Int32): void {
    if (!this.getBluffChoices().includes(choice)) {
      throw new Error(
        `"${choice}" is not a valid bluff choice in the current state! Valid bluff choices are: ${this.getBluffChoices()}`
      );
    }
    this.declaredRoll = choice;
    this.canAdvanceTurn = true;
  }

  public resetGame(): void {
    this.resetRoll();
    //this.currentPlayer = this.currentPlayer; //winner gets to start next game
    this.previousPlayer = -1;

    this.currentAction = "Error";
    this.previousAction = "Error";

    this.winner = -1;

    this.setHealths();

    this.canAdvanceTurn = false;
    this.turn = 1;
    this.round = 1;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  /////////////////////////////////////////////////////////////////////////////////
}
