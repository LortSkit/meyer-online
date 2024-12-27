import { Int32 } from "react-native/Libraries/Types/CodegenTypes";
import { _getRandomInt, getRoll } from "./diceUtils";

type TurnState = {
  canAdvanceTurn: boolean;
  awaitingCheckRoll: boolean;
  awaitingCheckCheers: boolean;
  awaitingAction: boolean;
  bluffing: boolean;
  sameRollOrHigher: boolean;
  turn: Int32;
};

type Actions = "Check" | "Roll" | "Truth" | "Bluff" | "SameRollOrHigher";

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
  private previousHealthRoll: Int32 = -1;
  private turnState: TurnState = {
    canAdvanceTurn: false,
    awaitingCheckRoll: true,
    awaitingCheckCheers: false,
    awaitingAction: false,
    bluffing: false,
    sameRollOrHigher: false,
    turn: 0,
  };
  private round: Int32 = 0;

  constructor(np: Int32) {
    if (np < 2 || np > 10) {
      throw new Error(
        "Number of players has to be between 2 and 10 (inclusive)"
      );
    }
    this.numberOfPlayers = np;
    for (let i = 0; i < this.allPossibleRollsOrdered.length; i++) {
      this.healths.push(6);
    }
  }

  public getRollsGreaterThanEqualTo(rol: Int32): Int32[] {
    let index = this.allPossibleRollsOrdered.indexOf(rol);
    return this.allPossibleRollsOrdered.slice(
      index,
      this.allPossibleRollsOrdered.length
    );
  }

  public isGreaterThanEqualTo(roll1: Int32, roll2: Int32): boolean {
    return this.getRollsGreaterThanEqualTo(roll2).includes(roll1);
  }

  public isLessThan(roll1: Int32, roll2: Int32): boolean {
    return !this.isGreaterThanEqualTo(roll1, roll2);
  }

  private getNextPlayer(player: Int32): Int32 {
    let nextplayer = -1;
    do {
      nextplayer = player + 1;
      if (nextplayer > this.numberOfPlayers) {
        nextplayer = 1;
      }
    } while (this.healths[nextplayer - 1] != 0);
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
    this.previousDeclaredRoll = this.declaredRoll;
    this.declaredRoll = -1;
    this.roll = -1;
  }

  private endTurn(): void {
    this.updateRolls();
    this.previousPlayer = this.currentPlayer;
    this.currentPlayer = this.getNextPlayer(this.currentPlayer);
    this.turnState = {
      canAdvanceTurn: false,
      awaitingCheckRoll: true,
      awaitingCheckCheers: false,
      awaitingAction: false,
      bluffing: false,
      sameRollOrHigher: false,
      turn: this.turnState.turn + 1,
    };
  }

  private endRoundBase(): void {
    this.updateRolls();
    this.round++;
    this.turnState = {
      canAdvanceTurn: false,
      awaitingCheckRoll: true,
      awaitingCheckCheers: false,
      awaitingAction: false,
      bluffing: false,
      sameRollOrHigher: true,
      turn: 0,
    };
  }

  private endRoundCurrentPlayerLost(): void {
    this.endRoundBase();
    let currentHealth = this.healths[this.currentPlayer - 1];
    this.healths[this.currentPlayer - 1] = this.decreaseHealth(currentHealth);
  }

  private endRoundPreviousPlayerLost(): void {
    this.endRoundBase();
    let currentHealth = this.healths[this.previousPlayer - 1];
    this.healths[this.previousPlayer - 1] = this.decreaseHealth(currentHealth);
    this.currentPlayer = this.previousPlayer;
  }

  public getRoll(): Int32 {
    if (this.turnState.sameRollOrHigher) {
      return -1; //Inaccessible
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

  public getBluffChoices(): Int32[] {
    //Mostly for frontend stuff
    if (this.roll == -1) {
      throw new Error("Cannot bluff if you haven't rolled!");
    }
    let bluffchoices = this.allPossibleRollsOrdered;
    bluffchoices.pop(); //remove 32 (roll of cheers)
    let index = bluffchoices.indexOf(this.roll);
    if (index == bluffchoices.length - 1) {
      //Bluffing when roll is 21 (what a nice thing to do :) )
      bluffchoices.pop();
      return bluffchoices;
    }
    bluffchoices = bluffchoices
      .slice(0, index)
      .concat(bluffchoices.slice(index + 1, bluffchoices.length));
    return bluffchoices;
  }

  public getCurrentPlayer(): Int32 {
    //TODO: This is a dev testing function, should be deleted before final version
    return this.currentPlayer;
  }

  public advanceTurn(): void {
    if (!this.turnState.canAdvanceTurn) {
      throw new Error(`Cannot advance in state ${this.turnState}!`);
    } else if (this.turnState.awaitingCheckRoll) {
      if (this.previousDeclaredRoll == this.previousRoll) {
        this.endRoundCurrentPlayerLost();
      } else {
        this.endRoundPreviousPlayerLost();
      }
    } else if (this.turnState.awaitingCheckCheers) {
      this.turnState.awaitingCheckCheers = false;
      if (this.roll != 32) {
        this.turnState.awaitingCheckCheers = false;
        this.turnState.awaitingAction = true;
        this.turnState.canAdvanceTurn = false;
      }
    } else if (this.turnState.awaitingAction) {
      this.endTurn();
    } else {
      this.endRoundBase(); //You rolled a 32
    }
  }

  public takeAction(action: Actions): void {
    switch (action) {
      case "Check":
        if (this.roll != -1) {
          throw new Error("Cannot check previous player's roll after rolling!");
        }
        this.turnState.canAdvanceTurn = true;
        return;

      case "Roll":
        if (this.roll != -1) {
          throw new Error("Cannot roll again!");
        }
        this.roll = getRoll();
        this.turnState.awaitingCheckRoll = false;
        this.turnState.canAdvanceTurn = true;
        this.turnState.awaitingCheckCheers = true;
        return;

      case "Truth":
        if (this.roll == -1) {
          throw new Error("You have to roll first!");
        }
        if (this.isLessThan(this.roll, this.previousDeclaredRoll)) {
          throw new Error(
            "Cannot be truthful if your roll is lower than the previous!"
          );
        }
        this.declaredRoll = this.roll;
        this.turnState.canAdvanceTurn = true;
        return;
      case "Bluff":
        if (this.roll == -1) {
          throw new Error("You have to roll first!");
        }
        this.turnState.bluffing = true;
        return;
      case "SameRollOrHigher":
        if (this.roll == -1) {
          throw new Error("You have to roll first!");
        }
        this.roll = getRoll();
        this.turnState.sameRollOrHigher = true;
        this.turnState.canAdvanceTurn = true;
        return;
    }
  }
  public undoTruthOrBluff(): void {
    //TODO: needed?
    this.declaredRoll = -1;
    this.turnState.canAdvanceTurn = false;
  }

  public chooseBluff(choice: Int32): void {
    if (choice == this.roll) {
      throw new Error("Your bluff cannot be your actual roll!");
    } else if (choice == 32) {
      throw new Error("Your bluff cannot be the Roll of Cheers!");
    }
    this.declaredRoll = choice;
    this.turnState.canAdvanceTurn = true;
  }
}
