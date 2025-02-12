import { getDiceRoll, getMeyerRoll } from "./diceUtils";
import {
  Action,
  MeyerInfo,
  MeyerInfoDefault,
  TurnInfo,
  TurnInfoType,
} from "./gameTypes";

//For the static functions below
const allPossibleRollsOrdered: number[] = [
  41, 42, 43, 51, 52, 53, 54, 61, 62, 63, 64, 65, 11, 22, 33, 44, 55, 66, 31,
  21, 32,
];

//Static logic functions for meyer game
function getRollsGreaterThanEqualTo(rol: number): number[] {
  let index = allPossibleRollsOrdered.indexOf(rol);
  return allPossibleRollsOrdered.slice(index, allPossibleRollsOrdered.length);
}

export function isGreaterThanEqualTo(roll1: number, roll2: number): boolean {
  return getRollsGreaterThanEqualTo(roll2).includes(roll1) || roll2 <= 0;
}

function isLessThan(roll1: number, roll2: number): boolean {
  return !isGreaterThanEqualTo(roll1, roll2);
}

function isEqualTo(roll1: number, roll2: number): boolean {
  return (
    getRollsGreaterThanEqualTo(roll2).includes(roll1) &&
    getRollsGreaterThanEqualTo(roll1).includes(roll2)
  );
}

function isLessThanEqualTo(roll1: number, roll2: number): boolean {
  return isEqualTo(roll1, roll2) || isLessThan(roll1, roll2);
}

