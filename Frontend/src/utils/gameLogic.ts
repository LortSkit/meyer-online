import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { getDiceRoll, getMeyerRoll } from "./diceUtils";

type TurnState = {
  canAdvanceTurn: boolean;
  turn: Int32;
};

export type Action =
  | "Error"
  | "Check"
  | "HealthRoll"
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
  private hasHealthRolled: boolean[] = [];
  private turnState: TurnState = {
    canAdvanceTurn: false,
    turn: 1,
  };
  private round: Int32 = 1;

  private currentAction: Action = "Error";
  private lastAction: Action = "Error";

  private turnTable: string[] = []; //Used for frontend to show information about the current turn

  constructor(numberOfPlayers: Int32) {
    if (numberOfPlayers < 2 || numberOfPlayers > 10) {
      throw new Error(
        "Number of players has to be between 2 and 10 (inclusive)"
      );
    }
    this.numberOfPlayers = numberOfPlayers;
    for (let i = 0; i < this.numberOfPlayers; i++) {
      this.healths.push(4);
      this.hasHealthRolled.push(false);
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
    }
    return nextplayer;
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
    this.turnState = {
      canAdvanceTurn: false,
      turn: this.turnState.turn + 1,
    };
    this.turnTable = [this.turnTable[this.turnTable.length - 1]];
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

  private endTurnToHealthRoll(player: Int32): void {
    this.resetRoll();
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = player;
    this.turnState = {
      canAdvanceTurn: false,
      turn: this.turnState.turn,
    };
  }

  private endRoundBase(): void {
    this.resetRoll();
    this.round++;
    this.turnState = {
      canAdvanceTurn: false,
      turn: 1,
    };
    let length = this.turnTable.length;
    this.turnTable = this.turnTable.slice(length - 3, length);
  }

  private endRoundCurrentPlayerLost(): void {
    this.endRoundBase();
    this.healths[this.currentPlayer - 1] != 0
      ? undefined //current player = current player
      : (this.currentPlayer = this.getNextPlayer(this.currentPlayer));
  }

  private endRoundPreviousPlayerLost(): void {
    this.endRoundBase();
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

  public getTurnTable(): string[] {
    return this.turnTable;
  }

  public getActionChoices(): Action[] {
    //TODO: Maybe use internally? More readable
    if (
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
      return [];
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
    return bluffchoices;
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%GAME STATE%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public advanceTurn(): void {
    if (!this.turnState.canAdvanceTurn) {
      throw new Error(`Cannot advance in state ${this.turnState}!`);
    } else if (this.currentAction == "Error") {
      throw new Error("Cannot advance state when no action has been taken!");
    } else if (this.currentAction == "Check") {
      let textToChange = this.turnTable[this.turnTable.length - 1];
      if (this.previousRoll == 32) {
        textToChange += `, but Player ${this.previousPlayer} rolled a 32!`;
        this.turnTable[this.turnTable.length - 1] = textToChange;
        this.endTurnCheersOnCheck(); //Previous player rolled a 32 in a "Same roll or higher"
        return;
      }
      let healthToLose = 0;
      this.previousRoll == 21 ? (healthToLose = 2) : (healthToLose = 1);

      if (
        this.previousDeclaredRoll == this.previousRoll ||
        (this.lastAction == "SameRollOrHigher" &&
          this.isGreaterThanEqualTo(
            this.previousRoll,
            this.previousDeclaredRoll
          ))
      ) {
        if (this.lastAction == "SameRollOrHigher") {
          textToChange = `Player ${this.previousPlayer} had declared "Same roll or higher" and had to roll at least ${this.previousDeclaredRoll} their roll was ${this.previousRoll}`;
        } else {
          textToChange = `Player ${this.previousPlayer} had declared ${this.previousDeclaredRoll} and their roll was indeed ${this.previousRoll}`;
        }
        this.turnTable[this.turnTable.length - 1] += "...";
        this.turnTable.push(textToChange);
        this.decreaseHealth(this.currentPlayer, healthToLose);
        this.turnTable.push(
          `Player ${this.currentPlayer} lost ${
            healthToLose == 2 ? "2 lives" : "1 life"
          }`
        );
        if (
          this.healths[this.currentPlayer - 1] == 3 &&
          !this.hasHealthRolled[this.currentPlayer - 1]
        ) {
          this.endTurnToHealthRoll(this.currentPlayer);
          return;
        }
        this.endRoundCurrentPlayerLost();
      } else {
        if (this.lastAction == "SameRollOrHigher") {
          textToChange = `Player ${this.previousPlayer} had declared "Same roll or higher" and had to roll at least ${this.previousDeclaredRoll} but their roll was only ${this.previousRoll}...`;
        } else {
          textToChange = `Player ${this.previousPlayer} had declared ${this.previousDeclaredRoll} and their roll was actually ${this.previousRoll}`;
        }
        this.turnTable[this.turnTable.length - 1] += "...";
        this.turnTable.push(textToChange);
        this.decreaseHealth(this.previousPlayer, healthToLose);
        this.turnTable.push(
          `Player ${this.previousPlayer} lost ${
            healthToLose == 2 ? "2 lives" : "1 life"
          }`
        );
        if (
          this.healths[this.previousPlayer - 1] == 3 &&
          !this.hasHealthRolled[this.previousPlayer - 1]
        ) {
          this.endTurnToHealthRoll(this.previousPlayer);
          return;
        }
        this.endRoundPreviousPlayerLost();
      }
    } else if (this.currentAction == "HealthRoll") {
      this.endRoundBase();
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
      throw new Error("This is unreachable");
    }
    this.lastAction = this.currentAction;
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
      case "Error":
        throw new Error('"Error" is not a valid action!');

      case "Check":
        if (this.getRoll() != -1) {
          throw new Error("Cannot check previous player's roll after rolling!");
        } else if (this.getTurn() == 1) {
          throw new Error("Cannot check in first round!");
        }

        this.turnTable.push(
          `Player ${this.currentPlayer} chose to check Player ${this.previousPlayer}'s roll`
        );
        return;

      case "HealthRoll":
        if (this.healths[this.currentPlayer - 1] != 3) {
          throw new Error(
            "Cannot health roll unless you get down to three lives!"
          );
        } else if (this.hasHealthRolled[this.currentPlayer - 1]) {
          throw new Error("Cannot health roll more than once!");
        }
        let healthRoll = getDiceRoll();
        this.healths[this.currentPlayer - 1] = healthRoll;
        this.hasHealthRolled[this.currentPlayer - 1] = true;
        this.turnTable.push(
          `Player ${this.currentPlayer} rolled their health of 3 into ${healthRoll}`
        );
        return;

      case "Roll":
        if (this.getRoll() != -1) {
          throw new Error("Cannot roll again!");
        }
        this.roll = getMeyerRoll();
        this.turnTable.push(`Player ${this.currentPlayer} chose to roll...`);
        return;

      case "Cheers":
        if (this.getRoll() != 32) {
          throw new Error(
            "You can only say Cheers if you rolled the Roll of Cheers!"
          );
        }
        this.turnTable.push(`Player ${this.currentPlayer} said "Cheers!"`);
        return;

      case "SameRollOrHigher":
        if (this.getRoll() == -1) {
          throw new Error("You have to roll first!");
        } else if (this.getTurn() == 1) {
          throw new Error("Cannot same roll or higher in first round!");
        }
        this.currentAction = action;
        this.roll = getMeyerRoll();
        this.turnTable.push(
          `Player ${this.currentPlayer} declared "Same roll or higher"`
        );
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
        this.turnTable.push(
          `Player ${this.currentPlayer} declared ${this.getRoll()}`
        );
        return;

      case "Bluff":
        if (this.getRoll() == -1) {
          throw new Error("You have to roll first!");
        }
        return;
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
    this.turnTable.push(
      `Player ${this.currentPlayer} declared ${this.declaredRoll}`
    );
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  /////////////////////////////////////////////////////////////////////////////////
}
