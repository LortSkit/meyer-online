import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { _getRandomInt, getDiceRoll } from "./diceUtils";

type TurnState = {
  canAdvanceTurn: boolean;
  turn: Int32;
};

export type Action =
  | "Error"
  | "Check"
  | "Roll"
  | "Cheers"
  | "SameRollOrHigher"
  | "Truth"
  | "Bluff";

export class Meyer {
  private readonly allPossibleRollsOrdered: Int32[] = [
    41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 31,
    21, 32,
  ];

  private readonly numberOfPlayers: Int32 = -1;

  private previousRoll: Int32 = -1;
  private previousDeclaredRoll: Int32 = -1;
  private roll: Int32 = -1;
  private declaredRoll: Int32 = -1;
  private previousPlayer: Int32 = -1;
  private currentPlayer: Int32 = 1;

  private healths: Int32[] = [];
  private previousHealthRoll: Int32 = -1; //TODO: Use this for frontend!
  private turnState: TurnState = {
    canAdvanceTurn: false,
    turn: 1,
  };
  private round: Int32 = 1;

  private currentAction: Action = "Error"; //TODO: Use this instead of turnState

  constructor(numberOfPlayers: Int32) {
    if (numberOfPlayers < 2 || numberOfPlayers > 10) {
      throw new Error(
        "Number of players has to be between 2 and 10 (inclusive)"
      );
    }
    this.numberOfPlayers = numberOfPlayers;
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.healths.push(6);
    }
  }

  ////////////////////////////////PRIVATE FUNCTIONS/////////////////////////////////
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
      console.log(nextplayer, this.healths[nextplayer - 1]);
    }
    return nextplayer;
  }

  private decreaseHealth(health: Int32): Int32 {
    health--;
    if (health == 3) {
      this.previousHealthRoll = _getRandomInt(1, 7);
      health = this.previousHealthRoll;
    }
    return health;
  }

  private updateRolls(): void {
    this.previousRoll = this.roll;
    if (this.declaredRoll != -1) {
      this.previousDeclaredRoll = this.declaredRoll;
    }
    this.declaredRoll = -1;
    this.roll = -1;
  }

  private endTurn(): void {
    this.updateRolls();
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = this.getNextPlayer(this.currentPlayer);
    this.turnState = {
      canAdvanceTurn: false,
      turn: this.turnState.turn + 1,
    };
  }

  private endTurnCheersOnCheck(): void {
    //Only for edge case where the checked roll was 32
    this.declaredRoll = this.previousDeclaredRoll;
    this.roll = this.previousRoll;

    let checkingPlayer = this.currentPlayer;
    this.currentPlayer = this.previousPlayer;
    this.previousPlayer = checkingPlayer;
    this.turnState = {
      canAdvanceTurn: false,
      turn: this.turnState.turn,
    };
  }

  private endRoundBase(): void {
    console.log("Round over, last action: ", this.currentAction, this.roll);
    //this.currentAction = "Error";
    this.updateRolls();
    this.round++;
    this.turnState = {
      canAdvanceTurn: false,
      turn: 1,
    };
  }

  private endRoundCurrentPlayerLost(): void {
    this.endRoundBase();
    let currentHealth = this.healths[this.currentPlayer - 1];
    this.healths[this.currentPlayer - 1] = this.decreaseHealth(currentHealth);
    this.healths[this.currentPlayer - 1] != 0
      ? undefined
      : (this.currentPlayer = this.getNextPlayer(this.currentPlayer));
  }

  private endRoundPreviousPlayerLost(): void {
    this.endRoundBase();
    let currentHealth = this.healths[this.previousPlayer - 1];
    this.healths[this.previousPlayer - 1] = this.decreaseHealth(currentHealth);
    this.healths[this.previousPlayer - 1] != 0
      ? (this.currentPlayer = this.previousPlayer)
      : (this.currentPlayer = this.getNextPlayer(this.currentPlayer));
  }
  //////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////PUBLIC FUNCTIONS//////////////////////////////////

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%NUMERICAL LOGIC%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public getRollsGreaterThanEqualTo(rol: Int32): Int32[] {
    let index = this.allPossibleRollsOrdered.indexOf(rol);
    return this.allPossibleRollsOrdered.slice(
      index,
      this.allPossibleRollsOrdered.length
    );
  }

  public isGreaterThanEqualTo(roll1: Int32, roll2: Int32): boolean {
    return this.getRollsGreaterThanEqualTo(roll2).includes(roll1) || roll2 <= 0;
  }

  public isLessThan(roll1: Int32, roll2: Int32): boolean {
    return !this.isGreaterThanEqualTo(roll1, roll2);
  }

  public isEqualTo(roll1: Int32, roll2: Int32): boolean {
    return (
      this.getRollsGreaterThanEqualTo(roll2).includes(roll1) &&
      this.getRollsGreaterThanEqualTo(roll1).includes(roll2)
    );
  }

  public isLessThanEqualTo(roll1: Int32, roll2: Int32): boolean {
    return this.isEqualTo(roll1, roll2) || this.isLessThan(roll1, roll2);
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%FRONTEND GETTERS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public getCurrentPlayer(): Int32 {
    //TODO: Does this cause information leakage?
    return this.currentPlayer;
  }

  public getCurrentAction(): Action {
    //TODO: Does this cause information leakage?
    return this.currentAction;
  }

  public getCurrentHealths(): Int32[] {
    return this.healths;
  }
  public getRoll(): Int32 {
    //TODO: Does this cause information leakage?
    if (this.currentAction == "SameRollOrHigher") {
      console.log("Correct");
      return -1;
    }
    return this.roll;
  }

  public getState(): TurnState {
    return this.turnState;
  }

  public getRound(): Int32 {
    return this.round;
  }

  public getTurn(): Int32 {
    return this.turnState.turn;
  }

  public getActionChoices(): Action[] {
    //TODO: Maybe use internally? More readable
    if (this.getRoll() == 32) {
      return ["Cheers"];
    } else if (this.getRoll() == -1) {
      if (this.getTurn() == 1) {
        return ["Roll"];
      }
      return ["Check", "Roll"];
    } else if (this.getTurn() == 1) {
      return ["Truth", "Bluff"];
    } else if (this.getRoll() == 21 && this.previousDeclaredRoll == 21) {
      //Edge case: Cannote bluff if the previous declared roll was a meyer and the player rolled a meyer
      return ["Truth", "SameRollOrHigher"];
    } else if (
      this.isGreaterThanEqualTo(this.getRoll(), this.previousDeclaredRoll)
    ) {
      return ["Truth", "Bluff", "SameRollOrHigher"];
    }
    return ["Bluff", "SameRollOrHigher"];
  }

  public getBluffChoices(): Int32[] {
    //TODO: Maybe use internally? More readable
    if (this.getRoll() == -1) {
      return []; //TODO: Check error here instead if possible
    }
    let bluffchoices = this.allPossibleRollsOrdered.slice(
      0,
      this.allPossibleRollsOrdered.length
    );
    bluffchoices = bluffchoices.filter((value): value is number =>
      this.isGreaterThanEqualTo(value, this.previousDeclaredRoll)
    );
    bluffchoices.pop(); //remove 32 (roll of cheers)
    let index = bluffchoices.indexOf(this.getRoll());
    if (index == bluffchoices.length - 1) {
      //Bluffing when roll is 21 (what a nice thing to do :) )
      bluffchoices.pop();
      return bluffchoices;
    } else if (
      this.getTurn() > 1 &&
      this.isLessThanEqualTo(this.getRoll(), this.previousDeclaredRoll)
    ) {
      bluffchoices = bluffchoices.slice(index + 1, bluffchoices.length);
    } else {
      bluffchoices = bluffchoices
        .slice(0, index)
        .concat(bluffchoices.slice(index + 1, bluffchoices.length));
    }
    console.log(this.getRoll(), bluffchoices);
    return bluffchoices;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%GAME STATE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public advanceTurn(): void {
    console.log("True advance!", this.currentAction);
    if (!this.turnState.canAdvanceTurn) {
      throw new Error(`Cannot advance in state ${this.turnState}!`);
    } else if (this.currentAction == "Error") {
      throw new Error("Cannot advance state when no action has been taken!");
    } else if (this.currentAction == "Check") {
      if (this.previousRoll == 32) {
        this.endTurnCheersOnCheck(); //Previous player rolled a 32 in a "Same roll or higher"
      } else if (this.previousDeclaredRoll == this.previousRoll) {
        this.endRoundCurrentPlayerLost();
      } else {
        this.endRoundPreviousPlayerLost();
      }
    } else if (this.currentAction == "Roll") {
      if (this.getRoll() != 32) {
        this.turnState.canAdvanceTurn = false;
      }
    } else if (this.currentAction == "Cheers") {
      this.endRoundBase(); //Current player rolled a 32
    } else if (this.currentAction == "SameRollOrHigher") {
      this.endTurn();
    } else if (this.currentAction == "Truth" || this.currentAction == "Bluff") {
      this.endTurn();
    } else {
      console.log("Wtf:", this.currentAction, this.getRoll());
      throw new Error("WTFFFFFF");
    }
    this.currentAction = "Error";
  }

  public takeAction(action: Action): void {
    if (action != "SameRollOrHigher") {
      //Otherwise cannot check if a roll has been made
      this.currentAction = action;
    }
    if (action != "Bluff") {
      this.turnState.canAdvanceTurn = true;
    }
    switch (
      action //Error checking and roll setting
    ) {
      case "Check":
        if (this.getRoll() != -1) {
          throw new Error("Cannot check previous player's roll after rolling!");
        } else if (this.getTurn() == 1) {
          throw new Error("Cannot check in first round!");
        }
        return;

      case "Roll":
        if (this.getRoll() != -1) {
          throw new Error("Cannot roll again!");
        }
        this.roll = getDiceRoll();
        console.log("Roll is now", this.roll);
        return;

      case "Truth":
        if (this.getRoll() == -1) {
          throw new Error("You have to roll first!");
        }
        if (
          this.getTurn() > 1 &&
          this.isLessThan(this.getRoll(), this.previousDeclaredRoll)
        ) {
          throw new Error(
            "Cannot be truthful if your roll is lower than the previous!"
          );
        }
        this.declaredRoll = this.getRoll();
        return;
      case "Bluff":
        if (this.getRoll() == -1) {
          throw new Error("You have to roll first!");
        }
        return;
      case "SameRollOrHigher":
        if (this.getRoll() == -1) {
          throw new Error("You have to roll first!");
        } else if (this.getTurn() == 1) {
          throw new Error("Cannot same roll or higher in first round!");
        }
        this.currentAction = action;
        this.roll = getDiceRoll();
        return;
      case "Cheers":
        if (this.getRoll() != 32) {
          throw new Error(
            "You can only say Cheers if you rolled the Roll of Cheers!"
          );
        }
        return;
      case "Error":
        throw new Error('"Error" is not a valid action!');
    }
  }

  public chooseBluff(choice: Int32): void {
    if (choice == this.getRoll()) {
      throw new Error("Your bluff cannot be your actual roll!");
    } else if (choice == 32) {
      throw new Error("Your bluff cannot be the Roll of Cheers!");
    }
    this.declaredRoll = choice;
    this.turnState.canAdvanceTurn = true;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  /////////////////////////////////////////////////////////////////////////////////
}