export function bluffChoices(
  currentRoll: number,
  previousDeclaredRoll: number,
  turn: number
) {
  if (currentRoll === -1) {
    return [];
  }
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
  private roll: number = -1;
  private previousRoll: number = -1;

  private declaredRoll: number = -1;
  private previousDeclaredRoll: number = -1;

  private currentPlayer: number = 1;
  private previousPlayer: number = -1;

  private currentAction: Action = "Error";
  private previousAction: Action = "Error";
  //##############################################################################//

  //####################################GLOBAL####################################//
  private numberOfPlayers: number = -1; //In online play, can change
  private playerUids: string[] = [];
  private playersLeft: number[] = [];

  private winner: number = -1;

  private healths: number[] = [];
  private hasHealthRolled: boolean[] = [];

  private canAdvanceTurn: boolean = false;
  private turn: number = 1;
  private turnTotal: number = 1;
  private round: number = 1;

  private turnInformation: TurnInfo[] = [];
  //##############################################################################//

  constructor(playerUids: string[]) {
    this.numberOfPlayers = playerUids.length;
    if (this.numberOfPlayers < 2 || this.numberOfPlayers > 20) {
      throw new Error(
        "Number of players has to be between 2 and 20 (inclusive)"
      );
    }
    this.playerUids = playerUids;
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

  private getNextPlayer(player: number): number {
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

  private decreaseHealth(player: number, lostHealth: number): void {
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
    this.turnTotal++;
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

  private endTurnToHealthRoll(player: number): void {
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
    this.turnTotal++;
  }

  private endRoundCurrentPlayerLost(): void {
    this.endRoundBase();
    this.healths[this.currentPlayer - 1] > 0
      ? undefined //current player = current player
      : (this.currentPlayer = this.getNextPlayer(this.currentPlayer));
    if (this.isCurrentPlayerWinner()) {
      this.winner = this.currentPlayer;
      this.round--; //keep total correct
      this.turnTotal--; //keep total correct
    }
  }

  private endRoundPreviousPlayerLost(): void {
    this.endRoundBase();
    this.healths[this.previousPlayer - 1] > 0
      ? (this.currentPlayer = this.previousPlayer)
      : undefined; //current player = current player
    if (this.isCurrentPlayerWinner()) {
      this.winner = this.currentPlayer;
      this.round--; //keep total correct
      this.turnTotal--; //keep total correct
    }
  }

  private getOnlinePlayerIndex(player: number): number {
    if (this.playerLeft.length === 0 || player === 1) {
      return player;
    }

    const toBeReducted = this.playersLeft.filter(
      (value) => value < player
    ).length;
    return player - toBeReducted;
  }

  private setTurnInformation(): void {
    let numbersList: number[] = [this.getOnlinePlayerIndex(this.currentPlayer)];
    let toBeTurnInfo: TurnInfo[] = [[this.currentAction, numbersList]];

    switch (this.currentAction) {
      case "Error":
        break;

      case "Check":
        toBeTurnInfo = [
          [
            "Check",
            [
              this.getOnlinePlayerIndex(this.currentPlayer),
              this.getOnlinePlayerIndex(this.previousPlayer),
            ],
          ],
        ];
        let turnInfoType: string = "Check";
        this.previousAction === "SameRollOrHigher"
          ? (turnInfoType += "T")
          : (turnInfoType += "F");

        let currentPlayerLost =
          this.previousDeclaredRoll === this.previousRoll ||
          (this.previousAction == "SameRollOrHigher" &&
            isGreaterThanEqualTo(this.previousRoll, this.previousDeclaredRoll));

        currentPlayerLost ? (turnInfoType += "T") : (turnInfoType += "F");

        toBeTurnInfo.push([
          turnInfoType as TurnInfoType,
          [
            this.getOnlinePlayerIndex(this.previousPlayer),
            this.previousDeclaredRoll,
            this.previousRoll,
          ],
        ]);

        if (this.previousRoll != 32) {
          let losingPlayer = currentPlayerLost
            ? this.getOnlinePlayerIndex(this.currentPlayer)
            : this.getOnlinePlayerIndex(this.previousPlayer);
          let healthToLose =
            this.previousRoll == 21 || this.previousDeclaredRoll == 21 ? 2 : 1;

          toBeTurnInfo.push(["CheckLoseHealth", [losingPlayer, healthToLose]]);
        }

        this.turnInformation = toBeTurnInfo;
        break;

      case "HealthRoll":
        numbersList.push(this.healths[this.currentPlayer - 1]);
        toBeTurnInfo = [[this.currentAction, numbersList]];
        this.turnInformation = toBeTurnInfo;
        break;

      case "Roll":
        this.turnInformation = toBeTurnInfo;
        break;

      case "Cheers":
        this.turnInformation = toBeTurnInfo;
        break;

      case "SameRollOrHigher":
        this.turnInformation = toBeTurnInfo;

        break;

      case "Truth":
        numbersList.push(this.roll);
        toBeTurnInfo = [[this.currentAction, numbersList]];
        this.turnInformation = toBeTurnInfo;
        break;

      case "Bluff":
        numbersList.push(this.declaredRoll);
        toBeTurnInfo = [["Truth", numbersList]];
        this.turnInformation = toBeTurnInfo;
        break;
    }
  }
  //////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////PUBLIC FUNCTIONS//////////////////////////////////
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%FRONTEND SHARED GETTERS%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  public getCurrentPlayerUid(): string {
    return this.playerUids[this.getCurrentPlayer() - 1];
  }

  public getCurrentAction(): Action {
    return this.currentAction;
  }

  public getCanAdvanceTurn(): boolean {
    return this.canAdvanceTurn;
  }

  public getCurrentHealths(): number[] {
    if (this.playerLeft.length === 0) {
      return this.healths;
    }

    return this.healths.filter(
      (value, index) => !this.playersLeft.includes(index + 1)
    );
  }
  public getRoll(): number {
    if (this.currentAction == "SameRollOrHigher") {
      return -1;
    }
    return this.roll;
  }

  public getPreviousRoll(): number {
    return this.previousRoll;
  }

  public getRound(): number {
    return this.round;
  }

  public getTurn(): number {
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

  public getBluffChoices(): number[] {
    if (
      this.isGameOver() ||
      this.getRoll() == -1 ||
      this.currentAction != "Bluff"
    ) {
      return [];
    }

    return bluffChoices(
      this.getRoll(),
      this.previousDeclaredRoll,
      this.getTurn()
    );
  }

  public playerLeft(uid: string): void {
    if (!this.isGameOver() && this.playerUids.includes(uid)) {
      const playerIndex = this.playerUids.findIndex((value) => value === uid);
      const playerValue = playerIndex + 1;
      this.healths[playerIndex] = 0;
      //this.turnInformation = [];
      this.playersLeft.push(playerValue);

      const roundHasToEnd =
        playerValue === this.currentPlayer ||
        (playerValue === this.previousPlayer &&
          this.getActionChoices().includes("Check"));

      if (roundHasToEnd) {
        this.endRoundBase();
        this.currentPlayer =
          playerValue === this.currentPlayer
            ? this.getNextPlayer(this.currentPlayer)
            : this.currentPlayer;
        this.previousPlayer = -1;
      } else if (playerValue === this.previousPlayer) {
        this.previousPlayer = this.currentPlayer;
      }
      if (this.isCurrentPlayerWinner()) {
        this.winner = this.currentPlayer;
        if (roundHasToEnd) {
          this.round--; //keep total correct
          this.turnTotal--; //keep total correct
        }
      }
    }
  }

  public isGameOver(): boolean {
    return this.winner != -1;
  }

  public getMeyerInfo(uid?: string): MeyerInfo {
    if (uid && uid === this.playerUids[this.currentPlayer - 1]) {
      return {
        round: this.getRound(),
        turn: this.getTurn(),
        turnTotal: this.turnTotal,
        isGameOver: this.isGameOver(),
        healths: this.getCurrentHealths(),
        currentPlayer: uid,
        roll: this.getRoll(),
        actionChoices: this.getActionChoices(),
        bluffChoices: this.getBluffChoices(),
        turnInformation: this.turnInformation,
      };
    } else {
      return {
        ...MeyerInfoDefault,
        round: this.getRound(),
        turn: this.getTurn(),
        turnTotal: this.turnTotal,
        isGameOver: this.isGameOver(),
        healths: this.getCurrentHealths(),
        currentPlayer: this.playerUids[this.currentPlayer - 1],
        turnInformation: this.turnInformation,
      };
    }
  }

  public deleteTurnInformation(): void {
    this.turnInformation = [];
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%GAME STATE UPDATERS%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  public advanceTurn(): void {
    if (!this.canAdvanceTurn) {
      throw new Error(`Cannot advance right now!`);
    } else if (this.currentAction === "Error") {
      throw new Error("Cannot advance state when no action has been taken!");
    }

    this.setTurnInformation();

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

  public chooseBluff(choice: number): void {
    if (!this.getBluffChoices().includes(choice)) {
      throw new Error(
        `"${choice}" is not a valid bluff choice in the current state! Valid bluff choices are: ${this.getBluffChoices()}`
      );
    }
    this.declaredRoll = choice;
    this.canAdvanceTurn = true;
  }

  public resetGame(playerUids?: string[]): void {
    if (playerUids) {
      this.playerUids = playerUids;
      this.numberOfPlayers = playerUids.length;
    }
    this.resetRoll();
    //this.currentPlayer = this.currentPlayer; //winner gets to start next game
    this.previousPlayer = -1;

    this.currentAction = "Error";
    this.previousAction = "Error";

    this.winner = -1;

    this.setHealths();

    this.canAdvanceTurn = false;
    this.turn = 1;
    this.turnTotal = 1;
    this.round = 1;
    this.turnInformation = [];
  }
  //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
  /////////////////////////////////////////////////////////////////////////////////
}
